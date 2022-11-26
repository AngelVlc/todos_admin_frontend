import axios from "axios";

export class UsersRepository {
  async getById(id) {
    const res = await axios.get(`users/${id}`);

    return res.data;
  }

  async deleteById(id) {
    const res = await axios.delete(`users/${id}`);

    return res.status === 204;
  }

  async getAll() {
    const res = await axios.get("users");

    return res.data;
  }

  async create(user) {
    const res = await axios.post("users", user);

    if (res.status === 201) {
      return res.data;
    }
  }

  async update(user) {
    const res = await axios.patch(`users/${user.id}`, user);

    if (res.status === 200) {
      return res.data;
    }
  }
}
