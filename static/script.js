document.addEventListener("DOMContentLoaded", function() {
  const cashAmounts = [30, 50, 70, 90, 100, 120, 140, 160, 180, 200];
  //const cashAmountsRound2 = [120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140];
  //creating the user choice for CASH or LOTTERY
  const choices = {
    "Cash": false,
    "Lottery" : false
  }

  for (let key in choices) {
    let label = document.createElement("label");
    label.innerText = key;
  }

  const round1TableBody = document.getElementById("round1-table-body");

  // Create table rows for each cash amount in the first table
  cashAmounts.forEach(function(cashAmount) {
    const row = document.createElement("tr");


    // adding the Letorry text and cell on to the table 
    const lotteryCell = document.createElement("td");
    const lotteryText = document.createTextNode("Loterry");
    lotteryCell.appendChild(lotteryText);
    row.appendChild(lotteryCell);

    //creating the cash amount element
    const cashAmountCell = document.createElement("td");
    cashAmountCell.textContent = "$" + cashAmount;
    row.appendChild(cashAmountCell);

    const userInputCell = document.createElement("td");
    //const choice = document.createElement("input");
    

    // choice.type = "radio";
    // choice.type = "radio";
    // row.appendChild(choice);
    // round1TableBody.appendChild(row)
    
    //create the label element 

    // let label = document.createElement("label");
    // label.innerText = "Lottery";
    // userInputCell.appendChild(label)
    // userInputInput.type = "radio";
    // //userInputInput.required = true; // Set input as required
    // label.appendChild(userInputInput);
    // row.appendChild(userInputCell);

  

    for (let key in choices) {
      let label = document.createElement("label");
      label.innerText = key;
      const userInputInput = document.createElement("input");
      
      userInputInput.name = "choice"
      userInputInput.type = "radio";
      label.appendChild(userInputInput);
      userInputCell.appendChild(label);
   }
    row.appendChild(userInputCell);

    round1TableBody.appendChild(row);
  });

  //Style the lotteryCell in the first table
  const lotteryCells = document.querySelectorAll("#round1-table-body td:first-child");
  lotteryCells.forEach(function(cell) {
    cell.classList.add("lottery-cell");
  });

  function createRound2Table() {
    const container = document.getElementById("tables-container");

    // Create table for round 2
    const round2Table = document.createElement("table");
    round2Table.id = "round2-table";

    // Create table body for round 2
    const round2TableBody = document.createElement("tbody");

    // Create table rows for each cash amount in the second table
    cashAmountsRound2.forEach(function(cashAmount) {
      const row = document.createElement("tr");

      const lotteryCell = document.createElement("td");
      const lotteryText = document.createTextNode("75% of $200 25% of $30");
      lotteryCell.appendChild(lotteryText);
      row.appendChild(lotteryCell);

      const cashAmountCell = document.createElement("td");
      cashAmountCell.textContent = "$" + cashAmount;
      row.appendChild(cashAmountCell);

      const userInputCell = document.createElement("td");
      const userInputInput = document.createElement("input");
      userInputInput.type = "text";
      userInputInput.required = true; // Set input as requx ired
      userInputCell.appendChild(userInputInput);
      row.appendChild(userInputCell);

      round2TableBody.appendChild(row);
    });

    round2Table.appendChild(round2TableBody);

    // Append the round 2 table to the container element
    container.appendChild(round2Table);

    // //Style the lotteryCell in the second table
    // const lotteryCellsRound2 = round2Table.querySelectorAll("td:first-child");
    // lotteryCellsRound2.forEach(function(cell) {
    //   cell.classList.add("lottery-cell");
    // });

    // //Validate user input in the second table
    // round2TableBody.addEventListener("input", function(event) {
    //   const userInput = event.target.value.trim(); // Trim whitespace from the input
    //   const userInputCell = event.target.parentNode;
    //   const cashAmountCell = userInputCell.previousElementSibling;

    //   if (userInput !== "L" && userInput !== "C" || userInput === "") {
    //     userInputCell.classList.add("invalid-input");
    //   } else {
    //     userInputCell.classList.remove("invalid-input");
    //   }

    //   const allInputsFilled = Array.from(round2TableBody.querySelectorAll("input")).every(function(input) {
    //     return input.value.trim() !== "";
    //   });
      
    // });
  }

  
});