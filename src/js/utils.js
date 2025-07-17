export async function loadPartial(selector, url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
  }
}

export function hamburger() {
    const hamburgerBtn = document.querySelector(".hamburger");
    const navList = document.querySelector(".main-nav ul");
    hamburgerBtn.addEventListener("click", () => {
      navList.classList.toggle("show");
      if (navList.classList.contains("show")) {
        hamburgerBtn.innerHTML = "&#9783;"
      
      } else {
          hamburgerBtn.innerHTML = "&#9776;"
        console.log("Menu closed");
      }
    });

}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function setupFilterToggle() {
    const menuIcon = document.querySelector(".menu-icon");
    const filters = document.querySelector(".filters");

    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("open");
        filters.classList.toggle("open");
        if (menuIcon.classList.contains("open")){
            menuIcon.textContent = "Hide Filters";
        } else {
            menuIcon.textContent = "Show Filters"
        }
    });


}

