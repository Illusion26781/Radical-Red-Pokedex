function displaySpeciesRow(tracker, key) {
	let mon = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "speciesRow";
	currentRow.onclick = function() {
		displaySpeciesPanel(mon);
	};
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper("td", "speciesDexIDWrapper", Math.trunc(mon.dexID)),
		buildWrapperSprite("td", "speciesSprite", sprites[mon.ID]),
		buildWrapperName("td", "speciesName", mon),
		buildWrapperTypes("td", "speciesTypes", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperAbilities("td", "speciesAbilities", mon.abilities),
		buildWrapperStat("td", "speciesStat", "HP", mon.stats.HP),
		buildWrapperStat("td", "speciesStat", "Atk", mon.stats.attack),
		buildWrapperStat("td", "speciesStat", "Def", mon.stats.defense),
		buildWrapperStat("td", "speciesStat", "SpA", mon.stats.specialAttack),
		buildWrapperStat("td", "speciesStat", "SpD", mon.stats.specialDefense),
		buildWrapperStat("td", "speciesStat", "Spe", mon.stats.speed),
		buildWrapperStat("td", "speciesStat", "BST", mon.stats.total)
	);
}

function displayLevelUpMovesRow(tracker, movePair) {
	let [key, level] = movePair;
	let move = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "movesRow";
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper("td", "moveLevelWrapper", level),
		buildWrapper("td", "moveNameWrapper", move.name),
		buildWrapperTypes("td", "moveType", types[move.type]),
		buildWrapperTypes("td", "moveSplit", splits[move.split]),
		buildWrapper("td", "movePowerWrapper", move.power),
		buildWrapper("td", "moveAccuracyWrapper", move.accuracy),
		buildWrapper("td", "moveDescriptionWrapper", move.description)
	);
}

function displayMovesRow(tracker, key) {
	let move = tracker.library[key];
	let currentRow = document.createElement("tr");
	currentRow.className = "movesRow";
	tracker.body.appendChild(currentRow);
	
	currentRow.append(
		buildWrapper("td", "moveNameWrapper", move.name),
		buildWrapperTypes("td", "moveType", types[move.type]),
		buildWrapperTypes("td", "moveSplit", splits[move.split]),
		buildWrapper("td", "movePowerWrapper", move.power),
		buildWrapper("td", "moveAccuracyWrapper", move.accuracy),
		buildWrapper("td", "moveDescriptionWrapper", move.description)
	);
}

function displaySpeciesPanel(mon) {
	let speciesPanel = document.getElementById("speciesPanel");
	let infoDisplay = document.getElementById("speciesPanelInfoDisplay");
	let tables = [
		["speciesLearnsetLevelUpTable", mon.learnset.levelup],
		["speciesLearnsetTMHMTable", mon.learnset.TMHM],
		["speciesLearnsetTutorTable", mon.learnset.tutor],
		["speciesLearnsetEggMovesTable", mon.learnset.eggmoves]
	]
	
	speciesPanel.className = "";
	infoDisplay.innerText = "";
	
	infoDisplay.append(
		buildWrapperSprite("div", "infoSprite", sprites[mon.ID]),
		buildWrapperName("div", "infoName", mon),
		buildWrapper("div", "infoDexIDWrapper",  "#" + Math.trunc(mon.dexID)),
		buildWrapperTypes("div", "infoTypes", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperAbilitiesFull("div", "infoAbilities", mon.abilities)
	);
	
	let statWrapper = buildWrapper("div", "infoStats");
	statWrapper.append(
		buildWrapperStatFull("div", "infoStat", "HP", mon.stats.HP),
		buildWrapperStatFull("div", "infoStat", "Atk", mon.stats.attack),
		buildWrapperStatFull("div", "infoStat", "Def", mon.stats.defense),
		buildWrapperStatFull("div", "infoStat", "SpA", mon.stats.specialAttack),
		buildWrapperStatFull("div", "infoStat", "SpD", mon.stats.specialDefense),
		buildWrapperStatFull("div", "infoStat", "Spe", mon.stats.speed),
		buildWrapperStat("div", "infoStat", "BST", mon.stats.total)
	);
	
	infoDisplay.append(
		statWrapper,
		buildWrapperChangelog("div", "infoChangelog", mon),
		buildWrapperFamilyTree("div", "infoFamilyTree", mon),
		//buildWrapperHeldItems("div", "infoItems", mon.items),
		//buildWrapperEggGroups("div", "infoEggGroups", mon.family.eggGroup),
		buildWrapperCoverageDefensive("div", "infoCoverage", types[mon.type.primary], types[mon.type.secondary]),
		buildWrapperCoverageOffensive("div", "infoCoverage", types[mon.type.primary], types[mon.type.secondary])
	);

	for (const [ID, data] of tables) {
		let table = document.getElementById(ID);
		table.className = "tableWrapper";
		if (data.length > 0)
			populateTable(ID, data);
		else
			table.classList.toggle("hide");
	}

	window.scrollTo(0, 0);
}

function buildWrapper(tag, className, text=null) {
	let wrapper = document.createElement(tag);
	wrapper.className = className;
	if (text)
		wrapper.textContent = text;
	if (text === 0)
		wrapper.textContent = "-";
	
	return wrapper;
}

function buildWrapperSprite(tag, className, src) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	let img = document.createElement("img");
	img.className = className;
	img.src = src;
	wrapper.append(img);
	
	return wrapper;
}

