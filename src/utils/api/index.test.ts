import { objectToQueryString } from ".";

it("key, value로 이루어진 객체를 올바른 형태의 쿼리스트링으로 변환할 수 있다.", () => {
  const obj = {
    test: "a",
    test2: 1,
    test3: undefined,
  };

  const obj2 = undefined;

  expect(objectToQueryString(obj)).toEqual(`?test=a&test2=1`);
  expect(objectToQueryString(obj2)).toEqual("?");
});
