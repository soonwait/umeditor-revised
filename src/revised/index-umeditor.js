// ;
// console.log(Object.keys(UM.plugins))
// console.log(Object.keys(UM.commands))


/**
 * 移除默认插件
 */
[
  "autosave", //自动保存草稿
  "autoupload", //1.拖放文件到编辑区域，自动上传并插入到选区,  2.插入粘贴板的图片，自动上传并插入到选区
  "basestyle", //加粗,斜体,上标,下标
  // "cleardoc", //清空文档， 不在plugins里，只是command
  "enterkey", //设置回车标签p或br
  "font", //字体颜色,背景色,字号,字体,下划线,删除线
  "formula", //公式插件
  "horizontal", //分割线
  // "image", //插入图片，操作图片的对齐方式， 不在plugins里，只是command
  // "insertHtml", //插入内容，操作图片的对齐方式， 不在plugins里，只是command
  "justify", //段落格式,居左,居右,居中,两端对齐
  "keystrokes", //处理特殊键的兼容性问题
  "link", //超链接,取消链接
  "list", //有序列表,无序列表
  "paragraph",//段落格式,标签值为：'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',formatBlock
  "paste", //粘贴
  // "preview", //预览， 不在plugins里，只是command
  // "print", //打印， 不在plugins里，只是command
  "removeformat", //清除格式
  "selectall", //全选
  "source", //查看源码
  "undo", //撤销和重做
  "video", //插入视频
  "xssFilter" //xss过滤器
].forEach(function (name) {
  if (!!UM.plugins[name])
    delete UM.plugins[name];
});



/**
 * 移除默认命令
 */
["inserthtml", "insertimage", "print", "cleardoc", "preview", "fullscreen"].forEach(cmdName => {
  delete UM.commands[cmdName];
});


// console.log(Object.keys(UM.plugins))
// console.log(Object.keys(UM.commands))






var mobile = require('./mobile');
var dom = require('./dom');

var domUtils = UM.dom.domUtils;

