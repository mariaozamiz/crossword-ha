'use strict';
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
const table = document.querySelector('.table');
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const checkBtn = document.querySelector('.btn-check');
const solveBtn = document.querySelector('.btn-solve');

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

table.addEventListener('mousedown', handleClick);
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
