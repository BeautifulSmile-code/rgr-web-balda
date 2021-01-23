export class Model {
    constructor() {
        this.chars = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
        this.answers = [];
        this.bakArr = new Array(25);
        this.track = [];
        this.numChar = null;
        this.scorePlayer1 = [];
        this.scorePlayer2 = [];
        this.result = '';
        this.error = '';
        this.move = 1;
    }

    init(removeClickFunc, addClickFunc) {
        this.removeClick = removeClickFunc;
        this.addClick = addClickFunc;
    }

    newGame = () => {
        for (let i = 0; i < this.bakArr.length; i++)
            this.bakArr[i] = '';
        // удаляем задание пути
        document.getElementById('content').removeEventListener('click', this.setTrack, false);

        this.removeClick('content', this.setTrack);

        this.track = [];
        this.numChar = null;
        this.scorePlayer1 = [];
        this.scorePlayer2 = [];
        this.getBak();
        this.result = '';
        this.error = '';
        this.change();
        this.start();
    }


}