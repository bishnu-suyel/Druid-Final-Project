import axios from "axios";

const API_URL = "http://localhost:51431/jsonapi/";

export const fetchContent = async (contentType) => {
  const response = await axios.get(`${API_URL}/${contentType}`);
  return response.data;
};
