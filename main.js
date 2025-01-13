// Imports
import { getCookie, get_token } from "api.js";

// Setup Liquidjs
var Liquid = window.liquidjs.Liquid;
export var liquidEngine = new Liquid();
window.liquidEngine = liquidEngine;