function buildWrapperName(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (mon.family.cousins && species[mon.family.cousins[0]].family.region !== mon.family.region)
		wrapper.append(buildWrapper("div", className + "Region", regions[mon.family.region].variant));
	
	wrapper.append(buildWrapper("div", className + "Name", mon.name));

	if (mon.family.form)
		wrapper.append(buildWrapper("div", className + "Form", mon.family.form));
	
	return wrapper;
}

function buildWrapperTypes(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	let typeBlock = buildWrapper("div", "typeWrapper", primary.name);
	typeBlock.style.backgroundColor = primary.color;
	wrapper.append(typeBlock);
	
	if (secondary) {
		typeBlock = buildWrapper("div", "typeWrapper", secondary.name);
		typeBlock.style.backgroundColor = secondary.color;
		wrapper.append(typeBlock);
	}
	
	return wrapper;
}

function buildWrapperAbilities(tag, className, a) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (a.primary)
		wrapper.append(buildWrapper("div", className + "Primary", abilities[a.primary].name));
	
	if (a.secondary)
		wrapper.append(buildWrapper("div", className + "Secondary", abilities[a.secondary].name));
	
	if (a.hidden)
		wrapper.append(buildWrapper("div", className + "Hidden", abilities[a.hidden].name));
	
	return wrapper;
}

function buildWrapperAbilitiesFull(tag, className, a) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (a.primary)
		wrapper.append(buildWrapper("div", className + "Primary", abilities[a.primary].name + " - " + abilities[a.primary].description));
	
	if (a.secondary)
		wrapper.append(buildWrapper("div", className + "Secondary", abilities[a.secondary].name + " - " + abilities[a.secondary].description));
	
	if (a.hidden)
		wrapper.append(buildWrapper("div", className + "Hidden", abilities[a.hidden].name + " - " + abilities[a.hidden].description));
	
	return wrapper;
}

function buildWrapperStat(tag, className, label, value) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	wrapper.append(buildWrapper("div", className + "Label", label));
	wrapper.append(buildWrapper("div", className + "Value", value));
	
	return wrapper;
}

function buildWrapperStatFull(tag, className, label, value) {
	let wrapper = buildWrapperStat(tag, className, label, value);
	let bar = buildWrapper("div", "infoStatBar " + label);
	bar.style.width = `${(value / 255) * 300}px`;;
	wrapper.append(bar);
	
	return wrapper;
}

