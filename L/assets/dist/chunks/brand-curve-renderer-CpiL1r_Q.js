import { t as __vitePreload } from "./preload-helper-DHlaQ_oz.js";
//#region node_modules/split-type/dist/index.js
/**
* SplitType
* https://github.com/lukePeavey/SplitType
* @version 0.3.4
* @author Luke Peavey <lwpeavey@gmail.com>
*/
(function() {
  function append() {
    var length = arguments.length;
    for (var i = 0; i < length; i++) {
      var node = i < 0 || arguments.length <= i ? void 0 : arguments[i];
      if (node.nodeType === 1 || node.nodeType === 11) this.appendChild(node);
      else this.appendChild(document.createTextNode(String(node)));
    }
  }
  function replaceChildren() {
    while (this.lastChild) this.removeChild(this.lastChild);
    if (arguments.length) this.append.apply(this, arguments);
  }
  function replaceWith() {
    var parent = this.parentNode;
    for (var _len = arguments.length, nodes = new Array(_len), _key = 0; _key < _len; _key++) nodes[_key] = arguments[_key];
    var i = nodes.length;
    if (!parent) return;
    if (!i) parent.removeChild(this);
    while (i--) {
      var node = nodes[i];
      if (typeof node !== "object") node = this.ownerDocument.createTextNode(node);
      else if (node.parentNode) node.parentNode.removeChild(node);
      if (!i) parent.replaceChild(node, this);
      else parent.insertBefore(this.previousSibling, node);
    }
  }
  if (typeof Element !== "undefined") {
    if (!Element.prototype.append) {
      Element.prototype.append = append;
      DocumentFragment.prototype.append = append;
    }
    if (!Element.prototype.replaceChildren) {
      Element.prototype.replaceChildren = replaceChildren;
      DocumentFragment.prototype.replaceChildren = replaceChildren;
    }
    if (!Element.prototype.replaceWith) {
      Element.prototype.replaceWith = replaceWith;
      DocumentFragment.prototype.replaceWith = replaceWith;
    }
  }
})();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) Object.defineProperty(obj, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
  else obj[key] = value;
  return obj;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
    else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
/**
* Shallow merges the properties of an object with the target object. Only
* includes properties that exist on the target object. Non-writable properties
* on the target object will not be over-written.
*
* @param {Object} target
* @param {Object} object
*/
function extend(target, object) {
  return Object.getOwnPropertyNames(Object(target)).reduce(function(extended, key) {
    var currentValue = Object.getOwnPropertyDescriptor(Object(target), key);
    var newValue = Object.getOwnPropertyDescriptor(Object(object), key);
    return Object.defineProperty(extended, key, newValue || currentValue);
  }, {});
}
/**
* Checks if given value is a string
*
* @param {any} value
* @return {boolean} `true` if `value` is a string, else `false`
*/
function isString(value) {
  return typeof value === "string";
}
function isArray(value) {
  return Array.isArray(value);
}
/**
* Parses user supplied settings objects.
*/
function parseSettings() {
  var settings = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var object = extend(settings);
  var types;
  if (object.types !== void 0) types = object.types;
  else if (object.split !== void 0) types = object.split;
  if (types !== void 0) object.types = (isString(types) || isArray(types) ? String(types) : "").split(",").map(function(type) {
    return String(type).trim();
  }).filter(function(type) {
    return /((line)|(word)|(char))/i.test(type);
  });
  if (object.absolute || object.position) object.absolute = object.absolute || /absolute/.test(settings.position);
  return object;
}
/**
* Takes a list of `types` and returns an object
*
* @param {string | string[]} value a comma separated list of split types
* @return {{lines: boolean, words: boolean, chars: boolean}}
*/
function parseTypes(value) {
  var types = isString(value) || isArray(value) ? String(value) : "";
  return {
    none: !types,
    lines: /line/i.test(types),
    words: /word/i.test(types),
    chars: /char/i.test(types)
  };
}
/**
* Returns true if `value` is a non-null object.
* @param {any} value
* @return {boolean}
*/
function isObject(value) {
  return value !== null && typeof value === "object";
}
/**
* Returns true if `input` is one of the following:
* - `Element`
* - `Text`
* - `DocumentFragment`
*/
function isNode(input) {
  return isObject(input) && /^(1|3|11)$/.test(input.nodeType);
}
/**
* Checks if `value` is a valid array-like length.
* Original source: Lodash
*
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3)
* // => true
*
* _.isLength(Number.MIN_VALUE)
* // => false
*
* _.isLength(Infinity)
* // => false
*
* _.isLength('3')
* // => false
*/
function isLength(value) {
  return typeof value === "number" && value > -1 && value % 1 === 0;
}
/**
* Checks if `value` is an array-like object
* @param {any} value
* @return {boolean} true if `value` is array-like`, else `false`
* @example
* isArrayLike(new Array())
* // => true
*
* isArrayLike(document.querySelectorAll('div'))
* // => true
*
* isArrayLike(document.getElementsByTagName('div'))
* // => true
*
* isArrayLike(() => {})
* // => false
*
* isArrayLike({foo: 'bar'})
* // => false
*
* * isArrayLike(null)
* // => false
*/
function isArrayLike(value) {
  return isObject(value) && isLength(value.length);
}
/**
* Coerces `value` to an `Array`.
*
* @param {any} value
* @return {any[]}
* @example
* // If `value` is any `Array`, returns original `Array`
* let arr = [1, 2]
* toArray(arr)
* // => arr
*
* // If `value` is an `ArrayLike`, its equivalent to `Array.from(value)`
* let nodeList = document.querySelectorAll('div')
* toArray(nodeList)
* // => HTMLElement[] s
*
* // If value is falsy, returns empty array
* toArray(null)
* // => []
*
* // For any other type of value, its equivalent to `Array.of(value)`
* let element = document.createElement('div')
* toArray(element)
* // => [element]
*
*/
function toArray(value) {
  if (isArray(value)) return value;
  if (value == null) return [];
  return isArrayLike(value) ? Array.prototype.slice.call(value) : [value];
}
/**
* Processes target elements for the splitType function.
*
* @param {any} target Can be one of the following:
* 1. `string` - A css selector
* 2. `HTMLElement` - A single element
* 3. `NodeList` - A nodeList
* 4. `Element[]` - An array of elements
* 5. `Array<NodeList|Element[]>` - An nested array of elements
* @returns {Element[]} A flat array HTML elements
* @return A flat array of elements or empty array if no elements are found
*/
function getTargetElements(target) {
  var elements = target;
  if (isString(target)) if (/^(#[a-z]\w+)$/.test(target.trim())) elements = document.getElementById(target.trim().slice(1));
  else elements = document.querySelectorAll(target);
  return toArray(elements).reduce(function(result, element) {
    return [].concat(_toConsumableArray(result), _toConsumableArray(toArray(element).filter(isNode)));
  }, []);
}
var entries = Object.entries;
var expando = "_splittype";
var cache = {};
var uid = 0;
/**
* Stores data associated with DOM elements or other objects. This is a
* simplified version of jQuery's data method.
*
* @signature Data(owner)
* @description Get the data store object for the given owner.
* @param {Object} owner the object that data will be associated with.
* @return {Object} the data object for given `owner`. If no data exists
*     for the given object, creates a new data store and returns it.
*
* @signature Data(owner, key)
* @description Get the value
* @param {Object} owner
* @param {string} key
* @return {any} the value of the provided key. If key does not exist, returns
*     undefined.
*
* @signature Data(owner, key, value)
* @description Sets the given key/value pair in data store
* @param {Object} owner
* @param {string} key
* @param {any} value
*/
function set(owner, key, value) {
  if (!isObject(owner)) {
    console.warn("[data.set] owner is not an object");
    return null;
  }
  var id = owner[expando] || (owner[expando] = ++uid);
  var data = cache[id] || (cache[id] = {});
  if (value === void 0) {
    if (!!key && Object.getPrototypeOf(key) === Object.prototype) cache[id] = _objectSpread2(_objectSpread2({}, data), key);
  } else if (key !== void 0) data[key] = value;
  return value;
}
function get(owner, key) {
  var id = isObject(owner) ? owner[expando] : null;
  var data = id && cache[id] || {};
  if (key === void 0) return data;
  return data[key];
}
/**
* Remove all data associated with the given element
*/
function remove(element) {
  var id = element && element[expando];
  if (id) {
    delete element[id];
    delete cache[id];
  }
}
/**
* Clear all cached data
*/
function clear() {
  Object.keys(cache).forEach(function(key) {
    delete cache[key];
  });
}
/**
* Remove all temporary data from the store.
*/
function cleanup() {
  entries(cache).forEach(function(_ref) {
    var _ref2 = _slicedToArray(_ref, 2), id = _ref2[0], _ref2$ = _ref2[1], isRoot = _ref2$.isRoot, isSplit = _ref2$.isSplit;
    if (!isRoot || !isSplit) {
      cache[id] = null;
      delete cache[id];
    }
  });
}
/**
* Splits a string into an array of words.
*
* @param {string} string
* @param {string | RegExp} [separator = ' ']
* @return {string[]} Array of words
*/
function toWords(value) {
  var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " ";
  return (value ? String(value) : "").trim().replace(/\s+/g, " ").split(separator);
}
/**
* Based on lodash#split <https://lodash.com/license>
* Copyright jQuery Foundation and other contributors <https://jquery.org/>
* Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters &
* Editors
*/
var rsAstralRange = "\\ud800-\\udfff";
var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
var rsComboSymbolsRange = "\\u20d0-\\u20f0";
var rsVarRange = "\\ufe0e\\ufe0f";
/** Used to compose unicode capture groups. */
var rsAstral = "[".concat(rsAstralRange, "]");
var rsCombo = "[".concat(rsComboMarksRange).concat(rsComboSymbolsRange, "]");
var rsFitz = "\\ud83c[\\udffb-\\udfff]";
var rsModifier = "(?:".concat(rsCombo, "|").concat(rsFitz, ")");
var rsNonAstral = "[^".concat(rsAstralRange, "]");
var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
var rsZWJ = "\\u200d";
/** Used to compose unicode regexes. */
var reOptMod = "".concat(rsModifier, "?");
var rsOptVar = "[".concat(rsVarRange, "]?");
var rsOptJoin = "(?:" + rsZWJ + "(?:" + [
  rsNonAstral,
  rsRegional,
  rsSurrPair
].join("|") + ")" + rsOptVar + reOptMod + ")*";
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = "(?:".concat([
  "".concat(rsNonAstral).concat(rsCombo, "?"),
  rsCombo,
  rsRegional,
  rsSurrPair,
  rsAstral
].join("|"), "\n)");
/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp("".concat(rsFitz, "(?=").concat(rsFitz, ")|").concat(rsSymbol).concat(rsSeq), "g");
/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var unicodeRange = [
  rsZWJ,
  rsAstralRange,
  rsComboMarksRange,
  rsComboSymbolsRange,
  rsVarRange
];
var reHasUnicode = RegExp("[".concat(unicodeRange.join(""), "]"));
/**
* Converts an ASCII `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function asciiToArray(string) {
  return string.split("");
}
/**
* Checks if `string` contains Unicode symbols.
*
* @private
* @param {string} string The string to inspect.
* @returns {boolean} Returns `true` if a symbol is found, else `false`.
*/
function hasUnicode(string) {
  return reHasUnicode.test(string);
}
/**
* Converts a Unicode `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}
/**
* Converts `string` to an array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the converted array.
*/
function stringToArray(string) {
  return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
}
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values.
*
* @param {*} value The value to process.
* @returns {string} Returns the string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString(value) {
  return value == null ? "" : String(value);
}
/**
* Splits `string` into an array of characters. If `separator` is omitted,
* it behaves likes split.split('').
*
* Unlike native string.split(''), it can split strings that contain unicode
* characters like emojis and symbols.
*
* @param {string} [string=''] The string to split.
* @param {RegExp|string} [separator=''] The separator pattern to split by.
* @returns {Array} Returns the string segments.
* @example
* toChars('foo');
* // => ['f', 'o', 'o']
*
* toChars('foo bar');
* // => ["f", "o", "o", " ", "b", "a", "r"]
*
* toChars('f😀o');
* // => ['f', '😀', 'o']
*
* toChars('f-😀-o', /-/);
* // => ['f', '😀', 'o']
*
*/
function toChars(string) {
  var separator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  string = toString(string);
  if (string && isString(string)) {
    if (!separator && hasUnicode(string)) return stringToArray(string);
  }
  return string.split(separator);
}
/**
* Create an HTML element with the the given attributes
*
* attributes can include standard HTML attribute, as well as the following
* "special" properties:
*   - children: HTMLElement | ArrayLike<HTMLElement>
*   - textContent: string
*   - innerHTML: string
*
* @param {string} name
* @param  {Object} [attributes]
* @returns {HTMLElement}
*/
function createElement(name, attributes) {
  var element = document.createElement(name);
  if (!attributes) return element;
  Object.keys(attributes).forEach(function(attribute) {
    var rawValue = attributes[attribute];
    var value = isString(rawValue) ? rawValue.trim() : rawValue;
    if (value === null || value === "") return;
    if (attribute === "children") element.append.apply(element, _toConsumableArray(toArray(value)));
    else element.setAttribute(attribute, value);
  });
  return element;
}
var defaults = {
  splitClass: "",
  lineClass: "line",
  wordClass: "word",
  charClass: "char",
  types: [
    "lines",
    "words",
    "chars"
  ],
  absolute: false,
  tagName: "div"
};
/**
* Splits the text content of a single TextNode into words and/or characters.
*
* This functions gets called for every text node inside the target element. It
* replaces the text node with a document fragment containing the split text.
* Returns an array of the split word and character elements from this node.
*
* @param {TextNode} textNode
* @param {Object} settings
* @return {{words: Element[], chars: Element[]}}
*/
function splitWordsAndChars(textNode, settings) {
  settings = extend(defaults, settings);
  var types = parseTypes(settings.types);
  var TAG_NAME = settings.tagName;
  var VALUE = textNode.nodeValue;
  var splitText = document.createDocumentFragment();
  var words = [];
  var chars = [];
  if (/^\s/.test(VALUE)) splitText.append(" ");
  words = toWords(VALUE).reduce(function(result, WORD, idx, arr) {
    var wordElement;
    var characterElementsForCurrentWord;
    if (types.chars) characterElementsForCurrentWord = toChars(WORD).map(function(CHAR) {
      var characterElement = createElement(TAG_NAME, {
        "class": "".concat(settings.splitClass, " ").concat(settings.charClass),
        style: "display: inline-block;",
        children: CHAR
      });
      set(characterElement, "isChar", true);
      chars = [].concat(_toConsumableArray(chars), [characterElement]);
      return characterElement;
    });
    if (types.words || types.lines) {
      wordElement = createElement(TAG_NAME, {
        "class": "".concat(settings.wordClass, " ").concat(settings.splitClass),
        style: "display: inline-block; ".concat(types.words && settings.absolute ? "position: relative;" : ""),
        children: types.chars ? characterElementsForCurrentWord : WORD
      });
      set(wordElement, {
        isWord: true,
        isWordStart: true,
        isWordEnd: true
      });
      splitText.appendChild(wordElement);
    } else characterElementsForCurrentWord.forEach(function(characterElement) {
      splitText.appendChild(characterElement);
    });
    if (idx < arr.length - 1) splitText.append(" ");
    return types.words ? result.concat(wordElement) : result;
  }, []);
  if (/\s$/.test(VALUE)) splitText.append(" ");
  textNode.replaceWith(splitText);
  return {
    words,
    chars
  };
}
/**
* Splits the text content of a target element into words and/or characters.
* The function is recursive, it will also split the text content of any child
* elements into words/characters, while preserving the nested elements.
*
* @param {Node} node an HTML Element or Text Node
* @param {Object} setting splitType settings
*/
function split(node, settings) {
  var type = node.nodeType;
  var wordsAndChars = {
    words: [],
    chars: []
  };
  if (!/(1|3|11)/.test(type)) return wordsAndChars;
  if (type === 3 && /\S/.test(node.nodeValue)) return splitWordsAndChars(node, settings);
  var childNodes = toArray(node.childNodes);
  if (childNodes.length) {
    set(node, "isSplit", true);
    if (!get(node).isRoot) {
      node.style.display = "inline-block";
      node.style.position = "relative";
      var nextSibling = node.nextSibling;
      var prevSibling = node.previousSibling;
      var text = node.textContent || "";
      var textAfter = nextSibling ? nextSibling.textContent : " ";
      var textBefore = prevSibling ? prevSibling.textContent : " ";
      set(node, {
        isWordEnd: /\s$/.test(text) || /^\s/.test(textAfter),
        isWordStart: /^\s/.test(text) || /\s$/.test(textBefore)
      });
    }
  }
  return childNodes.reduce(function(result, child) {
    var _split = split(child, settings), words = _split.words, chars = _split.chars;
    return {
      words: [].concat(_toConsumableArray(result.words), _toConsumableArray(words)),
      chars: [].concat(_toConsumableArray(result.chars), _toConsumableArray(chars))
    };
  }, wordsAndChars);
}
/**
* Gets the height and position of an element relative to offset parent.
* Should be equivalent to offsetTop and offsetHeight, but with sub-pixel
* precision.
*
* TODO needs work
*/
function getPosition(node, isWord, settings, scrollPos) {
  if (!settings.absolute) return { top: isWord ? node.offsetTop : null };
  var parent = node.offsetParent;
  var _scrollPos = _slicedToArray(scrollPos, 2), scrollX = _scrollPos[0], scrollY = _scrollPos[1];
  var parentX = 0;
  var parentY = 0;
  if (parent && parent !== document.body) {
    var parentRect = parent.getBoundingClientRect();
    parentX = parentRect.x + scrollX;
    parentY = parentRect.y + scrollY;
  }
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height, x = _node$getBoundingClie.x;
  return {
    width,
    height,
    top: _node$getBoundingClie.y + scrollY - parentY,
    left: x + scrollX - parentX
  };
}
/**
* Recursively "un-splits" text into words.
* This is used when splitting text into lines but not words.
* We initially split the text into words so we can maintain the correct line
* breaks. Once text has been split into lines, we "un-split" the words...
* @param {Element}
* @return {void}
*/
function unSplitWords(element) {
  if (!get(element).isWord) toArray(element.children).forEach(function(child) {
    return unSplitWords(child);
  });
  else {
    remove(element);
    element.replaceWith.apply(element, _toConsumableArray(element.childNodes));
  }
}
var createFragment = function createFragment() {
  return document.createDocumentFragment();
};
function repositionAfterSplit(element, settings, scrollPos) {
  var types = parseTypes(settings.types);
  var TAG_NAME = settings.tagName;
  var nodes = element.getElementsByTagName("*");
  var wordsInEachLine = [];
  var wordsInCurrentLine = [];
  var lineOffsetY = null;
  var elementHeight;
  var elementWidth;
  var contentBox;
  var lines = [];
  /**------------------------------------------------
  ** GET STYLES AND POSITIONS
  **-----------------------------------------------*/
  var parent = element.parentElement;
  var nextSibling = element.nextElementSibling;
  var splitText = createFragment();
  var cs = window.getComputedStyle(element);
  var align = cs.textAlign;
  var lineThreshold = parseFloat(cs.fontSize) * .2;
  if (settings.absolute) {
    contentBox = {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth
    };
    elementWidth = element.offsetWidth;
    elementHeight = element.offsetHeight;
    set(element, {
      cssWidth: element.style.width,
      cssHeight: element.style.height
    });
  }
  toArray(nodes).forEach(function(node) {
    var isWordLike = node.parentElement === element;
    var _getPosition = getPosition(node, isWordLike, settings, scrollPos), width = _getPosition.width, height = _getPosition.height, top = _getPosition.top, left = _getPosition.left;
    if (/^br$/i.test(node.nodeName)) return;
    if (types.lines && isWordLike) {
      if (lineOffsetY === null || top - lineOffsetY >= lineThreshold) {
        lineOffsetY = top;
        wordsInEachLine.push(wordsInCurrentLine = []);
      }
      wordsInCurrentLine.push(node);
    }
    if (settings.absolute) set(node, {
      top,
      left,
      width,
      height
    });
  });
  if (parent) parent.removeChild(element);
  /**------------------------------------------------
  ** SPLIT LINES
  **-----------------------------------------------*/
  if (types.lines) {
    lines = wordsInEachLine.map(function(wordsInThisLine) {
      var lineElement = createElement(TAG_NAME, {
        "class": "".concat(settings.splitClass, " ").concat(settings.lineClass),
        style: "display: block; text-align: ".concat(align, "; width: 100%;")
      });
      set(lineElement, "isLine", true);
      var lineDimensions = {
        height: 0,
        top: 1e4
      };
      splitText.appendChild(lineElement);
      wordsInThisLine.forEach(function(wordOrElement, idx, arr) {
        var _data$get = get(wordOrElement), isWordEnd = _data$get.isWordEnd, top = _data$get.top, height = _data$get.height;
        var next = arr[idx + 1];
        lineDimensions.height = Math.max(lineDimensions.height, height);
        lineDimensions.top = Math.min(lineDimensions.top, top);
        lineElement.appendChild(wordOrElement);
        if (isWordEnd && get(next).isWordStart) lineElement.append(" ");
      });
      if (settings.absolute) set(lineElement, {
        height: lineDimensions.height,
        top: lineDimensions.top
      });
      return lineElement;
    });
    if (!types.words) unSplitWords(splitText);
    element.replaceChildren(splitText);
  }
  /**------------------------------------------------
  **  SET ABSOLUTE POSITION
  **-----------------------------------------------*/
  if (settings.absolute) {
    element.style.width = "".concat(element.style.width || elementWidth, "px");
    element.style.height = "".concat(elementHeight, "px");
    toArray(nodes).forEach(function(node) {
      var _data$get2 = get(node), isLine = _data$get2.isLine, top = _data$get2.top, left = _data$get2.left, width = _data$get2.width, height = _data$get2.height;
      var parentData = get(node.parentElement);
      var isChildOfLineNode = !isLine && parentData.isLine;
      node.style.top = "".concat(isChildOfLineNode ? top - parentData.top : top, "px");
      node.style.left = isLine ? "".concat(contentBox.left, "px") : "".concat(left - (isChildOfLineNode ? contentBox.left : 0), "px");
      node.style.height = "".concat(height, "px");
      node.style.width = isLine ? "".concat(contentBox.width, "px") : "".concat(width, "px");
      node.style.position = "absolute";
    });
  }
  if (parent) if (nextSibling) parent.insertBefore(element, nextSibling);
  else parent.appendChild(element);
  return lines;
}
var _defaults = extend(defaults, {});
var SplitType = /*#__PURE__*/ function() {
  _createClass(SplitType, null, [
    {
      key: "clearData",
      /**
      * CLears all data
      */
      value: function clearData() {
        clear();
      }
    },
    {
      key: "setDefaults",
      /**
      * Sets the default settings for all SplitType instances.
      * The provided object will be merged with the existing defaults objects.
      *
      * @param {Object} settings an object containing the settings to override
      * @returns {Object} the new default settings
      * @public
      * @static
      * @example
      * SplitType.setDefaults({ "position": "absolute" })
      */
      value: function setDefaults(options) {
        _defaults = extend(_defaults, parseSettings(options));
        return defaults;
      }
    },
    {
      key: "revert",
      value: function revert(elements) {
        getTargetElements(elements).forEach(function(element) {
          var _data$get = get(element), isSplit = _data$get.isSplit, html = _data$get.html, cssWidth = _data$get.cssWidth, cssHeight = _data$get.cssHeight;
          if (isSplit) {
            element.innerHTML = html;
            element.style.width = cssWidth || "";
            element.style.height = cssHeight || "";
            remove(element);
          }
        });
      }
    },
    {
      key: "create",
      value: function create(target, options) {
        return new SplitType(target, options);
      }
    },
    {
      key: "data",
      /**
      * The internal data store
      */
      get: function get() {
        return cache;
      }
    },
    {
      key: "defaults",
      get: function get() {
        return _defaults;
      },
      set: function set(options) {
        _defaults = extend(_defaults, parseSettings(options));
      }
    }
  ]);
  function SplitType(elements, options) {
    _classCallCheck(this, SplitType);
    this.isSplit = false;
    this.settings = extend(_defaults, parseSettings(options));
    this.elements = getTargetElements(elements);
    this.split();
  }
  /**
  * Splits the text in all target elements. This method is called
  * automatically when a new SplitType instance is created. It can also be
  * called manually to re-split text with new options.
  * @param {Object} options
  * @public
  */
  _createClass(SplitType, [{
    key: "split",
    value: function split$1(options) {
      var _this = this;
      this.revert();
      this.elements.forEach(function(element) {
        set(element, "html", element.innerHTML);
      });
      this.lines = [];
      this.words = [];
      this.chars = [];
      var scrollPos = [window.pageXOffset, window.pageYOffset];
      if (options !== void 0) this.settings = extend(this.settings, parseSettings(options));
      var types = parseTypes(this.settings.types);
      if (types.none) return;
      this.elements.forEach(function(element) {
        set(element, "isRoot", true);
        var _split2 = split(element, _this.settings), words = _split2.words, chars = _split2.chars;
        _this.words = [].concat(_toConsumableArray(_this.words), _toConsumableArray(words));
        _this.chars = [].concat(_toConsumableArray(_this.chars), _toConsumableArray(chars));
      });
      this.elements.forEach(function(element) {
        if (types.lines || _this.settings.absolute) {
          var lines = repositionAfterSplit(element, _this.settings, scrollPos);
          _this.lines = [].concat(_toConsumableArray(_this.lines), _toConsumableArray(lines));
        }
      });
      this.isSplit = true;
      window.scrollTo(scrollPos[0], scrollPos[1]);
      cleanup();
    }
  }, {
    key: "revert",
    value: function revert() {
      if (this.isSplit) {
        this.lines = null;
        this.words = null;
        this.chars = null;
        this.isSplit = false;
      }
      SplitType.revert(this.elements);
    }
  }]);
  return SplitType;
}();
//#endregion
//#region resources/ts/metric-roller.ts
var populateMetricRollers = (roots, options) => {
  const createDigitCell = (targetDigit, digitIndex, digitCount, statIndex) => {
    const cycles = Math.max(1, digitCount - digitIndex);
    const steps = options.singlePass ? targetDigit : cycles * 10 + targetDigit;
    const cell = document.createElement("span");
    const wheel = document.createElement("span");
    cell.className = `${options.classPrefix}__stat-digit`;
    wheel.className = `${options.classPrefix}__stat-wheel`;
    wheel.style.setProperty(`${options.variablePrefix}-distance`, `-${steps}em`);
    wheel.style.setProperty(`${options.variablePrefix}-duration`, `${options.singlePass ? 760 + steps * 48 : 900 + steps * 32}ms`);
    wheel.style.setProperty(`${options.variablePrefix}-delay`, `${(options.initialDelay ?? 80) + statIndex * 70 + digitIndex * 45}ms`);
    for (let step = 0; step <= steps; step += 1) {
      const character = document.createElement("span");
      character.className = `${options.classPrefix}__stat-character`;
      character.textContent = String(step % 10);
      wheel.append(character);
    }
    cell.append(wheel);
    return cell;
  };
  roots.forEach((root, statIndex) => {
    const rawValue = root.dataset.value?.trim() ?? "0";
    const digitCount = Array.from(rawValue).filter((character) => /\d/.test(character)).length;
    let digitIndex = 0;
    const fragment = document.createDocumentFragment();
    Array.from(rawValue).forEach((character) => {
      if (/\d/.test(character)) {
        fragment.append(createDigitCell(Number(character), digitIndex, digitCount, statIndex));
        digitIndex += 1;
        return;
      }
      const staticCharacter = document.createElement("span");
      staticCharacter.className = `${options.classPrefix}__stat-static`;
      staticCharacter.textContent = character;
      fragment.append(staticCharacter);
    });
    root.replaceChildren(fragment);
  });
};
//#endregion
//#region resources/ts/brand-curve-renderer.ts
var getBrandCurveExitFactor = (viewportSize, finalEdge, releasePoint) => {
  const progress = Math.min(1, Math.max(0, (viewportSize - finalEdge) / Math.max(1, viewportSize - releasePoint)));
  return 1 - progress * progress * (3 - 2 * progress);
};
var brandCurveVertexShader = `
    uniform float uAxis;
    uniform float uBend;
    uniform float uCurveCenter;
    uniform float uCurveRadius;
    uniform vec4 uMediaBounds;
    uniform vec2 uViewportSize;
    uniform float uSurfaceCenter;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec2 screen = uMediaBounds.xy + vec2(uv.x, 1.0 - uv.y) * uMediaBounds.zw;
        float horizontal = step(0.5, uAxis);
        float screenAxis = mix(screen.y, screen.x, horizontal);
        float curveDistance = (screenAxis - uCurveCenter) / max(uCurveRadius, 0.001);
        float normalizedDistance = clamp(abs(curveDistance), 0.0, 1.0);
        float curveMask = 1.0 - step(1.0, abs(curveDistance));
        float paperCurve = (0.5 + 0.5 * cos(3.14159265 * normalizedDistance)) * curveMask;
        float curveDepth = paperCurve * uBend;

        // Every image passes through one viewport-space surface. Neither its
        // center nor its height changes the curve or the normalization.
        float peakSwell = (2.5 - uBend * 0.45) / (2.5 - uBend);
        float swell = ((2.5 - curveDepth * 0.45) / (2.5 - curveDepth)) / peakSwell;
        float crossAxis = mix(screen.x, screen.y, horizontal);
        float curvedCrossAxis = uSurfaceCenter + (crossAxis - uSurfaceCenter) * swell;
        screen.x = mix(curvedCrossAxis, screen.x, horizontal);
        screen.y = mix(screen.y, curvedCrossAxis, horizontal);
        gl_Position = vec4(screen.x / uViewportSize.x * 2.0 - 1.0,
            1.0 - screen.y / uViewportSize.y * 2.0, 0.0, 1.0);
    }
`;
var fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uPlaneSize;
    uniform vec2 uImageSize;
    uniform float uHoverZoom;
    varying vec2 vUv;

    void main() {
        float planeAspect = uPlaneSize.x / max(uPlaneSize.y, 1.0);
        float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
        vec2 coverScale = vec2(1.0);

        if (planeAspect > imageAspect) {
            coverScale.y = imageAspect / planeAspect;
        } else {
            coverScale.x = planeAspect / imageAspect;
        }

        vec2 textureUv = ((vUv - 0.5) * coverScale) / max(uHoverZoom, 1.0) + 0.5;
        gl_FragColor = texture2D(uTexture, textureUv);
        #include <colorspace_fragment>
    }
`;
var waitForImage = async (image) => {
  if (!image.complete) await new Promise((resolve) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => resolve(), { once: true });
  });
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) return false;
  if (typeof image.decode === "function") await image.decode().catch(() => void 0);
  return image.naturalWidth > 0 && image.naturalHeight > 0;
};
var viewportIntersects = (bounds, width, height) => bounds.right > 0 && bounds.left < width && bounds.bottom > 0 && bounds.top < height;
var createBrandCurveRenderer = async (root, getAxis) => {
  const mediaElements = Array.from(root.querySelectorAll("[data-brand-detail-hero-media], [data-brand-detail-media]"));
  if (mediaElements.length === 0 || !("WebGLRenderingContext" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  let THREE;
  try {
    THREE = await __vitePreload(() => import("./three.module-DbTyATjt.js"), [], import.meta.url);
  } catch (_error) {
    return null;
  }
  const states = mediaElements.map((element) => {
    const image = element.querySelector("[data-brand-detail-image], img");
    return image ? {
      element,
      image,
      texture: null,
      texturePromise: null,
      nearViewport: false,
      failed: false
    } : null;
  }).filter((state) => state !== null);
  if (states.length === 0) return null;
  const canvas = document.createElement("canvas");
  canvas.className = "brand-detail__webgl-canvas";
  canvas.dataset.brandDetailWebgl = "";
  canvas.setAttribute("aria-hidden", "true");
  root.append(canvas);
  let renderer;
  let camera;
  let scene;
  let geometry;
  let material;
  let mesh;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(1118481, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.autoClear = false;
    camera = new THREE.PerspectiveCamera(45, 1, .1, 10);
    camera.position.z = 2.5;
    scene = new THREE.Scene();
    geometry = new THREE.PlaneGeometry(2, 2, 64, 64);
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uPlaneSize: { value: new THREE.Vector2(1, 1) },
        uImageSize: { value: new THREE.Vector2(1, 1) },
        uHoverZoom: { value: 1 },
        uAxis: { value: 1 },
        uBend: { value: .16 },
        uCurveCenter: { value: .5 },
        uCurveRadius: { value: .9 },
        uMediaBounds: { value: new THREE.Vector4() },
        uViewportSize: { value: new THREE.Vector2(1, 1) },
        uSurfaceCenter: { value: 0 }
      },
      vertexShader: brandCurveVertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
  } catch (_error) {
    canvas.remove();
    return null;
  }
  let destroyed = false;
  let contextLost = false;
  let renderingFailed = false;
  let frameId = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  const disposeTexture = (state) => {
    state.texture?.dispose();
    state.texture = null;
    state.texturePromise = null;
    state.element.classList.remove("is-webgl-active", "is-webgl-pending");
  };
  const resizeRenderer = () => {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    if (width === canvasWidth && height === canvasHeight) return;
    canvasWidth = width;
    canvasHeight = height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
  };
  const ensureTexture = (state) => {
    if (state.failed || state.texture || state.texturePromise) return state.texturePromise ?? Promise.resolve();
    state.texturePromise = (async () => {
      state.image.loading = "eager";
      if (!await waitForImage(state.image) || destroyed || renderingFailed || state.failed) {
        state.element.classList.remove("is-webgl-pending");
        return;
      }
      const scale = Math.min(1, 1536 / Math.max(state.image.naturalWidth, state.image.naturalHeight));
      const source = document.createElement("canvas");
      source.width = Math.max(1, Math.round(state.image.naturalWidth * scale));
      source.height = Math.max(1, Math.round(state.image.naturalHeight * scale));
      const context = source.getContext("2d");
      if (!context) throw new Error("Brand image preparation failed");
      context.drawImage(state.image, 0, 0, source.width, source.height);
      const texture = new THREE.Texture(source);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      state.texture = texture;
      renderer.initTexture(texture);
      requestRender();
    })().catch(() => {
      state.failed = true;
      disposeTexture(state);
    }).finally(() => {
      state.texturePromise = null;
    });
    return state.texturePromise;
  };
  const renderMedia = (state, axis, exitOffset, exitFactor) => {
    if (!state.texture) return false;
    const bounds = state.element.getBoundingClientRect();
    if (!viewportIntersects(bounds, canvasWidth, canvasHeight) || bounds.width < 1 || bounds.height < 1) return false;
    let revealInset = 0;
    if (state.element.hasAttribute("data-brand-detail-hero-media")) {
      const clip = window.getComputedStyle(state.element).clipPath;
      const inset = /^inset\(\s*([\d.]+)(%|px)/.exec(clip);
      if (inset) revealInset = Number(inset[1]) * (inset[2] === "%" ? bounds.height / 100 : 1);
    }
    const revealing = revealInset > .01;
    const clippedLeft = axis === "y" ? 0 : Math.max(0, bounds.left);
    const clippedTop = axis === "y" ? Math.max(0, bounds.top + revealInset) : 0;
    const clippedRight = axis === "y" ? canvasWidth : Math.min(canvasWidth, bounds.right);
    const clippedBottom = axis === "y" ? Math.min(canvasHeight, bounds.bottom) : canvasHeight;
    const clippedWidth = clippedRight - clippedLeft;
    const clippedHeight = clippedBottom - clippedTop;
    if (clippedWidth <= 0 || clippedHeight <= 0) return revealing;
    const isMobile = window.innerWidth <= 560;
    const zoneCenter = axis === "x" ? canvasWidth * .5 : canvasHeight * (isMobile ? .4 : .38) - exitOffset;
    const zoneRadius = axis === "x" ? canvasWidth * .89 : canvasHeight * (isMobile ? .91 : .89);
    material.uniforms.uTexture.value = state.texture;
    material.uniforms.uPlaneSize.value.set(bounds.width, bounds.height);
    material.uniforms.uImageSize.value.set(state.image.naturalWidth, state.image.naturalHeight);
    material.uniforms.uHoverZoom.value = 1;
    material.uniforms.uAxis.value = axis === "x" ? 1 : 0;
    material.uniforms.uBend.value = (isMobile ? .135 : .16) * exitFactor;
    material.uniforms.uCurveCenter.value = zoneCenter;
    material.uniforms.uCurveRadius.value = zoneRadius;
    material.uniforms.uMediaBounds.value.set(bounds.left, bounds.top, bounds.width, bounds.height);
    renderer.setViewport(0, 0, canvasWidth, canvasHeight);
    renderer.setScissor(clippedLeft, canvasHeight - clippedBottom, clippedWidth, clippedHeight);
    renderer.clearDepth();
    renderer.render(scene, camera);
    if (!state.element.classList.contains("is-webgl-active")) {
      const context = renderer.getContext();
      if (context.isContextLost() || context.getError() !== context.NO_ERROR) throw new Error("Brand image WebGL rendering failed");
      state.element.classList.add("is-webgl-active");
      state.element.classList.remove("is-webgl-pending");
    }
    return revealing;
  };
  const renderFrame = () => {
    frameId = null;
    if (destroyed || contextLost || renderingFailed || document.hidden || root.hasAttribute("data-brand-detail-transition-frozen")) return;
    try {
      resizeRenderer();
      renderer.setScissorTest(false);
      renderer.clear(true, true, true);
      if (!root.classList.contains("is-brand-detail-visible")) return;
      renderer.setScissorTest(true);
      const axis = getAxis();
      const surface = root.querySelector(".brand-detail__gallery-grid")?.getBoundingClientRect() ?? states[0].element.getBoundingClientRect();
      material.uniforms.uViewportSize.value.set(canvasWidth, canvasHeight);
      material.uniforms.uSurfaceCenter.value = axis === "y" ? surface.left + surface.width / 2 : canvasHeight / 2;
      const finalBottom = Math.max(...states.map((state) => state.element.getBoundingClientRect().bottom));
      const exitDistance = axis === "y" ? Math.max(0, canvasHeight - finalBottom) : 0;
      const exitBlend = Math.max(1, canvasHeight * .12);
      const exitOffset = exitDistance < exitBlend ? exitDistance * exitDistance / (2 * exitBlend) : exitDistance - exitBlend / 2;
      const exitFactor = axis === "y" ? getBrandCurveExitFactor(canvasHeight, finalBottom, canvasHeight * (window.innerWidth <= 560 ? .4 : .38)) : 1;
      let revealing = false;
      states.forEach((state) => {
        revealing = renderMedia(state, axis, exitOffset, exitFactor) || revealing;
      });
      renderer.setScissorTest(false);
      if (revealing) requestRender();
    } catch (_error) {
      renderingFailed = true;
      canvas.hidden = true;
      states.forEach(disposeTexture);
    }
  };
  function requestRender() {
    if (!destroyed && !contextLost && !renderingFailed && frameId === null) frameId = window.requestAnimationFrame(renderFrame);
  }
  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const state = states.find((candidate) => candidate.element === entry.target);
      if (!state) return;
      state.nearViewport = entry.isIntersecting;
      if (entry.isIntersecting) ensureTexture(state);
    });
    requestRender();
  }, {
    root: null,
    rootMargin: "200% 0px 200% 0px",
    threshold: 0
  });
  states.forEach((state) => {
    state.element.classList.add("is-webgl-pending");
    mediaObserver.observe(state.element);
  });
  const resizeObserver = new ResizeObserver(() => requestRender());
  resizeObserver.observe(root);
  resizeObserver.observe(canvas);
  const transitionObserver = new MutationObserver(() => {
    if (!root.hasAttribute("data-brand-detail-transition-frozen")) requestRender();
  });
  transitionObserver.observe(root, {
    attributes: true,
    attributeFilter: ["data-brand-detail-transition-frozen"]
  });
  const onScroll = () => requestRender();
  const onVisibilityChange = () => requestRender();
  const onContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    canvas.hidden = true;
    states.forEach((state) => state.element.classList.remove("is-webgl-active", "is-webgl-pending"));
  };
  const onContextRestored = () => {
    if (destroyed) return;
    contextLost = false;
    renderingFailed = false;
    canvas.hidden = false;
    states.forEach((state) => {
      if (state.texture) state.texture.needsUpdate = true;
      else if (state.nearViewport) ensureTexture(state);
    });
    requestRender();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.visualViewport?.addEventListener("resize", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  resizeRenderer();
  requestRender();
  const initialMedia = states.filter((state, index) => index < 5 || state.nearViewport);
  let prepareTimer;
  await Promise.race([Promise.all(initialMedia.map(ensureTexture)), new Promise((resolve) => {
    prepareTimer = window.setTimeout(resolve, 1500);
  })]);
  window.clearTimeout(prepareTimer);
  return {
    requestRender,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      mediaObserver.disconnect();
      resizeObserver.disconnect();
      transitionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      states.forEach(disposeTexture);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
};
//#endregion
export { SplitType as a, populateMetricRollers as i, createBrandCurveRenderer as n, getBrandCurveExitFactor as r, brandCurveVertexShader as t };
