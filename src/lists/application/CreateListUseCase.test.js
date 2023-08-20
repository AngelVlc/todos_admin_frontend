import { CreateListUseCase } from ".";
import { List, ListItem } from "../domain";

describe("CreateListUseCase", () => {
  describe("#execute", () => {
    it("creates a list with its items", async () => {
      const fakeListsRepository = {
        create: jest.fn(),
      };

      fakeListsRepository.create.mockResolvedValue({
        id: 15,
      });

      const useCase = new CreateListUseCase({
        listsRepository: fakeListsRepository,
      });

      const list = {
        id: -1,
        name: "list",
        items: [{ title: "title" }],
      };

      const result = await useCase.execute(list);

      expect(fakeListsRepository.create.mock.calls[0][0]).toStrictEqual(list);
      expect(result).toStrictEqual({ id: 15 });
    });
  });
});
