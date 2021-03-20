'use strict';

/*************************
 *       Variables       *
 *************************/

const maxId = 168;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
let start = false;
let totalSeconds = JSON.parse(localStorage.getItem('timer')) || 0;
let crossword = JSON.parse(localStorage.getItem('crossword')) || {};
let timer;
let score = 0;

const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const table = document.querySelector('.table');
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const checkBtn = document.querySelector('.btn-check');
const solveBtn = document.querySelector('.btn-solve');
const clearBtn = document.querySelector('.btn-clear');
const form = document.querySelector('.form');

/*************************
 *       Listeners       *
 *************************/

table.addEventListener('mousedown', handleClick);
table.addEventListener('input', handleWriting);
table.addEventListener('keyup', handleKeyUp);
checkBtn.addEventListener('click', showErrors);
solveBtn.addEventListener('click', solveCrossword);
clearBtn.addEventListener('click', clearGame);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));

/*************************
 *         Start        *
 *************************/

startGame();

function startGame() {
    //check and paint localStorage data in DOM
    if (Object.keys(crossword).length > 0) {
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

/*************************
 *     LocalStorage      *
 *************************/

function saveCrossword(e) {
    const id = e.target.id;
    const letter = e.target.value;
    //save crossword object: id as key, letter as value
    crossword[id] = letter;
    localStorage.setItem('crossword', JSON.stringify(crossword));
    //save crossword timer
    localStorage.setItem('timer', JSON.stringify(totalSeconds));
}

/*************************
 *     Flow-writing     *
 *************************/

function handleWriting(e) {
    saveCrossword(e);
    keepScore(e);
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
            !previousCell.hasAttribute(across ? 'data-across' : 'data-down')
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
    let selector = `[data-across="${e.target.dataset.across}"]`;
    if (!across) {
        selector = `[data-down="${e.target.dataset.down}"]`;
    }
    addHighlight(selector);
    currentCellId = e.target.id;
}

function addHighlight(selector) {
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
        clue.scrollIntoView({ block: 'center' });
    }
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

function keepScore(e) {
    e.target.validity.valid ? (score += 10) : (score -= 5);
    console.log(score);
}

function checkForm() {
    if (form.checkValidity()) {
        alert('parabéns');
    }
    return form.checkValidity();
}
