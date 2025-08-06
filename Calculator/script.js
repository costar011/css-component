const displayBox = document.querySelector(".display"),
      displayInput = displayBox.querySelector(".display-input"),
      displayResult = displayBox.querySelector(".display-result"),
      buttons = document.querySelectorAll("button"),
      operators = ["%", "÷", "x", "-", "+"];

let input = "",
    reslut = "";

// main function to handle calculator Logic