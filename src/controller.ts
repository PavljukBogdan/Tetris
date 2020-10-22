import Game from "./game";
import View from "./view";

export default class Controller {


    private game: Game;
    private view: View;
    private intervalId: any;
    private isPlaying: boolean;

    constructor(game: any, view: any) {
     this.game = game;
     this.view = view;
     this.intervalId = null;
     this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup',this.handleKeyUp.bind(this));
        //запускаємо стартовий екран
        this.view.renderStartScreen(this.isPlaying);
    }
    //оновлення поля
    private update(): void {
        this.game.movePieceDown();//запускаємо фігуру вниз
        this.updateView();
    }
    //старт гри
    private play(): void {
        this.isPlaying = true; //прапор ми у грі
        this.startTimer(); //запускаємо таймер
        this.updateView();
    }
    //пауза
    private pause(): void {
        this.isPlaying = false; //прапор ми не в грі
        this.stopTimer(); //зупиняємо таймер
        this.updateView();
    }
    //перезавантаження
    private reset(): void {
        this.game.reset();
        this.play()
    }
    //оновлення поля
    private updateView(): void {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.view.renderEndScreen(state); //додаємо екран закінчення гри
            this.view.removeStartScreen();
        } else if (!this.isPlaying) { //якщо ми не вгрі
            this.view.renderPauseScreen(this.isPlaying);
        } else {
            this.view.renderMainScreen(state); //оновлюємо зображення екрана
            this.view.removeStartScreen();
            this.view.removePauseScreen();
            this.view.removeEndScreen();
        }

    }

    private startTimer(): void { //запускаємо інтервал
        const speed = 1000 - (this.game.getState().level * 100);//швидкість гри

        if (!this.intervalId) {
            this.intervalId = setInterval(() =>  {
                this.update();
            },speed > 0 ? speed : 100);//максимальна швидкість 100мс
        }
    }

    private stopTimer(): void { //очищаємо інтервал
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private handleKeyDown(): void {
        const state = this.game.getState();
        // @ts-ignore
        switch (event.keyCode) {
            case 13:
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else  {
                    this.play();
                }
                break;
            case 37:
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 38:
                this.game.rotatePiece();
                this.updateView();
                break;
            case 39:
                this.game.movePieceRight();
                this.updateView();
                break;
            case 40:
                this.startTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
        }
    }
    private handleKeyUp(event: { keyCode: any; }): void {
        switch (event.keyCode) {
            case 40:
                this.startTimer();
                break;
        }
    }
}

