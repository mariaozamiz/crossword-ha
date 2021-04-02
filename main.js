'use strict';

/*************************
 *       Variables       *
 *************************/

const maxId = 168;
let firstIdCell = 2;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
let start = false;
let totalSeconds = JSON.parse(localStorage.getItem('timer')) || 0;
let crossword = JSON.parse(localStorage.getItem('crossword')) || {};
let timer;
let errors = JSON.parse(localStorage.getItem('errors')) || 0;
let score = JSON.parse(localStorage.getItem('score')) || 0;
let cluesData;

const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const table = document.querySelector('.table');
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const acrossClueList = document.querySelector('.clues-across');
const downClueList = document.querySelector('.clues-down');
const clueBox = document.querySelector('.clue-box');
const checkBtn = document.querySelector('.btn-check');
const solveBtn = document.querySelector('.btn-solve');
const clearBtn = document.querySelector('.btn-clear');
const shareBtn = document.querySelector('.btn-share');
const closeBtn = document.querySelector('.dialog-close-btn');
const dialog = document.querySelector('.dialog');
dialogPolyfill.registerDialog(dialog);
const form = document.querySelector('.form');
const scoreText = document.querySelector('.score');

/*************************
 *       Listeners       *
 *************************/

table.addEventListener('mousedown', handleClick);
table.addEventListener('input', handleWriting);
table.addEventListener('keyup', handleKeyUp);
checkBtn.addEventListener('click', showErrors);
solveBtn.addEventListener('click', solveCrossword);
clearBtn.addEventListener('click', clearGame);
shareBtn.addEventListener('click', shareOnTwitter);
closeBtn.addEventListener('click', () => dialog.close());
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));

/*************************
 *         Start        *
 *************************/

startGame();

function startGame() {
    fetchClues();
    if (Object.keys(crossword).length > 0) {
        //check and paint localStorage data in DOM
        const keysArr = Object.keys(crossword);
        keysArr.forEach((key) => {
            let cell = document.getElementById(key);
            cell.value = crossword[key];
        });
    }
    if (totalSeconds > 0) {
        setTime();
    }
}

/*************************
 *        Buttons        *
 *************************/

function showErrors() {
    if (errorShown) {
        document.documentElement.style.setProperty(
            `--colorerror`,
            `var(--blue)`
        );
        errorShown = false;
        checkBtn.innerHTML = `mostrar errores`;
    } else {
        document.documentElement.style.setProperty(`--colorerror`, `red`);
        errorShown = true;
        checkBtn.innerHTML = `ocultar errores`;
        scoreDown();
    }
}

function solveCrossword() {
    cells.forEach((cell) => (cell.value = cell.pattern.charAt(1)));
    checkForm();
}

function clearGame() {
    window.localStorage.clear();
    removeHighligh();
    totalSeconds = -1;
    clearInterval(timer);
    start = false;
    setTime();
}

function shareOnTwitter() {
    console.log('compartes');
}

/*************************
 *     LocalStorage      *
 *************************/

function saveCrossword(e) {
    const id = e.target.id;
    const letter = e.target.value;
    //save crossword object: id as key, letter as value
    crossword[id] = letter;
    localStorage.setItem('crossword', JSON.stringify(crossword));
    //save crossword timer, score and errors
    localStorage.setItem('timer', JSON.stringify(totalSeconds));
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('errors', JSON.stringify(errors));
}

/*************************
 *     Flow-writing     *
 *************************/

function handleWriting(e) {
    saveCrossword(e);
    checkInput(e);
    if (checkForm()) {
        return;
    }
    if (!start) {
        startTimer();
    }
    let cellId = e.target.id;
    if (e.inputType === 'deleteContentBackward') {
        return;
    }
    let nextCell = getNextCell(cellId);
    while (
        !nextCell.hasAttribute(across ? 'data-across' : 'data-down') ||
        nextCell.value
    ) {
        nextCell = getNextCell(nextCell.id);
    }
    nextCell.focus();
}

