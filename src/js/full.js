import { getAllCompendium } from "./api.js";
import { loadPartial, hamburger } from "./utils.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    hamburger();

        const listContainer = document.querySelector(".compendium-list");
        const items = await getAllCompendium();

        items.sort((a, b) => a.name.localeCompare(b.name));

        listContainer.innerHTML = items.map(item => `
        <a href="/compendiums/item.html?id=${item.id}" class="compendium-card">
            <button class="favorite-btn" title="Favorite"></button>
            <img src="${item.image}" alt="${item.name}" />
            <h2>${item.name}</h2>
        </a>
        `).join("");

        
    }

init();

