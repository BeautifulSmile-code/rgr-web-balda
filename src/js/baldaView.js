import {EventView} from "./eventView.js"

export class View {
    constructor() {
        this.events = new EventView();
    }
    init() {
        let content = document.getElementById('content');
        let k = 0;
        for (let i = 1; i <= 5; i++) {
            let div = document.createElement('div');
            for (let j = 1; j <= 5; j++) {
                let input = document.createElement('input');
                input.setAttribute('readonly', 'readonly');
                input.name = k;
                div.appendChild(input);
                k++;
            }
            content.appendChild(div);
        }
        let kb = document.getElementById('keyboard');
        for (let i = 0; i < this.events.chars.length; i++) {
            let b = document.createElement('button');
            let t = document.createTextNode(this.events.chars[i]);
            b.appendChild(t);
            kb.appendChild(b);
            if (i !== 0 && i % 8 === 7)
                kb.appendChild(document.createElement('br'));
        }
        kb.addEventListener('click', this.events.select, false);
        // вешаем обработчик начать игру
        document.getElementById('start').addEventListener('click', this.events.start, false);
        document.getElementById('cancel').addEventListener('click', this.events.cancel, false);
    }

    removeClick = (id, func) => {

    }

    addClick = (id, func) => {

    }

}




