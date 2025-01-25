#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { packAsync } = require('free-tex-packer-core');
// const appInfo = require('./package.json');
const appDir = path.dirname(require.main.filename);
console.log(appDir);

function isExists(path) {
    return fs.existsSync(path);
}

function fixPath(path) {
    return path.trim().split('\\').join('/');
}

function getNameFromPath(path) {
    return path.trim().split('/').pop();
}

function isFolder(path) {
    if (isExists(path)) {
        return fs.statSync(path).isDirectory();
    }
    else {
        path = fixPath(path);
        const name = getNameFromPath(path);
        const parts = name.split('.');
        return parts.length === 1;
    }
}

function getFolderFilesList(dir, base = '', list = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.indexOf('.png') > 0 || file.indexOf('.jpg') > 0 || file.indexOf('.jpeg') > 0) {
            const p = path.resolve(dir, file);
            if (isFolder(p) && p.toUpperCase().indexOf('__MACOSX') < 0) {
                list = getFolderFilesList(p, base + file + '/', list);
            }
            else {
                list.push({
                    name: (base ? base : '') + file,
                    path: p
                });
            }
        }
    }

    return list;
}

function loadImages(images, files) {
    log('load images ' + images.length);
    for (const image of images) {
        log(image.name);
        if (image.name.indexOf('.png') > 0 || image.name.indexOf('.jpg') > 0 || image.name.indexOf('.jpeg') > 0) {
            try {
                files.push({ path: image.name, contents: fs.readFileSync(image.path) });
            }
            catch (e) {
                throw new Error('can not load image ' + JSON.stringify(image));
            }
        }
    }
}

function saveResult(outputPath, files) {
    for (const file of files) {
        log('output path ' + outputPath);
        const out = path.resolve(outputPath, file.name);
        log('Writing ' + out);
        fs.writeFileSync(out, file.buffer);
    }
}

// Map exporters to core format
function getExporterFormat(exporter) {
    switch (exporter) {
        case 'JSON (hash)':
            return 'JsonHash';
        case 'JSON (array)':
            return 'JsonArray';
        case 'XML':
            return 'XML';
        case 'css (modern)':
            return 'Css';
        case 'css (old)':
            return 'OldCss';
        case 'pixi.js':
            return 'Pixi';
        case 'Phaser (hash)':
            return 'PhaserHash';
        case 'Phaser (array)':
            return 'PhaserArray';
        case 'Phaser 3':
            return 'Phaser3';
        case 'Spine':
            return 'Spine';
        case 'cocos2d':
            return 'Cocos2d';
        case 'UnrealEngine':
            return 'Unreal';
        case 'Starling':
            return 'Starling';
        case 'Unity3D':
            return 'Unity3D';
        case 'Godot (atlas)':
            return 'GodotAtlas';
        case 'Godot (tileset)':
            return 'GodotTileset';
        default:
            return null;
    }
}

function loadFolder(folder, files) {
    if (!isExists(folder)) {
        console.error('Folder does not exist ' + folder);
        return;
    }
    const list = getFolderFilesList(folder, getNameFromPath(folder) + '/');
    log('list ' + JSON.stringify(list));
    loadImages(list, files);
}

function log(arg) {
    console.log(arg);
}

console.log('Free Texture Packer CLI');

const atlases = ['reel', 'main'];

try {
    for (const atlas of atlases) {
        const result = pack(atlas);
        if (!result) {
            console.error('Unable to pack ' + atlas);
        }
    }
}
catch (e) {
    log('Error ' + JSON.stringify(e));
}

async function pack(atlas) {
    const projectPath = `${appDir}/atlases/${atlas}.ftpp`;
    const splitPath = projectPath.split('/');
    splitPath.pop();
    // const outputPath = splitPath.join('/');
    // log('output path ' + outputPath);

    let project = null;
    try {
        const content = fs.readFileSync(projectPath).toString();
        project = JSON.parse(content);
    } catch (err) {
        log('Unsupported project format ' + projectPath + ' ' + err);
        return false;
    }

    const files = [];

    const imagesDir = `${appDir}/atlases/${atlas}`;
    loadFolder(imagesDir, files);
    /*
      // Ignore specified folders from project, take images from default folder named after atlas
      loadImages(project.images, files);
      for (const folder of project.folders) {
          console.log('folder ' + folder);
          loadFolder(folder, files);
      }
      */

    const options = project.packOptions;

    // options.width = 4096;
    // options.height = 4096;
    options.savePath = `${appDir}/public/atlases/`;
    options.exporter = getExporterFormat(options.exporter);
    if (!options.exporter) {
        log('CLI does not support a custom exporter ' + options.exporter);
        throw new Error('missing exporter');
    }

    log('Options ' + JSON.stringify(options));

    try {
        log('Packing ' + atlas + ' with options ' + JSON.stringify(options));
        const packResult = await packAsync(files, options);
        saveResult(options.savePath, packResult);
        log('Done');
        return true;
    } catch (err) {
        log('Packaging failed', err);
        return false;
    }
}