function buildWrapperChangelog(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!mon.changelog)
		return wrapper;
	
	wrapper.append(buildWrapper("div", className));
	
	if (mon.changelog.type) {
		wrapper.append(buildWrapper("div", "infoChangelogTypeLabel", "New Typing:"));
		let typeWrapper = buildWrapper("div", "infoChangelogTypesWrapper");
		typeWrapper.append(buildWrapperTypes("div", "infoChangelogOldType", types[mon.changelog.type.primary], types[mon.changelog.type.secondary]));
		typeWrapper.append(buildWrapper("div", className + "ArrowWrapper", "→"));
		typeWrapper.append(buildWrapperTypes("div", "infoChangelogNewType", types[mon.type.primary], types[mon.type.secondary]));
		wrapper.append(typeWrapper);
	}
	
	if (mon.changelog.abilities) {
		let abilityWrapper = buildWrapper("div", "infoChangelogAbilityWrapper", "Ability Changes:");
		for (const ability of ["primary", "secondary", "hidden"]) {
			let oldAbility = abilities[mon.changelog.abilities[ability]];
			let newAbility = abilities[mon.abilities[ability]];
			if (oldAbility == newAbility)
				continue;
			if (oldAbility && newAbility)
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility" + ability, oldAbility.name + " → " + newAbility.name));
			else if (newAbility)
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility" + ability, "None → " + newAbility.name));
			else if (oldAbility)
				abilityWrapper.append(buildWrapper("div", "infoChangelogAbility" + ability, oldAbility.name + " → None"));
			}
		wrapper.append(abilityWrapper);
	}
	
	if (mon.changelog.stats) {
		let statLabels = {HP:"HP", attack:"Atk", defense:"Def", specialAttack:"SpA", specialDefense:"SpD", speed:"Spe"};
		let statsWrapper = buildWrapper("div", className, "Stat Changes:");
		
		for (const stat in mon.changelog.stats) {
			let statClass =  mon.changelog.stats[stat] < mon.stats[stat] ? "infoChangelogBuff" : "infoChangelogNerf";
			statsWrapper.append(buildWrapper("div", statClass, statLabels[stat] + " " + mon.changelog.stats[stat] + " → " + mon.stats[stat]));
		}
		wrapper.append(statsWrapper);
	}
	
	return wrapper;
}

function buildWrapperHeldItems(tag, className, i) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!i)
		return wrapper;
	
	wrapper.append(buildWrapper("div", className, "Held Items:"));
	if (i.common)
		wrapper.append(buildWrapper("div", className, "Common: " + items[i.common].name));
	if (i.rare)
		wrapper.append(buildWrapper("div", className, "Rare: " + items[i.rare].name));
	
	return wrapper;
}

function buildWrapperEggGroups(tag, className, e) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	
	if (!e)
		return wrapper;
	
	wrapper.append(buildWrapper("div", className, "Egg Groups:"));
	if (e.primary)
		wrapper.append(buildWrapper("div", className, eggGroups[e.primary].name));
	if (e.secondary)
		wrapper.append(buildWrapper("div", className, eggGroups[e.secondary].name));
	
	return wrapper;
}

function buildWrapperFamilyTree(tag, className, mon) {
	let wrapper = buildWrapper(tag, className + "Wrapper");
	wrapper.append(buildWrapper("div", "infoTreeEvoLabel", "Evolution Line"));
	wrapper.append(familyTree(mon.family.ancestor));
	
	
	if (mon.family.forms) {
		wrapper.append(buildWrapper("div", "infoTreeFormsLabel", "Alternate Forms"));
		let formsWrapper = buildWrapper("div", "infoFormsWrapper");
		for (const key of mon.family.forms) {
			let spriteWrapper = buildWrapper("div", "infoTreeSpriteWrapper");
			let img = document.createElement("img");
			img.src = sprites[key];
			img.className = "infoTreeSprite";
			img.onclick = function () {
				displaySpeciesPanel(species[key]);
			}
			spriteWrapper.append(img);
			formsWrapper.append(spriteWrapper);
		}
		wrapper.append(formsWrapper);
	}

	return wrapper;
}

function familyTree(key, evo=null) {
	let wrapper = buildWrapper("div", "infoTreeWrapper " + key);
	
	if (evo) {
		let evoWrapper = buildWrapper("div", "evoMethodWrapper");
		evoWrapper.append(buildWrapper("div", "evoMethod " + evo[0], "→"));
		wrapper.append(evoWrapper);
	}
	
	let spriteWrapper = buildWrapper("div", "infoTreeSpriteWrapper");
	let img = document.createElement("img");
	img.src = sprites[key];
	img.className = "infoTreeSprite";
	img.onclick = function () {
		displaySpeciesPanel(species[key]);
	}
	spriteWrapper.append(img);
	wrapper.append(spriteWrapper);
	
	if (species[key].family.evolutions) {
		if (species[key].family.evolutions.length === 1)
			wrapper.className += " single";
		let branchWrapper = buildWrapper("div", "infoTreeBranchWrapper");
		for (const evolution of species[key].family.evolutions)
			branchWrapper.append(familyTree(evolution[2], evolution));
		wrapper.append(branchWrapper);
	}
	
	return wrapper;
}

function buildWrapperCoverageDefensive(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + "Wrapper", "Defensive Coverage.");
	
	return wrapper;
}

function buildWrapperCoverageOffensive(tag, className, primary, secondary=null) {
	let wrapper = buildWrapper(tag, className + "Wrapper", "Offensive Coverage.");
	
	return wrapper;
}