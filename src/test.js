require('./revised/index-umeditor');
var um = require('./revised/um-instance');

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


  if (res = el.dispatchEvent(new KeyboardEvent('keydown', evt))) {
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



function fix(el) {
  // var el = um.body;
  el.addEventListener('input', (evt) => {
    if (evt.inputType === 'insertText') {
      document.execCommand('insertHtml', false, evt.data);
      evt.preventDefault();
    }
    else {
      console.log(evt);
    }
  }, false);
}


um.ready(() => {
    var el = um.body;
  el.focus();

  //   // fix(el);

  QUnit.test('empty', function (assert) {
    assert.expect(1);

    var content = '<p><br></p>';
    um.setContent(content);
    assert.ok('' === um.getContent(), '文档不为空');
  });

  //   QUnit.test('empty - a', function (assert) {
  //     assert.expect(1);

  //     var content = '<p><br></p>';
  //     um.setContent(content);
  //     keyA(el);
  //     assert.ok('<p>a</p>' === um.getContent(), '文档内容不符');
  //   });
})
