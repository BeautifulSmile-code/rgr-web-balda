export class EventView {

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
    endGame = () => {
        if (this.answers.length >= 3) {
            let nPlayer = 0, nBot = 0;
            for (let i = 0; i < this.scorePlayer1.length; i++)
                nPlayer += this.answers[this.scorePlayer1[i]].length;
            for (let i = 0; i < this.scorePlayer2.length; i++)
                nBot += this.answers[this.scorePlayer2[i]].length;
            if (nPlayer === nBot)
                alert('Ничья');
            else if (nPlayer > nBot)
                alert('Победил первый игрок!!! :)');
            else
                alert('Вы проиграли :(');
            // удаляем событие ход
            document.getElementById('test').removeEventListener('click', this.validate, false);
            return true;
        } else {
            return false;
        }
    }
    change = () => {
        let arrInput = document.querySelectorAll('input');
        for (let k = 0; k < arrInput.length; k++) {
            if (this.track.indexOf(parseInt(arrInput[k].name)) !== -1)
                arrInput[k].classList.add('select');
            else
                arrInput[k].classList.remove('select');
            if (this.numChar !== null && this.numChar === parseInt(arrInput[k].name))
                arrInput[k].classList.add('add');
            else
                arrInput[k].classList.remove('add');
        }
        let str = '', word = '', n = 0;
        for (let i = 0; i < this.scorePlayer1.length; i++) {
            word = this.answers[this.scorePlayer1[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }
        document.getElementById('player1-score').innerHTML = n;
        document.getElementById('player1-words').innerHTML = str;

        str = '';
        n = 0;
        for (let i = 0; i < this.scorePlayer2.length; i++) {
            word = this.answers[this.scorePlayer2[i]];
            str += word + ' (' + word.length + ')<br>';
            n += word.length;
        }
        document.getElementById('player2-score').innerHTML = n;
        document.getElementById('player2-words').innerHTML = str;
        document.getElementById('result').innerHTML = this.result;
        document.getElementById('error').innerHTML = this.error;
    }
    setBak = () => {
        let arrInput = document.querySelectorAll('input');
        // заполняем массив данными из таблицы
        for (let k = 0; k < arrInput.length; k++)
            this.bakArr[parseInt(arrInput[k].name)] = arrInput[k].value;
    }
    getBak = () => {
        let arrInput = document.querySelectorAll('input');
        for (let k = 0; k < arrInput.length; k++)
            arrInput[k].value = this.bakArr[parseInt(arrInput[k].name)];
    }
    validate = async () => {
        if (this.numChar !== null && this.track.indexOf(this.numChar) === -1) {
            this.error = "Слово должно содержать добавленную букву";
            this.track = [];
            this.change();
            return false;
        }
        let result = '';
        for (let i = 0; i < this.track.length; i++)
            result += document.getElementsByName(this.track[i])[0].value;
        if (this.answers.indexOf(result) !== -1) {
            this.error = 'Слово "' + result + '" уже использовано';
            this.track = [];
            this.change();
            return false;
        }

        let flag = await this.findWord(result);

        if (flag) {
            // вешаем обработчик выбора буквы
            document.getElementById('content').addEventListener('click', this.setChar, false);
            // удаляем задание пути
            document.getElementById('content').removeEventListener('click', this.setTrack, false);
            // удаляем отмена
            document.getElementById('cancel').removeEventListener('click', this.cancel, false);
            this.track = [];
            this.numChar = null;
            // добавляем слово в ответы

            this.answers.push(result);
            if (this.move > 0)
                this.scorePlayer1.push(this.answers.length - 1);
            else
                this.scorePlayer2.push(this.answers.length - 1);
            this.move*=-1;


        } else {
            this.track = [];
            if (this.numChar === null)
                this.error = 'Добавьте букву';
            else if (result.length > 1)
                this.error = 'Слово "' + result + '" не найдено';
            else
                this.error = 'Выберите слово';
        }
        this.change();
        this.endGame();
    }
    setTrack = (event) => {
        if (event.target.nodeName === 'INPUT') {
            let i = parseInt(event.target.name);
            if (event.target.value !== '')
                if (this.track.indexOf(i) === -1)
                    if (this.track.length > 0) {
                        if ((i < 20 && document.getElementsByName(i + 5)[0].value) ||
                            (i > 5 && document.getElementsByName(i - 5)[0].value) ||
                            (i % 5 < 4 && document.getElementsByName(i + 1)[0].value) ||
                            (i % 5 > 0 && document.getElementsByName(i - 1)[0].value)) {
                            let lastI = this.track[this.track.length - 1];
                            if ((lastI === i + 5) || (lastI === i - 5) || (lastI === i + 1) || (lastI === i - 1))
                                this.track.push(i);
                        }
                    } else {
                        this.track.push(i);
                    }
        }
        let result = '';
        for (let i = 0; i < this.track.length; i++)
            result += document.getElementsByName(this.track[i])[0].value;
        this.change();
        document.getElementById('result').innerHTML = result;
    }
    select = (e) => {

    }
    setChar = (event) => {
        if (event.target.nodeName === 'INPUT' && event.target.value === '') {
            let kb = document.getElementById('keyboard');
            kb.removeEventListener('click', this.select, false);
            this.select = (e) => {
                if (e.target.nodeName === "BUTTON") {
                    // ячейке таблицы присвоить выбраную букву на клавиатуре
                    event.target.value = e.target.firstChild.nodeValue;
                    // номер выбранной букве в таблице (подсвечивается красным)
                    this.numChar = parseInt(event.target.name);
                    // рендерим
                    this.change();
                    // скрывем клавиатуру
                    document.getElementById('substrate').className = 'hide';
                    document.getElementById('content').removeEventListener('click', this.setChar, false);
                    // вешаем обработчик задания пути
                    document.getElementById('content').addEventListener('click', this.setTrack, false);
                    // удаляем обработчик выбора буквы

                }
            };
            // вешаем обработчик события нажатия кнопки на клавиатуре
            kb.addEventListener('click', this.select, false);
            // вешаем обработчик отмены
            this.setBak();
            document.getElementById('cancel').addEventListener('click', this.cancel, false);
            // показываем клавиатуру
            document.getElementById('substrate').className = 'show';
        }
    }
    cancel = () => {
        this.getBak();
        this.track = [];
        // вешаем обработчик выбора буквы
        document.getElementById('content').addEventListener('click', this.setChar, false);
        // удаляем обработчик задания пути
        document.getElementById('content').removeEventListener('click', this.setTrack, false);
        //document.getElementById('result').innerHTML = '';
        this.result = '';
        this.error = '';
        this.change();
    }
    start = () => {
        this.answers = ['балда'];
        document.getElementsByName('10')[0].value = this.answers[0][0];
        document.getElementsByName('11')[0].value = this.answers[0][1];
        document.getElementsByName('12')[0].value = this.answers[0][2];
        document.getElementsByName('13')[0].value = this.answers[0][3];
        document.getElementsByName('14')[0].value = this.answers[0][4];
        // удаляем событие Старт
        document.getElementById('start').removeEventListener('click', this.start, false);
        // вешаем событие Заново
        document.getElementById('start').firstChild.nodeValue = 'Заново';
        document.getElementById('start').addEventListener('click', this.newGame, false);
        // вешаем обработчик выбора буквы
        document.getElementById('content').addEventListener('click', this.setChar, false);
        // вешаем обработчик проверки слова (Ход)
        document.getElementById('turn').addEventListener('click', this.validate, false);
        this.change();
    }

    getDictionaryWord = async(word) => {
        let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210123T111602Z.d13a7117c721fc03.d381475bbc4e86803e58aedf692bc649790f9c71&lang=ru-ru&text="+word;
        let result = await fetch(url, {method: "GET"});
        if (result.ok) {
            // console.log(result)
            return await result.json();
        } else {
            return null;
            console.error(`Cannot find word`);
        }
    }


    // поиск целого слова в словаре
    findWord = async (word) => {
        let rez = await this.getDictionaryWord(word);
        console.log(word);
        console.log(rez);
        console.log(rez.def.length);
        console.log(rez.def.length !== 0);
        return ( rez.def.length !== 0);
    }

}