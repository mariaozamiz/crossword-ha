'use strict';
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
let crossword = JSON.parse(localStorage.getItem('crossword')) || {};

const table = document.querySelector('.table');
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const checkBtn = document.querySelector('.btn-check');
const solveBtn = document.querySelector('.btn-solve');

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
const animar = (persoa) => {
    console.log(`Ánimo ${persoa}! Es a mellor <3`);
};

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

function handleWriting(e) {
    saveCrossword(e);
    animar('pichurra');
}

table.addEventListener('mousedown', handleClick);
table.addEventListener('input', handleWriting);
checkBtn.addEventListener('click', showErrors);
solveBtn.addEventListener('click', solveCrossword);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));

function addHighlight(selector) {
    // at cells
    const cells = document.querySelectorAll(`input${selector}`);
    cells.forEach((cell) => cell.classList.add('highlight'));

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
    //crossword object: id as key, letter as value
    crossword[id] = letter;
    console.log(crossword);
    localStorage.setItem('crossword', JSON.stringify(crossword));
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
}
