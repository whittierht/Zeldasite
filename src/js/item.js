import { loadPartial, hamburger, getParam } from "./utils.js";
import { getAllCompendium } from "./api.js";

let locationCoordinates = {};
let currentTotkLayerIndex = 0;
const totkLayers = ["ground", "sky", "depths"];

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    locationCoordinates = await fetchCoordinates();
    hamburger();

    const itemId = getParam("id");
    const game = getParam("game") || "botw";
    const content = document.querySelector(".item-content");

    if (!itemId) {
        content.innerHTML = "<p>Item not found. Try again!</p>";
        return;
    }

    const allItems = await getAllCompendium(game);
    const item = allItems.find(i => i.id == itemId);

    if (!item) {
        content.innerHTML = "<p>Item not found. Try again!</p>";
        return;
    }

    content.innerHTML = `
        <div class="item">
            <h1 class="item-name">${item.name}</h1>
            <p class="item-category"><i>${item.category}</i></p>
            <p class="item-description">${item.description || "No description available."}</p>
            <img class="item-image" src="${item.image}" alt="${item.name}">
        </div>
    `;

    const locations = document.querySelector(".item-locations");
    locations.innerHTML = `<strong>Common Locations:</strong> ${item.common_locations?.length ? item.common_locations.join(", ") : "No Common Locations"}`;

    setupMapControls(item.common_locations);
    showItemLocations(item.common_locations);

    const drops = document.querySelector(".drops");
    let statsHTML = "";

    if (item.hearts_recovered) {
        statsHTML += `<p><strong>Hearts Recovered:</strong> ${item.hearts_recovered}</p>`;
    }

    if (item.cooking_effect) {
        statsHTML += `<p><strong>Cooking Effect:</strong> ${item.cooking_effect}</p>`;
    }

    if (item.properties) {
        if (item.properties.attack) {
            statsHTML += `<p><strong>Attack:</strong> ${item.properties.attack}</p>`;
        }
        if (item.properties.defense) {
            statsHTML += `<p><strong>Defense:</strong> ${item.properties.defense}</p>`;
        }
    }

    const hasDrops = item.drops?.length;
    const hasStats = statsHTML.length;

    if (hasDrops || hasStats) {
        drops.innerHTML = `
            <h2 class="item-drops"><strong>Stats</strong></h2>
            <div class="drops-list">
                ${hasDrops ? `<strong>Drops:</strong><ul>${item.drops.map(drop => `<li>${drop}</li>`).join("")}</ul>` : ""}
                ${hasStats ? `<div class="stats">${statsHTML}</div>` : ""}
            </div>
        `;
    } else {
        drops.style.display = "none"; // Hide the whole section
    }
}

function setupMapControls(locations) {
    const prevBtn = document.getElementById("prev-map");
    const nextBtn = document.getElementById("next-map");

    prevBtn.addEventListener("click", () => switchTotkLayer(-1, locations));
    nextBtn.addEventListener("click", () => switchTotkLayer(1, locations));
}

function switchTotkLayer(direction, locations) {
    const mapImage = document.querySelector(".totk-map .map-image");
    const mapHeader = document.querySelector(".totkMAP");

    currentTotkLayerIndex = (currentTotkLayerIndex + direction + totkLayers.length) % totkLayers.length;
    const currentLayer = totkLayers[currentTotkLayerIndex];

    mapImage.src = `/images/totk-${currentLayer}-map.jpg`;

    if (currentLayer === "ground") {
        mapHeader.textContent = "TOTK Ground Map";
    } else if (currentLayer === "sky") {
        mapHeader.textContent = "TOTK Sky Map";
    } else if (currentLayer === "depths") {
        mapHeader.textContent = "TOTK Depths Map";
    } else {
        console.warn(`No Map`);
    }



    showItemLocations(locations);
}

function showItemLocations(locations) {
    const botwMapInner = document.querySelector(".botw-map .map-inner");
    const totkMap = document.querySelector(".totk-map");
    const totkMapInner = document.querySelector(".totk-map .map-inner");

    botwMapInner.parentElement.classList.remove("active");
    totkMap.classList.remove("active");

    botwMapInner.querySelectorAll(".marker").forEach(m => m.remove());
    totkMapInner.querySelectorAll(".marker").forEach(m => m.remove());

    if (!locations?.length) return;

    let botwUsed = false;
    let totkUsed = false;

    locations.forEach(loc => {
        const coords = locationCoordinates[loc];
        if (!coords) {
            console.warn(`Missing coordinates for location: ${loc}`);
            return;
        }

        if (coords.map === "botw" || coords.map === "both") {
            const botwMarker = document.createElement("div");
            botwMarker.classList.add("marker", "red");
            botwMarker.style.top = coords.top;
            botwMarker.style.left = coords.left;
            botwMapInner.appendChild(botwMarker);
            botwUsed = true;
        }

        if (coords.map === "totk" || coords.map === "both") {
            const totkMarker = document.createElement("div");
            totkMarker.classList.add("marker");

        if (coords.layer === "ground") {
            totkMarker.classList.add("red");
        } else if (coords.layer === "sky") {
            totkMarker.classList.add("blue");
        } else if (coords.layer === "depths") {
            totkMarker.classList.add("purple");
        } else {
            console.warn(`Invalid or missing layer for ${loc}`, coords);
        }

            totkMarker.style.top = coords.top;
            totkMarker.style.left = coords.left;
            totkMapInner.appendChild(totkMarker);
            totkUsed = true;
        }
    });

    if (botwUsed) botwMapInner.parentElement.classList.add("active");
    if (totkUsed) totkMap.classList.add("active");
}

async function fetchCoordinates() {
    try {
        const res = await fetch("/js/locationCoordinates.json");
        return await res.json();
    } catch (err) {
        console.error("Failed to load location coordinates:", err);
        return {};
    }
}

init();

