var serverPath = 'https://ueditor.baidu.com/server/umeditor/',
  um = UM.getEditor('editor', {
    imageUrl: serverPath + "imageUp.php",
    imagePath: serverPath,
    lang: /^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en',
    langPath: UMEDITOR_CONFIG.UMEDITOR_HOME_URL + "lang/",
    focus: true,
    focusInEnd: false,
    autoFloatEnabled: false,
    /* 传入配置参数,可配参数列表看umeditor.config.js */
    //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
    // toolbar: [
    //     'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
    //     'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
    //     '| justifyleft justifycenter justifyright justifyjustify |',
    //     'link unlink | emotion image video  | map',
    //     '| horizontal print preview fullscreen', 'drafts', 'formula'
    // ],
    // toolbar: ['source | undo redo | selectall cleardoc | bold italic underline | justifyleft justifycenter justifyright | emotion image video map | horizontal print preview fullscreen'],
    toolbar: ['undo redo | bold italic underline'],
    // excludePlugins: ["justify", "font", "link", "paragraph", "horizontal", "undo", "paste", "list", "source", "enterkey", "basestyle", "video", "selectall", "removeformat", "keystrokes", "autosave", "autoupload", "formula", "xssFilter"],
    excludePlugins: [
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
      // "undo", //撤销和重做
      "video", //插入视频
      "xssFilter" //xss过滤器
    ],
  });

// um.ready(function () {
//   um.focus(false);
//   um.setContent('<p>s</p>\
// <p><ins cite="any" datetime="2019-04-17 09:25">sadfsaf</ins></p>\
// <p><ins cite="any" datetime="2019-04-17 09:25">fdsafasfdsaf</ins></p>\
// <p><ins cite="any" datetime="2019-04-17 09:25">fdsafas</ins></p>');

//   testSuite();
// })
// function insertHtml() {
//   var value = prompt('插入html代码', '');
//   um.execCommand('insertHtml', value)
// }
// function getAllHtml() {
//   alert(UM.getEditor('editor').getAllHtml())
// }
// function getContent() {
//   var arr = [];
//   arr.push("使用editor.getContent()方法可以获得编辑器的内容");
//   arr.push("内容为：");
//   arr.push(UM.getEditor('editor').getContent());
//   alert(arr.join("\n"));
// }
// function isFocus() {
//   alert(um.isFocus())
// }
// function doBlur() {
//   um.blur()
// }
// function getPlainTxt() {
//   var arr = [];
//   arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
//   arr.push("内容为：");
//   arr.push(UM.getEditor('editor').getPlainTxt());
//   alert(arr.join('\n'))
// }
// function setContent(isAppendTo) {
//   var arr = [];
//   arr.push("使用editor.setContent('欢迎使用umeditor', true)方法可以设置编辑器的内容");
//   UM.getEditor('editor').setContent('欢迎使用umeditor', isAppendTo);
//   alert(arr.join("\n"));
// }
// function setDisabled() {
//   UM.getEditor('editor').setDisabled('fullscreen');
//   disableBtn("enable");
// }

// function setEnabled() {
//   UM.getEditor('editor').setEnabled();
//   enableBtn();
// }

// function getText() {
//   //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
//   var range = UM.getEditor('editor').selection.getRange();
//   range.select();
//   var txt = UM.getEditor('editor').selection.getText();
//   alert(txt)
// }

// function getContentTxt() {
//   var arr = [];
//   arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
//   arr.push("编辑器的纯文本内容为：");
//   arr.push(UM.getEditor('editor').getContentTxt());
//   alert(arr.join("\n"));
// }
// function hasContent() {
//   var arr = [];
//   arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
//   arr.push("判断结果为：");
//   arr.push(UM.getEditor('editor').hasContents());
//   alert(arr.join("\n"));
// }
// function setFocus() {
//   UM.getEditor('editor').focus();
// }
// function deleteEditor() {
//   disableBtn();
//   UM.getEditor('editor').destroy();
// }
// function disableBtn(str) {
//   var div = document.getElementById('btnContainer');
//   var btns = UM.dom.domUtils.getElementsByTagName(div, "button");
//   for (var i = 0, btn; btn = btns[i++];) {
//     if (btn.id == str) {
//       UM.dom.domUtils.removeAttributes(btn, ["disabled"]);
//     } else {
//       $(btn).attr("disabled", true).addClass("disabled");
//     }
//   }
// }
// function enableBtn() {
//   var div = document.getElementById('btnContainer');
//   var btns = UM.dom.domUtils.getElementsByTagName(div, "button");
//   for (var i = 0, btn; btn = btns[i++];) {
//     $(btn).removeAttr("disabled").removeClass("disabled");
//   }
// }

