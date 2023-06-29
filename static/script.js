var value1 = 100;   // Lottery
var value2 = 25;    // Cash
var difference = value1 - value2;   // Keep track of ranges

function decreaseValue() {
  if (difference === 2) {
    alert("Done");
  } else if (difference <= 5) {
      decreaseValueByOne();
  } else {
    value1 -= 10;
    difference = value1 - value2;
    document.getElementById("value1").textContent = value1;
  }
}

function increaseValue() {
  if (difference === 2) {
    alert("Done");
  } else if (difference <= 5) {
      increaseValueByOne();
  } else {
    value2 += 10;
    difference = value1 - value2;
    document.getElementById("value2").textContent = value2;
  }
}

function decreaseValueByOne() {
  value1 -= 1;
  difference = value1 - value2;
  document.getElementById("value1").textContent = value1;

  if (difference === 2) {
    document.getElementById("box1").style.display = "none";
    document.getElementById("box2").style.display = "none";
    alert("Done");
  }
}

function increaseValueByOne() {
  value2 += 1;
  difference = value1 - value2;
  document.getElementById("value2").textContent = value2;

  if (difference === 2) {
    document.getElementById("box1").style.display = "none";
    document.getElementById("box2").style.display = "none";
    alert("Done");
  }
}