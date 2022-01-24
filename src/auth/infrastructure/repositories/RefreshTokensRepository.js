import axios from "axios";

export class RefreshTokensRepository {
  async getAll() {
    const res = await axios.get("refreshtokens");
    return res.data;
  }

  async deleteByIds(ids) {
    const res = await axios.delete("refreshtokens", { data: ids });
    return res.status === 204;
  }
}
