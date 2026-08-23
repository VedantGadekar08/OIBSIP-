# TempShift — Interactive Temperature Converter

TempShift is a clean, modern, and interactive web application designed to convert temperatures between Celsius (&deg;C), Fahrenheit (&deg;F), and Kelvin (K) simultaneously. It includes built-in physics validations (such as guarding against temperatures below absolute zero) and provides a highly responsive, user-friendly interface.

## 🚀 Features

- **Simultaneous Conversions**: Enter a temperature in any unit, and see the converted values for all other units instantly.
- **Physics-Boundary Guard**: Automatically checks and alerts the user if an entered temperature is physically impossible (i.e., below Absolute Zero: `0 K`, `-273.15 °C`, or `-459.67 °F`).
- **Dynamic Formatting**: Smart formatting of outputs—integers are displayed directly, while decimals are rounded to two decimal places with trailing zeros cleaned up.
- **Micro-Animations & UX Enhancements**:
  - CSS shake animations on error feedback.
  - Active error states clear automatically as soon as the user starts typing a new value.
  - Support for both click event and pressing the `Enter` key to submit.
- **Responsive Layout**: Designed with a mobile-first approach using CSS Flexbox, custom properties (variables), and modern typography.

---

## 🛠️ Technology Stack

- **HTML5**: Structured semantic markup for accessibility.
- **CSS3**: Modern layouts using Flexbox, CSS custom variables, custom typography via Google Fonts (Plus Jakarta Sans), transitions, and keyframe animations.
- **Vanilla JavaScript (ES6+)**: Core logic, DOM manipulation, input validation regex, and mathematical conversion algorithms.

---

## 📂 Project Structure

```text
OIBSIP-WebDev-L1-Temperature Converter Website/
├── index.html   # Main structure and UI entrypoint
├── style.css    # Responsive styling, layout, variables, and animations
├── script.js    # Application logic, input validation, and formulas
└── README.md    # Documentation (this file)
```

---

## 📐 Conversion Formulas

TempShift uses standard thermodynamics formulas to perform conversion calculations:

### From Celsius (&deg;C)
- **Fahrenheit**:  
  $$F = \left(C \times \frac{9}{5}\right) + 32$$
- **Kelvin**:  
  $$K = C + 273.15$$

### From Fahrenheit (&deg;F)
- **Celsius**:  
  $$C = (F - 32) \times \frac{5}{9}$$
- **Kelvin**:  
  $$K = \left((F - 32) \times \frac{5}{9}\right) + 273.15$$

### From Kelvin (K)
- **Celsius**:  
  $$C = K - 273.15$$
- **Fahrenheit**:  
  $$F = \left((K - 273.15) \times \frac{9}{5}\right) + 32$$

---

## 🧪 Physics Validation & Absolute Zero Limits

To prevent impossible thermodynamic calculations, the application enforces the absolute minimum temperature boundaries:

| Unit | Absolute Zero Threshold | Action on Violation |
| :--- | :--- | :--- |
| **Celsius (&deg;C)** | `-273.15 °C` | Throws validation error & shakes UI |
| **Fahrenheit (&deg;F)** | `-459.67 °F` | Throws validation error & shakes UI |
| **Kelvin (K)** | `0 K` | Throws validation error & shakes UI |

---

## 💻 How to Run the Project

1. Clone or download the repository to your local machine.
2. Open the directory containing the files.
3. Double-click `index.html` to open it directly in any modern web browser (Chrome, Firefox, Safari, Edge).
4. *(Optional)* Run a local development server using extensions like **Live Server** in VS Code, or python:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000` in your web browser.

---

## 📝 License

This project is open-source and available under the MIT License.
