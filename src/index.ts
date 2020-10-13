import Game from "./game";
import View from "./view";
import Controller from "./controller";

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root,480,640,20,10);
const controller = new Controller(game,view);

// @ts-ignore
window.game = game;
// @ts-ignore
window.view = view;
// @ts-ignore
window.controller = controller;

