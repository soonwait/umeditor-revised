




概念：
1. 光标及选区位置表示：`[]`
1. 文档中只支持以下内容：`p > br|#text|ins|del`
>  1. 第一版，无格式文本：`p > br|#text|ins|del`
>  1. 第二版，简单格式文本：`p > br|#text|b|i|u|h1-h9|hr|ins|del`，其中u用来表示错别字

第一版，测试用例

用例1 - 空文档字符插入
1. 文档为空时，实际内容为`<p>[]<br></p>`，这是一个场景
1. 插入字符时，`<p><ins>[&#8203;]</ins></p>`，这是个瞬间状态
1. 插入字符后，`<p><ins>x[]</ins></p>`，这是一个场景，或者输入若干字符后存成场景，取决于输入的时间长短，避免每一次输入都保存场景
1. 再次删除字符后，`<p>[]<br></p>`

4. 回车换行