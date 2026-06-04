const multiply = require("../../src/utils/multiply");

describe("multiply", () => {
  it("returns the product of two positive numbers", () => {
    expect(multiply(2, 3)).toBe(6);
  });

  it("returns 0 when one value is 0", () => {
    expect(multiply(0, 8)).toBe(0);
  });

  it("supports negative numbers", () => {
    expect(multiply(-2, 4)).toBe(-8);
  });
});