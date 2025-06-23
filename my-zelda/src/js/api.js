const API_URL = "https://botw-compendium.herokuapp.com/api/v3/compendium/all";

export async function getAllCompendium() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error("Failed to fetch compendium:", err);
        return [];
    }
}