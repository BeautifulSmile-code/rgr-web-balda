import {Model} from './baldaModel.js';
import {View} from './baldaView.js';

class Controller {
    constructor(view, model) {
        this.baldaView = view;
        this.baldaModel = model;
    }

    init() {
        this.baldaView.init();
        this.baldaModel.init(this.baldaView.removeClick, this.baldaView.addClick);
        this.needRendering();
    };

    needRendering(){
        //this.baldaView.render(baldaModel.objs);
    };
}

let baldaModel = new Model();
let baldaView = new View();

let simonController = new Controller(baldaView, baldaModel);
simonController.init();