/*
Pattern: set an internal style to react to an HTML attribute.

Simple, fast, but it is moving CSS in the lightDOM into the HTML domain, as it is not possible to set HTML attributes *from* CSS.

make the
:host([--custom-attr="a"]){
  --inner-prop-a: 10px;
  --inner-prop-b: 20px;
}

#inner-el-a {
  font-size: var(--inner-prop-a);
}

#inner-el-b {
  font-size: var(--inner-prop-b);
}

*/


/*
## Why use styles for custom properties instead of HTML attributes?

One important motivation behind CSS in the first place was to enable the developers to separate form (CSS) from content (HTML).
By using CSS developers could group together the style descriptions for their applications, and
then in theory develop the style and content independently of each other.
It very, very rarely works this way in practice, as we all know, but still,
the ability to separate layout and style in CSS from content and data model structure in HTML is still very useful and beneficial.
It gives better overview, and lets the developers more easily "switch between cognitive contexts" when
they develop in CSS and HTML respectively.

CSS also gives you the ability to control styles and layout using declarative CSS rules.
Cascading rules.
This also simplifies changing between different styles depending on css classes and position of the elements in the DOM.
A.o.

If you use HTML attributes as custom CSS properties, you do not get any such separation.
Even though you can Query based on a css property, you cannot

You are in essence moving style settings from CSS and back into HTML.
We don't want that. That
*/

const evaluateStyle = Symbol("evaluateStyle");
const cachedStyles = Symbol("cachedStyles");

const observedElements = new Set();
let rafID = 0;

function poll(el) {
  observedElements.add(el);
  if (observedElements.size === 1)
    rafID = requestAnimationFrame(checkStyles);
}

function stopPoll(el) {
  observedElements.delete(el);
}

function checkStyles() {
  if (observedElements.size === 0)
    return cancelAnimationFrame(rafID);
  const processed = new Set();
  let el = findHighestUnprocessedElement(processed);
  while (el) {
    el[evaluateStyle](getComputedStyle(el));
    processed.add(el);
    el = findHighestUnprocessedElement(processed);
  }
  rafID = requestAnimationFrame(checkStyles);
}

function findHighestUnprocessedElement(processed) {
  let highestElement = null;
  let highestDocLevel = Infinity;
  for (let el of observedElements) {
    if (processed.has(el)) {
    } else if (highestElement === null) {
      highestElement = el;
      highestDocLevel = getElementDocLevel(el);
    } else {
      let nextLevel = getElementDocLevel(el);
      if (nextLevel < highestDocLevel) {
        highestElement = el;
        highestDocLevel = nextLevel;
      }
    }
  }
  return highestElement;
}

function getElementDocLevel(el){
  let level = 0;
  let root = el.getRootNode();
  while (!!root.host){
    level++;
    root = root.host.getRootNode();
  }
  return level;
}

export function StyleChangedMixin(Base) {
  return class StyleChangedMixin extends Base {

    constructor() {
      super();
      this[cachedStyles] = {};
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      poll(this);
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      stopPoll(this);
    }

    stopStyleCheck() {
      stopPoll(this);
    }

    startStyleCheck() {
      poll(this);
    }

    [evaluateStyle](newStyle) {
      for (let prop of this.constructor.observedStyles) {
        const newValue = newStyle.getPropertyValue(prop).trim();
        const oldValue = this[cachedStyles][prop] || "";
        if (newValue !== oldValue) {
          this[cachedStyles][prop] = newValue;
          this.styleChangedCallback(prop, newValue, oldValue);
        }
      }
    }
  };
}