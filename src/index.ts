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

const model = new Model();
const view = new View(root,480,640,20,10);
const controller = new Controller(model,view);

window.game = model;
window.view = view;
window.controller = controller;