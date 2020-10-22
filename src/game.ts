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

    private score: number = 0; //отримані бали
    private lines: number = 0; //видалені лінії
    private topOut = false; //дійшли до верху поля
    private playField = this.createPlayField(); //ігрове поле
    private activePiece = this.createPiece(); //активна фігура
    private nextPiece = this.createPiece(); //наступна фігура
    private ROWS = 20;
    private COLUMNS = 10;

    constructor() {
        this.reset(); //запускаємо гру
    }
    //повернути стан гри
    private get level(): number {
        return Math.floor(this.lines * 0.1); // номер рівня
    }
    //отримати стан гри
    public getState(): TGameState {
        const playField = this.createPlayField();
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;
        //копіюємо ігрове поле
        for (let y = 0; y < this.playField.length; y++) {
            playField[y] = [];
            for (let x = 0; x < this.playField[y].length; x++) {
                playField[y][x] = this.playField[y][x];
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
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playField,
            isGameOver: this.topOut
        };
    }

    public reset(): void {
        this.score = 0; //отримані бали
        this.lines = 0; //видалені лінії
        this.topOut = false; //дійшли до верху поля
        this.playField = this.createPlayField(); //ігрове поле
        this.activePiece = this.createPiece(); //активна фігура
        this.nextPiece = this.createPiece(); //наступна фігура
    }

    public createPlayField(): number[][] {
        const playField:number[][] = [];
        for (let y = 0; y < 20; y++) {
            playField[y] = [];
            for (let x = 0; x < 10; x++) {
                playField[y][x] = 0;
            }
        }
        return playField; //створюємо масив ігрового поля 10х20
    }
    //створити фігуру
    public createPiece(): TPiece {
        const index: number = Math.floor(Math.random() * 7); //отримаємо випадковий індекс від 1 до 7
        const type: string = 'IJLOSTZ'[index];   //тип (назва) фігури

        const piece: TPiece = {x: 0, y: 0, blocks: []};

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
            case 'O':
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
        piece.x = Math.floor((this.COLUMNS - piece.blocks[0].length) / 2); //зміщаємо фігуру в центр
        piece.y = 0;
        return piece;
    }

    public movePieceLeft(): void { //зміщення ліворуч
        this.activePiece.x -= 1;
        if (this.hasCollision()) { //перевірка виходу за межі поля
            this.activePiece.x += 1; //якщо вийшли повертаємось назад
        }
    }

    public movePieceRight(): void { //зміщення праворуч
        this.activePiece.x += 1;
        if (this.hasCollision()) { //перевірка виходу за межі поля
            this.activePiece.x -= 1; //якщо вийшли повертаємось назад
        }
    }

    public movePieceDown(): void { //зміщення вниз
        if (this.topOut) return; //якщо дійшли до верху то виходимо
        this.activePiece.y += 1;

        if (this.hasCollision()) { //перевірка виходу за межі поля
            this.activePiece.y -= 1; //якщо вийшли повертаємось назад
            this.lockPiece(); //фіксуємо фігуру на полі
            //this.clearLines(); //видаляємо зібрані лінії
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);//оновлюємо очки та стерті лінії
            this.updatePieces();//обновляємо значення активної, та наступної фігури
        }
        if (this.hasCollision()) { //перевірка чи дійшли до кінця
            this.topOut = true;
        }
    }

    public rotatePiece(): void { //поворот фігури
        this.rotateBlocks();
        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    private rotateBlocks(clockwise: boolean = true): void {//поворот фігури
    const blocks = this.activePiece.blocks; //доступ до блоку
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


    private hasCollision(): boolean { //перевірка за межі поля
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] && //поле блоку не дорівнює нулю
                    ((this.playField[pieceY + y] === undefined || this.playField[pieceY + y][pieceX + x] === undefined) || //фігура не знаходиться за полем
                    this.playField[pieceY + y][pieceX + x]) //перевірка вільного місця
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private lockPiece(): void { //фіксуємо значення фігури на ігровому полі
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) { //якщо значення не нуль
                    this.playField[pieceY + y][pieceX + x] = blocks[y][x];//копіюємо значення фігури, на поле
                }
            }
        }
    }
    //видаляємо зібрані лінії
    private clearLines(): number {
        const rows = this.ROWS;
        const columns = this.COLUMNS;
        let lines:number[] = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < columns; x++) {
                if (this.playField[y][x]) { //якщо чарунка не дорівнює нулю
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
                this.playField.splice(index,1); //видаляємо лінію
                this.playField.unshift(new Array(columns).fill(0)); //додаємо нову пусту строку зверху
            }
        }
        return lines.length;
    }

    //зміна рахунку
    private updateScore(clearLines: number): void {
        if (clearLines > 0) {
            this.score += Game.points[clearLines] * (this.level + 1);//збільшуємо очки згідно ст блоку
            this.lines += clearLines; //збільшуємо кількість видалених ліній
        }
    }
    //оновлюємо стан фігур
    private updatePieces(): void {
        this.activePiece = this.nextPiece; //міняємо активну на наступну фігуру
        this.nextPiece = this.createPiece(); //створюємо наступну фігуру
    }

}