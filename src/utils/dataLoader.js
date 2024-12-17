export async function loadKlaviyoData() {
  try {
    const response = await fetch('/src/sample_data/klavio.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading Klaviyo data:', error);
    return null;
  }
}