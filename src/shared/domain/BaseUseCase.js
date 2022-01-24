export class BaseUseCase {
  static create() {
    throw new Error('[UseCase.create] should be implemented')
  }

  execute() {
    throw new Error('[UseCase#execute] should be implemented')
  }
}