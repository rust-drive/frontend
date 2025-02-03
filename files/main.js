import * as rustdrive from "./rustdrive.js";


if (rustdrive.standalone) {
	console.log("files: initalizing standalone");
	alert("This application only can be used with the Rustdrive GUI")
} else {
	console.log("files: initalizing in iframe");
}

class Path {
	constructor(input) {
		// Initialize list from input string or array
		if (typeof input === 'string') {
			this.list = input.split('/').filter(s => s !== '');
		} else {
			this.list = input || [];
		}
	}

	as_list() {
		// Return the path as a list
		return this.list;
	}

	as_string() {
		// Join the list into a string separated by '/'
		return this.list.join('/');
	}

	as_strings() {
		// Return a list of strings showing the path at each depth
		return this.list.map((item, index) => {
			return this.list.slice(0, index + 1).join('/');
		});
	}

	go_deeper(subPath) {
		// Add subPath to the current path
		if (typeof subPath === 'string') {
			this.list = this.list.concat(subPath.split('/').filter(s => s !== ''));
		} else if (Array.isArray(subPath)) {
			this.list = this.list.concat(subPath);
		}
	}

	go_up(level = 1) {
		// Remove the specified number of levels from the end of the path
		this.list = this.list.slice(0, Math.max(0, this.list.length - level));
	}
}

var path = new Path();
var files;

// Build Filelist
async function updateFiles() {

	// Get breadcrumb and template elements
    var breadcrumbs = document.getElementById("breadcrumbs");
    var template = document.getElementById("breadcrumb-template");
    
    // Clear existing breadcrumbs
    breadcrumbs.innerHTML = "";

    // Add "home" breadcrumb
    var li = template.content.querySelector("li").cloneNode(true);
    li.querySelector("a").textContent = "home";
    li.onclick = () => setPath([]);
    breadcrumbs.appendChild(li);

    // Add breadcrumbs for each directory in the path
    for (const directory in path.as_list()) {
        var li = template.content.querySelector("li").cloneNode(true);
        li.querySelector("a").textContent = path.as_list()[directory];
        li.onclick = () => setPath(path.as_list().slice(0, directory + 1));
        breadcrumbs.appendChild(li);
    }
    
    // Fetch the list of files from the API
    files = await rustdrive.api.file_list(path.as_string()); 
    var filelist = document.getElementById("filelist");
    var template = document.getElementById("file-template");

    // Clear existing file list
    filelist.innerHTML = "";

    // Add each file or folder to the file list
    for (const file in files) {
        var li = template.content.querySelector("a").cloneNode(true);
        li.textContent = files[file].name;
		li.onclick = () => showInfo(files[file].name);
        if (files[file].folder) {
            li.ondblclick = () => openFolder(files[file].name);
        } else {
            li.ondblclick = () => openFile(files[file].name);
        }
        filelist.appendChild(li);
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

function openFolder(filename) {
	path.go_deeper(filename)
	updateFiles();
}
window.openFolder = openFolder;

function setPath(new_path) {
	path = new Path(new_path);
	updateFiles();
}
window.setPath = setPath;

rustdrive.initialize(updateFiles);