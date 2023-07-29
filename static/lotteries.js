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
     radioInputLottery.value = "Lottery";
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
    radioInputCash.value = cashAmount;
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
  const roundChoices = [];
  const radios = document.querySelectorAll("input[type='radio']:checked");

  radios.forEach((radio) => {
    roundChoices.push(radio.value);
  });

  // Display the selected values in an alert

  for (let i = 0; i < roundChoices.length - 1; i++) {
    // if there is a switch from cash to lottery
    if (roundChoices[i + 1] === "Lottery" && !isNaN(roundChoices[i])) {
      alert("Please switch from lottery to cash")
      return [-1, -1, roundChoices]
    }
    // if there is a switch from lottery to cash
    if (roundChoices[i] === "Lottery" && !isNaN(roundChoices[i + 1])) {
      return [lotteries[i], lotteries[i + 1], roundChoices]
    }
  }

  alert("Please choose a difference");
  return [-1, -1, roundChoices]
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
  const LAST_ROUND = 2
  let round = 1
  let low = curLottery["low"]
  let high = curLottery["high"]
  let roundChoices = []
  let choices = {}
  let lotteries = generateLotteryRange(low, high, curLottery["first_round_step_size"]);
  fillLotteryRows(lotteries, tableBody);

  const form = document.getElementById("lotteryForm");
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    [low, high, roundChoices] = handleRadioSelection(lotteries);

    if (low === -1 || high === -1) {
      return
    }

    choices[`choices_round_${round}`] = roundChoices

    if (round == LAST_ROUND) {
      document.getElementById("submit-button").disabled = true;

      // POST to Flask to store user choices for current lottery and redirect to the appropriate page
      fetch(`/lottery/${lotteryNum}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(choices)
      })
      .then(response => {
        if (response.redirected) {
          window.location.href = response.url
        }
      })
      .catch(function(e){})
    }

    // Clear the table body and fill second round
    lotteries = generateLotteryRange(low, high, curLottery["second_round_step_size"]);
    fillLotteryRows(lotteries, tableBody);
    round++
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