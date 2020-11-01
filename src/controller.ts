import Game from "./game";
import View from "./view";

export default class Controller {


    private _game: Game;
    private _view: View;
    private _intervalId: any;
    private _isPlaying: boolean;

    constructor(game: any, view: any) {
     this._game = game;
     this._view = view;
     this._intervalId = null;
     this._isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup',this.handleKeyUp.bind(this));
        //запускаємо стартовий екран
        this._view.renderStartScreen();
    }
    //оновлення поля
    private update(): void {
        this._game.movePieceDown();//запускаємо фігуру вниз
        this.updateView();
    }
    //старт гри
    private play(): void {
        this._isPlaying = true; //прапор ми у грі
        this.startTimer(); //запускаємо таймер
        this.updateView(); // оновлюємо поле
    }
    //пауза
    private pause(): void {
        this._isPlaying = false; //прапор ми не в грі
        this.stopTimer(); //зупиняємо таймер
        this.updateView(); // оновлюємо поле
    }
    //перезавантаження
    private reset(): void {
        this._game.reset();
        this.play()
    }
    //оновлення поля
    private updateView(): void {
        const state = this._game.getState();

        if (state.isGameOver) {
            this._view.renderEndScreen(state); //додаємо екран закінчення гри
            this._view.removeStartScreen();
        } else if (!this._isPlaying) { //якщо ми не вгрі
            this._view.renderPauseScreen();
        } else {
            this._view.renderMainScreen(state); //оновлюємо зображення екрана
            this._view.removeStartScreen();
            this._view.removePauseScreen();
            this._view.removeEndScreen();
        }

    }

    private startTimer(): void { //запускаємо інтервал
        const speed = 1000 - (this._game.getState().level * 100);//швидкість гри

        if (!this._intervalId) {
            this._intervalId = setInterval(() =>  {
                this.update();
            },speed > 0 ? speed : 100);//максимальна швидкість 100мс
        }
    }

    private stopTimer(): void { //очищаємо інтервал
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    private handleKeyDown(): void {
        const state = this._game.getState();
        // @ts-ignore
        switch (event.keyCode) {
            case 13: //enter
                if (state.isGameOver) { //якщо гра закінчилась
                    this.reset(); //перезапускаємо
                } else if (this._isPlaying) { //якщо в грі
                    this.pause(); //пауза
                } else  {
                    this.play(); //гра працює
                }
                break;
            case 37: //стрілка вліво
                this._game.movePieceLeft(); //рухаємо фігуру вліво
                this.updateView(); //оновлюємо поле
                break;
            case 38: //стрілка вверх
                this._game.rotatePiece(); //повернути фігуру
                this.updateView(); //оновлюємо поле
                break;
            case 39: //стрілка вправо
                this._game.movePieceRight(); //рухаємо фігуру вправо
                this.updateView(); // оновлюємо поле
                break;
            case 40: // стрілка вниз
                this.startTimer(); //запускаємо таймер
                this._game.movePieceDown(); //рухаємо фігуру вниз
                this.updateView(); //оновлюємо поле
                break;
        }
    }
    private handleKeyUp(event: { keyCode: number }): void {
        switch (event.keyCode) {
            case 40: //стрілка вниз
                this.startTimer(); //запускаємо таймер
                break;
        }
    }
}

