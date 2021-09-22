const api_key = 'fUwiBPvvBwZXfky5QXVrVsSlOmRHlLQXnnZv03dI'

async function get(url){
  const fetchResponse = await fetch(url)
  let data = await fetchResponse.json();
  if (!fetchResponse.ok) throw data;
  return data;
}

export async function getManifest(rover){
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=${api_key}`
  const data = await get(url)
  return data;
}

export async function getPhotosBySol(rover, sol){
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${api_key}`
  const data = await get(url)
  return data;
}