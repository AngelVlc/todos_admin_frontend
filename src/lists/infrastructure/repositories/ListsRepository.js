import axios from "axios";

export class ListsRepository {
  async getById(id) {
    const res = await axios.get(`lists/${id}`);

    return res.data;
  }

  async deleteById(id) {
    const res = await axios.delete(`lists/${id}`);

    return res.status === 204;
  }

  async getAll() {
    const res = await axios.get("lists");

    return res.data;
  }
}
