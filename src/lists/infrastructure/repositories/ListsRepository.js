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

  async create(list) {
    const res = await axios.post("lists", list);

    if (res.status === 201) {
      return res.data;
    }
  }

  async update(list) {
    const res = await axios.patch(`lists/${list.id}`, list);

    if (res.status === 200) {
      return res.data;
    }
  }
}
