
/**
 * 当前按键是否输入字符
 * @param {KeyboardEvent} evt 
 * 
 * @returns {boolean}
 */
var __isChar = function (evt) {
  var keyCode = evt.keyCode || evt.which;

  var isChar =
    (keyCode > 47 && keyCode < 58) || // number keys
    // keyCode === 32 || keyCode === 13 || // spacebar & return key(s) (if you want to allow carriage returns)
    (keyCode > 64 && keyCode < 91) || // letter keys
    (keyCode > 95 && keyCode < 112) || // numpad keys
    (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
    (keyCode > 218 && keyCode < 223) ||   // [\]' (in order)
    // maybe 输入法，处理一下特殊符号
    (evt.key === 'Process' &&
      ['Backslash', 'BracketRight', 'BracketLeft', 'Quote', 'Semicolon', 'Slash', 'Period', 'Comma', 'Equal', 'Minus',
        'Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Backquote',
        'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'NumpadDecimal',
        'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract', 'NumpadAdd'].indexOf(evt.code) >= 0);
  return isChar && !evt.ctrlKey && !evt.altKey && !evt.metaKey;// && !evt.shiftKey;
};


/**
 * 拆分节点及其父节点
* @param {Element | Text} node 要拆分的节点，从这个节点开始往上拆分
* @param {number} offset 从节点的这个位置开始拆分，对于Text来说就是字符位置，对于Element来说就是子节点位置
* @param {Element | Text} parent 一直拆分到这个父节点
* 
* @returns {Element | Text | NULL} 返回拆分后的子节点（拆分位置的后半部分）
*/
/**
 * 拆分节点
* @param {Element | Text} node 要拆分的节点，从这个节点开始往上拆分
* @param {number} offset 从节点的这个位置开始拆分，对于Text来说就是字符位置，对于Element来说就是子节点位置
* @param {Element | Text} parent 一直拆分到这个父节点
* @param {boolean} ignoreParent 要不要拆第三个参数指定的父节点，为false时只拆到parent的子节点即可
* 
* @returns {Element | Text | NULL} 返回拆分后的子节点（拆分位置的后半部分）
*/
var __breakParent = function (node, offset, parent, ignoreParent) {
  if (!node) {
    console.error('node is null');
    return;
  }
  if (!parent) {
    console.error('parent is null');
    return;
  }
  if (!(node.compareDocumentPosition(parent) & Node.DOCUMENT_POSITION_CONTAINS)) {
    console.error(parent, 'is not parent or parent\'s parent of', node);
    return;
  }
  var next, child;
  while (node !== (ignoreParent ? parent : parent.parentNode)) {
    // 在当前节点之前拆
    if (offset === 0) {
      offset = Array.from(node.parentNode.childNodes).indexOf(node);
      node = node.parentNode;
    }
    else {
      // 拆文本节点
      if (node.nodeType === 3) {
        next = node.splitText(offset);
        if (next.nodeValue.length <= 0) node.parentNode.removeChild(next);
      } else if (child = node.childNodes[offset]) {
        next = node.cloneNode(false);
        node.parentNode.insertBefore(next, node.nextSibling);
        while (child = node.childNodes[offset]) { next.appendChild(child); }
      }
      offset = Array.from(node.parentNode.childNodes).indexOf(node) + 1;
      node = node.parentNode;
    }
  }
  return node.childNodes[offset];
};



/**
 * 这几个函数是从ueditor里扒出来的，回头优化一下
 */
var domUtils = UM.dom.domUtils;
var ie = UM.browser.ie;
var utils = UM.utils;

/**
 * 合并节点node的左右兄弟节点，可以根据给定的条件选择是否忽略合并左右节点。
 * @method mergeSibling
 * @param { Element } node 需要合并的目标节点
 * @param { Boolean } ignorePre 是否忽略合并左节点
 * @param { Boolean } ignoreNext 是否忽略合并右节点
 * @remind 如果同时忽略左右节点， 则该操作什么也不会做
 * @example
 * ```html
 * <b>xxxx</b><b id="test">ooo</b><b>xxxx</b>
 *
 * <script>
 *     var demoNode = document.getElementById("test");
 *     UE.dom.domUtils.mergeSibling( demoNode, false, true );
 *     //output: xxxxooo
 *     console.log( demoNode.innerHTML );
 * </script>
 * ```
 */
var mergeSibling = function (node, ignorePre, ignoreNext) {
  function merge(rtl, start, node) {
    var next;
    if ((next = node[rtl]) && !domUtils.isBookmarkNode(next) && next.nodeType == 1 && isSameElement(node, next)) {
      while (next.firstChild) {
        if (start == 'firstChild') {
          node.insertBefore(next.lastChild, node.firstChild);
        } else {
          node.appendChild(next.firstChild);
        }
      }
      domUtils.remove(next);
    }
  }
  !ignorePre && merge('previousSibling', 'firstChild', node);
  !ignoreNext && merge('nextSibling', 'lastChild', node);
};

/**
 * 比较节点nodeA与节点nodeB是否具有相同的标签名、属性名以及属性值
 * @method  isSameElement
 * @param { Node } nodeA 需要比较的节点
 * @param { Node } nodeB 需要比较的节点
 * @return { Boolean } 两个节点是否具有相同的标签名、属性名以及属性值
 * @example
 * ```html
 * <span style="font-size:12px">ssss</span>
 * <span style="font-size:12px">bbbbb</span>
 * <span style="font-size:13px">ssss</span>
 * <span style="font-size:14px">bbbbb</span>
 *
 * <script>
 *
 *     var nodes = document.getElementsByTagName( "span" );
 *
 *     //output: true
 *     console.log( UE.dom.domUtils.isSameElement( nodes[0], nodes[1] ) );
 *
 *     //output: false
 *     console.log( UE.dom.domUtils.isSameElement( nodes[2], nodes[3] ) );
 *
 * </script>
 * ```
 */
var isSameElement = function (nodeA, nodeB) {
  if (nodeA.tagName != nodeB.tagName) {
    return false;
  }
  var thisAttrs = nodeA.attributes,
    otherAttrs = nodeB.attributes;
  if (!ie && thisAttrs.length != otherAttrs.length) {
    return false;
  }
  var attrA, attrB, al = 0, bl = 0;
  for (var i = 0; attrA = thisAttrs[i++];) {
    if (attrA.nodeName == 'style') {
      if (attrA.specified) {
        al++;
      }
      if (isSameStyle(nodeA, nodeB)) {
        continue;
      } else {
        return false;
      }
    }
    if (ie) {
      if (attrA.specified) {
        al++;
        attrB = otherAttrs.getNamedItem(attrA.nodeName);
      } else {
        continue;
      }
    } else {
      attrB = nodeB.attributes[attrA.nodeName];
    }
    if (!attrB.specified || attrA.nodeValue != attrB.nodeValue) {
      return false;
    }
  }
  // 有可能attrB的属性包含了attrA的属性之外还有自己的属性
  if (ie) {
    for (i = 0; attrB = otherAttrs[i++];) {
      if (attrB.specified) {
        bl++;
      }
    }
    if (al != bl) {
      return false;
    }
  }
  return true;
};

/**
 * 判断节点nodeA与节点nodeB的元素的style属性是否一致
 * @method isSameStyle
 * @param { Node } nodeA 需要比较的节点
 * @param { Node } nodeB 需要比较的节点
 * @return { Boolean } 两个节点是否具有相同的style属性值
 * @example
 * ```html
 * <span style="font-size:12px">ssss</span>
 * <span style="font-size:12px">bbbbb</span>
 * <span style="font-size:13px">ssss</span>
 * <span style="font-size:14px">bbbbb</span>
 *
 * <script>
 *
 *     var nodes = document.getElementsByTagName( "span" );
 *
 *     //output: true
 *     console.log( UE.dom.domUtils.isSameStyle( nodes[0], nodes[1] ) );
 *
 *     //output: false
 *     console.log( UE.dom.domUtils.isSameStyle( nodes[2], nodes[3] ) );
 *
 * </script>
 * ```
 */
var isSameStyle = function (nodeA, nodeB) {
  var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':'),
    styleB = nodeB.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');
  if (browser.opera) {
    styleA = nodeA.style;
    styleB = nodeB.style;
    if (styleA.length != styleB.length)
      return false;
    for (var p in styleA) {
      if (/^(\d+|csstext)$/i.test(p)) {
        continue;
      }
      if (styleA[p] != styleB[p]) {
        return false;
      }
    }
    return true;
  }
  if (!styleA || !styleB) {
    return styleA == styleB;
  }
  styleA = styleA.split(';');
  styleB = styleB.split(';');
  if (styleA.length != styleB.length) {
    return false;
  }
  for (var i = 0, ci; ci = styleA[i++];) {
    if (utils.indexOf(styleB, ci) == -1) {
      return false;
    }
  }
  return true;
};



var __mergeText = function (node) {
  if(!node || !node.firstChild) return;
  node = node.firstChild;

  while (node && node.nodeType === 3 && (next = node.nextSibling) && next.nodeType === 3) {
    node.nodeValue += next.nodeValue;
    next.parentNode.removeChild(next);
    node = next;
  }
};

var dom = {
  isChar: __isChar,
  breakParent: __breakParent,
  // merge: mergeSibling,
  merge: function(node, ignorePre, ignoreNext) {
    var first = node.firstChild, last = node.lastChild;
    mergeSibling.apply(this, arguments);
    __mergeText(node);

    if(!ignorePre && first && first.nodeType === 1 && first.previousSibling) {
      this.merge(first);
    }
    if(ignorePre || !ignoreNext && last && last !== first && last.nodeType === 1 && last.nextSibling) {
      this.merge(last);
    }
  },
  mergeText: __mergeText
};

module.exports = dom;