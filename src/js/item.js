import { loadPartial, hamburger, getParam } from "./utils.js";
import { getAllCompendium } from "./api.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    hamburger();

    const itemId = getParam("id");
    const content = document.querySelector(".item-content")

    if (!itemId) {
        content.innterHTML = "<p>Item not fount. Try again!</p>"
        return;
    }

    const allItems = await getAllCompendium();
    const item = allItems.find(i => i.id == itemId);

    if (!item) {
        content.innerHTML = "<p>Item not fount. Try again!</p>"
    }

    content.innerHTML = `
        <h1 class = "item-name">${item.name}</h1>
        <img class = "item-image" src="${item.image}" alt="${item.name}">
        <p class = "item-category"><strong>Category:</strong> ${item.category}</p>
        <p class = "item-description"><strong>Description:</strong> ${item.description || "No description available."}</p>
        <p class = "item-locations"><strong>Common Locations:</strong> ${item.common_locations && item.common_locations.length > 0 ? item.common_locations.join(", ") : "None."}</p>
        <p class = "item-drops"><strong>Drops:</strong> ${item.drops && item.drops.length > 0 ? item.drops.join(", ") : "None."}</p>
    `;

    }

init();

