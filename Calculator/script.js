const displayBox = document.querySelector(".display"),
      displayInput = displayBox.querySelector(".display-input"),
      displayResult = displayBox.querySelector(".display-result"),
      buttons = document.querySelectorAll("button"),
      operators = ["%", "÷", "x", "-", "+"];

let input = "",
    result = "";

// main function to handle calculator Logic
const calculator = (btnValue) => {

  // handle equals
  if (btnValue === "=") {
    try {
      const calculatedValue = eval(input);
      result = calculatedValue;
    }
    catch {
      result = "Error";
    }
  }

  input += btnValue;

  // update display
  displayInput.value = input; 
  displayResult.value = result;
  displayInput.scrollLeft = displayInput.scrollWidth;
}

// add click event listeners to all buttons
buttons.forEach(button =>
  button.addEventListener("click", e => calculate(e.target.textContent))
);