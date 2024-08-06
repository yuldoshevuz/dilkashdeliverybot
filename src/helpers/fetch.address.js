import axios from "axios"
import randomUserAgent from "random-useragent"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchLocationAddress = async (latitude, longitude) => {
    const maxAttempts = 10;
    let attempts = 0;

    while(attempts < maxAttempts) {
        const userAgent = randomUserAgent.getRandom()
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse.php", {
            params: {
                lat: latitude,
                lon: longitude,
                zoom: 18,
                format: "jsonv2"
            },
            headers: { "User-Agent": userAgent }
        }).catch(() => null);
        
        const locationData = response?.data;

        if (locationData && locationData.display_name) {
            return {
                address: locationData.display_name,
                latitude,
                longitude
            }
        }

        attempts++
        await sleep(500)
    }

    return null
}

export default fetchLocationAddress