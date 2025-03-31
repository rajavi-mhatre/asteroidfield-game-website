//Function to login
function login() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    //invalid email format displays an error message.
    if (!emailPattern.test(email)) {
        document.getElementById("loginFailure").innerHTML = "Invalid email format.";
        return false; // Prevent form submission
    }

    // Check if email exists in localStorage
    if (localStorage[email] === undefined) {
        document.getElementById("loginFailure").innerHTML = "Email not recognized. Do you have an account?"; 
        
        // Prevent form submission
        return false;
    }

    // Retrieve user object from localStorage
    let usrObject = JSON.parse(localStorage[email]);

    // Validate password
    if (password === usrObject.password) {
        document.getElementById("loginFailure").innerHTML = ""; // Clear previous error message
        sessionStorage.loggedInUserEmail = usrObject.email; // Store email in sessionStorage
        // Redirect to the gameplay page after successful login
        window.location.href = "gameplay.html";
        return true; 
    } else {
        document.getElementById("loginFailure").innerHTML = "Password incorrect, please try again.";
        return false; // Prevent form submission
    }
}
