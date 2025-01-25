export class Trapezium {
    // кусочно-линейная функция
    private x: number[];
    private f: number[];
    private n: number;

    constructor(inX: number[], inF: number[]) {
        // таблица x,F
        this.x = inX;
        this.f = inF;
        this.n = this.x.length;
    }

    lastX(): number {
        return this.x[this.n - 1];
    }

    func(_x: number): number {
        // значение функции в точке
        let y: number;
        // assert('error', this.x.length > 0 && this.f.length > 0 && this.x.length == this.f.length);

        if (_x < this.x[0]) {
            return this.f[0];
        } else {
            if (_x > this.x[this.n - 1]) {
                return this.f[this.n - 1];
            }
        }

        if (_x == this.x[this.n - 1]) {
            return this.f[this.n - 1];
        }

        let p = -1;

        for (let i = 0; i < this.n - 1; i++) {
            if (_x > this.x[i] && _x <= this.x[i + 1]) {
                p = i;
                break;
            }
        }

        if (_x == this.x[0]) {
            p = 0;
        }

        if (p == -1) {
            return this.f[this.n - 1];
        }

        if (this.n > 1) {
            // Замена переменной: 0 - начало отрезка, 1 - его конец
            const t: number = (_x - this.x[p]) / (this.x[p + 1] - this.x[p]);
            y = this.f[p] + (this.f[p + 1] - this.f[p]) * t;
        } else {
            y = this.f[p];
        }

        return y;
    }

    areaAll() {
        let result = 0;
        for (let i = 0; i < this.n - 1; i++) {
            result += (this.x[i + 1] - this.x[i]) * (this.f[i] + this.f[i + 1]) * 0.5;
        }
        return result;
    }

    area(inX: number) {
        // интеграл от 0 до in_X
        let result = 0;

        for (let i = 0; i < this.n - 1; i++) {
            if (inX == this.x[i]) {
                return result;
            }

            if (inX > this.x[i] && inX <= this.x[i + 1]) {
                result += (inX - this.x[i]) * (this.f[i] + this.func(inX)) * 0.5;
                return result;
            } else {
                result += (this.x[i + 1] - this.x[i]) * (this.f[i] + this.f[i + 1]) * 0.5;
            }
        }

        return result;
    }

    // умножает все значения f так, чтобы обеспечить заданное значение интеграла (площадь под графиком)
    normalize(inArea: number) {
        const area: number = this.area(this.lastX());

        if (area == 0) {
            return;
        }

        const AntiArea: number = inArea / area;

        for (let i = 0; i < this.n; i++) {
            this.f[i] *= AntiArea;
        }
    }

    // умножает все значения x так, чтобы обеспечить заданную длину отрезка
    stretch(inLength: number) {
        // вычисляем длину отрезка - значений по оси х (старая длина)
        const length = this.x[this.n - 1] - this.x[0];
        const start = this.x[0];

        if (length == 0) {
            return;
        }
        // вычисляем коэффициент интерполяции
        const antiLength = inLength / length;

        // и интерполируем
        for (let i = 0; i < this.n; i++) {
            this.x[i] = start + antiLength * (this.x[i] - start);
        }
    }
}
