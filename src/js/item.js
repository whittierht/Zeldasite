import { loadPartial, hamburger, getParam } from "./utils.js";
import { getAllCompendium } from "./api.js";
import { getAllBOTW, getAllTOTK } from "./api.js";

let locationCoordinates = {};
let currentTotkLayerIndex = 0;
const totkLayers = ["ground", "sky", "depths"];

let botwItems = [];
let totkItems = [];






async function init() {
    botwItems = await getAllBOTW();
    totkItems = await getAllTOTK();


    function itemAppearances(itemName) {
    const fromBOTW = botwItems.some(i => i.name === itemName);
    const fromTOTK = totkItems.some(i => i.name === itemName);

    if (fromBOTW && fromTOTK) return "BOTW and TOTK";
    if (fromBOTW) return "BOTW";
    if (fromTOTK) return "TOTK";
    return "Unknown";
}

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

    let allItems = [];
    if (game === "botw") {
        allItems = await getAllBOTW();
    } else if (game === "totk") {
        allItems = await getAllTOTK();
    }
    const item = allItems.find(i => Number(i.id) === Number(itemId));

    if (!item) {
        content.innerHTML = "<p>Item not found. Try again!</p>";
        return;
    }

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = favorites.some(fav => Number(fav.id) === Number(item.id) && fav.game === game);


    console.log("Favorites list:", favorites);
    console.log("Is current item favorited?", isFavorite);

    content.innerHTML = `
    <div class="item">
        <h1 class="item-name">${item.name}</h1>
        <button class="favorite-btn" title="${isFavorite ? "Remove from Favorites" : "Add to Favorites"}">
        <span class="heart ${isFavorite ? "filled" : ""}">&#10084;</span>
        </button>
        <p class="item-category"><i>${item.category}</i></p>
        <p class="item-description">${item.description || "No description available."}</p>
        <div class="image-wrapper">
        <div class="spinner"></div>
        <img class="item-image" src="${item.image}" alt="${item.name}">
        </div>


    </div>
    `;

    const allItemsFull = await getAllCompendium();
    const uniqueByNameMap = new Map();
    allItemsFull.forEach(i => {
    if (!uniqueByNameMap.has(i.name)) {
        uniqueByNameMap.set(i.name, i);
    }
    });
    const uniqueItems = Array.from(uniqueByNameMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
    );

    const currentIndex = uniqueItems.findIndex(i => i.name === item.name);

    const prevItem = uniqueItems[currentIndex - 1];
    const nextItem = uniqueItems[currentIndex + 1];

    const prevBtn = document.getElementById("prev-item");
    const nextBtn = document.getElementById("next-item");

    if (prevItem) {
        prevBtn.addEventListener("click", () => {
            window.location.href = `/compendiums/item.html?id=${prevItem.id}&game=${prevItem.game}`;
    });
    } else {
        prevBtn.disabled = true;
    }

    if (nextItem) {
        nextBtn.addEventListener("click", () => {
            window.location.href = `/compendiums/item.html?id=${nextItem.id}&game=${nextItem.game}`;
    });
    } else {
        nextBtn.disabled = true;
    }



    const img = document.querySelector(".item-image");
    const spinner = document.querySelector(".spinner");

    function hideSpinner() {
        img.classList.add("loaded");
        spinner.classList.add("hidden");
    }

    img.addEventListener("load", hideSpinner);
    img.addEventListener("error", () => {
        img.src = "/images/placeholder.png";
        hideSpinner();
    });

    if (img.complete && img.naturalHeight !== 0) {
        hideSpinner();
    }




    document.querySelector(".favorite-btn").addEventListener("click", (e) => {
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const index = favorites.findIndex(fav =>
            Number(fav.id) === Number(item.id) && fav.game === game
        );
        const heart = e.currentTarget.querySelector(".heart");

        if (index === -1) {
            favorites.push({ id: item.id, name: item.name, game });
            heart.classList.add("filled");
        } else {
            favorites.splice(index, 1);
            heart.classList.remove("filled");
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    });


    const mapKey = document.querySelector(".map-key");
    const locations = document.querySelector(".item-locations");
    locations.innerHTML = `<strong>Common Locations:</strong> ${item.common_locations?.length ? item.common_locations.join(", ") : "No Common Locations"}`;


    if (!item.common_locations?.length) {
        mapKey.style.display = "none";
    } else {
        mapKey.style.display = "inline-block;"; 
    }

    setupMapControls(item.common_locations);
    showItemLocations(item.common_locations, item);

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
        drops.style.display = "none"; 
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

    mapImage.classList.add("fade-out");

    setTimeout(() => {
        mapImage.src = `/images/totk-${currentLayer}-map.jpg`;

        mapImage.onload = () => {
            mapImage.classList.remove("fade-out");
        };

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
    }, 300); 
}



function showItemLocations(locations, item) {
    const isFromBOTW = botwItems.some(i => i.name === item.name);
    const isFromTOTK = totkItems.some(i => i.name === item.name);
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

    if (isFromBOTW && botwUsed) {
        botwMapInner.parentElement.classList.add("active");
    } else {
        botwMapInner.parentElement.classList.remove("active");
    }

    if (isFromTOTK && totkUsed) {
        totkMap.classList.add("active");
    } else {
        totkMap.classList.remove("active");
    }

    const mapKey = document.querySelector(".map-key");
    if (!totkMap.classList.contains("active")) {
        mapKey.style.display = "none";
    } else {
        mapKey.style.display = "inline-block";
    }

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

