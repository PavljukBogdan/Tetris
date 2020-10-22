import game, {TGameState} from "./game";
import {TMap} from "./Types";
import  * as PIXI from 'pixi.js'
import {Enums} from "./enums";

type TColors = TMap<number, number>;

export default class View {

    static colors: TColors = {
        0: Enums.black,
        1: Enums.cyan,
        2: Enums.blue,
        3: Enums.orange,
        4: Enums.yellow,
        5: Enums.green,
        6: Enums.purple,
        7: Enums.red,
        8: Enums.gray
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
    private containerTetro: PIXI.Container;
    private containerStartScreen = new PIXI.Container(); //контейнр стартового екрану
    private containerPanelText = new PIXI.Container()
    private styleScreen = new PIXI.TextStyle({
        fontFamily: 'Press Start 2P',
        fontSize: 18,
        //fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#ffffff'], // gradient
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

    constructor(element: any, width: number, height: number, rows: number, column: number) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.column = column;

        this.app = new PIXI.Application({
            width: this.width,//ширина полотна
            height: this.height, //висота полотна
            backgroundColor: View.colors[8], //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });
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

        const app1 = new PIXI.Application({
            width: this.playFieldWidth + 3,//ширина полотна
            height: this.playFieldHeight + 3, //висота полотна
            backgroundColor: View.colors[8], //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });

        //this.element.appendChild(this.canvas);//додаємо контекст, який створили
        document.body.appendChild(this.app.view);
    }
    //малюємо загальне поле
    public renderMainScreen(state: TGameState) {
        //this.clearScreen(state); //очищаємо
        this.renderPlayField(state);  //малюємо ігрове поле
        this.clearScreen(state); //очищаємо
        this.renderPanel(state); //малюєм бокову панель
        this.app.stage.addChild(this.containerPanelText);
    }
    //малюємо стартовий екран
    public renderStartScreen(isGameOver: boolean): void {

        const richText = new PIXI.Text('Press ENTER to Start', this.styleScreen);
        richText.x = 50;
        richText.y = 280;

        this.containerStartScreen = new PIXI.Container();
        this.containerStartScreen.name = 'welcomeText';
        this.containerStartScreen.addChild(richText);

            this.app.stage.addChild(this.containerStartScreen);

    }
    public removeStartScreen() {
        this.app.stage.removeChild(this.app.stage.getChildByName('welcomeText'));
    }
    //малюємо екран паузи
    public renderPauseScreen(isGameOver: boolean) {

        const richText = new PIXI.Text('Press ENTER to Resume', this.styleScreen);
        richText.x = 50;
        richText.y = 280;

        const container = new PIXI.Container();
        container.name = 'pauseText';
        container.addChild(richText);

            this.app.stage.addChild(container);
    }

    public removePauseScreen() {
        this.app.stage.removeChild(this.app.stage.getChildByName('pauseText'));
    }
    //малюємо екран закінчення гри
    public renderEndScreen({score, isGameOver}: TGameState) {
        const scoreText = new PIXI.Text(`Score ${score}`, this.styleScreen);
        scoreText.x = 150;
        scoreText.y = 280;
        const restartText = new PIXI.Text('Press ENTER to Restart',this.styleScreen);
        restartText.x = 50;
        restartText.y = 320;

        const containerScore = new PIXI.Container();
        containerScore.name = 'scoreText';
        containerScore.addChild(scoreText);

        const containerRestart = new PIXI.Container();
        containerRestart.name = 'restartText';
        containerRestart.addChild(restartText);

            this.app.stage.addChild(containerScore);
            this.app.stage.addChild(containerRestart);
    }

    public removeEndScreen() {
        this.app.stage.removeChild(this.app.stage.getChildByName('scoreText'));
        this.app.stage.removeChild(this.app.stage.getChildByName('restartText'));
    }
    //очищаємо полотно
    private clearScreen({ playField }:TGameState) {

        for (let y = 0; y < playField.length; y++) {
            const line = playField[y]; //константа для зручності
            for (let x = 0; x < line.length; x++) {
                const block =  line[x]; //отримуємо хожну чарунку в ігровому полі
                    this.app.stage.removeChild(this.containerTetro.getChildByName('blackBlock'));
                    this.app.stage.removeChild(this.containerTetro.getChildByName('blockTetro'));
                }
        }

        // this.app.stage.removeChild(this.containerTetro.getChildByName('blackBlock'));
        // console.log("blackBlock " + this.app.stage.removeChild(this.containerTetro.getChildByName('blackBlock')));


            //this.app.stage.removeChild(this.container.getChildByName('blackBlock'));
        //this.container.removeChild(this.container.getChildByName('block'));
        //console.log("clear block")
         //this.context.clearRect(0,0,this.width,this.height); //очищаємо поле від фігури

    }
    //малюємо ігрове поле
    private renderPlayField({ playField }:TGameState) {

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
                        View.colors[block],
                        View.colors[0]);
                    this.app.stage.removeChild(this.containerTetro.getChildByName('blackBlock'));
                } else {
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.playFieldX + (x * this.blockWidth),
                        this.playFieldY +  (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[0],
                        View.colors[0]);
                    this.containerTetro.name = 'blackBlock';
                    this.app.stage.removeChild(this.containerTetro.getChildByName('blockTetro'));
                }
                //this.clearScreen();
                //this.app.stage.removeChild(this.container.getChildByName('blackBlock'));
                //console.log(this.app.stage.removeChild(this.container.getChildByName('blackBlock')));
                //this.app.stage.removeChild(this.container.getChildByName('blockTetro'));
                //console.log(this.app.stage.removeChild(this.container.getChildByName('blockTetro')));
            }
        }

        //малюємо межу ігрового поля
        // this.context.strokeStyle = 'white'; //колір білий
        // this.context.lineWidth = this.playFieldBorderWidth;//ширина лінії
        // this.context.strokeRect(0,0,this.playFieldWidth, this.playFieldHeight);
    }

    private pixiTextPanel(text: string, x: number, y: number) {
        const style= new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 14,
            fill: ['#ffffff'], // gradient
        });
        const scoreText = new PIXI.Text(text,style);
        scoreText.x = x;
        scoreText.y = y;
        this.containerPanelText.name = 'textPanel';
        this.containerPanelText.addChild(scoreText);
    }

