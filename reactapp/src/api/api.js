const BASE_URL = "http://localhost:3030"; // Thay đổi URL dựa trên API của bạn

export const getPosts = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: "GET" });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