// window.onkeydown = function (e) {
//   if (!um.isFocus()) {
//     var keyCode = e.keyCode || e.which;
//     if (keyCode == 8) {
//       e.preventDefault();
//     }
//   }
// };

// function fireKeyEvent(el, evtType, keyCode) {
//   var doc = el.ownerDocument,
//     win = doc.defaultView || doc.parentWindow,
//     evtObj;
//   if (doc.createEvent) {
//     if (win.KeyEvent) {
//       evtObj = doc.createEvent('KeyEvents');
//       evtObj.initKeyEvent(evtType, true, true, win, false, false, false, false, keyCode, 0);
//     }
//     else {
//       evtObj = doc.createEvent('UIEvents');
//       Object.defineProperty(evtObj, 'keyCode', {
//         get: function () { return this.keyCodeVal; }
//       });
//       Object.defineProperty(evtObj, 'which', {
//         get: function () { return this.keyCodeVal; }
//       });
//       evtObj.initUIEvent(evtType, true, true, win, 1);
//       evtObj.keyCodeVal = keyCode;
//       if (evtObj.keyCode !== keyCode) {
//         console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
//       }
//     }
//     el.dispatchEvent(evtObj);
//   }
//   else if (doc.createEventObject) {
//     evtObj = doc.createEventObject();
//     evtObj.keyCode = keyCode;
//     el.fireEvent('on' + evtType, evtObj);
//   }
// }

function keyA(el) {
  var res, evt = {
    key: 'a',
    code: 'KeyA',
    keyCode: 65,
    which: 65,
    isTrusted: true, // no effect
    view: window,
    // sourceCapabilities: // no effect
    currentTarget: el, // no effect
    eventPhase: 2, // no effect
    bubbles: true,
    cancelable: true,
    composed: true
  };

//     isTrusted false true
//     app.bundle.js:9831 sourceCapabilities null InputDeviceCapabilities {firesTouchEvents: false}
//     app.bundle.js:9831 currentTarget null <textarea id=​"test">​</textarea>​
//     app.bundle.js:9831 eventPhase 0 2
//     app.bundle.js:9831 bubbles false true
//     app.bundle.js:9831 cancelable false true
//     app.bundle.js:9831 composed false true
//     app.bundle.js:9831 timeStamp 2266.3699999975506 4349.019999994198
//     app.bundle.js:9831 path (5) [textarea#test, body, html, document, Window] (5) [textarea#test, body, html, document, Window]

//     isTrusted false true
//     app.bundle.js:9831 charCode 0 97
//     app.bundle.js:9831 keyCode 65 97
//     app.bundle.js:9831 sourceCapabilities null InputDeviceCapabilities {firesTouchEvents: false}
//     app.bundle.js:9831 which 65 97
//     app.bundle.js:9831 currentTarget null <textarea id=​"test">​</textarea>​
//     app.bundle.js:9831 eventPhase 0 2
//     app.bundle.js:9831 bubbles false true
//     app.bundle.js:9831 cancelable false true
//     app.bundle.js:9831 composed false true
//     app.bundle.js:9831 timeStamp 2267.475000000559 4349.339999986114
//     app.bundle.js:9831 path (5) [textarea#test, body, html, document, Window] (5) [textarea#test, body, html, document, Window]

//     isTrusted false true
// app.bundle.js:9831 currentTarget null <textarea id=​"test">​</textarea>​
// app.bundle.js:9831 eventPhase 0 2
// app.bundle.js:9831 bubbles false true
// app.bundle.js:9831 composed false true
// app.bundle.js:9831 timeStamp 2268.3350000006612 4357.074999978067
// app.bundle.js:9831 path (5) [textarea#test, body, html, document, Window] (5) [textarea#test, body, html, document, Window]


// isTrusted false true
// app.bundle.js:9831 sourceCapabilities null InputDeviceCapabilities {firesTouchEvents: false}
// app.bundle.js:9831 currentTarget null <textarea id=​"test">​</textarea>​
// app.bundle.js:9831 eventPhase 0 2
// app.bundle.js:9831 bubbles false true
// app.bundle.js:9831 cancelable false true
// app.bundle.js:9831 composed false true
// app.bundle.js:9831 timeStamp 2269.109999993816 4476.744999992661
// app.bundle.js:9831 path (5) [textarea#test, body, html, document, Window] (5) [textarea#test, body, html, document, Window]

  if(res = el.dispatchEvent(new KeyboardEvent('keydown', evt))) {
    console.log(res);
    evt.charCode = evt.keyCode = evt.which = 97;
    res = el.dispatchEvent(new KeyboardEvent('keypress', evt));
    console.log(res);
    res = el.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: 'a', bubbles: true, composed: true }));
    console.log(res);
  }
  evt.keyCode = evt.which = 65;
  delete evt.charCode;
  res = el.dispatchEvent(new KeyboardEvent('keyup', evt));
  console.log(res);
}
// function equal(v1, v2, ss) {
//   if(v1 !== v2) throw new Error(ss || '两个值不相等' + v1 + v2);
// }
// function test(tcs, tfn) {
//   console.log('start test case:', tcs);
//   try {
//     tfn.call(this);
//   } catch(e) {
//     console.error('failure test case:', tcs, e);
//     return;
//   }
//   console.info('success test case:', tcs);
// }

