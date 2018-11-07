import {HashDotMap} from "./HashDot.js";

export class HashDotsRouter {
  constructor(routes) {
    this.routes = {};
    this.rules = new HashDotMap(routes);
    window.addEventListener("hashchange", () => this._onHashchange());
    requestAnimationFrame(() => this._onHashchange());                    //startup routechange event at first rAF
  }

  _onHashchange() {
    if (this.routes.rootLink === window.location.hash)
      return;
    const newRoute = this.rules.interpret(window.location.hash);
    if (this.routes.rootLink !== newRoute.rootLink)
      window.dispatchEvent(new CustomEvent("routechange", {detail: this.routes = newRoute}));
    if (newRoute.rootLink !== window.location.hash)
      window.location.hash = newRoute.rootLink;
  }
}

export class SlashDotsRouter {
  constructor(routes) {
    this.routes = {};
    this.rules = new HashDotMap(routes);
    window.addEventListener("click", (ev) => {
      const base = getBaseHref();
      let filteredClick = highjackLink(ev, base);
      if (filteredClick)
        this._routeClick(filteredClick, base);
    });
    window.addEventListener("popstate", (ev) => this._routeClick(window.location.href, getBaseHref()));
    requestAnimationFrame(() => this._routeClick(window.location.href, getBaseHref()));   //startup routechange event at first rAF
  }

  makeAbsolute(link) {
    const url = new URL(link, document.baseURI).toString();
    return url.substr(document.baseURI.toString().length - 1);
  }

  _routeClick(full, base) {
    debugger;
    let link = full.substr(base.length-1);
    if (this.routes.rootLink === link)
      return;
    const newRoute = this.rules.interpret(link);
    if (this.routes.rootLink !== newRoute.rootLink)
      window.dispatchEvent(new CustomEvent("routechange", {detail: this.routes = newRoute}));
    const newFull = base.substr(0, base.length-1) + newRoute.rootLink;
    if (window.location.href !== newFull) {
      history.pushState(undefined, undefined, newFull);
    }
  }
}

//In IE, neither URL nor document.baseURI is used. IE falls back to creating an a-tag in ie.
//https://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
function qualifyURL(url) {
  if (URL)
    return new URL(url, document.baseURI).href;
  var a = document.createElement('a');
  a.href = url;
  return a.cloneNode(false).href;
}

function getBaseHref(){
  debugger;
  if (document.baseURI)
    return document.baseURI.substring(0, document.baseURI.lastIndexOf("/")+1);
  var base = document.querySelector('base');
  if (base)
    return base.href;
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

/**
 *
 * @param e
 * @returns {string} link as seen from the base when highjacked, otherwise undefined
 */
function highjackLink(e, base) {
  //1. skip all non-left single clicks
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)
    return;

  for (let el = e.target; el; el = el.parentNode) {                 //IE and Edge does not support composedPath()
    //2. find the first <a href> in the event path
    if (el.nodeName !== "A" && el.nodeName !== "a")
      continue;
    //3a. skip 'download' and 'external'.
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external')
      return;
    let link = ((typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString') ?
      el.href.baseVal :
      el.getAttribute('href');
    //3b. skip '#...', 'mailto:...' and '' (empty)
    if (link.startsWith("#") || link.startsWith('mailto:') || "")
      return;

    //3c. skip x-origins
    let url = qualifyURL(link);
    if(!url.startsWith(base))
      return;
    e.preventDefault();
    return url;
  }
}