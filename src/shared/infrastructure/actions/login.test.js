import { userLoggedIn, userLoggedOut } from ".";

describe("#userLoggedIn", () => {
  it("should generate user logged in action", () => {
    const action = userLoggedIn({
      userName: "name",
      userId: 11,
      isAdmin: true,
    });

    expect(action).toEqual({
      type: "USER_LOGGED_IN",
      authInfo: {
        userName: "name",
        userId: 11,
        isAdmin: true,
      },
    });
  });
});

describe("#userLoggedOut", () => {
  it("should generate user logged out action", () => {
    const action = userLoggedOut();

    expect(action).toEqual({
      type: "USER_LOGGED_OUT",
    });
  });
});
