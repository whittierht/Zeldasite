const BASE_URL = "https://botw-compendium.herokuapp.com/api/v3/compendium";

export async function getAllCompendium() {
  try {
    const [botwRes, totkRes] = await Promise.all([
      fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all"),
      fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all?game=totk")
    ]);

    const [botwJson, totkJson] = await Promise.all([
      botwRes.json(),
      totkRes.json()
    ]);

    const botwItems = botwJson.data.map(item => ({ ...item, game: "botw" }));
    const totkItems = totkJson.data.map(item => ({ ...item, game: "totk" }));

    return [...botwItems, ...totkItems];
  } catch (err) {
    console.error("Failed to fetch compendium:", err);
    return [];
  }
}

export async function getAllBOTW() {
  const res = await fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all");
  const json = await res.json();
  return json.data.map(item => ({ ...item, game: "botw" }));
}

export async function getAllTOTK() {
  const res = await fetch("https://botw-compendium.herokuapp.com/api/v3/compendium/all?game=totk");
  const json = await res.json();
  return json.data.map(item => ({ ...item, game: "totk" }));
}