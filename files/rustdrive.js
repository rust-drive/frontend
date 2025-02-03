/*

Successor of the api.js file

*/

export var standalone = window.self == window.top;

var config;

// Define the configuration of the frontend
class Configuration {
    constructor(backend_url, default_app, app_urls) {
        this.backend_url = backend_url; // Store the backend URL
        this.default_app = default_app; // Store the default application
        this.app_urls = app_urls; // Store the application URLs
    }
}

// Implement the token storage system
export const auth = {

    // Set the cookie for the given token with a given expiery date
    set_token(token) {
        const exdays = 100;
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        // Set the cookie with the token, expiration date and same site protection
        document.cookie = "rustdrive_token=" + token + ";" + expires + ";SameSite=Lax;path=/";
    },

    // Extend the token by getting the current token and setting it again with a new expiration date
    extend_token(token) {
        // Get the current token
        token = getToken();
        // Set the token again with a new expiration date
        setToken(token);
    },

    // Get the token from the cookie
    get_token() {
        // Set the name of the cookie
        let name = "rustdrive_token" + "=";
        // Decode the cookie
        let decodedCookie = decodeURIComponent(document.cookie);
        // Split the cookie into an array of key-value pairs
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            // Get the current key-value pair
            let c = ca[i];
            // Remove leading whitespace
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            // If the key matches the name of the cookie
            if (c.indexOf(name) == 0) {
                // Return the value of the cookie
                return c.substring(name.length, c.length);
            }
        }
        // If the cookie is not found, return an empty string
        return "";
    },

    // Delete the cookie
    delete_token() {
        // Set the cookie with an expiration date in the past
        document.cookie = "rustdrive_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; path=/";
    },
}

// Implementing the API commands
export const api = {
    async get_token(user_id, password) {
        // Make a GET request to the backend /auth/get-token endpoint
        const url = config.backend_url + '/auth/get-token';
        const options = {
            method: 'GET',
            headers: {
                // Set the Authorization header with the base64 encoded user id and password
                Authorization: 'Basic ' + btoa(user_id + ':' + password),
                // Set the Content-Type to json
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(url, options);
        const token = await response.text();
        if (response.ok) {
            // Return the token if the request was successful
            return token;
        } else {
            // Throw an error with the token if the request failed
            throw new Error(token);
        }
    },
    // Make a GET request to the backend /api/file-list endpoint to get a list of files
    // in the directory at the given path
    async file_list(path) {
        const url = config.backend_url + '/api/file-list/' + path;
        const token = auth.get_token();
        const options = {
            method: 'GET',
            headers: {
                // Set the Authorization header with the bearer token
                Authorization: `Bearer ${token}`
            }
        };
        const response = await fetch(url, options);
        // Return the list of files as JSON
        return await response.json();
    },

    // Make a GET request to the backend /api/file_content endpoint to get the content
    // of the file at the given path
    async file_content(path) {
        const url = config.backend_url + '/api/file_content/' + path;
        const token = auth.get_token();
        const options = {
            method: 'GET',
            headers: {
                // Set the Authorization header with the bearer token
                Authorization: `Bearer ${token}`
            }
        };
        const response = await fetch(url, options);
        // Return the content of the file as plain text
        return await response.text();
    }
}




export function initialize(callback) {
    // Receive the configuration in iframe mode
    window.addEventListener('message', (event) => {
	    config = event.data.config;
        auth.set_token(event.data.token);
	    console.log("rustdrive: configuration recieved");
        callback();
    });
}

console.log("rustdrive: module loaded");