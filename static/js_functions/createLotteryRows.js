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
  
export { createLotteryRows };