function Revised(me) {

  const ANONYMOUS = 'anonymous';

  var __user = ANONYMOUS;
  var __revisedVisible = true;


  var __toString = function (e) {
    if (typeof e === 'object' && e instanceof Array) {
      return `[${e.map(__toString).join(',')}]`;
    }
    return e.nodeType === 3 ? `"${e.nodeValue}"` : e.nodeType === 11 ? Array.from(e.childNodes).reduce((a, e) => {
      return a + __toString(e);
    }, "") : e.outerHTML;
  };


  var __isDel = function (node) {
    return node && node.nodeType === 1 && node.tagName === 'DEL' && node;
  };
  var __inDel = function (node) {
    return (node = domUtils.findParentByTagName(node, 'DEL', true));
  };
  var __isIns = function (node) {
    return node && node.nodeType === 1 && node.tagName === 'INS' && node;
  };
  var __inIns = function (node) {
    return (node = domUtils.findParentByTagName(node, 'INS', true));
  };
  var __isEmpty = function (node) {
    if (!node) return false;
    else if (node.nodeType === 3) return node.nodeValue.length === 0;
    else if (node.nodeType === 1) return !node.firstChild || !Array.from(node.childNodes).some(e => !__isEmpty(e));
    else if (node.nodeType === 11) return node.firstChild || !Array.from(node.childNodes).some(e => !__isEmpty(e));
    else return false;
  };
  // TODO 修改的通用一点
  var __isPStart = function (node, offset) {
    if (!node) return false;
    if (node.nodeType === 3 && offset > 0) return false;
    if (node === me.body) return node.childNodes[offset];
    var p = domUtils.findParentByTagName(node, 'P', true);
    if (node.nodeType === 3) {
      offset = Array.from(node.parentNode.childNodes).indexOf(node);
      node = node.parentNode;
    }
    while (offset === 0 && node !== p) {
      offset = Array.from(node.parentNode.childNodes).indexOf(node);
      node = node.parentNode;
    }
    return node === p && offset === 0 && p;
  };

  var __isPEnd = function (node, offset) {
    if (!node) return false;
    if (node.nodeType === 3 && offset < node.nodeValue.length) return false;
    if (node === me.body) return node.childNodes[offset - 1];
    var p = domUtils.findParentByTagName(node, 'P', true);
    if (node.nodeType === 3) {
      offset = Array.from(node.parentNode.childNodes).indexOf(node) + 1;
      node = node.parentNode;
    }
    while (!node.childNodes[offset] && node !== p) {
      offset = Array.from(node.parentNode.childNodes).indexOf(node) + 1;
      node = node.parentNode;
    }
    return node === p && offset === node.childNodes.length && p;
  };
  var __date = function () {
    return new Date().toISOString().substring(0, 16).replace('T', ' ');
  };

  var __createDel = function () {
    var del = me.document.createElement('DEL');
    del.setAttribute('cite', __user || ANONYMOUS);
    del.setAttribute('datetime', __date());
    return del;
  };

  var __createIns = function (user, datetime) {
    var ins = me.document.createElement('INS');
    ins.setAttribute('cite', user || __user || ANONYMOUS);
    ins.setAttribute('datetime', datetime || __date());
    return ins;
  };




  var __includeInvisibles = function (sel, rng) {
    // if (document.revisedVisible) return;
    if (__revisedVisible) return;

    var start = rng.startContainer, end = rng.endContainer;
    if (!(start.compareDocumentPosition(me.body) & Node.DOCUMENT_POSITION_CONTAINS)) {
      console.warn('selection start is out of editor');
      return;
    }
    if (!(end.compareDocumentPosition(me.body) & Node.DOCUMENT_POSITION_CONTAINS)) {
      console.warn('selection end is out of editor');
      return;
    }
    var startOffset = rng.startOffset, startMoved;
    while (startOffset === 0) {
      startOffset = Array.from(start.parentNode.childNodes).indexOf(start);
      start = start.parentNode;
      if (start.nodeType === 1 && start.tagName === 'P') break;
      if (start.nodeType === 1 && start === me.body) return;
    }
    if (start.nodeType === 1 && start.tagName === 'P') {
      var prev;
      while ((prev = start.childNodes[startOffset - 1]) && __isDel(prev)) {// && prev !== prev.parentNode.lastChild) {
        startOffset--;
        startMoved = true;
      }
    }
    var endOffset = rng.endOffset, endMoved;
    while (endOffset === (end.nodeType === 3 ? end.nodeValue.length : end.childNodes.length)) {
      endOffset = Array.from(end.parentNode.childNodes).indexOf(end) + 1;
      end = end.parentNode;
      if (end.nodeType === 1 && end.tagName === 'P') break;
      if (end.nodeType === 1 && end === me.body) return;
    }
    if (end.nodeType === 1 && end.tagName === 'P') {
      var next, isntDel = false;
      // 当一段里选区后面全部都是del时，浏览器默认不删除他们，至少chrome是这样
      next = end.childNodes[endOffset];
      while (next) {
        if (!__isDel(next)) isntDel = true;
        next = next.nextSibling;
      }
      if (isntDel) {
        while ((next = end.childNodes[endOffset]) && __isDel(next)) {// && next !== next.parentNode.firstChild) {
          endOffset++;
          endMoved = true;
        }
      }
    }
    if (startMoved || endMoved) {
      if (startMoved) rng.setStart(start, startOffset);
      if (endMoved) rng.setEnd(end, endOffset);
      __shrink();
      // mobile.fixSelectionRange();
    }
  };


  // 当前选区是否跨了多行（或多个 <P>）
  var __isMultiLineSelection = function () {
    var sel = me.document.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    var rng = sel.getRangeAt(0);
    var frag = rng.cloneContents();

    var bml; // bool multi line
    // 跨行删除，frag里必然都是P， 这是一种判断方式
    bml = Array.from(frag.childNodes).reduce((a, c) => a && c.nodeType === 1 && c.tagName === 'P', true);
    if (!bml) return false;
    // 还可以根据range的端点来判断
    // console.log(rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset);
    bml = (rng.startContainer === me.body && rng.startOffset !== rng.endOffset)
      || ((tmp = domUtils.findParentByTagName(rng.startContainer, 'P')) && tmp !== domUtils.findParentByTagName(rng.endContainer, 'P'));
    return bml;
  };


  /**
   * 有关选区的处理函数
   */
  // TODO 重新整理这个函数，尤其是合并
  var __visitMultiLineFrag = function (frag) {
    return Array.from(frag.childNodes).map(p => {
      // 处理本次被删除的段落里的内容
      Array.from(p.childNodes).forEach(e => {
        // 早前已经删除的内容不用管，不管谁删的
        if (__isDel(e)) {
          // NOP
        }
        // 如果是自己插入的内容，则直接删除
        else if ((tmp = __isIns(e)) && __user === tmp.getAttribute('cite')) {
          tmp.parentNode.removeChild(tmp);
        }
        else if (e.nodeType === 1 && e.tagName === 'IMG') {
          var info = me.document.createElement('ABBR');
          info.innerText = '[图片已删除]';
          info.title = '已删除的图片：' + e.src;
          var del = __createDel();
          del.appendChild(info);
          p.insertBefore(del, e);
          p.removeChild(e);
        }
        // 其他节点全用删除线包括
        else {
          var del = __createDel();
          p.insertBefore(del, e);
          del.appendChild(e);
        }
      });
      // 合并相同人和时间的删除标记
      var next = p.firstChild;
      while (next) {
        dom.merge(next, true);
        next = next.nextSibling;
      }

      return p;
    });
  };

  var __visitMultiBlockFrag = function (frag) {
    Array.from(frag.childNodes).forEach(e => {
      if (__isDel(e)) {
        dom.merge(e, false, true);
      }
      else if ((tmp = __isIns(e)) && __user === tmp.getAttribute('cite')) {
        frag.removeChild(tmp);
      }
      else {
        var del = __createDel();
        frag.insertBefore(del, e);
        del.appendChild(e);
        dom.merge(del, false, true);
      }
    });
    return Array.from(frag.childNodes);
  };
  var __shrink = function () {
    var sel = me.document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var rng = sel.getRangeAt(0);
    var start = rng.startContainer, startOffset = rng.startOffset;
    while (start.nodeType === 1 && start.firstChild) {
      if (startOffset >= start.childNodes.length) {
        start = start.lastChild;
        startOffset = start.nodeType === 3 ? start.nodeValue.length : start.childNodes.length;
      } else {
        start = start.childNodes[startOffset];
        startOffset = 0;
      }
    }
    if (rng.collapsed) {
      if (start !== rng.startContainer) {
        rng.setStart(start, startOffset);
        rng.collapse(true);
        mobile.fixSelectionRange(sel, rng);
      }
      return;
    }
    var end = rng.endContainer, endOffset = rng.endOffset;
    while (end.nodeType === 1 && end.firstChild) {
      if (endOffset >= end.childNodes.length) {
        end = end.lastChild;
        endOffset = end.nodeType === 3 ? end.nodeValue.length : end.childNodes.length;
      } else if (endOffset === 0 && end.previousSibling) { // TODO
        end = end.previousSibling;
        endOffset = end.nodeType === 3 ? end.nodeValue.length : end.childNodes.length;
      } else if (end.childNodes[endOffset - 1]) {
        end = end.childNodes[endOffset - 1];
        endOffset = end.nodeType === 3 ? end.nodeValue.length : end.childNodes.length;
      } else { // TODO
        end = end.childNodes[endOffset];
        endOffset = 0;
      }
    }
    if (start !== rng.startContainer || end !== rng.endContainer) {
      if (start !== rng.startContainer) rng.setStart(start, startOffset);
      if (end !== rng.endContainer) rng.setEnd(end, endOffset);
      // rng.collapse(true);
      mobile.fixSelectionRange(sel, rng);
    }
  };


  var __deleteSelection = function (cursorToStart) {
    // TODO

    var sel = me.document.getSelection();
    if (!sel) {
      console.warn('selection is null');
      return;
    }
    // console.log('anchor', sel.anchorOffset, sel.anchorNode, __toString(sel.anchorNode));
    // console.log('focus', sel.focusOffset, sel.focusNode, __toString(sel.focusNode));
    if (sel.rangeCount === 0) {
      console.warn('selection\'s rangeCount is 0');
      return;
    }
    var rng = sel.getRangeAt(0);
    if (rng.collapsed) return;

    var start = rng.startContainer, end = rng.endContainer, tmp;
    console.log('before delete\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));
    if (typeof cursorToStart === 'undefined') {
      cursorToStart = sel.focusNode === start && sel.focusOffset === rng.startOffset;
    }

    __includeInvisibles(sel, rng);
    rng = sel.getRangeAt(0);
    start = rng.startContainer;
    end = rng.endContainer;
    console.log('before delete ... include invisible\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));
    var frag = rng.cloneContents();
    Array.from(frag.childNodes).forEach((e, i) => {
      // console.log(`frag[${i}]`, __toString(e));
    });

    var mline = __isMultiLineSelection(), mblock = (start !== end);
    // 跨行删除
    if (mline) {
      // TODO 如果删除的是跨行符，需要考虑
      // 1. backward时，如果这一行的开头是新插入的文字，则合并这行到上一行
      // 2. forward时，如果下一行的开头是新插入的文字，则将下一行合并到这一行尾
      if (__isEmpty(frag.firstChild) && __isEmpty(frag.lastChild)) {
        frag.removeChild(frag.lastChild);
        frag.removeChild(frag.firstChild);
      }
      if (frag.childNodes.length === 0) {
        // if (frag.childNodes.length === 2 && __isEmpty(frag.firstChild) && __isEmpty(frag.lastChild)) {
        // 删除空行
        console.info('delete a line seperator');
        rng.collapse(cursorToStart);
        mobile.fixSelectionRange(sel, rng);
        return;
      }

      // 保存删除前的状态
      var delFromPHead = __isPStart(start, rng.startOffset), delToPTail = __isPEnd(end, rng.endOffset);
      var delFromPTail = __isPEnd(start, rng.startOffset), delToPHead = __isPStart(end, rng.endOffset);

      // console.log('delFromPHead', delFromPHead, 'delFromPTail', delFromPTail, 'delToPHead', delToPHead, 'delToPTail', delToPTail);

      // 删除
      me.document.execCommand('delete', false, null);
      rng = sel.getRangeAt(0);
      start = rng.startContainer;
      end = rng.endContainer;
      // console.log('after delete\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

      // 插入<p><del></p>
      // 1. 从某行首开始删的，插入在此行之前
      // 2. 从某行中开始删的，先拆此行，然后插入在后行之前
      var dps = __visitMultiLineFrag(frag); // deleted p lines
      var pnext = delFromPHead || dom.breakParent(start, rng.startOffset, me.body, true);
      Array.from(dps).reverse().forEach(p => pnext = me.body.insertBefore(p, pnext));

      // 整理焦点
      if (cursorToStart) {
        // 从行首开始删的，焦点落在第一个<p><del></p>行首，否则落在所有<p><del></p>的前一行尾
        delFromPHead ? rng.setStart(start = dps[0], 0) : rng.setStart(start = dps[0].previousSibling, start.childNodes.length)
      } else {
        // 焦点落在最后一个<p><del></p>的行尾即可
        rng.setStart(start = dps[dps.length - 1], start.childNodes.length)
      }
      rng.collapse(true);
      mobile.fixSelectionRange(sel, rng);
      __shrink();
      rng = sel.getRangeAt(0);
      start = rng.startContainer;
      end = rng.endContainer;
      // console.log('after shrink\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

      // 合并第一<p><del></p>行，往前
      if (!delFromPHead && !delFromPTail) {
        dom.merge(dps[0].previousSibling, true, false);
      }
      // 合并最后<p><del></p>行，往后
      if (!delToPTail && !delToPHead) {
        dom.merge(dps[dps.length - 1], true, false);
      }
      // 删除最后一个空行<p><br></p>
      if (delFromPHead && delToPTail) {
        delFromPHead.parentNode.removeChild(delFromPHead);
      }

    }
    // 行内多节点删除
    else if (mblock) {
      // 删除
      me.document.execCommand('delete', false, null);
      rng = sel.getRangeAt(0);
      start = rng.startContainer;
      end = rng.endContainer;
      // console.log('after delete\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

      // 插入<del>
      var dbs = __visitMultiBlockFrag(frag); // deleted blocks
      var p = domUtils.findParentByTagName(start, 'P', true);
      if (!p) {
        console.error('some thing wrong!');
        return;
      }
      var bnext;
      if (tmp = __inDel(start)) bnext = dom.breakParent(start, rng.startOffset, tmp) || tmp.nextSibling;
      else if (tmp = __inIns(start)) bnext = dom.breakParent(start, rng.startOffset, tmp) || tmp.nextSibling;
      // TODO still a text in span in p ??
      else if (start.nodeType === 3) bnext = start.splitText(rng.startOffset);

      else if (start.nodeType === 1 && start.tagName === 'P') {
        bnext = start.childNodes[rng.startOffset], tmp = bnext;
        // TODO remove br
      }
      else {
        console.error('not supported yet!');
        return;
      }
      Array.from(dbs).reverse().forEach(b => bnext = p.insertBefore(b, bnext));

      // 整理焦点
      if (cursorToStart) {
        // 从行首开始删的，焦点落在第一个<p><del></p>行首，否则落在所有<p><del></p>的前一行尾
        // rng.setStart(start = dbs[0], 0);
        if (tmp = dbs[0].previousSibling) rng.setStart(start = tmp, start.nodeType === 3 ? start.nodeValue.length : start.childNodes.length);
        else rng.setStart(dbs[0], 0);
      } else {
        // 焦点落在最后一个<p><del></p>的行尾即可
        rng.setStart(start = dbs[dbs.length - 1], start.nodeType === 3 ? start.nodeValue.length : start.childNodes.length)
      }
      rng.collapse(true);
      mobile.fixSelectionRange(sel, rng);
      __shrink();
      rng = sel.getRangeAt(0);
      start = rng.startContainer;
      end = rng.endContainer;
      // console.log('after shrink\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

      // TODO 合并前后的删除节点
      dom.merge(dbs[0], false, true);
      dom.merge(dbs[dbs.length - 1], true, false);
    }
    // 行内单节点内的删除
    else {
      if (__inDel(start)) {
        // 仅移动光标，选区闭合
        rng.collapse(cursorToStart);
        mobile.fixSelectionRange(sel, rng);
      }
      else if ((tmp = __inIns(start)) && __user === tmp.getAttribute('cite')) {
        // 仅删除，选区闭合
        me.document.execCommand('delete', false, null);
      }
      else if (tmp = domUtils.findParentByTagName(start, 'P', true)) {
        // 保存信息，删除的是别人的插入
        var ins = __inIns(start), p = tmp;
        // 删除
        me.document.execCommand('delete', false, null);
        rng = sel.getRangeAt(0);
        start = rng.startContainer;
        end = rng.endContainer;
        // 隐藏删除标记时，删除到第一个字的时候会插入一个br，需要清理一下
        // 删成空行的时候也会插入一个br
        if ((tmp = p.firstChild) && tmp.nodeType === 1 && tmp.tagName === 'BR') p.removeChild(p.firstChild);
        // console.log('after delete\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

        var next = dom.breakParent(start, rng.startOffset, p, true);
        var parent = next ? next.parentNode : p;
        // 插入<del>
        var dbs = __visitMultiBlockFrag(frag); // deleted blocks
        // console.log(__toString(dbs))
        if (ins = ins && ins.cloneNode(false)) {
          // TODO 这里默认只有一个片段了哦
          var del = __createDel();
          ins.appendChild(document.createTextNode(frag.textContent));
          del.appendChild(ins);
          dbs = [del];
        }
        Array.from(dbs).reverse().forEach(b => next = parent.insertBefore(b, next));

        // 整理焦点
        if (cursorToStart) {
          if (tmp = dbs[0].previousSibling) rng.setStart(start = tmp, start.nodeType === 3 ? start.nodeValue.length : start.childNodes.length);
          else rng.setStart(dbs[0], 0);
        } else {
          rng.setStart(start = dbs[dbs.length - 1], start.nodeType === 3 ? start.nodeValue.left : start.childNodes.length);
        }
        rng.collapse(true);
        mobile.fixSelectionRange(sel, rng);
        __shrink();

        rng = sel.getRangeAt(0);
        start = rng.startContainer;
        end = rng.endContainer;
        // console.log('after shrink\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

        // 合并前后节点
        // 不出意外的话，片段应该只有一个
        console.log('merge', __toString(dbs[0]), false, true);
        console.log('merge', dbs[dbs.length - 1], true, false);
        dom.merge(dbs[0], false, true);
        dom.merge(dbs[dbs.length - 1], true, false);
      } else {
        console.error('element that are not p\'s child, not supported yet!');
      }
    }

  };

  var __insert = function () {
    var sel = me.document.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    // if (!sel.isCollapsed) __delete();
    var rng = sel.getRangeAt(0), tmp,
      start = rng.startContainer,
      end = rng.endContainer;
    console.log('before insert\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));

    // 清理占位符，我们不需要它
    if (domUtils.isFillChar(start)) {
      rng.setStartBefore(start);
      rng.collapse(true);
      domUtils.remove(start);
      mobile.fixSelectionRange(sel, rng);
      rng = sel.getRangeAt(0);
      start = rng.startContainer;
      end = rng.endContainer;
    }

    var now = __date();
    if ((tmp = __inIns(start)) && __user === tmp.getAttribute('cite') && now === tmp.getAttribute('datetime')) {
      // NOP
    }
    else {
      var p = domUtils.findParentByTagName(start, 'P', true);
      var next = start === p ? start.childNodes[rng.startOffset] : dom.breakParent(start, rng.startOffset, p, true);
      if (start === p && (tmp = p.childNodes[rng.startOffset]) && tmp.nodeType === 1 && tmp.tagName === 'BR') {
        if (tmp === next) next = null;
        p.removeChild(tmp);
      }
      var ins = __createIns();
      ins.innerHTML = '\u200B';
      // 这三步是必须的，并且顺序必须一致，这样可以保证在一个已有的ins之前插入的时候能够合并在一起
      // 先插入
      p.insertBefore(ins, next);
      // 再向后合并
      dom.merge(ins, true);
      // 再整理选区 // TODO 注意这里因为ins是向后合并的，所以可以想当然的将选区设置在第一个字符，也就是&#8203；
      rng.setStart(ins.firstChild, 0);
      rng.setEnd(ins.firstChild, 1);
      mobile.fixSelectionRange(sel, rng);
    }
    rng = sel.getRangeAt(0);
    start = rng.startContainer;
    end = rng.endContainer;
    console.log('after prepare insert\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end), me.body.innerHTML);
  };

  /* 保存场景 */
  var __timer;
  var __saveScene = function (sync) {
    __timer && clearTimeout(__timer);
    if (sync) {
      me.fireEvent('savescene');
      me.fireEvent('contentchange');
      me.fireEvent('selectionchange');
      return;
    }
    __timer = setTimeout(function () {
      me.fireEvent('savescene');
      me.fireEvent('contentchange');
      me.fireEvent('selectionchange');
      __timer = null;
    }, 300);
  }

  var __char = function (evt) {
    // domUtils.preventDefault(evt);
    __saveScene();
    __insert();
  };

  var __enter = function (evt) {
    // domUtils.preventDefault(evt);
    __saveScene();
    __insert();
  };

  var __space = function (evt) {
    domUtils.preventDefault(evt);
    __saveScene();
    __deleteSelection();
    __insert();

    // 如果是在段首敲空格，代替为全角中文空格，当作缩进
    var rng = me.selection.getRange(), start = rng.startContainer, tmp;
    // 这个条件在insert之后是必然的啊
    if (start.nodeType === 3 && start.nodeValue.substring(0, rng.startOffset).replace(/\u3000/gi, '').length === 0 && (tmp = __inIns(start))) {
      while (tmp = tmp.previousSibling) {
        if (tmp.textContent.replace(/\u3000/gi, '').length > 0) break;
      }
      if (!tmp) {
        me.document.execCommand('insertHtml', false, '&#12288;');
        return;
      }
    }
    // TODO 如果敲入字符的地方前面是个中文也要替换为中文全角空格吗？
    // 否则就代替为英文空格
    me.document.execCommand('insertHtml', false, '&nbsp;');
  };

  // 只有backspace和delete键需要处理sync的场景保存，而且前提是，undo.js中要解封
  // 注意：这里sync保存场景的一个不良结果是，连续删除的时候每一个字都有一次记录
  //       所以这里只测试了chrome下的判断，只有按键hold住之前的第一次触发才sync
  // 注意：开头和结尾的两次保存都是必须的，否则少一步回退
  var __backspace = function (evt) {
    domUtils.preventDefault(evt);
    var sync = !evt.originalEvent.repeat;
    __saveScene(sync);

    var rng = me.selection.getRange();
    if (rng.collpased && rng.startOffset === 0 && domUtils.isBondaryNode(rng.startContainer, 'firstChild')) return;
    else me.selection.getNative().modify('extend', 'backward', 'character');
    __deleteSelection(true);
    __saveScene(sync);
  };

  var __delete = function (evt) {
    domUtils.preventDefault(evt);
    var sync = !evt.originalEvent.repeat;
    __saveScene(sync);

    var rng = me.selection.getRange();
    if (rng.collpased && rng.startOffset === 0 && domUtils.isBondaryNode(rng.startContainer, 'firstChild')) return;
    else me.selection.getNative().modify('extend', 'forward', 'character');
    __deleteSelection(false);
    __saveScene(sync);
  };



  /**
   * Event 事件专区
   */
  var __keydown = function (evt) {
    // console.log('revised key')
    var keyCode = evt.keyCode || evt.which;

    if (dom.isChar(evt)) {
      __char(evt);
    }
    else if (keyCode === 13) {
      __enter(evt);
    }
    else if (keyCode === 32) {
      __space(evt);
    }
    else if (keyCode == 8) {
      __backspace(evt);
    }
    else if (keyCode == 46) {
      __delete(evt);
    }
  };

  // 输入法
  var __compStart = function (evt) {
    console.log('composition start', evt, evt.data)
    __saveScene(true);
    __deleteSelection();
    __insert();
  };
  var __compUpdate = function (evt) {
    // NOP
  };
  var __compEnd = function (evt) {
    console.log('composition end', evt, evt.data)
    // 好像浏览器自己会做
    // if (evt.data.length === 0) __cancelInsert();
    __saveScene(true);
  };

  /**
   * 成员专区
   */
  this.keydown = __keydown;
  this.compStart = __compStart;
  this.compEnd = __compEnd;

  this.setUser = function (user) {
    __user = user || ANONYMOUS;
  };
  this.setUsers = function (users) {
    var str = Array.prototype.map.call(users || [], user => `
      *[cite="${user.id}"],*[cite="${user.id}"] { color: ${user.color}; }
      del,ins {
          position: relative;
      }
      del:hover:before,
      ins:hover:before {
          position: fixed;
          left: 2px;
          bottom: 1px;
          background-color: rgba(0,0,0,0.6);
          color: white;
          padding: 3px 6px;
          font-size: xx-small;
      }
      del:hover:before {
          content: attr(cite)" 删除于 "attr(datetime);
      }
      ins:hover:before {
          content: attr(cite)" 添加于 "attr(datetime);
      }
    `).join('\n');
    utils.cssRule('revised', str, me.document);
  }
}

var utils = UM.utils;
UM.plugins["revised"] = function () {
  var me = this;
  var rev = new Revised(me);

  me.addListener('ready', function (type, evt) {
    var revised;
    if (revised = me.options.revised) {
      rev.setUser(revised.currentUser);
      rev.setUsers(revised.users);
    }
    me.body.addEventListener('compositionstart', rev.compStart, false);
    me.body.addEventListener('compositionend', rev.compEnd, false);
  });
  me.addListener('keydown', function (type, evt) {
    rev.keydown(evt);
  });
};

// 重新添加`undo`插件，以便让它排在我们的事件监听之后 `keydown`
require('./um-plugins/undo');
