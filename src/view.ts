import game, {TGameState} from "./game";
import {TMap} from "./Types";
import  * as PIXI from 'pixi.js'
import Game from "./game";

type TColors = TMap<number, string>;

export default class View {

    static colors: TColors = {
        1: 'cyan',
        2: 'blue',
        3: 'orange',
        4: 'yellow',
        5: 'green',
        6: 'purple',
        7: 'red'
    };

    private element: any;//дом. елемент
    private readonly width: number; //ширина
    private readonly height: number; //висота
    private rows: number; //кількість рядів
    private column: number; //кількість колонок
    //private readonly canvas: HTMLCanvasElement;
    //private context: CanvasRenderingContext2D;
    private readonly blockWidth: number; //ширина блока
    private readonly blockHeight: number;//висота блока
    private readonly playFieldBorderWidth: number;
    private readonly playFieldX: number;
    private readonly playFieldY: number;
    private readonly playFieldWidth: number;
    private readonly playFieldHeight: number;
    private readonly playFieldInnerWidth: number;
    private readonly playFieldInnerHeight: number;
    private readonly panelX: number;
    private readonly panelY: number;
    private panelWidth: number;
    private panelHeight: number;
    private app: PIXI.Application;
    // @ts-ignore
    private graphics: PIXI.Graphics;
    // @ts-ignore
    private container: PIXI.Container;

    constructor(element: any, width: number, height: number, rows: number, column: number) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.column = column;

        this.app = new PIXI.Application({
            width: this.width,//ширина полотна
            height: this.height, //висота полотна
            backgroundColor: 0x1099bb, //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });

        // this.canvas = document.createElement('canvas'); //полотно
        // this.canvas.width = this.width;//ширина полотна
        // this.canvas.height = this.height;//висота полотна
        // const ctx = this.canvas.getContext('2d');//контекст для малювання
        // if (ctx) {
        //     this.context = ctx;
        // } else {
        //     throw "context not found";
        // }
        this.playFieldBorderWidth = 4;//ширина границі
        this.playFieldX = this.playFieldBorderWidth;//координати початку ігрового поля x
        this.playFieldY = this.playFieldBorderWidth;//координати початку ігрового поля y
        this.playFieldWidth = this.width * 2 / 3//Ширина ігрового поля
        this.playFieldHeight = this.height//Висота ігрового поля
        this.playFieldInnerWidth = this.playFieldWidth - this.playFieldBorderWidth * 2;//Внутрішня ширина ігрового поля
        this.playFieldInnerHeight = this.playFieldHeight - this.playFieldBorderWidth * 2;// Внутрішня висота ігрового поля

        this.blockWidth = this.playFieldInnerWidth/ column; //ширина блока
        this.blockHeight = this.playFieldInnerHeight / rows; //висота блока

        this.panelX = this.playFieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;//ширина панелі
        this.panelHeight = this.height;//висота панелі

        //this.element.appendChild(this.canvas);//додаємо контекст, який створили
        document.body.appendChild(this.app.view);
    }
    //малюємо загальне поле
    renderMainScreen(state: TGameState) {
       // this.clearScreen(); //очищаємо
        this.renderPlayField(state);  //малюємо ігрове поле
        this.clearScreen(); //очищаємо
        this.renderPanel(state); //малюєм бокову панель
    }
    //малюємо стартовий екран
    renderStartScreen(isGameOver: boolean) {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round'
        });

        const richText = new PIXI.Text('Press ENTER to Start', style);
        richText.x = 50;
        richText.y = 220;

        const container = new PIXI.Container();

        container.addChild(richText);

        if (!isGameOver) {
            this.app.stage.addChild(container);
        } else {
            this.app.stage.removeChild(container);
        }


