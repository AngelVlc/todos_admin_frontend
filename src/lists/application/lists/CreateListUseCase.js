import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import { List, ListItem } from "../../domain";
import {
  ListsRepository,
  ListItemsRepository,
} from "../../infrastructure/repositories";

export class CreateListUseCase extends BaseUseCase {
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

    return new CreateListUseCase({ listsRepository, listItemsRepository });
  }

  async execute(list) {
    const createListResult = await this._listsRepository.create(list);

    const items = [];

    for (const item of list.items) {
      const createListItemResult = await this._listItemsRepository.create({
        ...item,
        listId: createListResult.id,
      });

      items.push(new ListItem(createListItemResult));
    }

    return new List({ ...createListResult, items });
  }
}
