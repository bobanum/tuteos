# Documentation

## Presentation

## Installation

## Getting Started
### Basic HTML Page
```html
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <script src="./tuteos.js" type="module"></script>
    <title>Étapes</title>
</head>

<body>
	<h1>My Tutorial</h1>
	<article id="my_article">
		<h2>My Article</h2>
		<ol>
			<li>An instruction</li>
			<li>An instruction with inline code : <span class="command copyable">put this in the terminal</span></li>
			<li>
				<p>An instruction with block code :</p>
				<div class="codeblock php copyable">
					<div>static public function my_function() {</div>
					<div class="block">
						<div>// this will be indented</div>
						<div><samp>This will not be copied</samp></div>
						<div>another(instruction);</div>
					</div>
					<div>}</div>
				</div>
			</li>
		</ol>
	</article>
</body>

</html>
```
### Javascript Stub
- Create the JS file `tuteos.js`
- Add basic code below
```js
import ParentTuteos from "http://localhost:5555/src/Tuteos.js";
class Tuteos extends ParentTuteos {
	static useAppFavicon = false;
	static indentation = "    ";
    static stylesheets =  ["css/style.css"];
    static menuSelector = "#app";
    static menu =  [
        {
            "label": "Complet",
            "url": "index.html",
            "icon": "btn_complet.svg",
        },
    ];
}

Tuteos.load().then(() => console.pin("Finished!"));

```
## The HTML Elements
|Tag|Definition|Remarks|
|---|----------|-------|
|`<cite>`| Used to mark a name | See [classes](#the-classes-and-ids)
|`<dfn>`|Will show a bubble with the definition (`title` attribute)|
### For Copyable Elements
These tags are to be user in a `.copyable` element.
|Tag|Definition|Remarks|
|---|----------|-------|
|`<ins>`|Will __not__ be displayed but will be copied|Could used to put comments in the copied code.
|`<del>`|Will be ignored when copying|Use when removing or replacing existing code. Is displayed as __strikethrough__ and __faded__
|`<em>`|Will be __faded__ but still be copied|
|`<samp>`|Will be ignored when copying. |Is displayed __faded__|
|`<s>`|Will be ignored when copying|Like `<samp>` but __not faded__, 


## The Classes and Ids
### Visual Classes (classes that only change visual aspects)
|Class or Id|Definition|Remarks|
|-----------|----------|-------|
|`.app`|With `<cite>` the name of an app||
|`.blade`|For _blade_ code||
|`.codeblock`|For a block of code. The `<div>`s inside a `.codeblock` are `white-space:pre`|See [Codeblocks](#codeblocks-and-indentation) below|
|`.body`|The _body_ inside of a `.module`||
|`.command`|For command for the terminal||
|`.controller`|For _controller_ code||
|`.file`|The path to a file||
|`.module`|Defines a `flex` element with a `<header>`, `.body` and `<footer>` ||
|`.php`|For _PHP_ code||

|`.string`|une chaîne de caractères||
|`.view`|le chemin d'une view||
|`.youtube` <small>généré</small>|Le lien vers Youtube||
### Functionnal Classes (classes that will be processes by JS)
|Class or Id|Definition|Remarks|
|-----------|----------|-------|
|`.copyable`|Makes content of element copyable|Adds a clipboard icon. See [Make Copyable](#make-copyable) below|
|`.icon` <small>generated</small>|The clipboard icon for copying||
|`.label` <small>generated</small>|Is added to a `.copyable` element||
|`.folded` <small>generated obselete for now</small>|When a section is folded||
|`.ref`|The `[href]` elements in the element will be replaced by the references page|
|`.block`||
|`.split`||
## The attributes (with data-xxx)
- data-definition : dans un `<dfn>`. Fait aparaître une bulle
- data-video : dans ul li. Fait ajouter un liien vers Youtube
## Codeblocks and Indentation
## Make Copyable

## Toteos Javascript Classes
|Class|Definition|Remarks|
|-----|----------|-------|
|Tuteos|(static) Main class|
|Copying|(static) Class making parts of tutorial copyable|
|Menu|Creates the menu using data in the stub and page's script|
|Summary|Creates the summary with the content of the page|

### Tuteos Properties (Global app preferences)
- These properties cans be overridden in the stub.

|Property|Definition|Remarks|
|-----|----------|-------|
|Tuteos.useAppFavicon|Which favicon to use. `true`=App's favicon, `false`=Tuteos' favicon|The favicon must be `/favicon.ico`. Default: `false`;
|Tuteos.indentation|Indentation characters for the copied code|Default: `"`&nbsp;&nbsp;&nbsp;&nbsp;`"` (4 spaces);
|Tuteos.stylesheets|Array of stylesheet paths to link for custom display|Default:`[]` (empty array);
|Tuteos.menuSelector|Selector of where to put the menu|Will be appended (for now) to corresponding element. Default: `"#app"`;
|Tuteos.menu|Array of the menu elements. |Default: `[]` (empty array);
|Tuteos.summarySelector|Array of the menu elements. |Default: `"article>:first-child"` (empty array);
|Tuteos.summaryItemsSelector|Selector to designate what element enters in the summary (the label)|Default: `"article>:first-child"` (empty array)
