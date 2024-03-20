const BASE_URL = "http://localhost:3030/api";

class PostApi {
  getAllPosts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/post/getallpost`, { method: "GET" });
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

  getPostsByAuthor = async () => {
    try {
      const response = await fetch(`${BASE_URL}/post/getpostbyauthor`, { method: "GET" });
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

export default PostApi = new PostApi();
