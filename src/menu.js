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
    static load() {}
    itemsList() {
        if (!this._items || this._items.length === 0) {
            return document.createTextNode("");
        }
        var result;
        result = document.createElement("ul");
        this.items.forEach(i => {
            result.appendChild(i.menuItem());
        });
        return result;
    }
    iconHtml(label, action, attrs = {}) {
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
    menuItem() {
        var result, label;
        if (this.off) {
            return document.createTextNode("");
        }
        result = document.createElement("li");
        if (this.url) {
            label = result.appendChild(document.createElement("a"));
            label.setAttribute("href", this.url);
            if (this.blank) {
                label.setAttribute("target", "_blank");
            }
            if (location.pathname.endsWith(this.url) || (location.pathname.endsWith("/") && this.url === "index.html")) {
                result.classList.add("courant");
            }
        } else {
            label = result.appendChild(document.createElement("span"));
        }
        label.innerHTML = this.label;
        if (this.icon) {
            label.appendChild(this.iconHtml(this.label, this.icon));
            label.classList.add("with-icon");
        }
        if (this._click) {
            result.addEventListener("click", this._click);
        }
        result.appendChild(this.playlistHtml("Playlist Youtube"));
        result.appendChild(this.itemsList());
        return result;
    }
    menuTrigger() {
        var result;
        if (typeof this.action === 'function') {
            result = document.createElement("span");
            result.addEventListener('click', this.action);
        } else {
            result = document.createElement("a");
            result.setAttribute("href", this.action);
            if (this.blank) {
                result.setAttribute("target", "_blank");
            }
        }
        result.innerHTML = this.label;
        if (location.pathname.endsWith(this.action) || (location.pathname.endsWith("/") && this.action === "index.html")) {
            result.classList.add("courant");
        }
        if (this.icon) {
            result.appendChild(this.iconHtml(this.label, this.icon));
            result.classList.add("with-icon");
        }
        result.appendChild(this.playlistHtml("Playlist Youtube"));
        return result;
    }
    playlistHtml(label) {
        if (!this.playlist) {
            return document.createTextNode("");
        }
        var result;
        result = document.createElement("a");
        result.classList.add("playlist");
        result.setAttribute("href", this.playlist);
        result.setAttribute("title", label);
        result.setAttribute("target", "_blank");
        result.appendChild(this.iconHtml(label, "logoplaylist.svg"));
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
    /*static menuItemHome() {
        var resultat, a;
        resultat = document.createElement("li");
        resultat.setAttribute("title", "Accueil");
        if (location.href === this.app_url("index.html")) {
            resultat.classList.add("courant");
        }
        a = resultat.appendChild(document.createElement("a"));
        a.setAttribute("href", this.app_url("index.html"));
        a.appendChild(this.iconHtml("Accueil", "btn_home.svg"));
        return resultat;
    }*/
    /*static menuItemComplet() {
        var resultat, a, img;
        resultat = document.createElement("li");
        resultat.setAttribute("title", "Tout afficher");
        if (location.href === this.page_url("index.html")) {
            resultat.classList.add("courant");
        }
        a = resultat.appendChild(document.createElement("a"));
        a.setAttribute("href", this.page_url("index.html"));
        img = a.appendChild(document.createElement("img"));
        img.setAttribute("alt", "Tout afficher");
        img.setAttribute("src", this.app_url("images/btn_complet.svg"));
        return resultat;
    }*/
    static from(obj) {
        var result = Object.assign(new this(), obj);
        return result;

    }
}
