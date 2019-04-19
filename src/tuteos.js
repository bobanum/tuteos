/*jslint browser:true, esnext:true*/
import Menu from './menu.js';

export default class Tuteos {
	static load() {
		this.loadJson("config.json").then(data => {
            for (let prop in data) {
                this[prop] = data[prop];
            }
		});
		var promesse = this.traiterReferences();
		promesse.then(function() {
			Tuteos.ajouterSommaire();
			Tuteos.rendreCopiable();
			//Tuteos.rendrePliable();
			Tuteos.ajouterIconesYt();
            // Tuteos.ajouterIframesYt();
		});
	}
    static get menu() {
        return this._menu;
    }
    static set menu(menu) {
        this._menu = new Menu("Main", menu);
        this.ajouterMenu();
    }
	static loadJson(fic) {
		return new Promise(resolve => {
			var xhr = new XMLHttpRequest();
			xhr.open("get", fic);
			xhr.responseType = "json";
			xhr.addEventListener("load", (e) => {
				resolve(e.currentTarget.response);
			});
			xhr.send(null);
		});
	}
	static ajouterMenu() {
		var menu = this._menu.itemsList();
		var nav = document.querySelector("div.interface>nav");
		nav = nav || document.querySelector("div.interface").appendChild(document.createElement("nav"));
		nav.appendChild(menu);
		return nav;
	}
	static traiterReferences() {
		var refs = Array.from(document.querySelectorAll("li.ref"));
		var pRefs = refs.map(function (ref) {
			return new Promise(function (resolve){
				var url = ref.querySelector("a").getAttribute("href");
				var xhr = new XMLHttpRequest();
				xhr.open("get", url);
				xhr.responseType = "document";
				xhr.obj = this;
				xhr.addEventListener("load", function() {
					var elements = Array.from(this.response.querySelectorAll("div.body>ol>li"));
					elements.forEach(function (e) {
						ref.parentNode.insertBefore(e, ref);
					});
					ref.parentNode.removeChild(ref);
					resolve(true);
				});
				xhr.send();

			});
		});
		return Promise.all(pRefs);
	}
	static ajouterIconesYt() {
		var elements = document.querySelectorAll("li[data-video]");
		elements.forEach(function (e) {
			var icone = this.iconeYt(e.getAttribute("data-video"));
			e.querySelector("h2").appendChild(icone);
		}, this);

	}
	static ajouterIframesYt() {
		var elements = document.querySelectorAll("li[data-video]");
		elements.forEach(function (e) {
			var idVideo = e.getAttribute("data-video");
			if (idVideo) {
				e.insertBefore(this.iframeYt(idVideo), e.querySelector("h2").nextSibling);
			}
		}, this);

	}
	static iconeYt(id) {
		var resultat = document.createElement("a");
		resultat.classList.add("youtube");
		var href = "https://youtu.be/" + id;
		resultat.setAttribute("href", href);
		resultat.setAttribute("target", "_blank");
		var img = resultat.appendChild(document.createElement("img"));
		img.setAttribute('src', this.app_url("images/logoyt.svg"));
//		img.style.width = "1em;
//		img.style.height = "1em;
		img.setAttribute('alt', "Youtube");
		img.setAttribute('title', "Visionner la vidéo dans Youtube");
		var span = resultat.appendChild(document.createElement("span"));
		span.innerHTML = href;
		return resultat;
	}
	static iframeYt(id) {
		var resultat = document.createElement("iframe");
		resultat.classList.add("youtube");
		var src = "https://www.youtube.com/embed/" + id;
		resultat.setAttribute("src", src);
		resultat.setAttribute("width", 560);
		resultat.setAttribute("height", 315);
		resultat.setAttribute("target", "_blank");
		resultat.setAttribute("frameborder", "0");
		resultat.setAttribute("allow", "autoplay; encrypted-media");
		resultat.setAttribute("allowfullscreen", "allowfullscreen");
		return resultat;
	}
	static rendrePliable() {
		var hs = document.querySelectorAll("h2");
		hs.forEach(function (h) {
			h.addEventListener("click", function () {
				this.classList.toggle("plie");
			});
		});
	}
	static rendreCopiable() {
		var copiables = document.querySelectorAll(".copiable");
		copiables.forEach(function (element) {
			var label = document.createElement("div");
			label.classList.add("label");
			label.innerHTML = element.innerHTML;
			element.innerHTML = "";

			element.appendChild(this.html_iconeEntite('📋', 'Copier dans le presse-papier', Tuteos.evt.copiable.click));
//			element.appendChild(this.html_iconeSvg('copy', 'Copier dans le presse-papier', Tuteos.evt.copiable.click));
			element.appendChild(label);
		}, this);
	}
	static html_iconeEntite(entite, alt, evt) {
		var resultat = document.createElement("span");
		resultat.classList.add("icon");
		//var entites = {"&#x1f4cb;":"📋", "&#x1f4cc;": "📌", "&#x1f4cd;": "📍", "&#x1f4ce;": "📎"};
		resultat.innerHTML = entite;
		resultat.setAttribute("title", alt);
		resultat.addEventListener("click", evt);
		return resultat;
	}
	static html_iconeSvg(nom, alt, evt) {
		var resultat = document.createElement("img");
		resultat.classList.add("icon");
		resultat.setAttribute("src", this.app_url("images/icone_" + nom + ".svg"));
		resultat.setAttribute("title", alt);
		resultat.addEventListener("click", evt);
		return resultat;
	}
	static ajouterSommaire() {
		var body = document.body.querySelector("div.interface>div.body");
		body.insertBefore(this.creerSommaire("li[id]>h2"), body.firstChild);
	}
	static creerSommaire(selecteur) {
		var elements, resultat, titre, sommaire;
		resultat = document.createElement("nav");
		resultat.setAttribute("id", "sommaire");
		titre = resultat.appendChild(document.createElement("h2"));
		titre.innerHTML = "Sommaire";
		sommaire = resultat.appendChild(document.createElement("ol"));
		elements = document.body.querySelectorAll(selecteur);
		elements.forEach(function (element) {
			sommaire.appendChild(this.creerElementSommaire(element));
			element.appendChild(this.iconeUp());
		}, this);
		return resultat;
	}
	static creerElementSommaire(element) {
		var resultat, a, id;
		resultat = document.createElement("li");
		id = element.closest("[id]").getAttribute("id");
		a = resultat.appendChild(document.createElement("a"));
		a.innerHTML = element.textContent;
		a.setAttribute("href", "#" + id);
		return resultat;
	}
	static iconeUp() {
		var resultat;
		resultat = document.createElement("a");
		resultat.setAttribute("href", "#sommaire");
		resultat.innerHTML = "⮵";
		return resultat;
	}
	static copier(element) {
		var copiable = element.parentNode;
		var texte = this.prendreTexte(copiable);
		var input = document.body.appendChild(document.createElement("textarea"));
        if (copiable.classList.contains("bloccode")) {
		  input.value = texte + "\r\n";
        } else {
		  input.value = texte;
        }
		input.select();
		document.execCommand("Copy");
		input.parentNode.removeChild(input);
		copiable.firstChild.appendChild(this.tagCopier());
	}
	static tagCopier() {
		var tag = document.createElement("span");
		tag.classList.add("tag");
		tag.innerHTML = "Copié";
		tag.addEventListener("transitionend", function() {
			this.parentNode.removeChild(this);
		});
		window.setTimeout(function () {
			tag.classList.add('out');
		},10);
		return tag;
	}
	static prendreTexte(copiable) {
		copiable = copiable.querySelector(".label").cloneNode(true);
		var samps = Array.from(copiable.querySelectorAll("samp, del"));
		samps.forEach(function(d) {
			d.parentNode.removeChild(d);
		});
		var elements = Array.from(copiable.childNodes);
		elements = elements.filter(element => {
			return (!(element instanceof Text && /^[ \r\n\t]*$/.test(element.data)));
		}).map(element => {
			var txt = element.data || element.textContent;
			return txt;
		});
		var resultat = elements.join("\r\n");
		return resultat;
	}
	static page_url(fic) {
		if (!fic) {
			return this._url_page;
		} else {
			return this._url_page + "/" + fic;
		}
	}
	static app_url(fic) {
		if (!fic) {
			return this._url_app;
		} else {
			return this._url_app + "/" + fic;
		}
	}
	static dirname(path) {
		return path.split("/").slice(0, -1).join("/");
    }
    /**
	 * [[Description]]
	 */
	static setPaths() {
		this._url_app = this.dirname(import.meta.url);
		this._url_page = this.dirname(location.href);
	}
    static ajouterStyle() {
        var style = document.head.appendChild(document.createElement("link"));
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', this.app_url("tuteos.css"));
    }
	static init() {
        this.setPaths();
        this.ajouterStyle();
		this.evt = {
			copiable: {
				click: (e) => {
					this.copier(e.currentTarget);
				}
			}
		};
		window.addEventListener("load", function () {
			Tuteos.load();
		});
	}
}
Tuteos.init();
