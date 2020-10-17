import  * as PIXI from 'pixi.js'
import {Graphics} from "pixi.js";

export default class MainPixi {

    renderRectangle() {
        let app = new PIXI.Application({
            width: 640,//ширина полотна
            height: 640, //висота полотна
            backgroundColor: 0x1099bb, //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });

        //this.element.appendChild(this.canvas);//додаємо контекст, який створили
        document.body.appendChild(app.view);
    }
}