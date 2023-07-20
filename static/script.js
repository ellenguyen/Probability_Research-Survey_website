// Creating the rows
function createLotteryRows(cashAmounts, choices, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);

  cashAmounts.forEach((cashAmount, index) => {
    const divTr = document.createElement("div");
    divTr.className = "tr";

    const divLabel = document.createElement("div");
    divLabel.className = "td";
    divLabel.textContent = "Lottery";
    divTr.appendChild(divLabel);

    const divAmount = document.createElement("div");
    divAmount.className = "td";
    divAmount.textContent = "$" + cashAmount;
    divTr.appendChild(divAmount);

    const divChoices = document.createElement("div");
    divChoices.className = "td";

    for (let choice in choices) {
      const label = document.createElement("label");
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "choice" + index;
      radioInput.value = choice;
      radioInput.required = true; // Added required attribute

      const span = document.createElement("span");
      span.textContent = choice;

      label.appendChild(radioInput);
      label.appendChild(span);
      divChoices.appendChild(label);
    }

    divTr.appendChild(divChoices);
    tableBody.appendChild(divTr);
  });
}

// Function to handle radio button selection
function handleRadioSelection() {
  const selectedValues = [];
  const radios = document.querySelectorAll("input[type='radio']:checked");

  radios.forEach((radio) => {
    selectedValues.push(radio.value);
  });

  // Display the selected values in an alert
  alert("Selected values: " + selectedValues.join(", "));

  for (let i = 0; i < selectedValues.length - 1; i++) {
    if (selectedValues[i] === "Lottery" && selectedValues[i + 1] === "Cash") {
      upper = lotteries[i + 1];
      lower = lotteries[i];
      break;
    }
  }

  // Update the lotteries
  lotteries = generateLotteryRange(lower, upper, 5);
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
const choices = {
  Cash: "Cash",
  Lottery: "Lottery",
};

// Initialize the lottery table and handle form submission
function initializeLotteryTable() {
  const tableBodyId = "tbody";
  createLotteryRows(lotteries, choices, tableBodyId);

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
      createLotteryRows(lotteries, choices, tableBodyId);
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const bounds = initializeLotteryTable();
});
