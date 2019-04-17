
var browser = UM.browser;

/**
 * 修补手机浏览器里的一些差异
 */
var mobile = {
  // 手机下，只修改range不起作用，必须重新sel.setRange一次
  fixSelectionRange: function (sel, rng) {
    if (browser.mobile) {
      sel.empty();
      sel.addRange(rng);
    }
  },
  // 手机输入法时，不触发compositionstart和compositionend事件的解决办法
  // ascii字符输入时，走的还是char部分
  fixCompositionNotWork: function (rev) {
    if (browser.mobile) {
      rev.insert();
      return true;
    }
    return false;
  }
};

module.exports = mobile;