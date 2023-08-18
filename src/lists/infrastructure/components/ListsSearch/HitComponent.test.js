import { render, cleanup } from "@testing-library/react";
import { HitComponent } from "./HitComponent";

describe("HitComponent", () => {
  const renderComponent = (hit) => {
    return {
      ...render(<HitComponent hit={hit} />),
    };
  };

  afterEach(cleanup);

  it("should match the snapshot", () => {
    const hit = {
      userID: 1,
      name: "listname",
      itemsTitles: ["title"],
      itemsDescriptions: ["description"],
      objectID: "20",
      _highlightResult: {
        userID: {
          value: "1",
          matchLevel: "none",
          matchedWords: [],
        },
        name: {
          value: "<mark>list</mark>name",
          matchLevel: "full",
          fullyHighlighted: false,
          matchedWords: ["list"],
        },
        itemsTitles: [{ value: "title", matchLevel: "none", matchedWords: [] }],
        itemsDescriptions: [
          { value: "description", matchLevel: "none", matchedWords: [] },
        ],
      },
      __position: 1,
    };

    const { asFragment } = renderComponent(hit);

    expect(asFragment()).toMatchSnapshot();
  });
});
