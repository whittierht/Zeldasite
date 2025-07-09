import { loadPartial, hamburger } from "./utils.js";
import { getAllCompendium } from "./api.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    hamburger();

    const favoritesSection = document.querySelector(".favorites-section");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.length) {
        favoritesSection.innerHTML = `<p class="empty">No favorites yet...</p>`;
        return;
    }

    const botwItems = await getAllCompendium("botw");
    const totkItems = await getAllCompendium("totk");

    const allItemsMap = new Map();

    for (const item of botwItems) {
    if (favorites.includes(item.name)) {
        allItemsMap.set(item.name, item);
    }
    }

    for (const item of totkItems) {
    if (favorites.includes(item.name) && !allItemsMap.has(item.name)) {
        allItemsMap.set(item.name, item);
    }
    }

    const matchedFavorites = Array.from(allItemsMap.values());

    if (!matchedFavorites.length) {
        favoritesSection.innerHTML = `<p class="empty">No favorites yet...</p>`;
        return;
    }

    favoritesSection.innerHTML = matchedFavorites.map(item => `
        <div class="favorite-item">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <button class="remove-btn" data-name="${item.name}">Remove</button>
        </div>
    `).join("");

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const nameToRemove = e.target.dataset.name;
            const updatedFavorites = favorites.filter(fav => fav !== nameToRemove);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            location.reload();
        });
    });
}

init();
