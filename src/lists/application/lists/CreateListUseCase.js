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
    const result = await this._listsRepository.create(list);
    const savedList = new List(result);

    for(const item of list.items) {
      const savedListItem = await this._listItemsRepository.create({
        ...item,
        listId: savedList.id,
      });

      savedList.items.push(new ListItem(savedListItem));
    };

    return savedList;
  }
}
