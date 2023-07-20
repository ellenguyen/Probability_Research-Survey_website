import {createLotteryRows} from './createLotteryRows.js';
import {handleRadioSelection} from './handleRadioSelection.js';
import {generateLotteryRange} from './generateLotteryRange.js';

const lotteries = generateLotteryRange(5, 15, 5);
const choices = {
    Cash: "Cash",
    Lottery: "Lottery",
};

// First call
function initializeLotteryTable() {
    const tableBodyId = "tbody";

    createLotteryRows(lotteries, choices, tableBodyId);

    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", handleRadioSelection);
}

document.addEventListener("DOMContentLoaded", initializeLotteryTable);