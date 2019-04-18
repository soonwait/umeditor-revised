
require('./revised/index-umeditor');

UM.plugins["test-console"] = function () {
  var me = this;

  function formatXml(xml) {
    var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
    var wsexp = / *(.*) +\n/g;
    var contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    var pad = 0;
    var formatted = '';
    var lines = xml.split('\n');
    var indent = 0;
    var lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
    var transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };

    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];

      // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
      if (ln.match(/\s*<\?xml/)) {
        formatted += ln + "\n";
        continue;
      }
      // ---

      var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      var fromTo = lastType + '->' + type;
      lastType = type;
      var padding = '';

      indent += transitions[fromTo];
      for (var j = 0; j < indent; j++) {
        padding += '  '//'\t';
      }
      if (fromTo == 'opening->closing')
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      else
        formatted += padding + ln + '\n';
    }

    return formatted;
  }


  function getDomFullString(node) {
    var str;
    if (!node.firstChild) {
      str = node.nodeType === 3 ? `<text>${node.nodeValue.replace(/\u200B/gi, '&#8203;').replace(/\u3000/gi, '&#12288;')}</text>` : node.outerHTML;
      // 注意：outerHTML里已经包含了属性
    }
    else {
      str = `<${node.tagName.toLowerCase()}>${Array.from(node.childNodes).map(getDomFullString).join('')}</${node.tagName.toLowerCase()}>`;
      if (node.nodeType === 1 && (node.tagName === 'INS' || node.tagName === 'DEL')) {
        // TODO 这里只处理了DEL和INS的属性，其他的没处理呢还
        var t = ['cite', 'datetime'].filter(attr => !!node.getAttribute(attr)).map(attr => `${attr}="${node.getAttribute(attr)}"`).join(' ');
        str = str.replace(/>/, ' ' + t + '>');
      }
    }
    return str;
  }


  function getBody() {
    var str = getDomFullString(me.body);
    return str.substring(5, str.length - 6);
  }


  function spy() {
    // document.getElementById('sss').innerText = me.body.innerText;
    var el = document.getElementById('sss')
    el && (el.innerText = me.body.innerHTML.split('</p><p').join('</p>\n<p'));
    el = document.getElementById('sss1')
    el && (el.innerText = me.getContent(() => true).split('</p><p').join('</p>\n<p'));
    el = document.getElementById('sss2')
    el && (el.innerText = formatXml(getBody().split('</p><p').join('</p>\n<p')));
  }
  me.addListener('contentChange click', spy);
};

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

