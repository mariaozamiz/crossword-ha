'use strict';
const maxId = 12;
let currentCellId = '';
let errorShown = false;
let across = true;
let clueText;
const table = d.get('.table');
const cells = d.getAll('.letter');
const clues = d.getAll('.clue');
const checkBtn = d.get('.btn-check');

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
    let nextCell = getNextCell(cellId);
    while (!nextCell.hasAttribute(across ? 'data-across' : 'data-down')) {
        nextCell = getNextCell(nextCell.id);
    }
    nextCell.focus();
}
checkBtn.addEventListener('click', showErrors);
table.addEventListener('input', handleWriting);
table.addEventListener('mousedown', handleClick);
d.on('focus', '.letter', handleFocus);

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
    d.getAll(`input${selector}`).forEach((cell) =>
        cell.classList.add('highlight')
    );

    // at clue
    const clue = d.getAll(`li${selector}`);
    // clean following lines as soon as we have completed the crossword
    if (clue) {
        clueText = clue.innerHTML;
        clue.innerHTML = '<mark class="mark">' + clueText + '</mark>';
    }
}

function removeHighligh() {
    //from crossword cells
    d.getAll('.highlight').forEach((cell) =>
        cell.classList.remove('highlight')
    );

    //from clue
    const highlightClue = d.get('.mark');
    // clean following lines as soon as we have completed the crossword
    if (highlightClue) {
        highlightClue.parentElement.innerHTML = clueText;
    }
}
