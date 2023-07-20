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
    alert("Upper: " + upper + ", Lower: " + lower);
  
    return selectedValues;
}
  
export { handleRadioSelection };