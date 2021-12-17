import timeSince from "./time-since";

describe("timeSince", () => {
  it("should correctly return the time since a date", () => {
    expect(timeSince(new Date())).toEqual("a moment ago");

    expect(timeSince(new Date(new Date().getTime() - 1 * 60000))).toEqual(
      "1 minute ago"
    );

    expect(timeSince(new Date(new Date().getTime() - 3 * 60000))).toEqual(
      "3 minutes ago"
    );

    expect(timeSince(new Date(new Date().getTime() - 60 * 60000))).toEqual(
      "1 hour ago"
    );

    expect(timeSince(new Date(new Date().getTime() - 5 * 60 * 60000))).toEqual(
      "5 hours ago"
    );

    expect(timeSince(new Date(new Date().getTime() - 24 * 60 * 60000))).toEqual(
      "1 day ago"
    );

    expect(
      timeSince(new Date(new Date().getTime() - 6 * 24 * 60 * 60000))
    ).toEqual("6 days ago");

    expect(
      timeSince(new Date(new Date().getTime() - 31 * 24 * 60 * 60000))
    ).toEqual("1 month ago");

    expect(
      timeSince(new Date(new Date().getTime() - 3 * 31 * 24 * 60 * 60000))
    ).toEqual("3 months ago");

    expect(
      timeSince(new Date(new Date().getTime() - 365 * 24 * 60 * 60000))
    ).toEqual("1 year ago");

    expect(
      timeSince(new Date(new Date().getTime() - 4 * 365 * 24 * 60 * 60000))
    ).toEqual("4 years ago");
  });
});
