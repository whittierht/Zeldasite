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
    });

}

