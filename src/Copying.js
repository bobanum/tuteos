import Tuteos from "./Tuteos.js";

export default class Copying {
	/**
	 * Makes copyable items copyable
	 */
	static process() {
		var elements = document.querySelectorAll(".copyable");
		elements.forEach(element => {
			var label = document.createElement("div");
			label.classList.add("label");
			label.innerHTML = element.innerHTML;
			element.innerHTML = "";

			element.appendChild(Tuteos.html_entityIcon('&#x1f4cb;&#xfe0e;', Tuteos._('copy_to_clipboard'), e => {
				this.copy(e.currentTarget);
			}));
			//element.appendChild(this.html_svgIcon('copy', Tuteos._('copy_to_clipboard'), (e) => {
			//    this.copy(e.currentTarget);
			//}));
			element.appendChild(label);
		});
	}
	/**
	 * Copies innerText of given element to the clipboard
	 * @param {HTMLElement} element The element from which to take the text
	 */
	static copy(element) {
		var copyable, text, input;
		copyable = element.parentNode;
		text = this.grabText(copyable);
		input = document.body.appendChild(document.createElement("textarea"));
		if (copyable.classList.contains("codeblock")) {
			text = text + "\r\n";
		}
		input.value = text;
		input.select();
		document.execCommand("Copy");
		input.parentNode.removeChild(input);
		this.copiedTag(copyable);
	}
	/**
	 * Activate tag displaying "copied" briefly.
	 * @returns {Promise} [[Description]]
	 */
	static copiedTag(copyable) {
		return new Promise(resolve => {
			var tag = copyable.firstChild.appendChild(document.createElement("span"));
			tag.classList.add("tag");
			tag.innerHTML = Tuteos._("copied");
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
	 * Return the copyable innerText of given element
	 * @param   {HTMLElement} copyable HTMLElement containing text
	 * @returns {string}      The resulting text
	 */
	static grabText(copyable, join = true) {
		copyable = copyable.querySelector(".label").cloneNode(true);
		this.clean(copyable);
		var elements = this.grabBlockText(copyable);

		var result = elements;
		if (join) {
			result = elements.join("\r\n");
		}
		return result;
	}
	/**
	 * Return the copyable innerText of given element
	 * @param   {HTMLElement} block HTMLElement containing text
	 * @returns {string}      The resulting text
	 */
	static grabBlockText(block) {
		block = block.cloneNode(true);
		this.clean(block);
		var elements = Array.from(block.childNodes);
		elements = elements.filter(element => {
			return (!(element instanceof Text && /^[ \r\n\t]*$/.test(element.data)));
		}).reduce((array, element) => {
			if (element.nodeType === 3) {
				array.push(element.nodeValue);
			} else if (element.classList.contains("block")) {
				let texts = this.grabBlockText(element);
				if (element.classList.contains("split")) {
					array[array.length-1] += texts.join("");
				} else {
					array.push(...texts.filter(text => text !== "").map(text => Tuteos.indentation + text));
				}
			} else {
				let text = element.data || element.textContent;
				if (text) {
					array.push(text);
				}
			}
			return array;
		}, []);
		return elements;
	}
	static clean(element) {
		var samps = Array.from(element.querySelectorAll("samp, del"));
		samps.forEach((samp) => {
			samp.remove();
		});
	}
}
