import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { List } from "../../domain";
import { ListsRepository, ListItemsRepository } from "../../infrastructure/repositories";

export class GetListByIdWithItemsUseCase extends BaseUseCase {
  _listsRepository;
  _listItemsRepository;

  constructor({ listsRepository, listItemsRepository }) {
    super();

    this._listsRepository = listsRepository;
    this._listItemsRepository = listItemsRepository;
  }

  static create() {
    const listsRepository = new ListsRepository();
    const listItemsRepository = new ListItemsRepository();

    return new GetListByIdWithItemsUseCase({ listsRepository, listItemsRepository });
  }

  async execute(id) {
    const getListResult = await this._listsRepository.getById(id);
    const getListItemsResult = await this._listItemsRepository.getAllByListId(id)

    return new List({...getListResult, items: getListItemsResult});
  }
}
