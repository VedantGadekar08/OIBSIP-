document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('activeSession');
    
    // Redirect to login if no session is found
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    // Display welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Welcome, ${session}!`;

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('activeSession');
        window.location.href = 'index.html';
    });
});
