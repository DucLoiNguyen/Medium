const BASE_URL = "http://localhost:3030/api";

class TopicApi {
  getAllTopics = async () => {
    try {
      const response = await fetch(`${BASE_URL}/topic/getalltopic`, { method: "GET" });
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

  getAllTags = async () => {
    try {
      const response = await fetch(`${BASE_URL}/topic/getalltag`, { method: "GET" });
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
}

export default TopicApi = new TopicApi();