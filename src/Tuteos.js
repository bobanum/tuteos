import Menu from './Menu.js';
import Copying from './Copying.js';
import Summary from './Summary.js';
import References from './References.js';

export default class Tuteos {
	static debug = false;
	static useAppFavicon = false;
	static indentation = "    ";
	static menu = [];	// Should be overridden
	static menuSelector = "#app";
	static summarySelector = "#app>div.body";
	static summaryItemsSelector = "article>:first-child";
	static stylesheets = [];
	static title = "Tuteos";
	static subtitle = "";
	/**
	 * Initializes the app. Sets static properties.
	 * Called on class load.
	 */
	static init() {
		console.pin = this.debug ? console.log : function () { };
		console.pin("Loading Tuteos");
		this.setPaths();
		this.setStrings();
		// this.load();
	}
	/**
	 * Loading the app called on window load event
	*/
	static load() {
		this.wrapContent();
		if (this.loadPromise) {
			console.pin("load in progress");
			return this.loadPromise;
		}
		console.pin("Adding head elements");
		this.addHeadElements();
		console.pin("Starting Tuteos.load");
		this.loadPromise = Promise.all([
			new Promise(resolve => {
				window.addEventListener("load", () => {
					console.pin("Window loaded");
					return resolve();
				});
			}),
		])
			.then(() => References.processAll())
			.then(() => {
				console.pin("References processed");
				this.addMenu();
				this.addSummary();
				Copying.process();
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
	static wrapContent() {
		var container = document.body.insertBefore(document.createElement("div"), document.body.firstChild);
		container.classList.add("interface");
		container.id = "app";
		container.appendChild(this.html_header());
		var body = container.appendChild(document.createElement("div"));
		body.classList.add("body");
		while (container.nextSibling) {
			body.appendChild(container.nextSibling);
		}
		container.appendChild(this.html_footer());
	}
	static html_header() {
		var result = document.createElement("header");
		var h1 = result.appendChild(document.createElement("h1"));
		h1.innerHTML = this.title;
		if (this.subtitle) {
			var h2 = result.appendChild(document.createElement("h2"));
			h2.innerHTML = this.subtitle;
		}
		return result;
	}
	static html_footer() {
		// <footer>Les vidéos sont disponibles sur <a href="https://www.youtube.com/channel/UCFWzWuHnqYOlBN2lJhBIGNg">la chaîne Youtube</a></footer>
		var result = document.createElement("footer");
		result.innerHTML = 'Les vidéos sont disponibles sur <a href="https://www.youtube.com/channel/UCFWzWuHnqYOlBN2lJhBIGNg">la chaîne Youtube</a>';
		return result;
	}
	/**
	 * Adds the menu to the app according to config file
	 */
	static addMenu() {
		var objMenu = new Menu(this.menu, "");
		var nav = objMenu.html_nav();
		var container = document.querySelector(this.menuSelector);
		container.appendChild(nav);
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
		var body = document.querySelector(this.summarySelector);
		var summary = new Summary(body, this.summaryItemsSelector);
		body.insertBefore(summary.html(), body.firstChild);
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
	static addHeadElements() {
		document.head.appendChild(this.html_style());
		document.head.appendChild(this.html_favicon());
		this.stylesheets.forEach(stylesheet => {
			document.head.appendChild(this.html_link(stylesheet));
		});
	}
	/**
	 * Adds link element for Tuteos stylesheet
	 * @todo Add stylesheets from config file
	 */
	static html_style() {
		return this.html_link(this.app_url("css/style.css"));
	}
	/**
	 * Adds link element for Tuteos stylesheet
	 * @todo Add stylesheets from config file
	 */
	static html_favicon() {
		var href = this.useAppFavicon ? 'favicon.ico' : this.app_url('../favicon.ico');
		return this.html_link(href, 'shortcut icon', { type: 'image/x-icon' });
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
}
Tuteos.init();
