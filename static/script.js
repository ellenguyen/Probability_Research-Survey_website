function initializeLotteryTable() {
  const lotteries = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const round1TableBody = document.getElementById("round1-table-body");
  const choices = {
    "Cash": false,
    "Lottery": false
  };


  lotteries.forEach(function(cashAmount, i) {
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
    round1TableBody.appendChild(row);
  });

  const lotteryCells = round1TableBody.querySelectorAll("td:first-child");
  lotteryCells.forEach(function(cell) {
    cell.classList.add("lottery-cell");
  });
}

document.addEventListener("DOMContentLoaded", initializeLotteryTable);
