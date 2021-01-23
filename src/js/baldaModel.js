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
        this.removeClick = null;
        this.addClick = null;
        this.letters = new Array(25).fill("");
    }


    init = (removeClickFunc, addClickFunc, changeFunc) => {
        this.removeClick = removeClickFunc;
        this.addClick = addClickFunc;
        this.change = changeFunc;
    }

    newGame = () => {
        for (let i = 0; i < this.bakArr.length; i++)
            this.bakArr[i] = '';

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

    endGame = () => {
        if (this.answers.length >= 21) {
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
                alert('Победил второй игрок!!! :)');
            // удаляем событие ход
            this.removeClick('test', this.validate);
            return true;
        } else {
            return false;
        }
    }

    setBak = () => {
        for (let k = 0; k < 25; k++)
            this.bakArr[k] = this.letters[k];
    }

    getBak = () => {
        for (let k = 0; k < 25; k++)
            this.letters[k] = this.bakArr[k];
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
            result += this.letters[this.track[i]];
        if (this.answers.indexOf(result) !== -1) {
            this.error = 'Слово "' + result + '" уже использовано';
            this.track = [];
            this.change();
            return false;
        }

        let flag = await this.findWord(result);

        if (flag) {
            // вешаем обработчик выбора буквы
            this.addClick('content', this.setChar);
            // удаляем задание пути
            this.removeClick('content', this.setTrack);
             // удаляем отмена
            this.removeClick('cancel', this.cancel);
            this.track = [];
            this.numChar = null;
            // добавляем слово в ответы

            this.answers.push(result);
            if (this.move > 0)
                this.scorePlayer1.push(this.answers.length - 1);
            else
                this.scorePlayer2.push(this.answers.length - 1);
            this.move *= -1;


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
                        if ((i < 20 && this.letters[i + 5 - 1] !== "") ||
                            (i > 5 && this.letters[i - 5 - 1] !== "") ||
                            (i % 5 < 4 && this.letters[i + 1 - 1] !== "") ||
                            (i % 5 > 0 && this.letters[i - 1 - 1] !== "")) {
                            let lastI = this.track[this.track.length - 1];
                            if ((lastI === i + 5) || (lastI === i - 5) || (lastI === i + 1) || (lastI === i - 1))
                                this.track.push(i);
                        }
                    } else {
                        this.track.push(i);
                    }
        }
        this.result = '';
        for (let i = 0; i < this.track.length; i++)
            this.result += this.letters[this.track[i]];

        this.change();
    }
    select = (e) => {

    }
    setChar = (event) => {
        this.setBak();
        if (event.target.nodeName === 'INPUT' && event.target.value === '') {

            this.removeClick('keyboard', this.select);
            this.select = (e) => {
                if (e.target.nodeName === "BUTTON") {
                    // ячейке таблицы присвоить выбраную букву на клавиатуре
                    this.letters[event.target.name] = e.target.firstChild.nodeValue;
                    // номер выбранной букве в таблице (подсвечивается красным)
                    this.numChar = parseInt(event.target.name);
                    // рендерим
                    this.change();
                    // скрывем клавиатуру
                    document.getElementById('substrate').className = 'hide';
                    this.removeClick('content', this.setChar);
                    // вешаем обработчик задания пути
                    this.addClick('content', this.setTrack);
                    // удаляем обработчик выбора буквы
                }
            };
            // вешаем обработчик события нажатия кнопки на клавиатуре
            this.addClick('keyboard', this.select);
            // вешаем обработчик отмены

            this.addClick('cancel', this.cancel);
            // показываем клавиатуру
            document.getElementById('substrate').className = 'show';
        }
    }
    cancel = () => {
        this.getBak();
        this.track = [];
        // вешаем обработчик выбора буквы
        this.addClick('content', this.setChar);
        // удаляем обработчик задания пути
        this.removeClick('content', this.setTrack);
        this.result = '';
        this.error = '';
        this.change();
    }
    start = () => {
        this.answers = ['балда'];
        this.letters[10] = this.answers[0][0];
        this.letters[11] = this.answers[0][1];
        this.letters[12] = this.answers[0][2];
        this.letters[13] = this.answers[0][3];
        this.letters[14] = this.answers[0][4];
        // удаляем событие Старт
        this.removeClick('start', this.start);
        // вешаем событие Заново
        document.getElementById('start').firstChild.nodeValue = 'Заново';
        this.addClick('start', this.newGame);
        // вешаем обработчик выбора буквы
        this.addClick('content', this.setChar);
        // вешаем обработчик проверки слова (Ход)
        this.addClick('turn', this.validate);
        this.change();
    }

    getDictionaryWord = async (word) => {
        let url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210123T111602Z.d13a7117c721fc03.d381475bbc4e86803e58aedf692bc649790f9c71&lang=ru-ru&text=" + word;
        let result = await fetch(url, {method: "GET"});
        if (result.ok) {
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
        return (rez.def.length !== 0);
    }

}