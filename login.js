// Imports
import { getCookie, get_token } from "./api.js";

// Check if the user is logged in
if (getCookie("token") === "") {
    // If not, do nothing
} else {
    // If yes, redirect to index page
    window.location.href = "./";
}

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const token = await get_token(username, password);
    //window.location.href = "/";
});