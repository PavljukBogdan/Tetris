import {TMap} from "./Types";
import {Points} from "./enums";

type TPiece = {x: number, y: number, blocks: number[][]};
    export type TGameState = {
        score: number,
        level: number,
        lines: number,
        nextPiece: TPiece,
        playField: number[][],
        isGameOver: boolean
    };

export default class Game {

    static points: TMap<string, number> = {
        '1': Points.One,
        '2': Points.Two,
        '3': Points.Three,
        '4': Points.Four,
    };

    private _score: number = 0; //отримані бали
    private _lines: number = 0; //видалені лінії
    private _topOut = false; //дійшли до верху поля
    private _playField = this.createPlayField(); //ігрове поле
    private _activePiece = this.createPiece(); //активна фігура
    private _nextPiece = this.createPiece(); //наступна фігура
    private _ROWS = 20; // кількість рядків
    private _COLUMNS = 10; // кількість стовпців


    constructor() {
        this.reset(); //запускаємо гру
    }
    //повернути стан гри
    private get level(): number {
        return Math.floor(this._lines * 0.1); // номер рівня
    }
    //отримати стан гри
    public getState(): TGameState {
        const playField = this.createPlayField();
        const {y: pieceY, x: pieceX, blocks} = this._activePiece;
        //копіюємо ігрове поле
        for (let y = 0; y < this._playField.length; y++) {
            playField[y] = [];
            //playField[y] = playField[y].concat(); //НЕ ПРАЦЮЄ
            for (let x = 0; x < this._playField[y].length; x++) {
                playField[y][x] = this._playField[y][x];
            }
        }
        //копіюємо значення активної фігури
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) { //якщо в чарунці існує елемент blocks[y][x]
                    playField[pieceY + y][pieceX + x] = blocks[y][x]; //копіюємо фігуру на поле
                }
            }
        }

        return {
            score: this._score,
            level: this.level,
            lines: this._lines,
            nextPiece: this._nextPiece,
            playField,
            isGameOver: this._topOut
        };
    }
    //перезавантаження гри
    public reset(): void {
        this._score = 0; //отримані бали
        this._lines = 0; //видалені лінії
        this._topOut = false; //дійшли до верху поля
        this._playField = this.createPlayField(); //ігрове поле
        this._activePiece = this.createPiece(); //активна фігура
        this._nextPiece = this.createPiece(); //наступна фігура
    }
    //створюємо ігрове поле
    public createPlayField(): number[][] {
        const playField:number[][] = [];
        for (let y = 0; y < 20; y++) {
            playField[y] = new Array(10).fill(0); //заповнюємо рядок нулями
        }
        return playField; //створюємо масив ігрового поля 10х20
    }
    //створити фігуру
    public createPiece(): TPiece {
        const index: number = Math.floor(Math.random() * 7); //отримаємо випадковий індекс від 1 до 7
        const type: string = 'IJLOSTZ'[index];   //тип (назва) фігури

        const piece: TPiece = {x: 0, y: 0, blocks: []}; //фігура тетро

        switch (type) {
            case 'I':

                piece.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
                break;
            case 'J':
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,2]
                ]
                break;
            case 'L':
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ]
                break;
            case 'O': //залишив велику область з еститичних міркувань, при виводі в боковій панелі відбувається центрування фігури
                piece.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ]
                break;
            case 'S':
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ]
                break;
            case 'T':
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ]
                break;
            case 'Z':piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ]
                break;
            default:
                throw new Error('Невідомий тип фігури');
        }
        piece.x = Math.floor((this._COLUMNS - piece.blocks[0].length) / 2); //зміщаємо фігуру в центр
        piece.y = 0; //фігура стартує з першої строки (тут є проблема)
        return piece;
    }
    //зміщення ліворуч
    public movePieceLeft(): void {
        this._activePiece.x -= 1; //зміщуєио вліво
        if (this.hasCollision()) { //перевірка виходу за межі поля
            this._activePiece.x += 1; //якщо вийшли повертаємось назад
        }
    }
    //зміщення праворуч
    public movePieceRight(): void {
        this._activePiece.x += 1; //зміщуємо вправо
        if (this.hasCollision()) { //перевірка виходу за межі поля
            this._activePiece.x -= 1; //якщо вийшли повертаємось назад
        }
    }
    //зміщення вниз
    public movePieceDown(): void {
        if (this._topOut) return; //якщо дійшли до верху то виходимо
        this._activePiece.y += 1; //зміщуємо вниз

        if (this.hasCollision()) { //перевірка виходу за межі поля
            this._activePiece.y -= 1; //якщо вийшли повертаємось назад
            this.lockPiece(); //фіксуємо фігуру на полі
            const clearedLines = this.clearLines(); //видаляємо зібрані лінії
            this.updateScore(clearedLines);//оновлюємо очки та стерті лінії
            this.updatePieces();//обновляємо значення активної, та наступної фігури
        }
        const clearedLines = this.clearLines(); //видаляємо зібрані лінії
        this.updateScore(clearedLines);//оновлюємо очки та стерті лінії (лікує баг)

        if (this.hasCollision()) { //перевірка чи дійшли до кінця
            this._topOut = true;
        }
    }
    //поворот фігури
    public rotatePiece(): void {
        this.rotateBlocks(); //поворот блоку фігури
        if (this.hasCollision()) { //перевірка на колізіє
            this.rotateBlocks(false); // при наявності колізій НЕ повертаємо блок
        }
    }
    //поворот блоку фігури
    private rotateBlocks(clockwise: boolean = true): void {
    const blocks = this._activePiece.blocks; //доступ до блоку
    const length = blocks.length;
    const x = Math.floor(length / 2);
    const y  = length - 1;

    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            const temp = blocks[i][j];
            if (clockwise) {
                blocks[i][j] = blocks[y - j][i];
                blocks[y - j][i] = blocks[y - i][y - j];
                blocks[y - i][y - j] = blocks[j][y - i];
                blocks[j][y - i] = temp;
            } else {
                blocks[i][j] = blocks[j][y - i];
                blocks[j][y - i] = blocks[y - i][y - j];
                blocks[y - i][y - j] = blocks[y - j][i];
                blocks[y - j][i] = temp;
                }
            }
        }
    }
    //перевірка за межі поля
    private hasCollision(): boolean {
        const { y: pieceY, x: pieceX, blocks } = this._activePiece;
        //проходимось по координатах блока
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] && //поле блоку не дорівнює нулю
                    ((this._playField[pieceY + y] === undefined || this._playField[pieceY + y][pieceX + x] === undefined) || //фігура не знаходиться за полем
                    this._playField[pieceY + y][pieceX + x]) //перевірка вільного місця
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    //фіксуємо значення фігури на ігровому полі
    private lockPiece(): void {
        const { y: pieceY, x: pieceX, blocks } = this._activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) { //якщо значення не нуль
                    this._playField[pieceY + y][pieceX + x] = blocks[y][x];//копіюємо значення фігури, на поле
                }
            }
        }
    }
    //видаляємо зібрані лінії
    private clearLines(): number {
        const rows = this._ROWS;
        const columns = this._COLUMNS;
        let lines:number[] = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if (this._playField[y][x]) { //якщо чарунка не дорівнює нулю
                    numberOfBlocks += 1;
                }
            }
            if (numberOfBlocks === 0) {
                break; //завершаємо цикл
            } else if (numberOfBlocks < columns) {
                continue; //переходимо на наступну ітерацію
            } else if (numberOfBlocks === columns) {
                lines.unshift(y); //додаємо індекс ряду в масив
            }
            for (let index of lines) {
                this._playField.splice(index,1); //видаляємо лінію
                this._playField.unshift(new Array(columns).fill(0)); //додаємо нову пусту строку зверху
            }
        }
        return lines.length;

    }

    //зміна рахунку
    private updateScore(clearLines: number): void {
        if (clearLines > 0) {
            this._score += Game.points[clearLines] * (this.level + 1);//збільшуємо очки згідно ст блоку
            this._lines += clearLines; //збільшуємо кількість видалених ліній
        }
    }
    //оновлюємо стан фігур
    private updatePieces(): void {
        this._activePiece = this._nextPiece; //міняємо активну на наступну фігуру
        this._nextPiece = this.createPiece(); //створюємо наступну фігуру
    }

}