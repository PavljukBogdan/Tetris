import Model from "./model";
import View from "./view";

export default class Controller {


    private _model: Model;
    private _view: View;
    private _intervalId: number;
    private _isPlaying: boolean;

    constructor(model: Model, view: View) {
     this._model = model;
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
        this._model.movePieceDown();//запускаємо фігуру вниз
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
        this._model.reset();
        this.play()
    }
    //оновлення поля
    private updateView(): void {
        const state = this._model.getState();

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
    //запускаємо інтервал
    private startTimer(): void {
        const speed = 1000 - (this._model.getState().level * 100);//швидкість гри

        if (!this._intervalId) {
            this._intervalId = setInterval(() =>  {
                this.update();
            },Math.max(100,speed));//максимальна швидкість 100мс
        }
    }
    //очищаємо інтервал
    private stopTimer(): void {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }
    //кнопки керування
    private handleKeyDown(e: KeyboardEvent): void {
        const state = this._model.getState();

        switch (e.key) {
            case 'Enter':
                if (state.isGameOver) { //якщо гра закінчилась
                    this.reset(); //перезапускаємо
                } else if (this._isPlaying) { //якщо в грі
                    this.pause(); //пауза
                } else  {
                    this.play(); //гра працює
                }
                break;
            case 'ArrowLeft': //стрілка вліво
                this._model.movePieceLeft(); //рухаємо фігуру вліво
                this.updateView(); //оновлюємо поле
                break;
            case 'ArrowUp': //стрілка вверх
                this._model.rotatePiece(); //повернути фігуру
                this.updateView(); //оновлюємо поле
                break;
            case 'ArrowRight': //стрілка вправо
                this._model.movePieceRight(); //рухаємо фігуру вправо
                this.updateView(); // оновлюємо поле
                break;
            case 'ArrowDown': // стрілка вниз
                this.startTimer(); //запускаємо таймер
                this._model.movePieceDown(); //рухаємо фігуру вниз
                this.updateView(); //оновлюємо поле
                break;
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowDown': //стрілка вниз
                this.startTimer(); //запускаємо таймер
                break;
        }
    }
}

