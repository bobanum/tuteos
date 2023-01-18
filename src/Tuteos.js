import Menu from './Menu.js';

export default class Tuteos {
	static debug = false;
	static useAppFavicon = false;
	static indentation = "    ";
	static menu = [];	// Should be overridden
	static menuContainer = "#app";
	/**
	 * Loading the app called on window load event
	 */
	static load() {
		if (this.loadPromise) {
			console.pin("load in progress");
			return this.loadPromise;
		}
		console.pin("Starting Tuteos.load");
		this.loadPromise = Promise.all([
			new Promise(resolve => {
				window.addEventListener("load", () => {
					console.pin("Window loaded");
					return resolve();
				});
			}),
		])
			.then(() => this.processReferences())
			.then(() => {
				console.pin("References processed");
				this.addMenu();
				this.addSummary();
				this.makeCopiable();
				// this.makeFoldable();
				this.addYoutubeIcons();
				// this.addYoutubeFrames();
			})
			.then(() => console.pin("Tuteos loaded"));
		return this.loadPromise;
	}
	/**
	 * Returns a Promise resolved when given file is loaded
	 * @param   {string}  file The path to json file
	 * @returns {Promise}  resolved json
	 */
	static loadJson(file) {
		return new Promise(resolve => {
			var xhr = new XMLHttpRequest();
			xhr.open("get", file);
			xhr.responseType = "json";
			xhr.addEventListener("load", (e) => {
				console.pin("File '" + file + "' loaded.");
				resolve(e.currentTarget.response);
			});
			xhr.send(null);
		});
	}
	/**
	 * Adds the menu to the app according to config file
	 */
	static addMenu() {
		var objMenu = new Menu("", this.menu);
		var nav = objMenu.html_nav();
		var container = document.querySelector(this.menuContainer);
		container.appendChild(nav);
	}
	/**
	 * Returns a Promise resolved when all references has been processed
	 * @returns {[[Type]]} [[Description]]
	 */
	static processReferences() {
		console.pin("Processing references");
		var refs = Array.from(document.querySelectorAll("li.ref"));
		var promises = refs.map(this.processRef, this);
		return Promise.all(promises);
	}
	/**
	 * Returns a Promise that loads given reference and processes it.
	 * @param   {HTMLElement} ref The element containing an url to reference
	 * @returns {Promise}     Promise returning removed ref after treatment
	 */
	static processRef(ref) {
		console.log(ref, ref.parentNode);
		var url = ref.querySelector("a").getAttribute("href");
		return this.loadReference(url).then(data => {
			console.pin("Processing ", url);
			var elements = Array.from(data.querySelectorAll("div.body>ol>li"));
			console.log(ref, ref.innerText, ref.parentNode);
			elements.forEach(element => ref.parentNode.insertBefore(element, ref));
			ref.parentNode.removeChild(ref);
			return ref;
		});
	}
	/**
	 * Returns a promise loading html file
	 * @param   {string}  url The url to file
	 * @returns {Promise} Promises giving loaded HTMLElement
	 */
	static loadReference(url) {
		return new Promise(resolve => {
			console.pin("Loading reference '" + url + "'");
			var xhr = new XMLHttpRequest();
			xhr.open("get", url);
			xhr.responseType = "document";
			xhr.addEventListener("load", (e) => {
				console.pin("Reference '" + url + "' loaded");
				resolve(e.target.response);
			});
			xhr.send();
		});
	}
	/**
	 * Finds every reference to video and adds Youtube icon
	 */
	static addYoutubeIcons() {
		var elements = document.querySelectorAll("li[data-video]");
		elements.forEach(element => {
			var icon = this.youtubeIcon(element.getAttribute("data-video"));
			element.querySelector("h2").appendChild(icon);
		}, this);
	}
	/**
	 * Finds every reference to video and adds iframe to Youtube video
	 */
	static addYoutubeFrames() {
		var elements = document.querySelectorAll("li[data-video]");
		elements.forEach(element => {
			var videoId = element.getAttribute("data-video");
			if (videoId) {
				element.insertBefore(this.youtubeFrame(videoId), element.querySelector("h2").nextSibling);
			}
		}, this);
	}
	/**
	 * Returns a link Youtube video with Youtube icon
	 * @param   {string}      id Id of the video
	 * @returns {HTMLElement} a.youtube element
	 */
	static youtubeIcon(id) {
		var result, href, img, span;
		result = document.createElement("a");
		result.classList.add("youtube");
		href = "https://youtu.be/" + id;
		result.setAttribute("href", href);
		result.setAttribute("target", "_blank");
		img = result.appendChild(document.createElement("img"));
		img.setAttribute('src', this.app_url("images/logo_youtube.svg"));
		img.setAttribute('alt', this._('youtube'));
		img.setAttribute('title', this._("watch_video_on_youtube"));
		span = result.appendChild(document.createElement("span"));
		span.innerHTML = href;
		return result;
	}
	/**
	 * Returns iframe element with data-video id
	 * @param   {string}      id Id of the video
	 * @returns {HTMLElement} iframe.youtube element
	 */
	static youtubeFrame(id) {
		var result = document.createElement("iframe");
		result.classList.add("youtube");
		var src = "https://www.youtube.com/embed/" + id;
		result.setAttribute("src", src);
		result.setAttribute("width", 560);
		result.setAttribute("height", 315);
		result.setAttribute("target", "_blank");
		result.setAttribute("frameborder", "0");
		result.setAttribute("allow", "autoplay; encrypted-media");
		result.setAttribute("allowfullscreen", "allowfullscreen");
		return result;
	}
	/**
	 * Makes every step foldable
	 * @todo Fix: avoid folding when clicking in youtube icon
	 * @todo: Add visual indicator to foldable/folded item
	 */
	static makeFoldable() {
		var elements = document.querySelectorAll("h2");
		elements.forEach(element => {
			element.addEventListener("click", function () {
				this.classList.toggle("folded");
			});
		});
	}
	/**
	 * Makes copiable items copiable
	 */
	static makeCopiable() {
		var elements = document.querySelectorAll(".copiable");
		elements.forEach(element => {
			var label = document.createElement("div");
			label.classList.add("label");
			label.innerHTML = element.innerHTML;
			element.innerHTML = "";

			element.appendChild(this.html_entityIcon('&#x1f4cb;&#xfe0e;', this._('copy_to_clipboard'), e => {
				this.copy(e.currentTarget);
			}));
			//element.appendChild(this.html_svgIcon('copy', this._('copy_to_clipboard'), (e) => {
			//    this.copy(e.currentTarget);
			//}));
			element.appendChild(label);
		});
	}
	/**
	 * Returns a span containing given entity with click event
	 * @param   {string}      entity Entity
	 * @param   {string}      alt    Label for title and alt attributes
	 * @param   {function}    evt    Click event function
	 * @returns {HTMLElement} span.icon element
	 */
	static html_entityIcon(entity, alt, evt) {
		var result = document.createElement("span");
		result.classList.add("icon");
		//var entities = {"&#x1f4cb;":"📋", "&#x1f4cc;": "📌", "&#x1f4cd;": "📍", "&#x1f4ce;": "📎"};
		result.innerHTML = entity;
		result.setAttribute("title", alt);
		result.addEventListener("click", evt);
		return result;
	}
	/**
	 * Returns an img element with givent svg icon name
	 * @param   {string}      entity Entity
	 * @param   {string}      alt    Label for title and alt attributes
	 * @param   {function}    evt    Click event function
	 * @returns {HTMLElement} span.icon element
	 */
	static html_svgIcon(name, alt, evt) {
		var result = document.createElement("img");
		result.classList.add("icon");
		result.setAttribute("src", this.app_url("images/icon_" + name + ".svg"));
		result.setAttribute("title", alt);
		result.addEventListener("click", evt);
		return result;
	}
	/**
	 * Adds summary to app
	 */
	static addSummary() {
		var body = document.body.querySelector("#app>div.body");
		body.insertBefore(this.createSummary("li[id]>h2"), body.firstChild);
	}
	/**
	 * Creates and returns summary of elements matching given selector
	 * @param   {string}      selecteur The selector for matching elements
	 * @returns {HTMLElement} A nav#summary element
	 */
	static createSummary(selector) {
		var result, elements, title, list;
		result = document.createElement("nav");
		result.setAttribute("id", "summary");
		title = result.appendChild(document.createElement("h2"));
		title.innerHTML = this._("summary");
		list = result.appendChild(document.createElement("ol"));
		elements = document.body.querySelectorAll(selector);
		elements.forEach(element => {
			list.appendChild(this.createSummaryItem(element));
			element.appendChild(this.upIcon());
		});
		return result;
	}
	/**
	 * Returns li HTMLElement for summary
	 * @param   {HTMLElement} element Element to analyse for label
	 * @returns {HTMLElement} li element with link
	 */
	static createSummaryItem(element) {
		var result, a, id;
		id = element.closest("[id]").getAttribute("id");
		result = document.createElement("li");
		a = result.appendChild(document.createElement("a"));
		a.innerHTML = element.textContent;
		a.setAttribute("href", "#" + id);
		return result;
	}
	/**
	 * Returns the link leading to summary
	 * @returns {HTMLElement} a element
	 */
	static upIcon() {
		var result;
		result = document.createElement("a");
		result.setAttribute("href", "#summary");
		result.innerHTML = "⮵";
		return result;
	}
	/**
	 * Copies innerText of given element to the clipboard
	 * @param {HTMLElement} element The element from which to take the text
	 */
	static copy(element) {
		var copiable, text, input;
		copiable = element.parentNode;
		text = this.grabText(copiable);
		input = document.body.appendChild(document.createElement("textarea"));
		if (copiable.classList.contains("codeblock")) {
			text = text + "\r\n";
		}
		input.value = text;
		input.select();
		document.execCommand("Copy");
		input.parentNode.removeChild(input);
		this.copiedTag(copiable);
	}
	/**
	 * Activate tag displaying "copied" briefly.
	 * @returns {Promise} [[Description]]
	 */
	static copiedTag(copiable) {
		return new Promise(resolve => {
			var tag = copiable.firstChild.appendChild(document.createElement("span"));
			tag.classList.add("tag");
			tag.innerHTML = this._("copied");
			tag.addEventListener("transitionend", function (e) {
				e.currentTarget.parentNode.removeChild(this);
				resolve(e.currentTarget);
			});
			window.setTimeout(function () {
				tag.classList.add('out');
			}, 10);
		});
	}
	/**
	 * Return the copiable innerText of given element
	 * @param   {HTMLElement} copiable HTMLElement containing text
	 * @returns {string}      The resulting text
	 */
	static grabText(copiable, join = true) {
		copiable = copiable.querySelector(".label").cloneNode(true);
		var samps = Array.from(copiable.querySelectorAll("samp, del"));
		samps.forEach(function (d) {
			d.parentNode.removeChild(d);
		});
		var elements = this.grabBlockText(copiable);

		var result = elements;
		if (join) {
			result = elements.join("\r\n");
		}
		return result;
	}
	/**
	 * Return the copiable innerText of given element
	 * @param   {HTMLElement} block HTMLElement containing text
	 * @returns {string}      The resulting text
	 */
	static grabBlockText(block) {
		block = block.cloneNode(true);
		var samps = Array.from(block.querySelectorAll("samp, del"));
		samps.forEach((samp) => {
			samp.remove();
		});
		var elements = Array.from(block.childNodes);
		elements = elements.filter(element => {
			return (!(element instanceof Text && /^[ \r\n\t]*$/.test(element.data)));
		}).reduce((array, element) => {
			console.log(element);
			if (element.classList.contains("block")) {
				let texts = this.grabBlockText(element);
				console.log(texts);
				array.push(...texts.filter(text => text !== "").map(text => this.indentation + text));
			} else {
				let text = element.data || element.textContent;
				console.log(text);
				if (text) {
					array.push(text);
				}
			}
			return array;
		}, []);
		return elements;
	}
	/**
	 * Returns absolute url of url relative to content page
	 * @param   {string} file Relative url
	 * @returns {string} Resulting absolute url
	 */
	static page_url(file) {
		if (!file) {
			return this._url_page;
		} else {
			return this._url_page + "/" + file;
		}
	}
	/**
	 * Returns absolute url of url relative to Tuteos app folder
	 * @param   {string} file Relative url
	 * @returns {string} Resulting absolute url
	 */
	static app_url(file) {
		if (!file) {
			return this._url_app;
		} else {
			return this._url_app + "/" + file;
		}
	}
	/**
	 * Return the directory name (removes file name) of given url
	 * @param   {string} path Full url
	 * @returns {string} Url
	 */
	static dirname(path) {
		return path.split("/").slice(0, -1).join("/");
	}
	/**
	 * Set paths static properties for urls
	 */
	static setPaths() {
		this._url_app = this.dirname(import.meta.url);
		this._url_page = this.dirname(location.href);
	}
	/**
	 * Adds link element for Tuteos stylesheet
	 * @todo Add stylesheets from config file
	 */
	static html_link(href, rel = 'stylesheet', attrs = {}) {
		var result;
		result = document.createElement("link");
		result.rel = rel;
		result.href = href;
		for (let name in attrs) {
			result[name] = attrs[name];
		}
		return result;
	}
	/**
	 * Adds link element for Tuteos stylesheet
	 * @todo Add stylesheets from config file
	 */
	static html_style(add = true) {
		var result = this.html_link(this.app_url("css/style.css"));
		if (add) {
			document.head.appendChild(result);
		}
		return result;
	}
	/**
	 * Adds link element for Tuteos stylesheet
	 * @todo Add stylesheets from config file
	 */
	static html_favicon(add = true) {
		var href = this.useAppFavicon ? 'favicon.ico' : this.app_url('../favicon.ico');
		var result = this.html_link(href, 'shortcut icon', { type: 'image/x-icon' });
		if (add) {
			document.head.appendChild(result);
		}
		return result;
	}
	/**
	 * Sets strings for localization.
	 * @todo Eventually, put in external files.
	 */
	static setStrings() {
		this.strings = {
			"en": {
				"youtube": "Youtube",
				"watch_video_on_youtube": "Watch video on Youtube",
				"copy_to_clipboard": "Copy to clipboard",
				"summary": "Summary",
				"copied": "Copied",
			},
			"fr": {
				"watch_video_on_youtube": "Visionner la vidéo dans Youtube",
				"copy_to_clipboard": "Copier dans le presse-papier",
				"summary": "Sommaire",
				"copied": "Copié",
			}
		};
		this.strings.current = {};
		Object.assign(this.strings.current, this.strings.en);	// Fallback
		Object.assign(this.strings.current, this.strings.fr);
	}
	/**
	 * Return corresponding string for localization
	 * If wanted string doesn't exist, returns dflt value or name
	 * @param   {string} name The name (id) of wanted string
	 * @param   {string} dflt Default value
	 * @returns {string} Found string
	 */
	static _(name, dflt) {
		var result = this.strings.current[name];
		if (result) {
			return result;
		}
		if (dflt !== undefined) {
			return dflt;
		}
		return name;
	}
	/**
	 * Initializes the app. Sets static properties.
	 * Called on class load.
	 */
	static init() {
		console.pin = this.debug ? console.log : function () { };
		console.pin("Loading Tuteos");
		this.setPaths();
		this.html_style();
		this.html_favicon();
		this.setStrings();
		// this.load();
	}
}
Tuteos.init();
