import { BaseUseCase } from "../../../shared/domain/BaseUseCase";
import {
  ListsRepository,
  ListItemsRepository,
} from "../../infrastructure/repositories";

export class UpdateListUseCase extends BaseUseCase {
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

    return new UpdateListUseCase({ listsRepository, listItemsRepository });
  }

  async execute(list) {
    const itemsToDeleteIndexes = [];

    for (const [index, item] of list.items.entries()) {
      if (item.state === "deleted") {
        await this._listItemsRepository.deleteById(list.id, item.id);
        itemsToDeleteIndexes.push(index);
      }
    }

    for (const index of itemsToDeleteIndexes) {
      list.items.splice(index, 1);
    }

    for (const item of list.items) {
      if (item.state === "modified" && item.id > 0) {
        await this._listItemsRepository.update(item);
        item.state = undefined;
      }
    }

    for (const item of list.items) {
      if (item.id < 0) {
        const result = await this._listItemsRepository.create(item);

        item.id = result.id;
      }
    }

    const ids = list.items.map((item) => item.id);
    const body = { ...list, idsByPosition: ids };

    await this._listsRepository.update(body);
  }
}
