import game, {TGameState} from "./model";
import {TMap} from "./Types";
import  * as PIXI from 'pixi.js'
import {Color} from "./color";

type TColors = TMap <number, number>;

export default class View {

    static color = [
        Color.black,
        Color.cyan,
        Color.blue,
        Color.orange,
        Color.yellow,
        Color.green,
        Color.purple,
        Color.red,
        Color.gray
    ];

    private playField = {
        _playFieldBorderWidth: 0,
        _playFieldX : 0,
        _playFieldY : 0,
        _playFieldWidth : 0,
        _playFieldHeight : 0,
        _playFieldInnerWidth : 0,
        _playFieldInnerHeight : 0,
    };

    private _element: any;//дом. елемент
    private readonly _width: number; //ширина
    private readonly _height: number; //висота
    private _rows: number; //кількість рядів
    private _column: number; //кількість колонок
    private _blockWidth: number; //ширина блока
    private _blockHeight: number;//висота блока
    private _panelX: number;
    private _panelY: number;
    private _panelWidth: number;
    private _panelHeight: number;
    private _app: PIXI.Application;
    private _graphics: PIXI.Graphics;
    private _containerTetro: PIXI.Container;
    private _containerStartScreen = new PIXI.Container(); //контейнр стартового екрану
    private _containerPanelText = new PIXI.Container()
    private _styleScreen = new PIXI.TextStyle({
        fill: "#212121",
        fontFamily: "Arial Black",
        fontSize: 30,
        stroke: "#fafafa",
        strokeThickness: 3
    });
    private _nextLabes: PIXI.Text;
    private _linesLabes: PIXI.Text;
    private _scoreLabes: PIXI.Text;
    private _levelLabes: PIXI.Text;
    private _gameFieldGr: PIXI.Container[][];
    private _panelFieldGr: PIXI.Container[][];
    private scoreText: PIXI.Text;
    private restartText: PIXI.Text;
    private containerScore: PIXI.Container;
    private containerRestart: PIXI.Container;

    constructor(element: Element | null, width: number, height: number, rows: number, column: number) {
        this._element = element;
        this._width = width;
        this._height = height;
        this._rows = rows;
        this._column = column;
        this.init();
    }

