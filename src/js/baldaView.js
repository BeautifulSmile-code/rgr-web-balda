import {Model} from "./baldaModel.js"

export class View {
    constructor() {

    }
    init = (model) => {
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
        for (let i = 0; i < model.chars.length; i++) {
            let b = document.createElement('button');
            let t = document.createTextNode(model.chars[i]);
            b.appendChild(t);
            kb.appendChild(b);
            if (i !== 0 && i % 8 === 7)
                kb.appendChild(document.createElement('br'));
        }
        kb.addEventListener('click', model.select, false);
        // вешаем обработчик начать игру
        document.getElementById('start').addEventListener('click', model.start, false);
        document.getElementById('cancel').addEventListener('click', model.cancel, false);
    }

    removeClick = (id, func) => {
        document.getElementById(id).removeEventListener('click', func, false);
    }

    addClick = (id, func) => {
        document.getElementById(id).addEventListener('click', func, false);
    }

    change = (model) => {
        let arrInput = document.querySelectorAll('input');
        for (let k = 0; k < arrInput.length; k++) {
            arrInput[k].value = model.letters[k];
            if (model.track.indexOf(parseInt(arrInput[k].name)) !== -1)
                arrInput[k].classList.add('select');
            else
                arrInput[k].classList.remove('select');
            if (model.numChar !== null && model.numChar === parseInt(arrInput[k].name))
                arrInput[k].classList.add('add');
            else
                arrInput[k].classList.remove('add');
        }
        let str = '', word = '', n = 0;
        for (let i = 0; i < model.scorePlayer1.length; i++) {
            word = model.answers[model.scorePlayer1[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }

        document.getElementById('player1-score').innerHTML = n;
        document.getElementById('player1-words').innerHTML = str;

        str = '';
        n = 0;
        for (let i = 0; i < model.scorePlayer2.length; i++) {
            word = model.answers[model.scorePlayer2[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }
        document.getElementById('player2-score').innerHTML = n;
        document.getElementById('player2-words').innerHTML = str;
        document.getElementById('result').innerHTML = model.result;
        document.getElementById('error').innerHTML = model.error;
    }

}




