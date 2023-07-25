// Creating the rows
function createLotteryRows(cashAmounts, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);

  cashAmounts.forEach((cashAmount, index) => {
    const divTr = document.createElement("div");
    divTr.className = "tr";

    //choice numbers
    const divLabel = document.createElement("div");
    divLabel.className = "td";
    divLabel.textContent = "Choice " + (index + 1) + ".";
    divTr.appendChild(divLabel);

     // Lottery choices
     const divLotteryChoices = document.createElement("div");
     divLotteryChoices.className = "td";
 
     const radioInputLottery = document.createElement("input");
     radioInputLottery.type = "radio";
     radioInputLottery.name = "choice" + index;
     radioInputLottery.value = "Lottery";
     radioInputLottery.id = "lottery" + index;
     radioInputLottery.required = true; // Added required attribute;
 
     const labelLottery = document.createElement("label");
     labelLottery.innerHTML = "<i>Lottery</i>";
     labelLottery.setAttribute("for", "lottery" + index);
 
     divLotteryChoices.appendChild(radioInputLottery);
     divLotteryChoices.appendChild(labelLottery);
     divTr.appendChild(divLotteryChoices);

    // the "vs" label
    const divVS = document.createElement("div");
    divVS.className = "td";
    divVS.innerHTML = "<i>vs</i>";
    divTr.appendChild(divVS);

    // Cash choices
    const divCashChoices = document.createElement("div");
    divCashChoices.className = "td";

    const radioInputCash = document.createElement("input");
    radioInputCash.type = "radio";
    radioInputCash.name = "choice" + index;
    radioInputCash.value = cashAmount + "Cash";
    radioInputCash.id = "cash" + index;
    radioInputCash.required = true; // Added required attribute;

    const labelCash = document.createElement("label");
    labelCash.innerHTML = "<b><i>$" + cashAmount + "</b> for sure</i>";
    labelCash.setAttribute("for", "cash" + index);

    divCashChoices.appendChild(radioInputCash);
    divCashChoices.appendChild(labelCash);
    divTr.appendChild(divCashChoices);

    // adding the rows to the
    tableBody.appendChild(divTr);
  });
}

// Function to handle radio button selection
const selectedValues = [];
function handleRadioSelection() {

  const radios = document.querySelectorAll("input[type='radio']:checked");

  radios.forEach((radio) => {
    selectedValues.push(radio.value);
  });

  // Display the selected values in an alert
  alert("Selected values: " + selectedValues.join(", "));


  for (let i = 0; i < selectedValues.length - 1; i++) {
    if (selectedValues[i] === "Lottery" && selectedValues[i + 1].includes("Cash")) {
      upper = lotteries[i + 1];
      lower = lotteries[i];
      alert("lotteries " + lotteries )
      break;
    }
  }

  // Update the lotteries
  alert("Upper: " + upper + ", Lower: " + lower);
}

// Function to generate a range of lotteries with a specified step size
function generateLotteryRange(start, end, step) {
  const range = [];
  for (let i = start; i <= end; i += step) {
    range.push(i);
  }
  return range;
}

// Function to send CE data to Flask
function sendCEData() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/ce-data", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  const data = JSON.stringify({ lower_bound: lower, upper_bound: upper });

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Request completed successfully
      console.log(xhr.responseText);
    }
  };

  xhr.send(data);
}

// Global variables
let CE = [];
let round = 1;
let upper = 200;
let lower = 20;
let stepSize = 20;
let lotteries = generateLotteryRange(lower, upper, stepSize);

// Initialize the lottery table and handle form submission
function initializeLotteryTable() {
  const tableBodyId = "tbody";
  createLotteryRows(lotteries, tableBodyId);

  const form = document.getElementById("lotteryForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    handleRadioSelection(); // Update the lotteries

    if (upper - lower === 2) {
      // If the difference is 1, display a message and disable the button
      alert("We have find the CE!");
      document.getElementById("submit-button").disabled = true;

      // Add the lower and upper bounds to the CE array
      CE.push(lower);
      CE.push(upper);
      alert("The CE is [" + lower + ", " + upper + "]");

      // Send CE data to Flask
      sendCEData();

      // Redirect to success page
      window.location.href = "/success";
    } else {
      // Clear the table body and create new lottery rows
      document.getElementById(tableBodyId).innerHTML = "";
      if (round === 1) {
        // Change the stepSize after the first round
        stepSize = 2;
        round++;
      }
      lotteries = generateLotteryRange(lower, upper, stepSize);
      createLotteryRows(lotteries, tableBodyId);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const bounds = initializeLotteryTable();
});