    public removePixiTextPanel(): void {
        const length = this.containerPanelText.children.length - 4;
        //this.containerPanelText.updateTransform();
        // for (let i = 0; i < length; i++) {
        //     this.app.stage.removeChild(this.app.stage.getChildByName('textPanel'));
        // }
        this.app.stage.removeChild(this.app.stage.getChildByName('textPanel'));
    }

    //малюємо бокову панель
    private renderPanel({level, score, lines, nextPiece}:TGameState) {
        const x = 325;

        const container = new PIXI.Container();

        this.pixiTextPanel('Next:',x,75);
        this.pixiTextPanel(`Lines: ${lines}`,x,200);
        this.pixiTextPanel(`Score ${score}`,x,250);
        this.pixiTextPanel(`Level: ${level}`,x,300);


        for (let y = 0; y < nextPiece.blocks.length; y++) {//виводимо фігуру
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];
                if (block) {
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.panelX + (x * this.blockWidth * 0.5), //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.panelY + 100 + (y * this.blockHeight * 0.5), //зміщуємо фігуру додатково на 100px
                        this.blockWidth * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.blockHeight * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        View.colors[block],
                        View.colors[8]);
                } else {
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.panelX + (x * this.blockWidth * 0.5), //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.panelY + 100 + (y * this.blockHeight * 0.5), //зміщуємо фігуру додатково на 100px
                        this.blockWidth * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.blockHeight * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        View.colors[8],
                        View.colors[8]);
                }
                this.app.stage.removeChild(this.containerTetro.getChildByName('blackBlock'));
                this.app.stage.removeChild(this.containerTetro.getChildByName('blockTetro'));
            }
        }

    }
    //малюємо блок
    private renderBlock(x: number, y: number, width: number, height: number, color: number, colorLine: number): void {

        this.graphics = new PIXI.Graphics();
        this.containerTetro = new PIXI.Container();
// Rectangle + line style 1
        this.graphics.lineStyle(2, colorLine, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();

         this.containerTetro.addChild(this.graphics);
         this.containerTetro.name = 'blockTetro';
         this.app.stage.addChild(this.containerTetro);

        // this.context.fillStyle = color; //виводимо її червоною
        // this.context.strokeStyle = 'black';//в чорній обводці
        // this.context.lineWidth = 2; //товщиною 2px
        // this.context.fillRect(x,y,width,height); //виводимо прямокутник
        // this.context.strokeRect(x,y,width,height); //обводимо прямокутник
    }
}