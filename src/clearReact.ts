import {Container, } from "pixi.js";

export default class ClearRect extends Container {
    constructor(
        fromX: number,
        fromY: number,
        private w: number,
        private h: number
    ) {
        super();
        this.position.x = fromX;
        this.position.y = fromY;
    }

    // @ts-ignore
    _renderWebGL(renderer: PIXI.WebGLRenderer) {
        let gl = (renderer.gl as WebGLRenderingContext);
        let wt = this.worldTransform;

        gl.enable(gl.SCISSOR_TEST); // set the scissor rectangle.
        gl.scissor(wt.tx, wt.ty,
            wt.a * this.w,
            wt.d * this.h); // clear
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.SCISSOR_TEST);
    };

    // @ts-ignore
    _renderCanvas(renderer: PIXI.CanvasRenderer) {
        let wt = this.worldTransform;

        renderer.context.clearRect(wt.tx, wt.ty, wt.a * this.w, wt.d * this.h);
    };
}