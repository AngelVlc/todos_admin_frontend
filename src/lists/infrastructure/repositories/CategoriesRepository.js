import axios from "axios";

export class CategoriesRepository {
  async getById(id) {
    const res = await axios.get(`categories/${id}`);

    return res.data;
  }

  async deleteById(id) {
    const res = await axios.delete(`categories/${id}`);

    return res.status === 204;
  }

  async getAll() {
    const res = await axios.get("categories");

    return res.data;
  }

  async create(category) {
    const res = await axios.post("categories", category);

    if (res.status === 201) {
      return res.data;
    }
  }

  async update(category) {
    const res = await axios.patch(`categories/${category.id}`, category);

    if (res.status === 200) {
      return res.data;
    }
  }
}
