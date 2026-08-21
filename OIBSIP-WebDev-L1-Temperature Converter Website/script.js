document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const tempInput = document.getElementById("temp-input");
  const unitSelect = document.getElementById("unit-select");
  const convertBtn = document.getElementById("convert-btn");
  const errorBox = document.getElementById("error-message");
  const resultsSection = document.getElementById("results-section");

  const valCelsius = document.querySelector("#result-c .result-value");
  const valFahrenheit = document.querySelector("#result-f .result-value");
  const valKelvin = document.querySelector("#result-k .result-value");

  // Absolute zero thresholds in respective units
  const ABSOLUTE_ZERO = {
    C: -273.15,
    F: -459.67,
    K: 0,
  };

  /**
   * Helper to format converted temperatures nicely.
   * If a value is integer, returns it directly.
   * Otherwise, rounds to 2 decimal places and strips trailing zeros.
   */
  const formatTemp = (value) => {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return parseFloat(value.toFixed(2)).toString();
  };

  /**
   * Performs conversion formulas based on input unit.
   */
  const convert = (value, fromUnit) => {
    let c, f, k;

    switch (fromUnit) {
      case "C":
        c = value;
        f = (value * 9) / 5 + 32;
        k = value + 273.15;
        break;
      case "F":
        c = ((value - 32) * 5) / 9;
        f = value;
        k = ((value - 32) * 5) / 9 + 273.15;
        break;
      case "K":
        c = value - 273.15;
        f = ((value - 273.15) * 9) / 5 + 32;
        k = value;
        break;
    }

    return {
      celsius: c,
      fahrenheit: f,
      kelvin: k,
    };
  };

  /**
   * Updates results UI elements.
   */
  const displayResults = (results) => {
    valCelsius.innerHTML = `${formatTemp(results.celsius)} &deg;C`;
    valFahrenheit.innerHTML = `${formatTemp(results.fahrenheit)} &deg;F`;
    valKelvin.innerHTML = `${formatTemp(results.kelvin)} K`;

    resultsSection.classList.remove("hidden");
  };

  /**
   * Validates structure and rules of the numeric input.
   */
  const validateInput = (rawStr, unit) => {
    const trimmed = rawStr.trim();

    // 1. Check for empty string
    if (trimmed === "") {
      return { isValid: false, message: "Please enter a temperature value." };
    }

    // 2. Validate correct decimal number pattern (allows negative signs)
    const numericRegex = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;
    if (!numericRegex.test(trimmed)) {
      return {
        isValid: false,
        message: "Please enter a valid numeric temperature (e.g., 25, -12.5).",
      };
    }

    const value = parseFloat(trimmed);

    // 3. Ensure the value is finite and not NaN
    if (isNaN(value) || !isFinite(value)) {
      return {
        isValid: false,
        message: "The entered value is not a readable number.",
      };
    }

    // 4. Absolute zero guard
    const minLimit = ABSOLUTE_ZERO[unit];
    if (value < minLimit) {
      const limitLabel = unit === "K" ? "0 K" : `${minLimit}°${unit}`;
      return {
        isValid: false,
        message: `Physics Limit: Temperature cannot be below absolute zero (${limitLabel}).`,
      };
    }

    return { isValid: true, value };
  };

  /**
   * Main orchestrator function for conversion workflow.
   */
  const processConversion = () => {
    const rawInput = tempInput.value;
    const selectedUnit = unitSelect.value;

    const validation = validateInput(rawInput, selectedUnit);

    if (!validation.isValid) {
      // Show error, hide results
      errorBox.textContent = validation.message;
      errorBox.classList.remove("hidden");
      resultsSection.classList.add("hidden");

      // Re-trigger the CSS shake animation on error box
      errorBox.style.animation = "none";
      errorBox.offsetHeight; // Trigger reflow to restart animation
      errorBox.style.animation = null;
      return;
    }

    // Clear any previous error box
    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    // Convert and render
    const results = convert(validation.value, selectedUnit);
    displayResults(results);
  };

  // Event Listeners
  convertBtn.addEventListener("click", processConversion);

  // Trigger conversion when user presses 'Enter' in input field
  tempInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      processConversion();
    }
  });

  // Optional: Clear errors on new input typing for better UX
  tempInput.addEventListener("input", () => {
    if (!errorBox.classList.contains("hidden")) {
      errorBox.classList.add("hidden");
    }
  });
});
