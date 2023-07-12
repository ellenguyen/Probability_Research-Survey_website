function createLotteryRows(cashAmounts, choices, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);
  
  cashAmounts.forEach(function(cashAmount, i) {
    const row = document.createElement("tr");
  
    const lotteryCell = document.createElement("td");
    const lotteryText = document.createTextNode("Lottery");
    lotteryCell.appendChild(lotteryText);
    row.appendChild(lotteryCell);
  
    const cashAmountCell = document.createElement("td");
    cashAmountCell.textContent = "$" + cashAmount;
    row.appendChild(cashAmountCell);
  
    const userInputCell = document.createElement("td");
  
    for (let key in choices) {
      let label = document.createElement("label");
      label.innerText = key;
      const userInputInput = document.createElement("input");
      userInputInput.name = "choice" + i;
      userInputInput.type = "radio";
      label.appendChild(userInputInput);
      userInputCell.appendChild(label);
    }
  
    row.appendChild(userInputCell);
    tableBody.appendChild(row);
  });
  
  const lotteryCells = tableBody.querySelectorAll("td:first-child");
  lotteryCells.forEach(function(cell) {
    cell.classList.add("lottery-cell");
  });
}

function initializeLotteryTable() {
  const lotteries = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const choices = {
    "Cash": false,
    "Lottery": false
  };
  const tableBodyId = "round1-table-body";

  createLotteryRows(lotteries, choices, tableBodyId);
}

document.addEventListener("DOMContentLoaded", initializeLotteryTable);