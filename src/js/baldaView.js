import music from "/src/audio/music-balda.mp3";
export class View {
    constructor() {
        this.audio = null;
    }
    init = (obj) => {
        this.audio = document.getElementById('audio');
        this.audio.src= music;
        this.audio.loop = "loop";
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
        for (let i = 0; i < obj.chars.length; i++) {
            let b = document.createElement('button');
            let t = document.createTextNode(obj.chars[i]);
            b.appendChild(t);
            kb.appendChild(b);
            if (i !== 0 && i % 8 === 7)
                kb.appendChild(document.createElement('br'));
        }
        kb.addEventListener('click', obj.select, false);
        // вешаем обработчик начать игру
        document.getElementById('start').addEventListener('click', obj.start, false);
        document.getElementById('cancel').addEventListener('click', obj.cancel, false);

        document.getElementById('music').addEventListener('click', this.playMusic, false);
    }

    removeClick = (id, func) => {
        document.getElementById(id).removeEventListener('click', func, false);
    }

    addClick = (id, func) => {
        document.getElementById(id).addEventListener('click', func, false);
    }

    change = (obj) => {
        let arrInput = document.querySelectorAll('input');
        for (let k = 0; k < arrInput.length; k++) {
            arrInput[k].value = obj.letters[k];
            if (obj.track.indexOf(parseInt(arrInput[k].name)) !== -1)
                arrInput[k].classList.add('select');
            else
                arrInput[k].classList.remove('select');
            if (obj.numChar !== null && obj.numChar === parseInt(arrInput[k].name))
                arrInput[k].classList.add('add');
            else
                arrInput[k].classList.remove('add');
        }
        let str = '', word = '', n = 0;
        for (let i = 0; i < obj.scorePlayer1.length; i++) {
            word = obj.answers[obj.scorePlayer1[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }

        document.getElementById('player1-score').innerHTML = n;
        document.getElementById('player1-words').innerHTML = str;

        str = '';
        n = 0;
        for (let i = 0; i < obj.scorePlayer2.length; i++) {
            word = obj.answers[obj.scorePlayer2[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }
        document.getElementById('player2-score').innerHTML = n;
        document.getElementById('player2-words').innerHTML = str;
        document.getElementById('result').innerHTML = obj.result;
        document.getElementById('error').innerHTML = obj.error;

        let player1 = document.getElementById('player1');
        let player2 = document.getElementById('player2');

        if (obj.move == 0) {
            player1.classList.remove('playerPlay');
            player2.classList.remove('playerPlay');
        }
        if (obj.move == 1) {
            player1.classList.add('playerPlay');
            player2.classList.remove('playerPlay');
        }
        if (obj.move == -1) {
            player2.classList.add('playerPlay');
            player1.classList.remove('playerPlay');
        }

        if (obj.showKey === true) document.getElementById('substrate').className = 'show';
        else document.getElementById('substrate').className = 'hide';
    }

    startView = (obj) => {
        this.removeClick('start', obj.start);
        document.getElementById('start').firstChild.nodeValue = 'Заново';
        this.addClick('start', obj.newGame);
        this.addClick('content', obj.setChar);
        this.addClick('turn', obj.validate);
        this.change(obj);
    }
    showKeyboard = (obj) => {
        document.getElementById('substrate').className = 'hide';
        this.change(obj);
    }

    playMusic = () => {

        this.audio.play();
        document.getElementById('music').firstChild.nodeValue = "Остановить музыку";
        document.getElementById('music').removeEventListener('click', this.playMusic);
        document.getElementById('music').addEventListener('click', this.pauseMusic);
    }
    pauseMusic = () => {
        this.audio.pause();
        document.getElementById('music').firstChild.nodeValue = "Включить музыку";
        document.getElementById('music').removeEventListener('click', this.pauseMusic);
        document.getElementById('music').addEventListener('click', this.playMusic);
    }
}