        // this.context.fillStyle = 'white';
        // this.context.font = '18px "Press Start 2P"';
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'middle';
        // this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }
    //малюємо екран паузи
    renderPauseScreen() {

        // this.context.fillStyle = 'rgba(0,0,0,0.75)'//затемнення основного екрану
        // this.context.fillRect(0,0,this.width, this.height);
        // this.context.fillStyle = 'white';
        // this.context.font = '18px "Press Start 2P"';
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'middle';
        // this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }
    //малюємо екран закінчення гри

    renderEndScreen({ score }:TGameState) {
        this.clearScreen(); //очищуємо екран

        // this.context.fillStyle = 'white';
        // this.context.font = '18px "Press Start 2P"';
        // this.context.textAlign = 'center';
        // this.context.textBaseline = 'middle';
        // this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        // this.context.fillText(`Score ${score}`, this.width / 2, this.height / 2);
        // this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
    }

    pixiText(str:string, isGameOver: boolean): void {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round'
        });

        const richText = new PIXI.Text(str, style);
        richText.x = 50;
        richText.y = 220;
        if (!isGameOver) {
            this.app.stage.addChild(richText);
        } else {
            this.app.stage.removeChild(richText);
        }
    }
    //очищаємо полотно
    clearScreen() {
        let index = this.container.getChildIndex(this.graphics); //отримую індекс даного елемента в контейнері
        this.container.removeChildAt(index);
        // this.context.clearRect(0,0,this.width,this.height); //очищаємо поле від фігури
    }
    //малюємо ігрове поле
    renderPlayField({ playField }:TGameState) {

        for (let y = 0; y < playField.length; y++) {
            const line = playField[y]; //константа для зручності
            for (let x = 0; x < line.length; x++) {
                const block =  line[x]; //отримуємо хожну чарунку в ігровому полі
                if (block) { //якщо чарунка не пуста
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.playFieldX + (x * this.blockWidth),
                        this.playFieldY +  (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,

                        View.colors[block]);
                }
            }
        }
        //малюємо межу ігрового поля
        // this.context.strokeStyle = 'white'; //колір білий
        // this.context.lineWidth = this.playFieldBorderWidth;//ширина лінії
        // this.context.strokeRect(0,0,this.playFieldWidth, this.playFieldHeight);
    }


    //малюємо бокову панель
    renderPanel({level, score, lines, nextPiece}:TGameState) {
        // this.context.textAlign = 'start'; //форматуємо по лівому краю
        // this.context.textBaseline = 'top';//форматуємо по верхньому краю
        // this.context.fillStyle = 'white';//колір тексту
        // this.context.font = '14px "Press Start 2P"';//шрифт
        // this.context.fillText(`score: ${score}`,this.panelX,this.panelY);//виводимо текст на плолтно
        // this.context.fillText(`Lines: ${lines}`,this.panelX,this.panelY + 24);//виводимо текст на плолтно
        // this.context.fillText(`Level: ${level}`,this.panelX,this.panelY + 48);//виводимо текст на плолтно
        // this.context.fillText('Next:',this.panelX,this.panelY + 96);//виводимо текст на плолтно

        for (let y = 0; y < nextPiece.blocks.length; y++) {//виводимо фігуру
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];
                if (block) {
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.panelX + (x * this.blockWidth * 0.5), //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.panelY + 100 + (y * this.blockHeight * 0.5), //зміщуємо фігуру додатково на 100px
                        this.blockWidth * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.blockHeight * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        View.colors[block]);
                }
            }
        }

    }
    //малюємо блок
    renderBlock(x: number, y: number, width: number, height: number, color: string): void {

        this.graphics = new PIXI.Graphics();
        this.container = new PIXI.Container();

// Rectangle + line style 1
        this.graphics.lineStyle(2, 0xFEEB77, 1);
        this.graphics.beginFill(0x650A5A);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();

        this.container.addChild(this.graphics);
        this.app.stage.addChild(this.container);

        // this.context.fillStyle = color; //виводимо її червоною
        // this.context.strokeStyle = 'black';//в чорній обводці
        // this.context.lineWidth = 2; //товщиною 2px
        // this.context.fillRect(x,y,width,height); //виводимо прямокутник
        // this.context.strokeRect(x,y,width,height); //обводимо прямокутник
    }
}