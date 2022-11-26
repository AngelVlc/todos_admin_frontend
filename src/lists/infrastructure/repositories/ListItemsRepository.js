import axios from "axios";

export class ListItemsRepository {
  async getById(listId, itemId) {
    const res = await axios.get(`lists/${listId}/items/${itemId}`);

    return res.data;
  }

  async deleteById(listId, itemId) {
    const res = await axios.delete(`lists/${listId}/items/${itemId}`);

    return res.status === 204;
  }

  async getAll(listId) {
    const res = await axios.get(`lists/${listId}/items`);

    return res.data;
  }

  async create(listItem) {
    const res = await axios.post(`lists/${listItem.listId}/items`, listItem);

    if (res.status === 201) {
      return res.data;
    }
  }

  async update(listItem) {
    const res = await axios.patch(`lists/${listItem.listId}/items/${listItem.id}`, listItem);

    if (res.status === 200) {
      return res.data;
    }
  }
}
