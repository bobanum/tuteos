import Tuteos from "./Tuteos.js";

export default class Summary {
	domain = null;
	selector = "article>:first-child";
	constructor(domain, selector) {
		this.domain = domain;
		this.selector = selector;
	}

	/**
	 * Creates and returns summary of elements matching given selector
	 * @param   {string}      selecteur The selector for matching elements
	 * @returns {HTMLElement} A nav#summary element
	 */
	html(selector = this.selector) {
		var result, elements, title, list;
		result = document.createElement("nav");
		result.setAttribute("id", "summary");
		title = result.appendChild(this.html_header());
		list = result.appendChild(document.createElement("ol"));
		elements = document.body.querySelectorAll(selector);
		elements.forEach(element => {
			list.appendChild(this.html_item(element));
			element.appendChild(this.upIcon());
		});
		return result;
	}
	/**
	 * XXXCreates and returns summary of elements matching given selector
	 * @param   {string}      selecteur The selector for matching elements
	 * @returns {HTMLElement} A nav#summary element
	 */
	html_header() {
		var result = document.createElement("header");
		var title = result.appendChild(document.createElement("h2"));
		title.innerHTML = Tuteos._("summary");
		result.appendChild(this.upIcon());
		return result;
	}
	/**
	 * Returns li HTMLElement for summary
	 * @param   {HTMLElement} element Element to analyse for label
	 * @returns {HTMLElement} li element with link
	 */
	html_item(element) {
		var result, a, id;
		var label = element.textContent;
		var container = element.closest("[id]") || element.parentNode;
		var id = container.getAttribute("id");
		if (!id) {
			id = element.id = this.slug(label);
		}
		
		var result = document.createElement("li");
		var a = result.appendChild(document.createElement("a"));
		a.innerHTML = label;
		a.setAttribute("href", "#" + id);
		return result;
	}
	/**
	 * Returns the link leading to summary
	 * @returns {HTMLElement} a element
	 */
	upIcon() {
		var result;
		result = document.createElement("a");
		result.classList.add("icon-top")
		result.setAttribute("href", "#");
		result.innerHTML = "⮭";
		return result;
	}
	slug(text) {
		// Remove ligatures from text
		text = text.replace(/[æÆ]/g, "ae").replace(/[œŒ]/g, "oe");
		// Remove diacritics from text
		const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		// Replace spaces and special characters with dashes
		const slug = normalizedText.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

		return slug;
	}
}
