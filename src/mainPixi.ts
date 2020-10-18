import  * as PIXI from 'pixi.js'
import {Graphics} from "pixi.js";

export default class MainPixi {

    renderRectangle() {
        let app = new PIXI.Application({
            width: 480,//ширина полотна
            height: 640, //висота полотна
            backgroundColor: 0x1099bb, //колір ігрового полотна
            resolution: window.devicePixelRatio || 1,
        });

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(2, 0xFEEB77, 1);
        graphics.beginFill(0x650A5A);
        graphics.drawRect(200, 50, 100, 100);
        graphics.endFill();

        app.stage.addChild(graphics);

        const container = new PIXI.Container();

        container.addChild(graphics);
        app.stage.addChild(container);

        container.y -= 1;





        //this.element.appendChild(this.canvas);//додаємо контекст, який створили
        document.body.appendChild(app.view);
    }
}