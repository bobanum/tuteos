/*jslint browser:true, esnext:true*/
class Tuteos {
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
//			Tuteos.ajouterIframesYt();
		});
	}
    static get menu() {
        return this._menu;
    }
    static set menu(menu) {
        this._menu = menu;
        this.ajouterMenu(this._menu);
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
	static ajouterMenu(elements) {
		var menu = this.creerMenu(elements);
		var nav = document.querySelector("div.interface>nav");
		nav = nav || document.querySelector("div.interface").appendChild(document.createElement("nav"));
		nav.appendChild(menu);
		return nav;
	}
	static creerMenu(elements) {
		var resultat;
		resultat = document.createElement("ul");
//		resultat.appendChild(this.elementMenuHome());
//		resultat.appendChild(this.elementMenuComplet());
		elements.forEach(e => {
			if (e.off !== true) {
				resultat.appendChild(this.elementMenu(e));
			}
		});
		return resultat;
	}
    static icone(etiquette, src, attrs = {}) {
		var resultat = document.createElement("img");
		resultat.setAttribute("alt", etiquette);
		resultat.setAttribute("width", "16");
		resultat.setAttribute("height", "16");
        if (/^[a-z0-9]+:\/\//i.test(src)) {
		  resultat.setAttribute("src", src);
        } else if (src.substr(0, 2) === "./") {
		  resultat.setAttribute("src", this.page_url(src));
        } else {
		  resultat.setAttribute("src", this.app_url("images/" + src));
        }
        for (let a in attrs) {
            resultat.setAttribute(a, attrs[a]);
        }
        return resultat;
    }
	static elementMenu(element) {
		var resultat, a;
        if (element.off) {
            return document.createComment();
        }
		resultat = document.createElement("li");
		a = resultat.appendChild(document.createElement("a"));
		a.setAttribute("href", element.url);
        if (element.blank) {
            a.setAttribute("target", "_blank");
        }
		a.innerHTML = element.etiquette;
		if (location.pathname.endsWith(element.url) || (location.pathname.endsWith("/") && element.url === "index.html")) {
			resultat.classList.add("courant");
		}
        if (element.icone) {
            a.appendChild(this.icone(element.etiquette, element.icone));
            a.classList.add("avec-icone");
        }
		if (element.playlist) {
			a = resultat.appendChild(document.createElement("a"));
			a.classList.add("playlist");
			a.setAttribute("href", element.playlist);
			a.setAttribute("title", "Vers la playlist");
			a.setAttribute("target", "_blank");
			a.appendChild(this.icone("Playlist Youtube", "logoplaylist.svg", {width: 27, height: 19}));
		}
		return resultat;
	}
	static elementMenuFrames() {
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
	static elementMenuHome() {
		var resultat, a;
		resultat = document.createElement("li");
		resultat.setAttribute("title", "Accueil");
		if (location.href === this.app_url("index.html")) {
			resultat.classList.add("courant");
		}
		a = resultat.appendChild(document.createElement("a"));
		a.setAttribute("href", this.app_url("index.html"));
		a.appendChild(this.icone("Accueil", "btn_home.svg"));
		return resultat;
	}
	static elementMenuComplet() {
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
		img.setAttribute("width", "16");
		img.setAttribute("height", "16");
		img.setAttribute("src", this.app_url("images/btn_complet.svg"));
		return resultat;
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
		img.setAttribute("width", 27);
		img.setAttribute("height", 19);
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
		input.value = texte;
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
	static setPaths() {
		var path_app = document.currentScript.getAttribute("src");
		var path_page = location.href;
		var dossier_page = path_page.split("/").slice(0, -1);
		var dossier_app = path_app.split("/").slice(0, -1);
		this._url_page = dossier_page.join("/");
		if (/^[a-z]+:\/\//.test(path_app)) {
			this._url_app = dossier_app.join("/");
		} else if (dossier_app.length === 0) {
			this._url_app = dossier_page.join("/");
		} else {
			while (dossier_app.length) {
				let segment = dossier_app.shift();
				if (segment === ".") {
					continue;
				} else if (segment === "..") {
					dossier_page.pop();
				} else {
					dossier_page.push(segment);
				}
			}
			this._url_app = dossier_page.join("/");
		}
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
