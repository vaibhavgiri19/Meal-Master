document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the default form submission behavior

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginError = document.getElementById('login-error');

    // Simple validation
    if (username === '' || password === '') {
        loginError.style.display = 'block';  // Show error if fields are empty
    } else {
        loginError.style.display = 'none';

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({ username }));

        // Redirect to the main recipe page after login
        window.location.href = 'index.html';
    }
});
