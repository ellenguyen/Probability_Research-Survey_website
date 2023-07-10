document.addEventListener("DOMContentLoaded", function() {
  const cashAmounts = [30, 50, 70, 90, 100, 120, 140, 160, 180, 200];
  //const cashAmountsRound2 = [120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140];

  //creating the user choice for CASH or LOTTERY
  const choices = {
    "Cash": false,
    "Lottery" : false
  }

  const round1TableBody = document.getElementById("round1-table-body");

  // Create table rows for each cash amount in the first table
                              // arr, index
  cashAmounts.forEach(function(cashAmount,i) {
    const row = document.createElement("tr");

    // creating the Loterry text and cell on to the table 
    const lotteryCell = document.createElement("td");
    const lotteryText = document.createTextNode("Loterry");
    //added the text inside the cell
    lotteryCell.appendChild(lotteryText);
    //add it to the row
    row.appendChild(lotteryCell);

    //creating the cash amount element 
    const cashAmountCell = document.createElement("td");
    //add text for cashamount inside the cell
    cashAmountCell.textContent = "$" + cashAmount;
    //add it to the row
    row.appendChild(cashAmountCell);

    //creating a cell and input for User_Inputs
    const userInputCell = document.createElement("td");
    const userInputInput = document.createElement("input")

    //looping thru the choices 
    for (let key in choices) {
      //creating label for the radio buttons
      let label = document.createElement("label");
      label.innerText = key;
      const userInputInput = document.createElement("input");
      //having the same name for the radio button in each row
      userInputInput.name = "choice" + i
      userInputInput.type = "radio";
      //add to the label to the userinput
      label.appendChild(userInputInput);
      userInputCell.appendChild(label);
      
    }
   // adding it to the row
    row.appendChild(userInputCell);
    // adding all the rows to the table
    round1TableBody.appendChild(row);
  });

  //Style the lotteryCell in the first table
  const lotteryCells = document.querySelectorAll("#round1-table-body td:first-child");
  lotteryCells.forEach(function(cell) {
    cell.classList.add("lottery-cell");
  });

  // function createRound2Table() {
  //   const container = document.getElementById("tables-container");

  //   // Create table for round 2
  //   const round2Table = document.createElement("table");
  //   round2Table.id = "round2-table";

  //   // Create table body for round 2
  //   const round2TableBody = document.createElement("tbody");

  //   round2Table.appendChild(round2TableBody);

  //   // Append the round 2 table to the container element
  //   container.appendChild(round2Table);

  // }

  
});