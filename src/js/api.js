const API_URL = "https://botw-compendium.herokuapp.com/api/v3/compendium/all";
const BOTW_URL = `${API_URL}?game=botw`;
const TOTK_URL = `${API_URL}?game=totk`;


export async function getAllCompendium() {
  try {
    const res  = await fetch(API_URL);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Failed to fetch compendium:", err);
    return [];
  }
}

export async function getAllBOTW() {
  try {
    const res  = await fetch(BOTW_URL);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Failed to fetch BOTW entries:", err);
    return [];
  }
}

export async function getAllTOTK() {
  try {
    const res  = await fetch(TOTK_URL);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("Failed to fetch TOTK entries:", err);
    return [];
  }
}