function handleKeyUp(e) {
    let cellId = e.target.id;
    if (e.key === 'Backspace') {
        let previousCell = getPreviousCell(cellId);
        while (
            !previousCell.hasAttribute(across ? 'data-across' : 'data-down') &&
            previousCell.id > firstIdCell
        ) {
            previousCell = getPreviousCell(previousCell.id);
        }
        previousCell.focus();
    }
    if (e.key === 'ArrowDown') {
        let nextCellId = parseInt(cellId) + 12;
        const cell = document.getElementById(nextCellId);
        if (cell) {
            cell.focus();
        }
    }
    if (e.key === 'ArrowRight') {
        let nextCellId = parseInt(cellId) + 1;
        const cell = document.getElementById(nextCellId);
        if (cell.dataset.across === e.target.dataset.across) {
            cell.focus();
        }
    }
    if (e.key === 'ArrowUp') {
        let nextCellId = parseInt(cellId) - 12;
        const cell = document.getElementById(nextCellId);
        if (cell) {
            cell.focus();
        }
    }
    if (e.key === 'ArrowLeft') {
        let nextCellId = parseInt(cellId) - 1;
        const cell = document.getElementById(nextCellId);
        if (cell.dataset.across === e.target.dataset.across) {
            cell.focus();
        }
    }
}

function getNextCell(id) {
    let cellId = parseInt(id);
    if (across) {
        cellId = (cellId % maxId) + 1;
    } else {
        cellId += 12;
        if (cellId > maxId) {
            cellId = (cellId % maxId) + 1;
            if (cellId > 12) cellId = 1;
        }
    }
    return document.getElementById(cellId);
}

function getPreviousCell(id) {
    let cellId = parseInt(id);
    if (across) {
        cellId = (cellId % maxId) - 1;
    } else {
        cellId -= 12;
        if (cellId <= 0) {
            cellId += maxId - 1;
            if (cellId == 156) cellId = 168;
        }
    }
    return document.getElementById(cellId);
}

/******************
 *  Fetch clues  *
 *******************/

function fetchClues() {
    fetch('clues.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cluesData = data;
            paintClueList('across');
            paintClueList('down');
        });
}

function paintClue(num) {
    clueBox.innerHTML = `${num}. ${cluesData[across ? 'across' : 'down'][num]}`;
}

function paintClueList(clueDirection) {
    const list = clueDirection === 'across' ? acrossClueList : downClueList;
    list.innerHTML = `<h2><strong>${
        clueDirection === 'across' ? 'Horizontales' : 'Verticales'
    }</strong></h2>`;
    for (const num in cluesData[clueDirection]) {
        let newLi = document.createElement('li');
        newLi.setAttribute('class', 'clue');
        newLi.setAttribute(`data-${clueDirection}`, num);
        newLi.innerHTML = `${num}. ${cluesData[clueDirection][num]}`;
        list.appendChild(newLi);
    }
}

/************************************
 *  Cell direction & highlighting   *
 ************************************/

function handleClick(e) {
    if (currentCellId === e.target.id) {
        across = !across;
        handleFocus(e);
    }
}

function handleFocus(e) {
    removeHighligh();
    let selector = `[data-across="${e.target.dataset.across}"]`,
        number = parseInt(e.target.dataset.across);
    if (!across) {
        selector = `[data-down="${e.target.dataset.down}"]`;
        number = parseInt(e.target.dataset.down);
    }
    addHighlight(selector, number);
    currentCellId = e.target.id;
}

function addHighlight(selector, clueNum) {
    // at cells
    const cells = document.querySelectorAll(`input${selector}`);
    cells.forEach((cell) => {
        cell.classList.add('highlight');
        cell.parentElement.classList.add('highlight');
    });

    // at clue
    const clue = document.querySelector(`li${selector}`);
    if (clue) {
        clueText = clue.innerHTML;
        clue.innerHTML = '<mark class="mark">' + clueText + '</mark>';
        if (window.innerWidth > 1200) {
            clue.scrollIntoView({ block: 'center' });
        }
    }
    paintClue(clueNum);
}

function removeHighligh() {
    //from crossword cells
    const highlightCell = document.querySelectorAll('.highlight');
    highlightCell.forEach((cell) => cell.classList.remove('highlight'));
    //from clue
    const highlightClue = document.querySelector('.mark');
    if (highlightClue) {
        highlightClue.parentElement.innerHTML = clueText;
    }
}

/*************************
 *         Timer         *
 *************************/

function startTimer() {
    start = true;
    timer = setInterval(setTime, 1000);
}

function setTime() {
    ++totalSeconds;
    seconds.innerHTML = pad(totalSeconds % 60);
    minutes.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}

/*************************
 *         Score         *
 *************************/

function checkInput(e) {
    if (e.target.validity.valid) {
        scoreUp();
    } else {
        countError();
        if (errorShown) scoreDown();
    }
}

function scoreDown() {
    score -= errors * 5;
    errors = 0;
}

function checkForm() {
    if (form.checkValidity()) {
        console.log(score);
        dialog.showModal();
    }
    return form.checkValidity();
}

function scoreUp() {
    score += 10;
}

function countError() {
    errors += 1;
}