um.ready(function () {
  // 1. 空文档
  // 目前做了敲a，敲回车，undo，redo
  // 有个问题：敲a再回退之后变成<p><text>&#8203;</text><br></p>
  // 有个问题：敲回车再回退之后变成<p><text>&#8203;</text><br></p>
  // 有个问题：敲回车再回退再重做之后变成<p><br></p><p><text>&#8203;</text><br></p>
  um.setContent('<p><br></p>');
  // 2. 单行文档
  // 目前做了敲a，敲回车，undo，redo，敲backspace
  // 有个问题：在行首敲a再回退之后变成<p><text>&#8203;</text><text>中共中央总书记</text></p>
  // 有个问题：敲backspace删除第一个字再回退再重做，变成<p><del cite="any" datetime="2019-04-18 10:58"><text>&#8203;</text><text>中</text></del><text>共中央总书记</text></p>
  // 有个问题：敲backspace删除前两个字再回退再重做，变成<p><del cite="any" datetime="2019-04-18 10:58"><text>&#8203;</text><text>中共</text></del><text>中央总书记</text></p>
  // 有个问题：敲delete删除行尾一个字，光标移动后再敲delete删除第二个字，然后undo,undo,redo,redo
  //         变成<p><text>中共中央总</text><del cite="any" datetime="2019-04-18 11:28"><text>&#8203;</text><text>书记</text></del></p>
  // 有个问题：在del之后backspace删字，光标会直接跳过del
  // 有个问题：在del之前delete删字，光标会停在原地
  um.setContent('<p>中共中央总书记</p>');
  return;
  // 2.1 单行单插入标签
  um.setContent('<p><ins cite="any" datetime="2019-04-18 18:37">中共</ins>中央总书记</p>');
  um.setContent('<p>中共中央<ins cite="any" datetime="2019-04-18 18:37">总书记</ins></p>');
  um.setContent('<p>中共<ins cite="any" datetime="2019-04-18 18:37">中央</ins>总书记</p>');
  // 2.2 单行单删除标签
  um.setContent('<p><del cite="any" datetime="2019-04-18 18:37">中共</del>中央总书记</p>');
  um.setContent('<p>中共中央<del cite="any" datetime="2019-04-18 18:37">总书记</del></p>');
  um.setContent('<p>中共<del cite="any" datetime="2019-04-18 18:37">中央</del>总书记</p>');

  um.setContent(
    `新华社北京4月2日电  近日，中共中央总书记、国家主席、中央军委主席习近平对民政工作作出重要指示。习近平强调，近年来，民政系统认真贯彻中央决策部署，革弊鼎新、攻坚克难，各项事业取得新进展，有力服务了改革发展稳定大局。
  习近平指出，民政工作关系民生、连着民心，是社会建设的兜底性、基础性工作。各级党委和政府要坚持以人民为中心，加强对民政工作的领导，增强基层民政服务能力，推动民政事业持续健康发展。各级民政部门要加强党的建设，坚持改革创新，聚焦脱贫攻坚，聚焦特殊群体，聚焦群众关切，更好履行基本民生保障、基层社会治理、基本社会服务等职责，为全面建成小康社会、全面建设社会主义现代化国家作出新的贡献。
  第十四次全国民政会议4月2日在北京召开。会上传达了习近平的重要指示。
  中共中央政治局常委、国务院总理李克强会见与会代表并讲话，向默默耕耘在基层一线、倾情尽力为困难群众服务的全国民政系统广大干部职工致以诚挚问候，对近年来民政工作取得的成绩充分肯定。他说，民政工作直接面对人民群众，是社会治理和社会服务的重要组成部分，是扶危济困的德政善举。当前，我国正处在全面建成小康社会的决胜阶段，人民追求美好生活的愿望十分强烈，民政工作的任务艰巨繁重。要坚持以习近平新时代中国特色社会主义思想为指导，贯彻落实党中央、国务院决策部署，着力保基本兜底线，织密扎牢民生保障“安全网”。服务打赢脱贫攻坚战，做好低保和特困人员包括生活困难的老年人、重度残疾人、重病患者、困境儿童等的基本生活保障工作。着力发展基本社会服务，解决好群众关切的“为难事”。深化“放管服”改革，让群众办事更便捷，更大发挥社会力量作用，积极发展贴近需求的社区养老托幼等服务，丰富生活服务供给，带动扩大就业和有效内需。要大力发展社会工作和慈善事业，弘扬志愿服务精神，人人参与、人人尽力，使社会大家庭更加温馨和谐。各级政府要贯彻以人民为中心的发展思想，关心民政、支持民政，多做雪中送炭、增进民生福祉的事，促进经济持续健康发展和社会和谐稳定。
  国务委员王勇参加会见并在会上讲话指出，要深入学习贯彻习近平总书记关于民政工作的重要论述和指示精神，认真落实李克强总理讲话要求，牢固树立以人民为中心的发展思想，全面扎实完成脱贫攻坚兜底保障任务，加强和完善各类困难群体基本生活保障，不断提升基层社会治理和社会基本服务水平，努力推进民政事业改革发展上新台阶。
  肖捷、何立峰参加会见。
  第十四次全国民政会议的任务是，以习近平新时代中国特色社会主义思想为指导，认真学习贯彻习近平关于民政工作的重要论述，总结党的十八大以来民政事业改革发展取得的成就，研究部署今后一个时期的民政工作。
  各省区市和计划单列市、新疆生产建设兵团，中央和国家机关有关部门负责同志，全国民政系统先进集体、先进工作者和劳动模范、“孺子牛奖”获得者代表等出席会议。
  责任编辑：郭立`
  );
  um.setContent(
    '<p><del cite="veiky" datetime="2019-04-04T15:32">新华社北京4月2日电  近日，中共中央总书记、国</del>家主席、<ins cite="sun" datetime="2019-04-04T15:32">中央军委主席习近平</ins><ins cite="veiky" datetime="2019-04-04T15:32">对民政工作作出重</ins>要指示。习近平强调，近年来，民政系统认真贯彻中央决策部署，革弊鼎新、攻坚克难，各项事业取得新进展，有力服务了改革发展稳定大局。</p>\
<p>习近平指出，民政<ins cite="veiky" datetime="2019-04-04T15:32">工作关系民生、连着民心，是社会建</ins>设的兜底性、基础性工作。各级党委和政府要坚持以人民为中心，加强对民政工作的领导，增强基层民政服务能力，推动民政事业持续健康发展。各级民政部门要加强党的建设，坚持改革创新，聚焦脱贫攻坚，聚焦特殊群体，聚焦群众关切，更好履行基本民生保障、基层社会治理、基本社会服务等职责，为全面建成小康社会、全面建设社会主<del cite="veiky" datetime="2019-04-04T15:32">义现代化国家作出</del><del cite="veiky" datetime="2019-04-04T15:32">新的</del><del cite="veiky" datetime="2019-04-04T15:32">贡献。</del></p>\
<p><del cite="veiky" datetime="2019-04-04T15:32">第十四次全国民政会议4月2日在北京召开。会上传达了习近平的重要指示。</del></p>\
<p>中共中央政治局常委、国务院总理李克强会见与会代表并讲话，向默默耕耘在基层一线、倾情尽力为困难群众服务的全国民政系统广大干部职工致以诚挚问候，对近年来民政工作取得的成绩充分肯定。他说，民政工作直接面对人民群众，是社会治理和社会服务的重要组成部分，是扶危济困的德政善举。当前，我国正处在全面建成小康社会的决胜阶段，人民追求美好生活的愿望十分强烈，民政工作的任务艰巨繁重。要坚持以习近平新时代中国特色社会主义思想为指导，贯彻落实党中央、国务院决策部署，着力保基本兜底线，织密扎牢民生保障“安全网”。服务打赢脱贫攻坚战，做好低保和特困人员包括生活困难的老年人、重度残疾人、重病患者、困境儿童等的基本生活保障工作。着力发展基本社会服务，解决好群众关切的“为难事”。深化“放管服”改革，让群众办事更便捷，更大发挥社会力量作用，积极发展贴近需求的社区养老托幼等服务，丰富生活服务供给，带动扩大就业和有效内需。要大力发展社会工作和慈善事业，弘扬志愿服务精神，人人参与、人人尽力，使社会大家庭更加温馨和谐。各级政府要贯彻以人民为中心的发展思想，关心民政、支持民政，多做雪中送炭、增进民生福祉的事，促进经济持续健康发展和社会和谐稳定。</p>\
<p>国务委员王勇参加会见并在会上讲话指出，要深入学习贯彻习近平总书记关于民政工作的重要论述和指示精神，认真落实李克强总理讲话要求，牢固树立以人民为中心的发展思想，全面扎实完成脱贫攻坚兜底保障任务，加强和完善各类困难群体基本生活保障，不断提升基层社会治理和社会基本服务水平，努力推进民政事业改革发展上新台阶。</p>\
<p>肖捷、何立峰参加会见。</p>\
<p><del cite="veiky" datetime="2019-04-04T15:32">责任编辑：</del><ins  cite="veiky" datetime="2019-04-04T15:32">郭立</ins></p>'
  );
  um.setContent(
    '<p>新华社北<del cite="veiky" datetime="2019-04-04T15:32">京4月2日电  近日，中共中央总书记、国</del>家主席、<ins cite="sun" datetime="2019-04-04T15:32">中央军委主席习近平对</ins><ins cite="veiky" datetime="2019-04-04T15:32">民政工作作出重</ins>要指示。习近平强调，近年来，民政系统认真贯彻中央决策部署，革弊鼎新、攻坚克难，各项事业取得新进展，有力服务了改革发展稳定大局。</p>'
  );
})