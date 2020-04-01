/*jslint browser:true, esnext:true*/
import Tuteos from "./tuteos.js";

/**
 * @todo Complete click actions and submenus
 */
export default class Menu {
    constructor(label = '', items = []) {
        this.label = label;
        this._url = null;
        this._click = null;
        this._items = [];
        this.items = items;
    }
    get items() {
        return this._items;
    }
    set items(items) {
        var is = items.map(i => {
            return Menu.from(i);
        });
        this._items.push(...is);
    }
    get click() {
        return this._click;
    }
    set click(fct) {
        if (typeof fct === "string") {
            /*jslint evil:true*/
            eval("fct=" + fct);
            /*jslint evil:false*/
        }
        this._click = fct;
    }
    get url() {
        return this._url;
    }
    set url(url) {
        this._url = url;
    }
    /**
     * Returns a div element containing all the menu or submenu.
     * @returns {HTMLElement} a div.menu
     */
    html() {
        var result;
        if (this.off) {
            return document.createTextNode("");
        }
        result = document.createElement("div");
        result.classList.add("menu");
        result.appendChild(this.html_label());
        if (this._click) {
            result.addEventListener("click", this._click);
        }
        result.appendChild(this.html_playlist("Playlist Youtube"));
        result.appendChild(this.html_itemsList());
        return result;
    }
    /**
     * Returns the label
     * @returns {HTMLElement} a or span element
     */
    html_label() {
        if (!(this.url || this.icon || this.label)) {
            return document.createTextNode("");
        }
        var result;
        if (this.url) {
            result = document.createElement("a");
            result.setAttribute("href", this.url);
            if (this.blank) {
                result.setAttribute("target", "_blank");
            }
            if (location.pathname.endsWith(this.url) || (location.pathname.endsWith("/") && this.url === "index.html")) {
                result.classList.add("courant");
            }
        } else {
            result = document.createElement("span");
        }
        result.innerHTML = this.label;
        if (this.icon) {
            result.appendChild(this.html_icon(this.label, this.icon));
            result.classList.add("with-icon");
        }
        return result;
    }
    html_nav(id) {
        var result = document.createElement("nav");
        if (id) {
            result.setAttribute("id", id);
        }
        result.appendChild(this.html());
        return result;
    }
    html_itemsList() {
        if (!this._items || this._items.length === 0) {
            return document.createTextNode("");
        }
        var result;
        result = document.createElement("ul");
        this.items.forEach(item => {
            let li = result.appendChild(document.createElement("li"));
            li.appendChild(item.html());
        });
        return result;
    }
    html_icon(label, action, attrs = {}) {
        var result = document.createElement("img");
        result.setAttribute("alt", label);
        result.setAttribute("title", label);
        if (typeof action === "function") {
            result.addEventListener("click", action);
        } else if (/^[a-z0-9]+:\/\//i.test(action)) {
            result.setAttribute("src", action);
        } else if (action.substr(0, 2) === "./") {
            result.setAttribute("src", Tuteos.page_url(action));
        } else {
            result.setAttribute("src", Tuteos.app_url("images/" + action));
        }
        for (let a in attrs) {
            result.setAttribute(a, attrs[a]);
        }
        return result;
    }
    html_playlist(label) {
        if (!this.playlist) {
            return document.createTextNode("");
        }
        var result;
        result = document.createElement("a");
        result.classList.add("playlist");
        result.setAttribute("href", this.playlist);
        result.setAttribute("title", label);
        result.setAttribute("target", "_blank");
        result.appendChild(this.html_icon(label, "logoplaylist.svg"));
        return result;
    }
    static menuItemFrames() {
        var resultat, a;
        resultat = document.createElement("li");
        a = resultat.appendChild(document.createElement("a"));
        a.setAttribute("href", "#");
        a.setAttribute("id", "mnu_videos");
        a.addEventListener("click", function () {
            document.body.classList.toggle('videos');
        });
        a.innerHTML = "Afficher les vidéos";
        return resultat;
    }
    static from(obj) {
        var result = Object.assign(new this(), obj);
        return result;

    }
}
