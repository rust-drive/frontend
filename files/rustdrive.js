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

export const auth = {

    set_token(token) {
        const exdays = 100;
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "rustdrive_token=" + token + ";" + expires + ";SameSite=Lax;path=/";
    },

    extend_token(token) {
        token = getToken();
        setToken(token);
    },

    get_token() {
        let name = "rustdrive_token" + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    delete_token() {
        document.cookie = "rustdrive_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; path=/";
    },
}

// Receive the configuration in iframe mode
window.addEventListener('message', (event) => {
	config = event.data.config;
    auth.set_token(event.data.token);
	console.log("rustdrive: configuration recieved");
});

console.log("rustdrive: module loaded");