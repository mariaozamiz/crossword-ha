'use strict';
const maxId = 12;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
const table = document.querySelector('.table');
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

function handleWriting(e) {
    let cellId = e.target.id;
    if (e.inputType === 'deleteContentBackward') {
        let previousCell = getPreviousCell(cellId);
        console.log(previousCell);
        while (
            !previousCell.hasAttribute(across ? 'data-across' : 'data-down')
        ) {
            previousCell = getPreviousCell(previousCell.id);
        }
        previousCell.focus();
    } else {
        let nextCell = getNextCell(cellId);
        while (!nextCell.hasAttribute(across ? 'data-across' : 'data-down')) {
            nextCell = getNextCell(nextCell.id);
        }
        nextCell.focus();
    }
}
checkBtn.addEventListener('click', showErrors);
table.addEventListener('input', handleWriting);
table.addEventListener('mousedown', handleClick);
cells.forEach((cell) => cell.addEventListener('focus', handleFocus));

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

function getPreviousCell(id) {
    let cellId = parseInt(id);
    if (across) {
        cellId = (cellId % maxId) - 1;
    } else {
        cellId -= 4;
        if (cellId > maxId) {
            cellId = (cellId % maxId) - 1;
            if (cellId < 4) cellId = 1;
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
    // clean following lines as soon as we have completed the crossword
    if (highlightClue) {
        highlightClue.parentElement.innerHTML = clueText;
    }
}
