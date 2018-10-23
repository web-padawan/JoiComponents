import {parseHashDots} from "../../src/router/HashDot.js";

describe("parseHashDot", function () {
  it("basic test: #omg.what.is.'this?!#...#'#wtf#OMG123.123", function () {

    const test = "#omg.what.is.'this?!#...#'#wtf#OMG123.123";
    let res = parseHashDots(test);
    expect(res.map).to.deep.equal({
      omg: ["what", "is", "'this?!#...#'"],
      wtf: [],
      OMG123: ["123"],
    });
    expect(res.tree).to.deep.equal([
      {
        keyword: "omg",
        signature: "omg/3",
        arguments: ["what", "is", "'this?!#...#'"],
        argumentTypes: [".", ".", "."],
        argumentString: ".what.is.'this?!#...#'"
      }, {
        keyword: "wtf",
        signature: "wtf/0",
        arguments: [],
        argumentTypes: [],
        argumentString: ""
      }, {
        keyword: "OMG123",
        signature: "OMG123/1",
        arguments: ["123"],
        argumentTypes: ["."],
        argumentString: ".123"
      }
    ]);
  });
});
