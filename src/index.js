
require('./revised/index-umeditor');

UM.plugins["test-console"] = function () {
  var me = this;
  function getDomFullString(node) {
    if(!node.firstChild) {
      return node.nodeType === 3 ? `"${node.nodeValue}"` : node.outerHTML;
    }
    else {
      return `<${node.tagName.toLowerCase()}>${Array.from(node.childNodes).map(getDomFullString).join('')}</${node.tagName.toLowerCase()}>`;
    }
  }
  function getBody() {
    var str = getDomFullString(me.body);
    return str.substring(5, str.length - 6);
  }
  function spy() {
    // document.getElementById('sss').innerText = me.body.innerText;
    document.getElementById('sss').innerText = me.body.innerHTML.split('</p><p').join('</p>\n<p');
    document.getElementById('sss1').innerText = me.getContent(() => true).split('</p><p').join('</p>\n<p');
    document.getElementById('sss2').innerText = getBody().split('</p><p').join('</p>\n<p');
  }
  me.addListener('contentChange click', spy);
  // me.addListener('click', spy);
};

var um = require('./test');
