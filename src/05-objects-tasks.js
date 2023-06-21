/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
  return this;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           selector1, combinator, selector2
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssBuilder {
  constructor() {
    this.initAll();
  }

  onlyOneError() {
    this.initAll();
    throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  checkOrder(order) {
    if (this.order > order) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.order = order;
  }

  element(value) {
    if (this.tag) {
      this.onlyOneError();
    }
    this.checkOrder(1);
    this.tag = value;
    this.updateSelector();
    return this;
  }

  id(value) {
    if (this.identificator) {
      this.onlyOneError();
    }
    this.checkOrder(2);
    this.identificator = value;
    this.updateSelector();
    return this;
  }

  class(value) {
    if (!this.classes) {
      this.classes = [];
    }
    this.checkOrder(3);
    this.classes.push(value);
    this.updateSelector();
    return this;
  }

  attr(value) {
    if (!this.attributes) {
      this.attributes = [];
    }
    this.checkOrder(4);
    this.attributes.push(value);
    this.updateSelector();
    return this;
  }

  pseudoClass(value) {
    if (!this.psClasses) {
      this.psClasses = [];
    }
    this.checkOrder(5);
    this.psClasses.push(value);
    this.updateSelector();
    return this;
  }

  pseudoElement(value) {
    if (this.psElement) {
      this.onlyOneError();
    }
    this.checkOrder(6);
    this.psElement = value;
    this.updateSelector();
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    const { selector } = this;
    this.initAll();
    return selector;
  }

  initAll() {
    this.tag = null;
    this.classes = [];
    this.identificator = null;
    this.attributes = [];
    this.psClasses = [];
    this.psElement = null;
    this.selector = '';
    this.order = 0;
  }

  updateSelector() {
    let selector = '';
    if (this.tag) {
      selector += this.tag;
    }
    if (this.attributes.length) {
      selector += `[${this.attributes.join('][')}]`;
    }
    if (this.identificator) {
      selector += `#${this.identificator}`;
    }
    if (this.classes.length) {
      selector += this.classes.map((el) => `.${el}`).join('');
    }
    if (this.psClasses.length) {
      selector += this.psClasses.map((el) => `:${el}`).join('');
    }
    if (this.psElement) {
      selector += `::${this.psElement}`;
    }
    this.selector = selector;
  }
}

const cssSelectorBuilder = {};

['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement', 'combine', 'stringify'].forEach((func) => {
  cssSelectorBuilder[func] = (...args) => {
    const cssBuilder = new CssBuilder();
    return cssBuilder[func](...args);
  };
});

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
