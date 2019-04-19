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
    revised: {
      currentUser: 'veiky',
      users: [
        { id: 'anonymous', name: 'anonymous', color: 'blue' },
        { id: 'veiky', name: 'veiky', color: 'red' },
        { id: 'sun', name: 'sun', color: 'blue' },
        { id: 'soonwait', name: 'soonwait', color: 'green' }
      ]
    }
  });

module.exports = um;