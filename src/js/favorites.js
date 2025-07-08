import { loadPartial, hamburger } from "./utils.js";
import { getAllCompendium } from "./api.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    hamburger();

    const favoritesSection = document.querySelector(".favorites-section");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.length) {
        favoritesSection.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    // Load both games' data
    const botwItems = await getAllCompendium("botw");
    const totkItems = await getAllCompendium("totk");
    const allItems = [...botwItems, ...totkItems];

    const matchedFavorites = allItems.filter(item => favorites.includes(item.name));

    if (!matchedFavorites.length) {
        favoritesSection.innerHTML = "<p>None of your favorites were found in the compendium.</p>";
        return;
    }

    favoritesSection.innerHTML = matchedFavorites.map(item => `
        <div class="favorite-item">
            <h3>${item.name}</h3>
            <img src="${item.image}" alt="${item.name}" width="120">
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
