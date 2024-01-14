function setupTables() {
	for (const name of [
		"speciesLearnsetPrevoExclusiveTable",
		"speciesLearnsetLevelUpTable"
	]) {
		setupTable(name, moves, displayLevelUpMovesRow, Object.keys(moves).length, sortLevelUpMovesRow, [
			{label: "Lvl", by: ["level"]},
			{label: "Name", by: ["name"]},
			{label: "Type", by: ["type"]},
			{label: "Category", by: ["split"]},
			{label: "Power", by: ["power"], factor: -1},
			{label: "Acc", by: ["accuracy"], factor: -1},
			{label: "Description"}
		]);
	}
	
	for (const name of [
		"speciesLearnsetTMHMTable",
		"speciesLearnsetTutorTable",
		"speciesLearnsetEggMovesTable",
		"speciesLearnsetEventTable"
	]) {
		setupTable(name, moves, displayMovesRow, Object.keys(moves).length, sortMovesRow, [
			{label: "Name", by: ["name"]},
			{label: "Type", by: ["type"]},
			{label: "Category", by: ["split"]},
			{label: "Power", by: ["power"], factor: -1},
			{label: "Acc", by: ["accuracy"], factor: -1},
			{label: "Description"}
		]);
	}

	setupTable("speciesTable", species, displaySpeciesRow, 50, sortSpeciesRow, [
		{label: "#", by: ["dexID"]},
		{label: "Sprite"},
		{label: "Name", by: ["name"]},
		{label: "Type"},
		{label: "Abilities", by: ["abilities", "primary"]},
		{label: "HP", by: ["stats", "HP"], factor: -1},
		{label: "Atk", by: ["stats", "attack"], factor: -1},
		{label: "Def", by: ["stats", "defense"], factor: -1},
		{label: "SpA", by: ["stats", "spAttack"], factor: -1},
		{label: "SpD", by: ["stats", "spDefense"], factor: -1},
		{label: "Spe", by: ["stats", "speed"], factor: -1},
		{label: "BST", by: ["stats", "total"], factor: -1}
	]);
	
	populateTable("speciesTable", Object.keys(species));
	
	window.onscroll = function(ev) {
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
			loadChunk(trackers["speciesTable"], false);
		}
	};
}

function setupTable(name, library, displayMethod, maxRows, sortMethod, sortOptions) {
	let wrapper = document.getElementById(name);
	if (!wrapper) {
		console.log(`Table ${name} could not be created, wrapper missing.`);
		return;
	}
	let table = document.createElement("table");
	let thead = document.createElement("thead");
	let tbody = document.createElement("tbody");
	table.className = "align-middle table table-striped table-dark table-hover";
	table.append(thead);
	table.append(tbody);
	wrapper.append(table);
	
	trackers[name] = {};
	let tracker = trackers[name];
	tracker.body = tbody;
	tracker.library = library;
	tracker.displayMethod = displayMethod;
	tracker.maxRows = maxRows;
	
	let sortControls = document.createElement("tr");
	sortControls.className = "sortControls";
	thead.append(sortControls);
	
	for (const sortProperties of sortOptions) {
		let sortOption = document.createElement("th");
		sortControls.append(sortOption);
		sortOption.innerText = sortProperties.label;
		sortOption.className = "sortLocked";
		if (!sortProperties.by)
			continue;
		sortOption.className = "sortOption";
		sortOption.onclick = function () {
			sortTracker(this, trackers[name], sortMethod, sortProperties);
		};
	}
	tracker.sortControls = sortControls.getElementsByClassName("sortOption");
}

function populateTable(name, data) {
	let tracker = trackers[name];
	if (!tracker) {
		console.log(`Tracker ${name} does not exist; cannot populate.`);
		return;
	}
	
	tracker.data = data;
	for (const control of tracker.sortControls)
		control.className = "sortOption";
	scrollIntoView = false;
	tracker.sortControls[0].click();
	scrollIntoView = true;
}

function sortTracker(selectedOption, tracker, sortMethod, sortProperties) {
	let prevClass = selectedOption.className;
	
	for (const option of tracker.sortControls)
		option.className = "sortOption";
	
	selectedOption.className = "sortOption active sortAscending";
	
	if (prevClass === "sortOption") {
		sortMethod(tracker, sortProperties);
	}
	else {
		if (prevClass === "sortOption active sortAscending") {
			selectedOption.className = "sortOption active sortDescending";
		}
	
		tracker.data.reverse();
	}
	
	loadChunk(tracker, true);
}