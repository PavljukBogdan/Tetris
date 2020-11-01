import game, {TGameState} from "./game";
import {TMap} from "./Types";
import  * as PIXI from 'pixi.js'
import {Enums} from "./enums";

type TColors = TMap <number, number>;

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

    private _element: any;//дом. елемент
    private readonly _width: number; //ширина
    private readonly _height: number; //висота
    private _rows: number; //кількість рядів
    private _column: number; //кількість колонок
    private readonly _blockWidth: number; //ширина блока
    private readonly _blockHeight: number;//висота блока
    private readonly _playFieldBorderWidth: number;
    private readonly _playFieldX: number;
    private readonly _playFieldY: number;
    private readonly _playFieldWidth: number;
    private readonly _playFieldHeight: number;
    private readonly _playFieldInnerWidth: number;
    private readonly _playFieldInnerHeight: number;
    private readonly _panelX: number;
    private readonly _panelY: number;
    private _panelWidth: number;
    private _panelHeight: number;
    private _app: PIXI.Application;
    private _graphics: PIXI.Graphics;
    private _containerTetro: PIXI.Container;
    private _containerStartScreen = new PIXI.Container(); //контейнр стартового екрану
    private _containerPanelText = new PIXI.Container()
    private _styleScreen = new PIXI.TextStyle({
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

        this._app = new PIXI.Application({
            width: this._width,//ширина полотна
            height: this._height, //висота полотна
            backgroundColor: View.colors[8], //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });
        this._playFieldBorderWidth = 4;//ширина границі
        this._playFieldX = this._playFieldBorderWidth;//координати початку ігрового поля x
        this._playFieldY = this._playFieldBorderWidth;//координати початку ігрового поля y
        this._playFieldWidth = this._width * 2 / 3//Ширина ігрового поля
        this._playFieldHeight = this._height//Висота ігрового поля
        this._playFieldInnerWidth = this._playFieldWidth - this._playFieldBorderWidth * 2;//Внутрішня ширина ігрового поля
        this._playFieldInnerHeight = this._playFieldHeight - this._playFieldBorderWidth * 2;// Внутрішня висота ігрового поля

        this._blockWidth = this._playFieldInnerWidth/ column; //ширина блока
        this._blockHeight = this._playFieldInnerHeight / rows; //висота блока

        this._panelX = this._playFieldWidth + 10;
        this._panelY = 0;
        this._panelWidth = this._width / 3;//ширина панелі
        this._panelHeight = this._height;//висота панелі
        document.body.appendChild(this._app.view); //додаємо полотно, яке створили
    }

    private init(): void {
        this.createPanel();
        this.createEndScreen();
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
        richText.x = 50;
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

        const richText = new PIXI.Text('Press ENTER to Resume', this._styleScreen);
        richText.x = 50;
        richText.y = 280;

        const container = new PIXI.Container();
        container.name = 'pauseText';
        container.addChild(richText);

            this._app.stage.addChild(container);
    }
    // видаляємо елементи екрана паузи
    public removePauseScreen(): void {
        this._app.stage.removeChild(this._app.stage.getChildByName('pauseText'));
    }
    //створюємо елементи закінчення гри
    public renderEndScreen({score}: TGameState): void {
        this.scoreText.text = `Score ${score}`;
        this.restartText.text = 'Press ENTER to Restart';
        this._app.stage.addChild(this.containerScore);
        this._app.stage.addChild(this.containerRestart);
    }
    //малюємо екран закінчення гри
    private createEndScreen(): void {
        this.scoreText = new PIXI.Text('Score', this._styleScreen);
        this.scoreText.x = 150;
        this.scoreText.y = 280;
        this.restartText = new PIXI.Text('Press ENTER to Restart', this._styleScreen);
        this.restartText.x = 50;
        this.restartText.y = 320;

        this.containerScore = new PIXI.Container();
        this.containerScore.name = 'scoreText';
        this.containerScore.addChild(this.scoreText);

        this.containerRestart = new PIXI.Container();
        this.containerRestart.name = 'restartText';
        this.containerRestart.addChild(this.restartText);

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
                    this._containerTetro = new PIXI.Container();
                    this._containerTetro.addChild(
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this._playFieldX + (x * this._blockWidth),
                        this._playFieldY +  (y * this._blockHeight),
                        this._blockWidth,
                        this._blockHeight,
                        View.colors[block],
                        View.colors[8]));
                    this._containerTetro.name = 'blockTetro_' + y + '_' + x;
                    this._gameFieldGr[y][x] = this._containerTetro;
                    this._app.stage.addChild(this._gameFieldGr[y][x]);
                } else {
                    this._containerTetro = new PIXI.Container();
                    this._containerTetro.addChild(
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this._playFieldX + (x * this._blockWidth),
                        this._playFieldY +  (y * this._blockHeight),
                        this._blockWidth,
                        this._blockHeight,
                        View.colors[0],
                        View.colors[8]));
                    this._containerTetro.name = 'blackTetro_' + y + '_' + x;
                    this._gameFieldGr[y][x] = this._containerTetro;
                    this._app.stage.addChild(this._gameFieldGr[y][x]);
                }
            }
        }
    }
    // створюємо піксі текст
    private pixiTextPanel(text: string, x: number, y: number): PIXI.Text {
        const style= new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 18,
            fill: ['#ffffff'], // gradient
        });
        const scoreText = new PIXI.Text(text,style);
        scoreText.x = x;
        scoreText.y = y;
        this._containerPanelText.name = 'textPanel';
        this._containerPanelText.addChild(scoreText);
        return scoreText;
    }
    //створюємо бокову панель
    private createPanel(): void {

        const x = 325; //координата х для розміщення елементів

        this._nextLabes = this.pixiTextPanel('Next:',x,75);
        this._linesLabes = this.pixiTextPanel('Lines:',x,200);
        this._scoreLabes = this.pixiTextPanel('Score',x,250);
        this._levelLabes = this.pixiTextPanel('Level',x,300);
    }
    //малюємо бокову панель
    private renderPanel({level, score, lines, nextPiece}:TGameState): void {
        this._nextLabes.text = 'Next:';
        this._linesLabes.text = `Lines: ${lines}`;
        this._scoreLabes.text = `Score ${score}`;
        this._levelLabes.text = `Level: ${level}`;
        //виводимо фігуру збоку
        this._panelFieldGr = []; //створюємо масив для зберігання графіки блоку
        for (let y = 0; y < nextPiece.blocks.length; y++) {
            this._panelFieldGr[y] = [];
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {

                const block = nextPiece.blocks[y][x];

                if (block) {
                    this._containerTetro = new PIXI.Container();
                    this._containerTetro.addChild(
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this._panelX + (x * this._blockWidth * 0.5), //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this._panelY + 100 + (y * this._blockHeight * 0.5), //зміщуємо фігуру додатково на 100px
                        this._blockWidth * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this._blockHeight * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        View.colors[block],
                        View.colors[8]));
                    this._containerTetro.name = 'blockTetroPanel_' + y + '_' + x;
                    this._panelFieldGr[y][x] = this._containerTetro;
                    this._app.stage.addChild(this._panelFieldGr[y][x]);
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