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
}
