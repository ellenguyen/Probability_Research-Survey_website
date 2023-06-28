var box1 = document.getElementById("box1");
var box2 = document.getElementById("box2");

box1.addEventListener("click", function() {
  var amount = parseInt(box1.innerHTML.substring(1));
  if (amount > 25) {
    amount -= 10;
    box1.innerHTML = "$" + amount;
  }
});
