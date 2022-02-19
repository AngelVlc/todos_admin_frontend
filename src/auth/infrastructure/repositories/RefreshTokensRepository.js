import axios from "axios";

export class RefreshTokensRepository {
  async getAll({ pageNumber, pageSize, sortColumn, sortOrder }) {
    const res = await axios.get(
      `refreshtokens?page=${pageNumber}&page_size=${pageSize}&sort=${sortColumn}&order=${sortOrder}`
    );

    return res.data;
  }

  async deleteByIds(ids) {
    const res = await axios.delete("refreshtokens", { data: ids });

    return res.status === 204;
  }
}
