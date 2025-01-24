// Imports
import { getCookie } from "./api.js";
import { default_app, app_urls } from "./config.js";

// Setup Liquidjs
var Liquid = window.liquidjs.Liquid;
export var liquidEngine = new Liquid();
window.liquidEngine = liquidEngine;


// Display all apps
let template = document.getElementById("app-template");
for (const app in app_urls) {
    let entry = template.content.querySelector("a").cloneNode(true);
    entry.href = "/?app=" + app;
    entry.text = app;
    document.getElementById("apps").appendChild(entry);
}


// Check if the user is logged in
if (getCookie("token") === "") {
    // If not, redirect to login page
    window.location.href = "login.html";
}


// Get app and set to default if none is present
let app;
const query_string = window.location.search;
if (query_string == "") {
    // If no app is set, set to default
    const params = new URLSearchParams();
    params.append("app", default_app);
    const new_query_string = params.toString();
    // Redirect
    window.location.href = "?" + new_query_string;
} else {
    // If app is set, get it
    const urlParams = new URLSearchParams(query_string);
    app = urlParams.get('app');
}


console.log(query_string);

let content_iframe =document.getElementById("content");
content_iframe.src = app_urls[app];

console.log("Loaded " + app);
