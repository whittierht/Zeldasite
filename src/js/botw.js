import { getAllBOTW } from "./api.js";
import { loadPartial, hamburger, setupFilterToggle } from "./utils.js";
import { setupFilters } from "./filters.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");
    await loadPartial(".filters-section", "/partials/filters.html");

    hamburger();

    const items = await getAllBOTW();
    items.sort((a, b) => a.name.localeCompare(b.name));

    renderList(items);
    setupFilterToggle();
    setupFilters(items, renderList);
}

function renderList(items) {
    const listContainer = document.querySelector(".compendium-list");
    listContainer.innerHTML = items.map(item => `
        <a href="/compendiums/item.html?id=${item.id}" class="compendium-card">
            <img src="${item.image}" alt="${item.name}" />
            <h2>${item.name}</h2>
        </a>
    `).join("");
}

init();
