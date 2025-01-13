// Imports
import { getCookie } from "/api.js";

// Setup Liquidjs
var Liquid = window.liquidjs.Liquid;
export var liquidEngine = new Liquid();
window.liquidEngine = liquidEngine;

// Check if the user is logged in
if (getCookie("token") === "") {
    // If not, redirect to login page
    window.location.href = "/login.html";
}