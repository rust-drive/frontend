import { file_list, getCookie } from "/api.js";

import * as rustdrive from "./rustdrive.js";


if (rustdrive.standalone) {
	console.log("files: initalizing standalone");
	alert("This application only can be used with the Rustdrive GUI")
} else {
	console.log("files: initalizing in iframe");
}

class Path {
	constructor(input) {
		if (typeof input === 'string') {
			this.list = input.split('/').filter(s => s !== '');
		} else {
			this.list = input || [];
		}
	}

	as_list() {
		return this.list;
	}

	as_string() {
		return this.list.join('/');
	}

	as_strings() {
		return this.list.map((item, index) => {
			return this.list.slice(0, index + 1).join('/');
		});
	}

	go_deeper(subPath) {
		if (typeof subPath === 'string') {
			this.list = this.list.concat(subPath.split('/').filter(s => s !== ''));
		} else if (Array.isArray(subPath)) {
			this.list = this.list.concat(subPath);
		}
	}

	go_up(level = 1) {
		this.list = this.list.slice(0, Math.max(0, this.list.length - level));
	}
}

var path = new Path();
var files;

// Build Filelist
async function updateFiles() {

	var breadcrumbs = document.getElementById("breadcrumbs");
	var template = document.getElementById("breadcrumb-template");
	
	breadcrumbs.innerHTML = "";

	var li = template.content.querySelector("li").cloneNode(true);
	li.querySelector("a").textContent = "home";
	li.onclick = () => setPath([]);
	breadcrumbs.appendChild(li);

	for ( const directory in path.as_list() ) {
		var li = template.content.querySelector("li").cloneNode(true);
		li.querySelector("a").textContent = path.as_list()[directory];
		li.onclick = () => setPath(path.as_list().slice(0, directory + 1));
		breadcrumbs.appendChild(li);
	}
	

	files = await rustdrive.api.file_list(path.as_string()); 
	var filelist = document.getElementById("filelist");
	var template = document.getElementById("file-template");

	filelist.innerHTML = "";

	for ( const file in files ) {
		if (files[file].folder) {
			var li = template.content.querySelector("a").cloneNode(true);
			li.textContent = files[file].name;
			li.ondblclick = () => openFolder(files[file].name);
			filelist.appendChild(li);
		} else {
			var li = template.content.querySelector("a").cloneNode(true);
			li.textContent = files[file].name;
			li.ondblclick = () => openFile(files[file].name);
			filelist.appendChild(li);
		}
	}

}


// Show infos of files
var Inspector = document.getElementById("inspector");
function showInfo(filename) {
	Inspector.innerHTML = "<h3>" + filename + "</h3>";
}
window.showInfo = showInfo;

function openFile(filename) {
	Inspector.innerHTML = "<h3>Opening: " + filename + "</h3>";
}
window.openFile = openFile;

function setPath(new_path) {
	path = new Path(new_path);
	updateFiles();
}
window.setPath = setPath;

function openFolder(filename) {
	path.go_deeper(filename)
	updateFiles();
}
window.openFolder = openFolder;


rustdrive.initialize(updateFiles);