    protected init(): void {
        this.createPanel();
        this.createEndScreen();
        this._app = new PIXI.Application({
            width: this._width,//ширина полотна
            height: this._height, //висота полотна
            backgroundColor: View.color[8], //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });
        this.playField._playFieldBorderWidth = 4;//ширина границі
        this.playField._playFieldX = this.playField._playFieldBorderWidth;//координати початку ігрового поля x
        this.playField._playFieldY = this.playField._playFieldBorderWidth;//координати початку ігрового поля y
        this.playField._playFieldWidth = this._width * 2 / 3//Ширина ігрового поля
        this.playField._playFieldHeight = this._height//Висота ігрового поля
        this.playField._playFieldInnerWidth = this.playField._playFieldWidth - this.playField._playFieldBorderWidth * 2;//Внутрішня ширина ігрового поля
        this.playField._playFieldInnerHeight = this.playField._playFieldHeight - this.playField._playFieldBorderWidth * 2;// Внутрішня висота ігрового поля

        this._blockWidth = this.playField._playFieldInnerWidth/ this._column; //ширина блока
        this._blockHeight = this.playField._playFieldInnerHeight / this._rows; //висота блока

        this._panelX = this.playField._playFieldWidth + 10;
        this._panelY = 0;
        this._panelWidth = this._width / 3;//ширина панелі
        this._panelHeight = this._height;//висота панелі
        document.body.appendChild(this._app.view); //додаємо полотно, яке створили
    }
    //малюємо загальне поле
    public renderMainScreen(state: TGameState): void {
        if (this._gameFieldGr) {
            this.clearScreen(); //очищаємо
        }
        if (this._gameFieldGr) {
            this.clearRenderPanel(); //очищаємо бокову панель (фігуру)
        }
        this._gameFieldGr = this.createField()
        this.renderPlayField(state);  //малюємо ігрове поле
        this.renderPanel(state); //малюєм бокову панель
        this._app.stage.addChild(this._containerPanelText);

    }
    //малюємо стартовий екран
    public renderStartScreen(): void {
        const richText = new PIXI.Text('Press ENTER to Start', this._styleScreen);
        richText.x = 60;
        richText.y = 280;
        this._containerStartScreen = new PIXI.Container();
        this._containerStartScreen.addChild(richText);
        this._app.stage.addChild(this._containerStartScreen);
    }
    // видаляємо елементи стартового екрана
    public removeStartScreen(): void {
        this._app.stage.removeChild(this._containerStartScreen);
    }
    //малюємо екран паузи
    public renderPauseScreen(): void {

        const richText = new PIXI.Text('Press ENTER', this._styleScreen);
        richText.x = 50;
        richText.y = 280;

        const richText2 = new PIXI.Text('to Resume', this._styleScreen);
        richText2.x = 73;
        richText2.y = 320;

        const container = new PIXI.Container();
        container.name = 'pauseText';
        container.addChild(richText);

        const container2 = new PIXI.Container();
        container2.name = 'pauseText2';
        container2.addChild(richText2);

        this._app.stage.addChild(container);
        this._app.stage.addChild(container2);
    }
    // видаляємо елементи екрана паузи
    public removePauseScreen(): void {
        this._app.stage.removeChild(this._app.stage.getChildByName('pauseText'));
    }
    //створюємо елементи закінчення гри
    public renderEndScreen({score}: TGameState): void {
        this.scoreText.text = `Score: ${score}`;
        this.restartText.text = 'Press ENTER';
        this.restartText2.text = 'to Restart';
        this._app.stage.addChild(this.containerScore);
        this._app.stage.addChild(this.containerRestart);
        this._app.stage.addChild(this.containerRestart2);
    }
    //малюємо екран закінчення гри
    private restartText2: PIXI.Text;
    private containerRestart2: PIXI.Container;
    private createEndScreen(): void {
        this.scoreText = new PIXI.Text('Score', this._styleScreen);
        this.scoreText.x = 90;
        this.scoreText.y = 260;

        this.containerScore = new PIXI.Container();
        this.containerScore.name = 'scoreText';
        this.containerScore.addChild(this.scoreText);

        this.restartText = new PIXI.Text('Press ENTER', this._styleScreen);
        this.restartText.x = 50;
        this.restartText.y = 300;

        this.containerRestart = new PIXI.Container();
        this.containerRestart.name = 'restartText';
        this.containerRestart.addChild(this.restartText);

        this.restartText2 = new PIXI.Text('to Restart', this._styleScreen);
        this.restartText2.x = 80;
        this.restartText2.y = 340;

        this.containerRestart2 = new PIXI.Container();
        this.containerRestart2.name = 'restartText2';
        this.containerRestart2.addChild(this.restartText2);

    }
    // видаляємо елементи закінчення гри
    public removeEndScreen(): void {
        this._app.stage.removeChild(this._app.stage.getChildByName('scoreText'));
        this._app.stage.removeChild(this._app.stage.getChildByName('restartText'));
    }
    //очищаємо полотно
    private clearScreen(): void {
        for (let y = 0; y < this._gameFieldGr.length; y++) {
            const line = this._gameFieldGr[y]; //константа для зручності
            for (let x = 0; x < line.length; x++) {
                this._app.stage.removeChild(this._gameFieldGr[y][x]);
            }
        }
    }
    //створюємо ігрове поле
    private  createField(): PIXI.Container[][] {
        let pF: PIXI.Container[][] = [];

        for (let y = 0; y < 20; y++) {
            pF[y] = [];
            for (let x = 0; x < 10; x++) {
                let container = new PIXI.Container();
                container.name = y + '_' + x;
                pF[y][x] = container;
            }
        }
        return pF;
    }
    //малюємо ігрове поле
    private renderPlayField({ playField }:TGameState): void {

        for (let y = 0; y < playField.length; y++) {
            const line = playField[y]; //константа для зручності
            for (let x = 0; x < line.length; x++) {
                const block =  line[x]; //отримуємо хожну чарунку в ігровому полі
                if (block) { //якщо чарунка не пуста
                    this.createBlock(x,y,block,'blockTetro_',1,this.playField._playFieldX,this.playField._playFieldY);
                } else {
                    this.createBlock(x,y,block,'blackTetro_',1,this.playField._playFieldX,this.playField._playFieldY);
                }
            }
        }
    }
    private createBlock(x: number, y: number, block: number, name: string, scale: number, xField: number, yField: number):void {
        this._containerTetro = new PIXI.Container();
        this._containerTetro.addChild(
            this.renderBlock( //малюємо блок з наступною фігурою
                xField + (x * this._blockWidth * scale),
                yField +  (y * this._blockHeight * scale),
                this._blockWidth * scale,
                this._blockHeight * scale,
                View.color[block],
                View.color[8]));
        this._containerTetro.name = name + y + '_' + x;
        this._gameFieldGr[y][x] = this._containerTetro;
        this._app.stage.addChild(this._gameFieldGr[y][x]);
    }
    // створюємо піксі текст
    private createPanelText(text: string, x: number, y: number): PIXI.Text {
        const style= new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: ['#ffffff'], // gradient
        });
        const textField = new PIXI.Text(text,style);
        textField.x = x;
        textField.y = y;
        this._containerPanelText.name = 'textPanel';
        this._containerPanelText.addChild(textField);
        return textField;
    }
    //створюємо бокову панель
    private createPanel(): void {

        const x = 325; //координата х для розміщення елементів

        this._nextLabes = this.createPanelText('Next:',x,75);
        this._linesLabes = this.createPanelText('Lines:',x,200);
        this._scoreLabes = this.createPanelText('Score',x,250);
        this._levelLabes = this.createPanelText('Level',x,300);
    }
    //малюємо бокову панель
    private renderPanel({level, score, lines, nextPiece}:TGameState): void {
        this._nextLabes.text = 'Next:';
        this._linesLabes.text = `Lines: ${lines}`;
        this._scoreLabes.text = `Score: ${score}`;
        this._levelLabes.text = `Level: ${level}`;
        //виводимо фігуру збоку
        this._panelFieldGr = []; //створюємо масив для зберігання графіки блоку
        for (let y = 0; y < nextPiece.blocks.length; y++) {
            this._panelFieldGr[y] = [];
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {

                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.createBlock(x,y,block,'blockTetroPanel_',0.5,this._panelX,this._panelY + 100);
                }
            }
        }
    }

    private clearRenderPanel(): void {
        for (let y = 0; y < this._panelFieldGr.length; y++) {
            const line = this._panelFieldGr[y]; //константа для зручності
            for (let x = 0; x < line.length; x++) {
                this._app.stage.removeChild(this._panelFieldGr[y][x]);
            }
        }
    }
    //малюємо блок
    private renderBlock(x: number, y: number, width: number, height: number, color: number, colorLine: number): PIXI.Graphics {

        this._graphics = new PIXI.Graphics();
        this._graphics.lineStyle(1, colorLine, 100);
        this._graphics.beginFill(color);
        this._graphics.drawRect(x, y, width, height);
        this._graphics.endFill();

        return this._graphics;
    }
}