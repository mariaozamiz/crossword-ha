'use strict';
const maxId = 168;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
let start = false;
let totalSeconds = JSON.parse(localStorage.getItem('timer')) || 0;
let crossword = JSON.parse(localStorage.getItem('crossword')) || {};
let timer;

const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const table = document.querySelector('.table');
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const checkBtn = document.querySelector('.btn-check');
const solveBtn = document.querySelector('.btn-solve');
const clearBtn = document.querySelector('.btn-clear');

startGame();

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

function solveCrossword() {
    cells.forEach((cell) => (cell.value = cell.pattern.charAt(1)));
}

function clearGame() {
    window.localStorage.clear();
    removeHighligh();
    totalSeconds = -1;
    clearInterval(timer);
    start = false;
    setTime();
}

function handleWriting(e) {
    saveCrossword(e);
    if (!start) {
        startTimer();
    }
    let cellId = e.target.id;
    if (e.inputType === 'deleteContentBackward') {
        return;
    }
    let nextCell = getNextCell(cellId);
    while (!nextCell.hasAttribute(across ? 'data-across' : 'data-down')) {
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
        console.log('Foco en ', previousCell);
    }
    if (e.key === 'ArrowDown') {
        console.log('quiero bajar');
        let nextCellId = parseInt(cellId) + 12;
        const cell = document.getElementById(nextCellId);
        cell.focus();
        if (nextCellId > maxId) {
            return;
        }
    }
}

// if (e.key === 'ArrowUp') {
//     console.log('quiero subir');
// }
// if (e.key === 'ArrowLeft') {
//     console.log('quiero atrás');
// }
// if (e.key === 'ArrowRight') {
//     console.log('quiero adelante');
// }

table.addEventListener('mousedown', handleClick);
table.addEventListener('input', handleWriting);
table.addEventListener('keyup', handleKeyUp);
checkBtn.addEventListener('click', showErrors);
solveBtn.addEventListener('click', solveCrossword);
clearBtn.addEventListener('click', clearGame);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));

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

function saveCrossword(e) {
    const id = e.target.id;
    const letter = e.target.value;
    //save crossword object: id as key, letter as value
    crossword[id] = letter;
    localStorage.setItem('crossword', JSON.stringify(crossword));
    //save crossword timer
    localStorage.setItem('timer', JSON.stringify(totalSeconds));
}

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
        if (cellId < maxId) {
            cellId = (cellId % maxId) - 1;
            if (cellId < 12) cellId = 1;
        }
    }
    return document.getElementById(cellId);
}
