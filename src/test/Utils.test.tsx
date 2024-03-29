import Utils from "../Utils";

test("Util test: format float", () => {
    expect(Utils.formatFloat(3.1415926, 3)).toBe("3.142");
    expect(Utils.formatFloat(2.7182818, 5)).toBe("2.71828");
});

test("Util test: move the items to the first in the array", () => {
    expect(JSON.stringify(Utils.itemMoveToFirst(3, ["a", true, 1234, "Hello", null])))
        .toBe(JSON.stringify(["a", true, 1234, null, "Hello"]));
});

test("Util test: array deduplicate", () => {
    const testArray = [0, 1, 1, 0, 2, 3, 4, 5, 5, 5, 5, 5];
    
    expect(Utils.arrayDeduplicate(testArray)).toStrictEqual([0, 1, 2, 3, 4, 5]);
});
