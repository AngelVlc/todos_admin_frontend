export class UseCaseFactory {
  get(useCase) {
    return useCase.create();
  }
}
