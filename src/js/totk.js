import { getAllTOTK } from "./api.js";
import { loadPartial, hamburger } from "./utils.js";

async function init() {
    await loadPartial(".myheader", "/partials/header.html");
    await loadPartial(".myfooter", "/partials/footer.html");

    hamburger();

    const listContainer = document.querySelector(".compendium-list");
    const items = await getAllTOTK();

    items.sort((a, b) => a.name.localeCompare(b.name));

    listContainer.innerHTML = items.map(item => `
        <a href="/compendiums/item.html?id=${item.id}&game=totk" class="compendium-card">
            <img src="${item.image}" alt="${item.name}" />
            <h2>${item.name}</h2>
        </a>
    `).join("");

    fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all?game=totk")
        .then(res => res.json())
        .then(data => {
            const all = new Set();
            data.data.forEach(item => item.common_locations?.forEach(loc => all.add(loc)));
            console.log(JSON.stringify(Array.from(all).sort(), null, 2));
        });
}

init();
