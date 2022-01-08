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
}
