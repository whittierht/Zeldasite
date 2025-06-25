import { loadPartial, hamburger } from "./utils.js";


async function init() {
  await loadPartial(".myheader", "/partials/header.html");
  await loadPartial(".myfooter", "/partials/footer.html");
  hamburger();
}

init();
