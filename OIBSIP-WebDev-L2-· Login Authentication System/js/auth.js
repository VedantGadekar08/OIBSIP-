document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const session = localStorage.getItem('activeSession');
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    // UI Elements
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const messageBox = document.getElementById('message-box');

    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Toggle Views
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
        clearMessage();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
        clearMessage();
    });

    // Helper functions
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = `message ${type}`;
    }

    function clearMessage() {
        messageBox.className = 'message';
        messageBox.textContent = '';
    }

    // Password Hashing (SHA-256)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Password Validation
    function validatePassword(password) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least 1 number.";
        }
        return null;
    }

    // Get Users from localStorage
    function getUsers() {
        const users = localStorage.getItem('auth_users');
        return users ? JSON.parse(users) : {};
    }

    // Registration Handler
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (!username || !password || !confirmPassword) {
            showMessage("All fields are required.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showMessage(passwordError, "error");
            return;
        }

        const users = getUsers();
        
        // Case-insensitive username check
        const usernameLower = username.toLowerCase();
        if (users[usernameLower]) {
            showMessage("User already exists. Please choose another username.", "error");
            return;
        }

        // Hash and Store
        try {
            const hashedPassword = await hashPassword(password);
            users[usernameLower] = {
                username: username,
                passwordHash: hashedPassword,
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('auth_users', JSON.stringify(users));
            
            showMessage("Registration successful! You can now log in.", "success");
            registerForm.reset();
            
            // Switch to login view after brief delay
            setTimeout(() => {
                registerView.style.display = 'none';
                loginView.style.display = 'block';
                clearMessage();
            }, 2000);
            
        } catch (error) {
            console.error("Hashing error", error);
            showMessage("An error occurred during registration.", "error");
        }
    });

    // Login Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            showMessage("Please enter both username and password.", "error");
            return;
        }

        const users = getUsers();
        const usernameLower = username.toLowerCase();
        const userRecord = users[usernameLower];

        if (!userRecord) {
            showMessage("Invalid username or password.", "error");
            return;
        }

        try {
            const hashedPassword = await hashPassword(password);
            
            if (userRecord.passwordHash === hashedPassword) {
                // Login successful
                localStorage.setItem('activeSession', username);
                window.location.href = 'dashboard.html';
            } else {
                showMessage("Invalid username or password.", "error");
            }
        } catch (error) {
            console.error("Hashing error", error);
            showMessage("An error occurred during login.", "error");
        }
    });
});
