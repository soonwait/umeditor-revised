
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
  return isChar;
};


/**
 * 从节点位置处拆分，直到till节点，till一定是node的一个祖先节点
* @param {Node} node
* @param {number} offset
* @param {Node} till
* 
* @returns {Node} 返回拆分后的子节点（拆分位置的后半部分，有可能是null，表示拆分位置在till的尾巴上，并且till是它父节点的最后一个子节点）
*/
/**
 * 从节点位置处拆分，直到till节点，但不拆分till节点，最多拆到它的子节点
* @param {Node} node
* @param {number} offset
* @param {Node} till
* @param {boolean} ignoreTill = true
* 
* @returns {Node} 返回拆分后的子节点（拆分位置的后半部分，有可能是null，表示拆分位置在till的尾巴上）
*/
var __split = function (node, offset, till, ignoreTill) {
  if (!node) {
    console.error('node is null');
    return;
  }
  if (!till) {
    console.error('ancestor is null');
    return;
  }
  if (!(node.compareDocumentPosition(till) & Node.DOCUMENT_POSITION_CONTAINS)) {
    console.error(till, 'is not ancestor of', node);
    return;
  }
  var next, child;
  while (node !== (ignoreTill ? till : till.parentNode)) {
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


var dom = {
  isChar: __isChar,
  split: __split
};

module.exports = dom;