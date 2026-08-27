# Client-Side Login Authentication System

A modern, responsive, and secure client-side authentication system built with HTML, CSS, and JavaScript. This project uses `localStorage` as a mock database and native Web Crypto API for password hashing, ensuring zero dependencies and standalone functionality.

## Features

- **Unified Auth Interface:** Seamless toggling between Registration and Login views.
- **Premium UI:** Glassmorphism design, subtle animated backgrounds, and a modern color palette.
- **Form Validation:** Basic input validation prevents empty submissions.
- **Password Policies:** Enforces secure passwords (minimum 8 characters, at least 1 number) during registration.
- **Secure Storage:** Passwords are never stored in plain text. They are hashed using `crypto.subtle.digest("SHA-256")` before being saved to `localStorage`.
- **Duplicate Checks:** Prevents creating an account with an existing username or email.
- **Session Management:** Simulates active user sessions.
- **Protected Dashboard:** Redirects unauthenticated users attempting to access the dashboard directly.
- **Logout Functionality:** Safely clears active sessions and returns to the login screen.

## Tech Stack

- **HTML5:** Structure and markup.
- **CSS3:** Premium styling with custom properties, flexbox/grid, and animations.
- **JavaScript (ES6+):** Form handling, validation, native crypto hashing, and DOM manipulation.

## File Structure

```text
/
├── index.html        # Main entry point containing both Login and Registration forms.
├── dashboard.html    # Protected dashboard view accessible only after login.
├── css/
│   └── style.css     # Global styles, variables, animations, and glassmorphic UI.
└── js/
    ├── auth.js       # Core authentication logic (hashing, validation, user storage).
    └── dashboard.js  # Dashboard session validation and logout logic.
```

## How to Use

1. **Clone or Download:** Save the project folder to your local machine.
2. **Open the Application:** Open `index.html` in any modern web browser (e.g., Chrome, Edge, Firefox).
3. **Register:** Click on "Register here", fill in your details, and make sure your password has at least 8 characters and 1 number.
4. **Log In:** After successful registration, log in with your new credentials.
5. **Dashboard:** You'll be redirected to the protected dashboard area.
6. **Log Out:** Click the "Log Out" button on the dashboard to clear your session and return to the login page.
7. **Test Protection:** Try opening `dashboard.html` directly in your browser without logging in; you should be automatically redirected back to `index.html`.

## Security Note

This project is intended for educational purposes and demonstrations of client-side logic. In a real-world production application, authentication, user data, and password hashing should **always** be handled on a secure backend server.
