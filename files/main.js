import { file_list } from "/rsc/api.js";

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

var path = new Path(["projects","mytest"]);
var files;

// Build Filelist
async function updateFiles() {

	var Breadcrumb = document.getElementById("breadcrumb");
	var template = document.getElementById("breadcrumb-template");

	var directorys = path.as_list().map((name, index) => {
		return {name: name, link: path.as_strings()[index]};
	});
	
	liquidEngine
		.parseAndRender(template.innerHTML, {directorys: directorys})
		.then(html => Breadcrumb.innerHTML = html)

	files = await file_list(path.as_string()); 
	var Filelist = document.getElementById("filelist");
	var template = document.getElementById("file-template");

	liquidEngine
		.parseAndRender(template.innerHTML, {files: files, amount: files.length})
		.then(html => Filelist.innerHTML = html)

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



updateFiles();