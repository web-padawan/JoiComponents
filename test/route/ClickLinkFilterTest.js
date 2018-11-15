import {highjackLink, getBaseHref} from "../../src/router/HashDotRouter.js";

function createA(attributes) {
  const a = document.createElement("a");
  for (let key of Object.keys(attributes))
    a.setAttribute(key, attributes[key]);
  return a;
}

function click(a, detail) {
  const event = new MouseEvent("click1", Object.assign({}, {bubbles: true, cancelable: true}, detail));
  a.dispatchEvent(event);
}

describe("HighjackLink tests", () => {

  it("Normal links within the base are not skipped", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      assert(result.endsWith("/abc"));
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: "abc"});
    document.body.appendChild(element);
    click(element, {href: "abc"});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("e.button", function (done) {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({});
    document.body.appendChild(element);
    click(element, {button: 1});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("e.metaKey", function (done) {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({});
    document.body.appendChild(element);
    click(element, {metaKey: true});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("e.ctrlKey", function (done) {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({});
    document.body.appendChild(element);
    click(element, {ctrlKey: true});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("e.shiftKey", function (done) {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({});
    document.body.appendChild(element);
    click(element, {shiftKey: true});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("e.defaultPrevented", function (done) {
    const listener = e => {
      e.preventDefault();
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: "abc"});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("download attribute", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({download: "url"});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("rel='external'", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({rel: "external"});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("Href starts with a #", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: "#abc"});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });

  it("Href starts with a mailto:", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: "mailto:abc"});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });
// Does not work
  it("Empty href", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: " "});
    document.body.appendChild(element);
    click(element, {});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });
  it("Object href", (done) => {
    const listener = e => {
      const result = highjackLink(e, getBaseHref());
      expect(result).to.be.equal(undefined);
      done();
    };
    window.addEventListener("click1", listener);
    const element = createA({href: {}});
    document.body.appendChild(element);
    click(element, {suka: SVGAnimatedString});
    document.body.removeChild(element);
    window.removeEventListener("click1", listener);
  });
});
