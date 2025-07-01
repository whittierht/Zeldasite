const BASE_URL = "https://botw-compendium.herokuapp.com/api/v3/compendium/all";

export async function getAllCompendium(game = "botw") {
  try {
    const url = `${BASE_URL}?game=${game}`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Failed to fetch compendium:", err);
    return [];
  }
}

export async function getAllBOTW() {
  return await getAllCompendium("botw");
}

export async function getAllTOTK() {
  return await getAllCompendium("totk");
}