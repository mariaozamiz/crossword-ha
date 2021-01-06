'use strict';
const letters = document.querySelectorAll('.letter');
const clearButton = document.querySelector('.btn-clear');

function clearAll() {
    letters.forEach((letter) => {
        letter.value = '';
    });
}

clearButton.addEventListener('click', clearAll);
