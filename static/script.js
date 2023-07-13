// function for top create the loterry rows
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
      if (i < 1){
          var f = document.createElement("form");
          f.setAttribute('method',"post");
      }
      const userInputInput = document.createElement("input");
      userInputInput.name = "choice" + i;
      userInputInput.type = "radio";
      //f.appendChild(userInputInput)
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



//Function to generate a range of lotteries with a specified step size
function generateLotteryRange(start, end, step) {
  const range = [];
  for (let i = start; i <= end; i += step) {
    range.push(i);
  }
  return range;
}

//first call
function initializeLotteryTable() {
  const lotteries = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const lotteries1 = generateLotteryRange(5, 50, 5);
  const choices = {
    "Cash": false,
    "Lottery": false
  };
  const tableBodyId = "round1-table-body";

  createLotteryRows(lotteries1, choices, tableBodyId);
}

document.addEventListener("DOMContentLoaded", initializeLotteryTable);

