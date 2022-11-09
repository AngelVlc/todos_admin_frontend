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
    const result = await this._listsRepository.getById(id);
    const list = new List(result);
    list.items = await this._listItemsRepository.getAll(id);

    return list;
  }
}
