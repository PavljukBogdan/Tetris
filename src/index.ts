import Model from "./model";
import View from "./view";
import Controller from "./controller";

declare global {
  interface Window {
      game: Model;
      view: View;
      controller: Controller;
  }
}

const root = document.querySelector('#root');

const game = new Model();
const view = new View(root,480,640,20,10);
const controller = new Controller(game,view);

window.game = game;
window.view = view;
window.controller = controller;