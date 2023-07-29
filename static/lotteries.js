// Global variables
// lotteryNum defined in html passed from flask

// Creating the rows
function fillLotteryRows(cashAmounts, tableBody) {
  tableBody.innerHTML = "";
  
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
     radioInputLottery.value = cashAmount+"Lottery";
     radioInputLottery.id = "lottery" + index;
     radioInputLottery.required = true; // Added required attribute;
 
     const labelLottery = document.createElement("label");
     labelLottery.className = "label-choice"
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
    labelCash.className = "label-choice"
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

function handleRadioSelection(lotteries) {
  const selectedValues = [];
  const radios = document.querySelectorAll("input[type='radio']:checked");

  radios.forEach((radio) => {
    selectedValues.push(radio.value);
  });

  // Display the selected values in an alert
  alert("Selected values: " + selectedValues.join(", "));

  for (let i = 0; i < selectedValues.length - 1; i++) {
    // if there is a switch from cash to lottery
    if (selectedValues[i + 1].includes("Lottery") && selectedValues[i].includes("Cash")) {
      alert("Please switch from lottery to cash")
      return [-1, -1]
    }
    // if there is a switch from lottery to cash
    if (selectedValues[i].includes("Lottery") && selectedValues[i + 1].includes("Cash")) {
      //TODO: SEND SELECTED VALUES WITH ROUND AND LOTTERY NUMBER TO FLASK SESSION
      return [lotteries[i], lotteries[i + 1]]
    }
  }

  alert("Please choose a difference");
  return [-1, -1]
}

// Function to handle radio button selection
function handleChoicesSelection(secondRound, round_one, round_two) {
  const selectedValues = [];
  const radios = document.querySelectorAll("input[type='radio']:checked");

  radios.forEach((radio) => {
    selectedValues.push(radio.value);
    if (secondRound === false) {
      round_one.push(radio.value);
    } else {
      round_two.push(radio.value);
    }
  });

  if (secondRound === false) {
    return round_one;
  } else {
    return round_two;
  }

}


// Function to send CE data to Flask
// TODO: make this do something?
function sendData(low, high, round_one, round_two) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/user-choice", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  const data = JSON.stringify({ lower_bound: low, upper_bound: high, choices_one: round_one, choices_two: round_two});

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Request completed successfully
      console.log(xhr.responseText);
    }
  };

  xhr.send(data);
}

// Function to generate a range of lotteries with a specified step size
function generateLotteryRange(start, end, step) {
  const range = [];
  for (let i = start; i <= end; i += step) {
    range.push(i);
  }
  return range;
}

// Initialize the lottery table and handle form submission
function initializeLotteryTable(curLottery) {
  const tableBody = document.getElementById("tbody");
  let secondRound = false;
  let low = curLottery["low"]
  let high = curLottery["high"]
  let round_one = [];
  let round_two = [];
  let lotteries = generateLotteryRange(low, high, curLottery["first_round_step_size"]);
  fillLotteryRows(lotteries, tableBody);

  const form = document.getElementById("lotteryForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    [low, high] = handleRadioSelection(lotteries);
    alert(`${low}, ${high}`)

    if(secondRound == false){
      round_one = handleChoicesSelection(secondRound,round_one,round_two);
    }else{
      round_two = handleChoicesSelection(secondRound,round_one,round_two);
    }


    if (low === -1 || high === -1) {
      return
    }

    if (secondRound) {
      document.getElementById("submit-button").disabled = true;

      //send data back to flask
      sendData(low, high, round_one, round_two);
      //sendUserChoices();

      if (lotteryNum === 25) {
        window.location.href = "/success"
        return
      }
      
      window.location.href = `/lottery/${lotteryNum + 1}`
    }

    // Clear the table body and fill second round
    lotteries = generateLotteryRange(low, high, curLottery["second_round_step_size"]);
    fillLotteryRows(lotteries, tableBody);
    secondRound = true
  });
}

async function getLotteryData() {
  return await fetch('/static/lotteries.json') // loads local json data linked in lotteries.html. this can be changed to a flask API endpoint if needed
  .then(response => response.json())
  .then(data => {
      return data
  })
  .catch(error => console.error('Error fetching lottery data:', error));
}

async function loadLottery(lotteryIndex) {
  let lotteryData = await getLotteryData()
  let curLottery = lotteryData[lotteryIndex]

  const taskName = document.getElementById("task-name")
  taskName.innerText = `TASK ${lotteryIndex + 1}:`

  const lotteryDescription = document.getElementById("lottery-description")
  lotteryDescription.innerText = `You receive $${curLottery["high"]} with probability ${parseInt(curLottery["probability_high"] * 100)}% and $${curLottery["low"]} with probability ${parseInt((1 - curLottery["probability_high"]) * 100)}%.`

  initializeLotteryTable(curLottery)
}

document.addEventListener("DOMContentLoaded", async function() {
  loadLottery(lotteryNum - 1)
});

// refreshes the page whenever it is shown.
// when using back and forward buttons in browser, state is usually saved which causes problems with lottery display after submission
// TODO: Find a better solution than this
(function () {
  window.onpageshow = function(event) {
      if (event.persisted) {
          window.location.reload();
      }
  };
})();