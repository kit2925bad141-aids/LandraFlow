const LOGIN_API = "http://localhost:8080/LaundraFlow/manager/login";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Checking login...";

    try {

        const response = await fetch(LOGIN_API, {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {

            loginMessage.textContent = "Login successful!";

            // Remember that manager has logged in
            sessionStorage.setItem("managerLoggedIn", "true");

            // Open dashboard
            window.location.href = "../index.html";

        } else {

            loginMessage.textContent =
                data.message || "Invalid email or password.";
        }

    } catch (error) {

        console.error("Login error:", error);

        loginMessage.textContent =
            "Unable to connect to server.";
    }
});