const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }
  
  if (currentInput === '0') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function inputOperator(op) {
  if (shouldResetDisplay) {
    shouldResetDisplay = false;
  }
  
  if (op === 'AC') {
    currentInput = '0';
    updateDisplay();
    return;
  }
  
  if (op === 'backspace') {
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateDisplay();
    return;
  }
  
  if (op === '()') {
    // Simple parentheses handling - toggles between ( and )
    const openParens = (currentInput.match(/\(/g) || []).length;
    const closeParens = (currentInput.match(/\)/g) || []).length;
    
    if (openParens <= closeParens) {
      currentInput += '(';
    } else {
      currentInput += ')';
    }
    updateDisplay();
    return;
  }
  
  if (op === '=') {
    try {
      // Replace display symbols with JavaScript operators
      let expression = currentInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      // Evaluate the expression
      let result = Function('"use strict"; return (' + expression + ')')();
      
      // Round to avoid floating point errors
      if (typeof result === 'number') {
        result = Math.round(result * 100000000) / 100000000;
      }
      
      currentInput = result.toString();
      shouldResetDisplay = true;
    } catch (error) {
      currentInput = 'Error';
      shouldResetDisplay = true;
    }
    updateDisplay();
    return;
  }
  
  // For other operators (%, ÷, ×, -, +)
  // Remove the last character if it's an operator
  const lastChar = currentInput[currentInput.length - 1];
  if (['%', '÷', '×', '-', '+', '(', ')'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }
  currentInput += op;
  updateDisplay();
}

// Add event listeners to all buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');
    
    if (button.classList.contains('number')) {
      inputNumber(value);
    } else if (button.classList.contains('operator')) {
      inputOperator(value);
    }
  });
});

// Initialize display
updateDisplay();
