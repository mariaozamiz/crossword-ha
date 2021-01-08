'use strict';
let currentCell = '';
let errorShown = false;
let across = true;
let clueText;
const letters = document.querySelectorAll('.letter');
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
    removeHighlights();
    // check if we are at the same cell
    if (currentCell === e.currentTarget.id) {
        across = !across;
    }
    let selector = `[data-across="${e.currentTarget.dataset.across}"]`;
    if (!across) {
        selector = `[data-down="${e.currentTarget.dataset.down}"]`;
    }
    //highlight related letters
    const letters = document.querySelectorAll(`input${selector}`);
    letters.forEach((letter) => letter.classList.add('highlight'));

    //highlight related clue
    const clue = document.querySelector(`li${selector}`);

    if (clue) {
        clueText = clue.innerHTML;
        clue.innerHTML = '<mark class="mark">' + clueText + '</mark>';
    }
    currentCell = e.currentTarget.id;
}

function removeHighlights() {
    //remove highlight from letters
    const highlightLetters = document.querySelectorAll('.highlight');
    highlightLetters.forEach((letter) => letter.classList.remove('highlight'));
    //remove highlight from text
    const highlightClue = document.querySelector('.mark');
    if (highlightClue) {
        highlightClue.parentElement.innerHTML = clueText;
    }
}

checkBtn.addEventListener('click', showErrors);
letters.forEach((letter) => letter.addEventListener('click', handleClick));
