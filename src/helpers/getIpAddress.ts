import axios from "axios";
const geoLocationKey = process.env.NEXT_PUBLIC_GEO_LOCATION_KEY;
export const getIpAndLocation = async () => {
  try {
    const response = await axios.get(
      `https://geolocation-db.com/json/${geoLocationKey}`,
    );
    return response.data;
  } catch (error) {}
};
