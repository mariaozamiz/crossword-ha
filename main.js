'use strict';
const maxId = 12;
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
    removeHighligh();
    let selector = `[data-across="${e.currentTarget.dataset.across}"]`;
    if (!across) {
        selector = `[data-down="${e.currentTarget.dataset.down}"]`;
    }
    addHighlight(selector);
    currentCellId = e.currentTarget.id;
}

function handleKeyUp(ev) {
    let nextCell = getNextCell(ev.currentTarget.id);
    while (!nextCell.hasAttribute(across ? 'data-across' : 'data-down')) {
        nextCell = getNextCell(nextCell.id);
    }
    nextCell.focus();
}

checkBtn.addEventListener('click', showErrors);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));
cells.forEach((cell) => cell.addEventListener('mousedown', handleClick));
cells.forEach((cell) => cell.addEventListener('keyup', handleKeyUp));

function getNextCell(id) {
    let cellId = parseInt(id);
    if (across) {
        cellId = (cellId % maxId) + 1;
    } else {
        cellId += 4;
        if (cellId > maxId) {
            cellId = (cellId % maxId) + 1;
            if (cellId > 4) cellId = 1;
        }
    }
    return document.getElementById(cellId);
}

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
