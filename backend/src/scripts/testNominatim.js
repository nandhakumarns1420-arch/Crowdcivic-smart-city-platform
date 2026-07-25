import axios from 'axios';

const testNominatim = async () => {
  console.log("--- Testing Nominatim API for 'Mylapore' ---");
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('Mylapore')}&countrycodes=in&limit=5`,
      {
        headers: {
          'User-Agent': 'CrowdCivic-Test'
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      console.log(`Success! Found ${response.data.length} results.`);
      const first = response.data[0];
      console.log(`First Result: ${first.display_name}`);
      console.log(`Coordinates: Lat ${first.lat}, Lon ${first.lon}`);
      
      if (first.display_name.includes('India')) {
        console.log("Verified: Result is in India.");
      }
      if (first.display_name.includes('Tamil Nadu')) {
        console.log("Verified: Result is in Tamil Nadu.");
      }
    } else {
      console.error("No results found for 'Mylapore'");
    }
  } catch (error) {
    console.error("API Call Failed:", error.message);
  }
};

testNominatim();
