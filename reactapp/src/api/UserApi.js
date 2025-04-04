const BASE_URL = "http://localhost:3030/api";

class UserApi {
  getAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/getalluser`, { method: "GET" }, {});
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

export default UserApi = new UserApi();