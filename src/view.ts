export default class View {

    static colors = {
        '1': 'cyan',
        '2': 'blue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'purple',
        '7': 'red'
    };

    private element: any;//дом. елемент
    private width: number; //ширина
    private height: number; //висота
    private rows: number; //кількість рядів
    private column:number; //кількість колонок
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D | null;
    private blockWidth: number; //ширина блока
    private blockHeight: number;//висота блока
    private playFieldBorderWidth: number;
    private playFieldX: number;
    private playFieldY: number;
    private playFieldWidth: number;
    private playFieldHeight: number;
    private playFieldInnerWidth: number;
    private playFieldInnerHeight: number;
    private panelX: number;
    private panelY: number;
    private panelWidth: number;
    private panelHeight: number;


    constructor(element: any, width: number, height: number, rows: number, column: number) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.column = column;

        this.canvas = document.createElement('canvas'); //полотно
        this.canvas.width = this.width;//ширина полотна
        this.canvas.height = this.height;//висота полотна
        this.context = this.canvas.getContext('2d');//контекст для малювання

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

        this.element.appendChild(this.canvas);//додаємо контекст, який створили
    }
    //малюємо загальне поле
    // @ts-ignore
    renderMainScreen(state) {
        this.clearScreen(); //очищаємо
        this.renderPlayField(state);  //малюємо ігрове поле
        // @ts-ignore
        this.renderPanel(state); //малюєм бокову панель
    }
    //малюємо стартовий екран
    renderStartScreen() {
        // @ts-ignore
        this.context?.fillStyle = 'white';
        // @ts-ignore
        this.context?.font = '18px "Press Start 2P"';
        // @ts-ignore
        this.context?.textAlign = 'center';
        // @ts-ignore
        this.context?.textBaseline = 'middle';
        this.context?.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    //малюємо екран паузи
    renderPauseScreen() {
        // @ts-ignore
        this.context?.fillStyle = 'rgba(0,0,0,0.75)'//затемнення основного екрану
        this.context?.fillRect(0,0,this.width, this.height);
        // @ts-ignore
        this.context?.fillStyle = 'white';
        // @ts-ignore
        this.context?.font = '18px "Press Start 2P"';
        // @ts-ignore
        this.context?.textAlign = 'center';
        // @ts-ignore
        this.context?.textBaseline = 'middle';
        this.context?.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }
    //малюємо екран закінчення гри
    // @ts-ignore
    renderEndScreen({ score }) {
        this.clearScreen(); //очищуємо екран
        // @ts-ignore
        this.context?.fillStyle = 'white';
        // @ts-ignore
        this.context?.font = '18px "Press Start 2P"';
        // @ts-ignore
        this.context?.textAlign = 'center';
        // @ts-ignore
        this.context?.textBaseline = 'middle';
        this.context?.fillText('GAME OVER', this.width / 2, this.height / 2 - 48);
        this.context?.fillText(`Score ${score}`, this.width / 2, this.height / 2);
        this.context?.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 48);
    }
    //очищаємо полотно
    clearScreen() {
        // @ts-ignore
        this.context.clearRect(0,0,this.width,this.height); //очищаємо поле від фігури
    }
    //малюємо ігрове поле
    // @ts-ignore
    renderPlayField({ playField }) {
        for (let y = 0; y < playField.length; y++) {
            const line = playField[y]; //константа для зручності

            for (let x = 0; x < line.length; x++) {
                const block =  line[x]; //отримуємо хожну чарунку в ігровому полі
                if (block) { //якщо чарунка не пуста
                   // @ts-ignore
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.playFieldX + (x * this.blockWidth),
                        this.playFieldY +  (y * this.blockHeight),
                        this.blockWidth,
                        this.blockHeight,
                        // @ts-ignore
                        View.colors[block]);
                }
            }
        }
        //малюємо межу ігрового поля
        // @ts-ignore
        this.context?.strokeStyle = 'white'; //колір білий
        // @ts-ignore
        this.context?.lineWidth = this.playFieldBorderWidth;//ширина лінії
        this.context?.strokeRect(0,0,this.playFieldWidth, this.playFieldHeight);
    }


    //малюємо бокову панель
    // @ts-ignore
    renderPanel({level, score, lines, nextPiece}) {
        // @ts-ignore
        this.context.textAlign = 'start'; //форматуємо по лівому краю
        // @ts-ignore
        this.context.textBaseline = 'top';//форматуємо по верхньому краю
        // @ts-ignore
        this.context.fillStyle = 'white';//колір тексту
        // @ts-ignore
        this.context.font = '14px "Press Start 2P"';//шрифт
        this.context?.fillText(`score: ${score}`,this.panelX,this.panelY);//виводимо текст на плолтно
        this.context?.fillText(`Lines: ${lines}`,this.panelX,this.panelY + 24);//виводимо текст на плолтно
        this.context?.fillText(`Level: ${level}`,this.panelX,this.panelY + 48);//виводимо текст на плолтно
        this.context?.fillText('Next:',this.panelX,this.panelY + 96);//виводимо текст на плолтно

        for (let y = 0; y < nextPiece.blocks.length; y++) {//виводимо фігуру
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];
                if (block) {
                    this.renderBlock( //малюємо блок з наступною фігурою
                        this.panelX + (x * this.blockWidth * 0.5), //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.panelY + 100 + (y * this.blockHeight * 0.5), //зміщуємо фігуру додатково на 100px
                        this.blockWidth * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        this.blockHeight * 0.5, //зменшуємо розмір фігури в 2 рази відносно інших об'єктів
                        // @ts-ignore
                        View.colors[block]);
                }
            }
        }

    }

    //малюємо блок
    renderBlock(x: number, y: number, width: number, height: number, color: string): void {

        // @ts-ignore
        this.context.fillStyle = color; //виводимо її червоною
        // @ts-ignore
        this.context.strokeStyle = 'black';//в чорній обводці
        // @ts-ignore
        this.context.lineWidth = 2; //товщиною 2px
        // @ts-ignore
        this.context.fillRect(x,y,width,height); //виводимо прямокутник
        // @ts-ignore
        this.context.strokeRect(x,y,width,height); //обводимо прямокутник
    }
}