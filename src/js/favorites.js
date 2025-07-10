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

    const matchedFavorites = favorites.map(fav => {
        const source = fav.game === "botw" ? botwItems : totkItems;
        const matched = source.find(item => item.id === fav.id && item.name === fav.name);
        if (matched) matched.game = fav.game;
        return matched;
    }).filter(Boolean);

    if (!matchedFavorites.length) {
        favoritesSection.innerHTML = `<p class="empty">No favorites yet...</p>`;
        return;
    }

    favoritesSection.innerHTML = matchedFavorites.map(item => `
        <div class="favorite-item">
            <a href="/compendiums/item.html?id=${item.id}&game=${item.game}">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
            </a>
            <button class="remove-btn"
                data-id="${item.id}"
                data-game="${item.game}"
                data-name="${item.name}">
                Remove
            </button>
        </div>
    `).join("");

    favoritesSection.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
            e.preventDefault();
            e.stopPropagation();

            const id = parseInt(e.target.dataset.id);
            const game = e.target.dataset.game;
            const name = e.target.dataset.name;

            const updatedFavorites = favorites.filter(fav =>
                fav.id !== id || fav.game !== game || fav.name !== name
            );

            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            location.reload();
        }
    });
}

init();
