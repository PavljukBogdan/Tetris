import Game from "./game";
import View from "./view";
import Controller from "./controller";

declare global {
  interface Window {
      game: Game;
      view: View;
      controller: Controller;
  }
}

const root = document.querySelector('#root');

const game = new Game();
const view = new View(root,480,640,20,10);
const controller = new Controller(game,view);

window.game = game;
window.view = view;
window.controller = controller;


