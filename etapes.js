/*jslint browser:true, esnext:true*/
class Etapes {
	static load() {
		this.ajouterMenu();
		var promesse = this.traiterReferences();
		promesse.then(function() {
			Etapes.ajouterSommaire();
			Etapes.rendreCopiable();
			//Etapes.rendrePliable();
			Etapes.ajouterIconesYt();
			//Etapes.ajouterIframesYt();
		});
	}
	static ajouterMenu() {
		var resultat;
		resultat = document.createElement("ul");
		resultat.appendChild(this.elementMenuHome());
//		resultat.appendChild(this.elementMenuFrames());
		var elements = [
			{
				etiquette: "Laravel 1",
				url: "cours1.html",
				playlist: "https://www.youtube.com/watch?v=sZ8crC_QQKU&list=PLR5YZQKvy9U2-I1e6m0pNPLQS07p-X0xg"
			},
			{
				etiquette: "Laravel 2",
				url: "cours2.html",
				playlist: "https://www.youtube.com/watch?v=ZpOq9oimnpM&list=PLR5YZQKvy9U1hb1uK_tIc_zEhV8PyEFLp"
			},
			{
				etiquette: "Laravel 2.5 (minitest)",
				url: "cours2.5.html",
				playlist: "https://www.youtube.com/watch?v=iYUwe99a8Xc&list=PLR5YZQKvy9U2u-AjvxN4sznkBlHxRXjXE"
			},
			{
				etiquette: "Laravel 3",
				url: "cours3.html",
				playlist: "https://www.youtube.com/watch?v=7EEGVGmQlew&list=PLR5YZQKvy9U3AHVDbsk1clZwAhMyzS090"
			}
		];
		elements.forEach(e => resultat.appendChild(this.elementMenu(e.etiquette, e.url, e.playlist)));
		var nav = document.querySelector("div.interface>nav");
		nav = nav || document.querySelector("div.interface").appendChild(document.createElement("nav"));
		nav.appendChild(resultat);
		return resultat;
	}
	static elementMenu(etiquette, url, playlist) {
		var resultat, a, img;
		resultat = document.createElement("li");
		a = resultat.appendChild(document.createElement("a"));
		a.setAttribute("href", url);
		a.innerHTML = etiquette;
		if (location.pathname.endsWith(url)) {
			resultat.classList.add("courant");
		}
		if (playlist) {
			a = resultat.appendChild(document.createElement("a"));
			a.classList.add("playlist");
			a.setAttribute("href", playlist);
			a.setAttribute("title", "Vers la playlist");
			a.setAttribute("target", "_blank");
			img = a.appendChild(document.createElement("img"));
			img.setAttribute("alt", "Playlist Youtube");
			img.setAttribute("src", "logoplaylist.svg");
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
		var resultat, a, img;
		resultat = document.createElement("li");
		console.log(location);
		if (location.pathname.endsWith("index.html") || location.pathname.endsWith("/")) {
			resultat.classList.add("courant");
		}
		a = resultat.appendChild(document.createElement("a"));
		a.setAttribute("href", "index.html");
		img = a.appendChild(document.createElement("img"));
		img.setAttribute("alt", "Accueil");
		img.setAttribute("src", "btn_home.svg");
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
		img.setAttribute('src', "logoyt.svg");
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
			var icon = element.appendChild(document.createElement("span"));
			icon.classList.add("icon");
			var entity = "";
			entity += "📋";
	//		entity += "&#x1f4cb;";
	//		entity += "📌";
	//		entity += "&#x1f4cc;";
	//		entity += "📍";
	//		entity += "&#x1f4cd;";
	//		entity += "📎";
	//		entity += "&#x1f4ce;";
			icon.innerHTML = entity;
			icon.setAttribute("title", "Copier dans le presse-papier");
			icon.addEventListener("click", Etapes.evt.copiable.click);
			element.appendChild(label);
		}, this);
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
		copiable.insertBefore(this.tagCopier(), copiable.firstChild);
	}
	static tagCopier() {
		var tag = document.createElement("span");
		tag.classList.add("tag");
		tag.innerHTML = "Copié";
		tag.addEventListener("transitionend", function() {
			this.parentNode.removeChild(this);
		});
		tag.style.opacity = 1;
		window.setTimeout(function () {
			tag.style.transitionDuration = "3s";
			tag.style.opacity = 0;
		},10);
	}
	static prendreTexte(copiable) {
		copiable = copiable.querySelector(".label").cloneNode(true);
		var samps = Array.from(copiable.querySelectorAll("samp, del"));
		samps.forEach(function(d) {
			d.parentNode.removeChild(d);
		});
		var resultat = copiable.textContent;
		resultat = resultat.trim();
		resultat = resultat.replace(/(?:\r\n|\n\r|\r|\n)\s*/g, "\r\n");
		return resultat;
	}
	static init() {
		var self = this;
		this.evt = {
			copiable: {
				click: function () {
					self.copier(this);
				}
			}
		};
		window.addEventListener("load", function () {
			Etapes.load();
		});
	}
}
Etapes.init();
