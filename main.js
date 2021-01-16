'use strict';
const maxId = 12;
let clicksNum = 0;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
const cells = document.querySelectorAll('.letter');
const clues = document.querySelectorAll('.clue');
const checkBtn = document.querySelector('.btn-check');

function showErrors(e) {
    e.preventDefault();
    if (errorShown) {
        document.documentElement.style.setProperty(
            `--colorerror`,
            `var(--blue)`
        );
        errorShown = false;
    } else {
        document.documentElement.style.setProperty(`--colorerror`, `red`);
        errorShown = true;
        checkBtn.innerHTML = `ocultar errores`;
    }
}

function handleClick(e) {
    if (currentCellId === e.currentTarget.id) {
        across = !across;
        handleFocus(e);
    }
}

function handleFocus(e) {
    removeHighlighting();
    let selector = `[data-across="${e.currentTarget.dataset.across}"]`;
    if (!across) {
        selector = `[data-down="${e.currentTarget.dataset.down}"]`;
    }
    //highlight cells
    const cells = document.querySelectorAll(`input${selector}`);
    cells.forEach((cell) => cell.classList.add('highlight'));

    //highlight clue
    const clue = document.querySelector(`li${selector}`);

    if (clue) {
        clueText = clue.innerHTML;
        clue.innerHTML = '<mark class="mark">' + clueText + '</mark>';
    }
    currentCellId = e.currentTarget.id;
}

function removeHighlighting() {
    //from crossword cells
    const highlightCell = document.querySelectorAll('.highlight');
    highlightCell.forEach((cell) => cell.classList.remove('highlight'));
    //from clue
    const highlightClue = document.querySelector('.mark');
    if (highlightClue) {
        highlightClue.parentElement.innerHTML = clueText;
    }
}

function handleKeyUp(ev) {
    let nextCellId = (parseInt(ev.currentTarget.id) % maxId) + 1;
    let nextCell = document.getElementById(nextCellId);
    while (!nextCell.hasAttribute('data-across')) {
        nextCellId = (nextCellId % maxId) + 1;
        nextCell = document.getElementById(nextCellId);
    }
    nextCell.focus();
}

checkBtn.addEventListener('click', showErrors);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));
cells.forEach((cell) => cell.addEventListener('mousedown', handleClick));
cells.forEach((cell) => cell.addEventListener('keyup', handleKeyUp));
