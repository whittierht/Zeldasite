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