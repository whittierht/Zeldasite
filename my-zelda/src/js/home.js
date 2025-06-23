import { loadPartial } from "./utils.js";
import { hamburger } from "./utils.js";

async function init() {
  await loadPartial(".myheader", "./partials/header.html");
  await loadPartial(".myfooter", "./partials/footer.html");
  hamburger();
}

init();
