;
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
].forEach(name => {
  delete UM.plugins[name];
});




/**
 * 移除默认命令
 */
["inserthtml", "insertimage", "print", "cleardoc", "preview", "fullscreen"].forEach(cmdName => {
  delete UM.commands[cmdName];
});







var mobile = require('./mobile');
var dom = require('./dom');

var domUtils = UM.dom.domUtils;

function Revised(me) {


  var __toString = function (e) {
    if (typeof e === 'object' && e instanceof Array) {
      return `[${e.map(__toString).join(',')}]`;
    }
    return e.nodeType === 3 ? `"${e.nodeValue}"` : e.nodeType === 11 ? Array.from(e.childNodes).reduce((a, e) => {
      return a + __toString(e);
    }, "") : e.outerHTML;
  };

  var __user = 'any';

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
  var __date = function () {
    return new Date().toISOString().substring(0, 16).replace('T', ' ');
  };

  var __createDel = function () {
    var del = me.document.createElement('DEL');
    del.setAttribute('cite', __user);
    del.setAttribute('datetime', __date());
    return del;
  };

  var __createIns = function (user, datetime) {
    var ins = me.document.createElement('INS');
    ins.setAttribute('cite', user || __user);
    ins.setAttribute('datetime', datetime || __date());
    return ins;
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
      var next = start !== p ? dom.split(start, rng.startOffset, p, true) : start.childNodes[rng.startOffset];
      if (p === start && (tmp = p.childNodes[rng.startOffset]) && tmp.nodeType === 1 && tmp.tagName === 'BR') {
        if (tmp === next) next = null;
        p.removeChild(tmp);
      }
      var ins = __createIns();
      ins.innerHTML = '\u200B';
      p.insertBefore(ins, next);
      rng.setStart(ins, 0);
      rng.setEnd(ins, 1);
      // rng.collapse(true);
      mobile.fixSelectionRange(sel, rng);

      // TODO 合并前后节点
      // me.selection.getRange().mergeSibling(ins, 'nextSibling');
    }
    rng = sel.getRangeAt(0);
    start = rng.startContainer;
    end = rng.endContainer;
    console.log('after prepare insert\n', rng.startOffset, __toString(start), '\n', rng.endOffset, __toString(end));
  };

  var __deleteBackward = function () {
    var rng = me.selection.getRange();
    if (rng.collpased && rng.startOffset === 0 && domUtils.isBondaryNode(rng.startContainer, 'firstChild')) return;
    else me.selection.getNative().modify('extend', 'backward', 'character');
  };

  // var __enter = function () {
  //   var rng = me.selection.getRange();
  // };

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


  /**
   * Event 事件专区
   */

  var __keydown = function (evt) {
    console.log('revised key')
    var keyCode = evt.keyCode || evt.which;

    // input
    if (dom.isChar(evt)) {
      __saveScene();
      __insert();
    }
    // enter
    else if (keyCode === 13) {
      // domUtils.preventDefault(evt);
      __saveScene();
      __insert();
    }
    // backspace
    else if (keyCode == 8) {
      __deleteBackward();
      domUtils.preventDefault(evt);
    }
  };




  /**
   * 成员专区
   */
  this.keydown = __keydown;
}


UM.plugins["revised"] = function () {
  var me = this;
  var rev = new Revised(me);

  me.addListener('keydown', function (type, evt) {
    rev.keydown(evt);
  });
};

// 重新添加`undo`插件，以便让它排在我们的事件监听之后 `keydown`
require('./um-plugins/undo');
