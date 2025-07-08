export function setupFilters(allItems, renderCallback) {
    const azBtn = document.querySelector(".az-filter");
    const zaBtn = document.querySelector(".za-filter");
    const equipmentBtn = document.querySelector(".equipment-filter");
    const materialsBtn = document.querySelector(".materials-filter");
    const monstersBtn = document.querySelector(".monsters-filter");
    const creaturesBtn = document.querySelector(".creatures-filter");
    const header =  document.querySelector(".compendium-header");
    const baseTitle = header.textContent;

    const allButtons = [azBtn, zaBtn, equipmentBtn, materialsBtn, monstersBtn, creaturesBtn];

     function clearActive() {
        allButtons.forEach(btn => btn?.classList.remove("active"));
    }

    azBtn?.addEventListener("click", () => {
        const sorted = [...allItems].sort((a, b) => a.name.localeCompare(b.name));
        renderCallback(sorted);
        header.textContent = `${baseTitle} - A to Z`;
        clearActive();
        azBtn.classList.add("active");
    });

    zaBtn?.addEventListener("click", () => {
        const sorted = [...allItems].sort((a, b) => b.name.localeCompare(a.name));
        renderCallback(sorted);
        header.textContent = `${baseTitle} - Z to A`;
        clearActive();
        zaBtn.classList.add("active");
    });

    equipmentBtn?.addEventListener("click", () => {
        const filtered = allItems.filter(item => item.category?.toLowerCase() === "equipment");
        renderCallback(filtered);
        header.textContent = `${baseTitle} - Equipment`;
        clearActive();
        equipmentBtn.classList.add("active");
    });

    materialsBtn?.addEventListener("click", () => {
        const filtered = allItems.filter(item => item.category?.toLowerCase() === "materials");
        renderCallback(filtered);
        header.textContent = `${baseTitle} - Materials`;
        clearActive();
        materialsBtn.classList.add("active");
    });

    monstersBtn?.addEventListener("click", () => {
        const filtered = allItems.filter(item => item.category?.toLowerCase() === "monsters");
        renderCallback(filtered);
        header.textContent = `${baseTitle} - Monsters`;
        clearActive();
        monstersBtn.classList.add("active");
    });

    creaturesBtn?.addEventListener("click", () => {
        const filtered = allItems.filter(item => item.category?.toLowerCase() === "creatures");
        renderCallback(filtered);
        header.textContent = `${baseTitle} - Creatures`;clearActive();
        creaturesBtn.classList.add("active");
    });
}
