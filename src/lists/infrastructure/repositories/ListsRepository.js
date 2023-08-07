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
    const listToSend = JSON.parse(JSON.stringify(list));
    for (const item of listToSend.items) {
      if (item.id < 0) {
        delete item.id;
      }
    }

    const res = await axios.post("lists", listToSend);

    if (res.status === 201) {
      return res.data;
    }
  }

  async update(list) {
    const listToSend = JSON.parse(JSON.stringify(list));
    for (const item of listToSend.items) {
      if (item.id < 0) {
        delete item.id;
      }
    }

    const res = await axios.patch(`lists/${list.id}`, listToSend);

    if (res.status === 200) {
      return res.data;
    }
  }

  async moveListItem(originListId, itemId, destinationListId) {
    const body = {
      originListItemId: itemId,
      destinationListItemId: destinationListId
    }

    const res = await axios.post(`lists/${originListId}/move-item`, body);

    return res.status === 200;
  }
}
