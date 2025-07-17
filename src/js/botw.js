import { getAllBOTW } from "./api.js";
import { loadPartial, hamburger, setupFilterToggle } from "./utils.js";
import { setupFilters } from "./filters.js";

let allItems = [];

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");
    await loadPartial(".filters-section", "/partials/filters.html");

    hamburger();

    const items = await getAllBOTW();
    items.sort((a, b) => a.name.localeCompare(b.name));
    allItems = items;

    renderList(items);
    setupFilterToggle();
    setupFilters(items, renderList);
    setUpSearch();
}

function renderList(items) {
  const listContainer = document.querySelector(".compendium-list");

  listContainer.innerHTML = items.map(item => `
    <a href="/compendiums/item.html?id=${item.id}&game=${item.game}" class="compendium-card">
      <img src="${item.image}" alt="${item.name}" />
      <h2>${item.name}</h2>
    </a>
  `).join("");
}


function setUpSearch() {
    const searchInput = document.querySelector(".search");

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = allItems.filter(item =>
            item.name.toLowerCase().includes(query)
        );
        const listContainer = document.querySelector(".compendium-list");
        if (!filtered.length) {
            listContainer.innerHTML = `<p class="empty">No results found...</p>`;
            return;
        }
        renderList(filtered);
    });
}


init();
