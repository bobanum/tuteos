/*jslint browser:true, esnext:true*/
class Etapes {
	static load() {
//		var copiables = document.querySelectorAll(".copiable");
//		copiables.forEach(Etapes.rendreCopiable);
		this.rendreCopiable();
		this.rendrePliable();
		this.ajouterIconesYt();
		this.ajouterSommaire();
//		var body = document.body.querySelector("div.interface>div.body");
//		body.insertBefore(this.creerSommaire("li[id]", "h2"), body.firstChild);
	}
	static ajouterIconesYt() {
		var elements = document.querySelectorAll("li[data-video]");
		elements.forEach(function (e) {
			e.insertBefore(this.iconeYt(e.getAttribute("data-video")), e.firstChild);
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
		var dels = Array.from(copiable.querySelectorAll("del"));
		dels.forEach(function(d) {
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
