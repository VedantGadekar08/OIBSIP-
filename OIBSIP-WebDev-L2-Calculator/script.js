/**
 * Modern Browser-Based Calculator
 * Fully Vanilla JavaScript, written with clean state management,
 * operator precedence chaining, keyboard support, and theme preference persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const previousOperandElement = document.getElementById('previous-operand');
  const currentOperandElement = document.getElementById('current-operand');
  const themeSwitch = document.getElementById('theme-switch');
  const buttons = document.querySelectorAll('.btn');

  // Calculator State
  let expressionTokens = []; // Holds numbers and operators, e.g. ["5", "+", "3"]
  let currentInput = "";      // String of current number being typed
  let isCalculated = false;   // Set to true after equals is pressed
  let hasError = false;       // Set to true if a division-by-zero error occurs

  // Initialize Theme from localStorage or system preference
  initializeTheme();

  // Attach event listeners to all buttons (no inline onclicks)
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleButtonPress(button);
    });
  });

  // Attach global keyboard listener
  document.addEventListener('keydown', handleKeyboardInput);

  /**
   * Main Router for Button Clicks
   */
  function handleButtonPress(button) {
    if (hasError && !button.matches('[data-action="clear"]')) {
      // If there's an error, block all buttons except Clear
      flashDisplayOnError();
      return;
    }

    if (button.dataset.number !== undefined) {
      appendNumber(button.dataset.number);
    } else if (button.dataset.operator !== undefined) {
      chooseOperator(button.dataset.operator);
    } else if (button.dataset.action !== undefined) {
      const action = button.dataset.action;
      if (action === 'clear') {
        clearAll();
      } else if (action === 'delete') {
        deleteLastDigit();
      } else if (action === 'equals') {
        computeResult();
      }
    }
    updateDisplay();
  }

  /**
   * Append a digit or decimal point to the current number
   */
  function appendNumber(number) {
    // If a calculation was just done, typing a number starts a fresh expression
    if (isCalculated) {
      expressionTokens = [];
      currentInput = "";
      isCalculated = false;
    }

    // Guard: Prevent multiple decimals in a single number
    if (number === '.' && currentInput.includes('.')) return;

    // Guard: If empty and typing '.', prefix with '0'
    if (number === '.' && currentInput === "") {
      currentInput = "0.";
      return;
    }

    // Limit maximum digits to prevent screen overflow
    if (currentInput.replace('.', '').length >= 15) return;

    // Prevent multiple leading zeros (e.g. "00" remains "0")
    if (number === '0' && currentInput === '0') return;

    // If typing after a solo '0' (not '0.'), replace it
    if (currentInput === '0' && number !== '.') {
      currentInput = number;
      return;
    }

    currentInput += number;
  }

  /**
   * Choose an operator (+, -, *, /, %)
   */
  function chooseOperator(operator) {
    // Percentage operator acts immediately on the current input (unary operation)
    if (operator === '%') {
      applyPercentage();
      return;
    }

    // If a calculation was just performed, start a new expression with the result
    if (isCalculated) {
      const lastResult = currentOperandElement.textContent.replace(/,/g, '');
      if (!isNaN(parseFloat(lastResult))) {
        expressionTokens = [lastResult];
      } else {
        expressionTokens = [];
      }
      isCalculated = false;
    }

    // Check if there is an active input
    if (currentInput !== "") {
      // If typing a minus sign initially (for negative numbers)
      if (currentInput === "-") {
        if (operator === "-") return; // Keep the minus
        // Otherwise, if another operator is typed, reset currentInput and apply operator to "0"
        currentInput = "";
      } else {
        expressionTokens.push(currentInput);
        currentInput = "";
      }
    }

    // Handle operator chaining / replacement
    if (expressionTokens.length === 0) {
      // If expression is empty and user clicks minus, let them type a negative number
      if (operator === '-') {
        currentInput = "-";
        return;
      } else {
        // For other operators, default first operand to 0
        expressionTokens.push("0");
      }
    }

    // If the expression ends with an operator and user chose another one, replace it
    const lastToken = expressionTokens[expressionTokens.length - 1];
    if (isOperator(lastToken)) {
      expressionTokens[expressionTokens.length - 1] = operator;
    } else {
      expressionTokens.push(operator);
    }
  }

  /**
   * Handle percentage (%) division
   */
  function applyPercentage() {
    if (currentInput !== "") {
      const parsed = parseFloat(currentInput);
      if (!isNaN(parsed)) {
        currentInput = (parsed / 100).toString();
      }
    } else if (isCalculated) {
      // Apply percentage directly to the last calculated result
      const lastResult = parseFloat(currentOperandElement.textContent.replace(/,/g, ''));
      if (!isNaN(lastResult)) {
        currentInput = (lastResult / 100).toString();
        expressionTokens = [];
        isCalculated = false;
      }
    }
  }

  /**
   * Delete the last digit from the current input
   */
  function deleteLastDigit() {
    if (isCalculated) {
      // Clear all if the user presses delete on a final result
      clearAll();
      return;
    }
    if (currentInput === "") return;

    currentInput = currentInput.slice(0, -1);
  }

  /**
   * Clear the entire calculator state
   */
  function clearAll() {
    expressionTokens = [];
    currentInput = "";
    isCalculated = false;
    hasError = false;
    currentOperandElement.classList.remove('error-text');
  }

  /**
   * Evaluate the complete expression
   */
  function computeResult() {
    // If no expression tokens, nothing to calculate
    if (expressionTokens.length === 0 && currentInput === "") return;

    // If we just calculated and press equals again, do nothing (or we could repeat the last op)
    if (isCalculated) return;

    // Push the final operand if exists
    if (currentInput !== "") {
      expressionTokens.push(currentInput);
      currentInput = "";
    }

    // If expression ends with an operator, discard it
    if (expressionTokens.length > 0 && isOperator(expressionTokens[expressionTokens.length - 1])) {
      expressionTokens.pop();
    }

    if (expressionTokens.length === 0) {
      currentInput = "0";
      return;
    }

    // Format top history line before calculating
    const originalExpression = formatExpressionForDisplay(expressionTokens, "") + " =";
    previousOperandElement.textContent = originalExpression;

    try {
      const result = evaluateExpression(expressionTokens);
      
      // If result is huge, format with exponential notation
      if (Math.abs(result) > 999999999999) {
        currentInput = result.toExponential(5);
      } else {
        currentInput = result.toString();
      }
      isCalculated = true;
    } catch (error) {
      currentInput = error.message;
      hasError = true;
      currentOperandElement.classList.add('error-text');
    }

    expressionTokens = [];
  }

  /**
   * Math parsing engine with Operator Precedence (Multiplication & Division first)
   */
  function evaluateExpression(tokens) {
    // Clone tokens and parse numbers
    let tempTokens = tokens.map((token, index) => {
      if (index % 2 === 0) {
        const val = parseFloat(token);
        if (isNaN(val)) throw new Error("Invalid number format");
        return val;
      }
      return token;
    });

    // Step 1: Handle multiplication (*) and division (/)
    for (let i = 0; i < tempTokens.length; i++) {
      if (tempTokens[i] === '*' || tempTokens[i] === '/') {
        const op = tempTokens[i];
        const left = tempTokens[i - 1];
        const right = tempTokens[i + 1];

        if (left === undefined || right === undefined) {
          throw new Error("Malformed expression");
        }

        if (op === '/' && right === 0) {
          throw new Error("Cannot divide by zero");
        }

        let val;
        if (op === '*') {
          val = left * right;
        } else {
          val = left / right;
        }

        // Replace the three elements (left, operator, right) with the single result
        tempTokens.splice(i - 1, 3, val);
        i--; // Adjust index since we removed elements
      }
    }

    // Step 2: Handle addition (+) and subtraction (-)
    let result = tempTokens[0];
    for (let i = 1; i < tempTokens.length; i += 2) {
      const op = tempTokens[i];
      const right = tempTokens[i + 1];

      if (right === undefined) {
        throw new Error("Malformed expression");
      }

      if (op === '+') {
        result += right;
      } else if (op === '-') {
        result -= right;
      } else {
        throw new Error("Unknown operator");
      }
    }

    // Step 3: Round result to resolve floating point errors (e.g. 0.1 + 0.2)
    return parseFloat(result.toFixed(10));
  }

  /**
   * Helper: Check if token is an operator
   */
  function isOperator(token) {
    return ['+', '-', '*', '/'].includes(token);
  }

  /**
   * Helper: Format number with commas and preserve typing decimals
   */
  function formatDisplayNumber(value) {
    if (value === "" || value === undefined) return "";
    if (value === "-") return "-";
    if (isNaN(value) && value.includes("Cannot")) return value; // Preserve division error message

    const stringValue = value.toString();

    // Check if it's in exponential notation
    if (stringValue.includes('e')) return stringValue;

    const [integerPart, decimalPart] = stringValue.split('.');

    let formattedInteger = "";
    if (integerPart !== "") {
      const parsedInt = parseFloat(integerPart);
      if (isNaN(parsedInt)) {
        formattedInteger = integerPart;
      } else {
        formattedInteger = parsedInt.toLocaleString('en-US', {
          maximumFractionDigits: 0
        });
        // Preserve negative zero or negative numbers during typing
        if (integerPart.startsWith('-') && !formattedInteger.startsWith('-')) {
          formattedInteger = '-' + formattedInteger;
        }
      }
    }

    if (decimalPart !== undefined) {
      return `${formattedInteger}.${decimalPart}`;
    }
    return formattedInteger;
  }

  /**
   * Helper: Format the entire expression line for display (making operators look nicer)
   */
  function formatExpressionForDisplay(tokens, currentInput) {
    let displayTokens = tokens.map((token, index) => {
      if (index % 2 === 1) {
        // Operators
        if (token === '*') return '×';
        if (token === '/') return '÷';
        if (token === '-') return '−';
        if (token === '+') return '+';
        return token;
      } else {
        // Numbers
        return formatDisplayNumber(token);
      }
    });

    let result = displayTokens.join(' ');
    if (currentInput !== "") {
      if (result !== "") {
        result += ' ' + formatDisplayNumber(currentInput);
      } else {
        result = formatDisplayNumber(currentInput);
      }
    }
    return result;
  }

  /**
   * Render updated state to display screen
   */
  function updateDisplay() {
    // 1. Update current input line
    if (hasError) {
      currentOperandElement.textContent = currentInput;
    } else if (currentInput === "" && expressionTokens.length === 0) {
      currentOperandElement.textContent = "0";
    } else if (currentInput === "" && expressionTokens.length > 0) {
      // If typing has paused after clicking an operator, show the last operand or running total
      const lastToken = expressionTokens[expressionTokens.length - 1];
      if (isOperator(lastToken)) {
        // Show the number before the operator as active, or evaluate intermediate result for comfort
        const secondToLast = expressionTokens[expressionTokens.length - 2];
        currentOperandElement.textContent = formatDisplayNumber(secondToLast || "0");
      } else {
        currentOperandElement.textContent = formatDisplayNumber(lastToken);
      }
    } else {
      currentOperandElement.textContent = formatDisplayNumber(currentInput);
    }

    // 2. Adjust font size dynamically if input length gets too long
    adjustFontSize();

    // 3. Update top running equation line
    if (!isCalculated && !hasError) {
      previousOperandElement.textContent = formatExpressionForDisplay(expressionTokens, currentInput);
    }
  }

  /**
   * Prevent display text overflow by decreasing font-size dynamically
   */
  function adjustFontSize() {
    const textLength = currentOperandElement.textContent.length;
    if (textLength > 16) {
      currentOperandElement.style.fontSize = '1.3rem';
    } else if (textLength > 12) {
      currentOperandElement.style.fontSize = '1.6rem';
    } else if (textLength > 8) {
      currentOperandElement.style.fontSize = '1.9rem';
    } else {
      currentOperandElement.style.fontSize = '2.2rem';
    }
  }

  /**
   * Visual indicator when trying to press buttons during an error state
   */
  function flashDisplayOnError() {
    currentOperandElement.classList.add('flash-error');
    setTimeout(() => {
      currentOperandElement.classList.remove('flash-error');
    }, 200);
  }

  /**
   * Keyboard Listener Callback
   */
  function handleKeyboardInput(e) {
    let buttonSelector = null;

    if (e.key >= '0' && e.key <= '9') {
      buttonSelector = `[data-number="${e.key}"]`;
    } else if (e.key === '.') {
      buttonSelector = `[data-number="."]`;
    } else if (e.key === '+') {
      buttonSelector = `[data-operator="+"]`;
    } else if (e.key === '-') {
      buttonSelector = `[data-operator="-"]`;
    } else if (e.key === '*') {
      buttonSelector = `[data-operator="*"]`;
    } else if (e.key === '/') {
      e.preventDefault(); // Stop standard search overlay trigger in some browsers
      buttonSelector = `[data-operator="/"]`;
    } else if (e.key === '%') {
      buttonSelector = `[data-operator="%"]`;
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      buttonSelector = `[data-action="equals"]`;
    } else if (e.key === 'Backspace') {
      buttonSelector = `[data-action="delete"]`;
    } else if (e.key === 'Escape') {
      buttonSelector = `[data-action="clear"]`;
    }

    if (buttonSelector) {
      const button = document.querySelector(buttonSelector);
      if (button) {
        // Trigger visual click effect
        button.classList.add('active-click');
        button.click();
        setTimeout(() => {
          button.classList.remove('active-click');
        }, 100);
      }
    }
  }

  /**
   * Theme Management Functions
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      document.body.classList.add('light-theme');
      themeSwitch.checked = true;
    } else {
      document.body.classList.remove('light-theme');
      themeSwitch.checked = false;
    }

    // Toggle theme dynamically on click
    themeSwitch.addEventListener('change', () => {
      if (themeSwitch.checked) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
});
