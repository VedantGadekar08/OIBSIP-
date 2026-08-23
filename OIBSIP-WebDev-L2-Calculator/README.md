# Modern Web Calculator

A sleek, responsive, browser-based calculator built using pure vanilla web technologies. It is equipped with advanced math evaluation, full keyboard accessibility, dynamic layout scaling, and a persistent dark/light theme switch.

## 🚀 Live Preview & Execution

To run the calculator:
1. Clone or download this repository.
2. Open [`index.html`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/index.html) directly in any modern web browser, or serve it using a local server (e.g., Live Server in VS Code, or running `python -m http.server` in the directory).

---

## ✨ Key Features

- **Advanced Math Parser (Operator Precedence):** Unlike simple calculators that evaluate sequentially (e.g., `2 + 3 * 5 = 25`), this calculator implements a two-pass math engine that respects standard algebraic operator precedence (PEMDAS/BODMAS), yielding the correct mathematical result of `17`.
- **Floating-Point Precision Fix:** Resolves standard JavaScript floating-point errors (e.g., `0.1 + 0.2` returning `0.30000000000000004`). Results are dynamically formatted to maintain accuracy up to 10 decimal places.
- **Dual Theme Support (Light/Dark):** Smoothly transitions between a dark theme (default Slate/Orange) and a light theme (Slate/Blue). Theme selections are saved to `localStorage` and respect the browser's native `prefers-color-scheme` settings if no manual choice has been made.
- **Full Keyboard Accessibility:** Fully operable via physical keyboard input. Supports digit keys, operator keys (`+`, `-`, `*`, `/`, `%`), `Enter` or `=` to solve, `Backspace` to delete, and `Escape` to clear. Keys light up on the screen on keypress to provide visual feedback.
- **Dynamic Text Scaling (Overflow Prevention):** As calculations or user input grow longer, the display font size automatically shrinks in real time to prevent UI clipping and numbers overflowing the screen container.
- **Robust Input Validation:**
  - Prevents typing multiple decimal points in a single operand.
  - Automatically prefixes a decimal point with `0` if clicked first (e.g., typing `.` outputs `0.`).
  - Restricts values to a maximum length of 15 digits per operand.
  - Allows negative number input by pressing `-` at the start of an expression or following another operator.
- **Dynamic Error Handling:** Includes division-by-zero validation. If triggered, the calculator displays a clean visual error state ("Cannot divide by zero"), changes the display text to red, shakes to notify the user, and locks all keys except the `Clear` (C) button.

---

## 📁 File Structure

The project consists of three core files:

1. **[`index.html`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/index.html)**
   - Houses the structure of the calculator.
   - Includes typography from Google Fonts (Poppins).
   - Structured around a display window (previous expression and current input) and a modern 4-column button grid.
   - Designed with semantic attributes and ARIA labels for accessibility.

2. **[`style.css`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/style.css)**
   - Utilizes custom CSS variables (`:root`) for easy theme-switching.
   - Implements a responsive layout using CSS Grid for the button matrix.
   - Includes CSS keyframe animations for the visual shake-on-error effect.
   - Uses media queries to automatically compress the calculator container on landscape/short screens to preserve usability.

3. **[`script.js`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/script.js)**
   - Orchestrates the application logic, keyboard events, and state management.
   - Written in modern, modular ES6 vanilla JavaScript.

---

## ⚙️ Technical Highlights

The application contains several key algorithms and subsystems within [`script.js`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/script.js):

### 1. Math Parsing Engine
The logic in [`evaluateExpression`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/script.js#L247) handles division, multiplication, addition, and subtraction in order. It extracts the operands and operators into an array of tokens, runs a pass to compute multiplication (`*`) and division (`/`), updates the token list inline using `splice`, and then runs a second pass for addition (`+`) and subtraction (`-`).

```javascript
// Step 1: Handle multiplication (*) and division (/)
for (let i = 0; i < tempTokens.length; i++) {
  if (tempTokens[i] === '*' || tempTokens[i] === '/') {
    // ... evaluates left and right operands, replaces them with the computed value
    tempTokens.splice(i - 1, 3, val);
    i--;
  }
}
```

### 2. Auto-scaling Display Text
To prevent numbers from flowing off the screen, [`adjustFontSize`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/script.js#L417) changes the CSS font size of the output element depending on the number of characters currently rendered:

```javascript
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
```

### 3. Keyboard Controller
[`handleKeyboardInput`](file:///d:/FSD/OIBSIP/OIBSIP-WebDev-L2-Calculator/script.js#L443) intercepts system key events, matches them to data attributes, and triggers virtual clicks on the buttons to ensure unified code execution paths.