// function testSuite() {
//   var el = um.body;
//   el.addEventListener('input', (evt)=> {
//     if(evt.inputType === 'insertText') {
//       document.execCommand('insertHtml', false, evt.data);
//       evt.preventDefault();
//     }
//     else {
//       console.log(evt);
//     }
//   }, false);


//   test('empty doc - input A', function(){
//     um.setContent('<p><br></p>');
//     um.focus();
//     keyA(um.body);
//     keyA(um.body);
//     keyA(um.body);
//     equal('<p><ins cite="any">aaa</ins></p>', um.getContent().replace(/\sdatetime="[0-9\s\:\-]+"/gi, ''));
//   });
// }

// var oldEvt = {};
// function testSuite1() {

//   // var el = document.getElementById('test') //um.body;
//   var el = um.body;
//   // el.focus();
//   // el.select();

//   var fn = (evt) => {
//     if(oldEvt[evt.type]) {
//       for(var i in evt) {
//         if(evt[i] !== oldEvt[evt.type][i]) console.log(i, oldEvt[evt.type][i], evt[i]);
//       }
//     } else {
//       oldEvt[evt.type] = evt
//     }
//     console.log('event:', evt.type, evt)
//     if(evt.type === 'input' && evt.inputType === 'insertText') {
//       document.execCommand('insertHtml', false, evt.data);
//       evt.preventDefault();
//     }
//   };
//   el.addEventListener('keydown', fn, false);
//   el.addEventListener('keypress', fn, false);
//   el.addEventListener('input', fn, false);
//   el.addEventListener('keyup', fn, false);
//   setInterval(() => {
//   // setTimeout(() => {


//     // fireKeyEvent(el, 'keydown', 48);
//     // fireKeyEvent(el, 'keypress', 48);
//     // fireKeyEvent(el, 'input', 48);
//     // fireKeyEvent(el, 'keyup', 48);
//   }, 1000)
// }

// module.exports = um;
// var test = QUnit.test;
// var equal = QUnit.assert.equal;
// var ok = QUnit.assert.ok;


  
function fix(el) {
  // var el = um.body;
  el.addEventListener('input', (evt)=> {
    if(evt.inputType === 'insertText') {
      document.execCommand('insertHtml', false, evt.data);
      evt.preventDefault();
    }
    else {
      console.log(evt);
    }
  }, false);
}


// um.ready(() => {
//   var el = um.body;
//   el.focus();

//   // fix(el);

//   QUnit.test('empty', function (assert) {
//     assert.expect(1);

//     var content = '<p><br></p>';
//     um.setContent(content);
//     assert.ok('' === um.getContent(), '文档不为空');
//   });

//   QUnit.test('empty - a', function (assert) {
//     assert.expect(1);

//     var content = '<p><br></p>';
//     um.setContent(content);
//     keyA(el);
//     assert.ok('<p>a</p>' === um.getContent(), '文档内容不符');
//   });
// })
