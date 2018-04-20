/*jslint browser:true, esnext:true*/
class Etapes {
	static load() {
		var copiables = document.querySelectorAll(".copiable");
		copiables.forEach(Etapes.rendreCopiable);
		this.rendrePliable();
		this.ajouterIconesYt();
		var body = document.body.querySelector("div.interface>div.body");
		body.insertBefore(this.creerSommaire("li[id]", "h2"), body.firstChild);
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
	static rendreCopiable(element) {
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
	}
	static creerSommaire(selecteur, label) {
		var elements = document.body.querySelectorAll(selecteur);
		var resultat = document.createElement("nav");
		resultat.setAttribute("id", "sommaire");
		var titre = resultat.appendChild(document.createElement("h2"));
		titre.innerHTML = "Sommaire";
		var sommaire = resultat.appendChild(document.createElement("ol"));

		elements.forEach(function (e) {
			var li = sommaire.appendChild(document.createElement("li"));
			var a = li.appendChild(document.createElement("a"));
			var id = e.getAttribute("id");
			if (label) {
				e = e.querySelector(label);
			}
			a.innerHTML = e.textContent;
			a.setAttribute("href", "#" + id);
			var up = e.appendChild(document.createElement("a"));
			up.setAttribute("href", "#sommaire");
			up.innerHTML = "⮵";
		});
		return resultat;
	}
	static copier(element) {
		var copiable = element.parentNode;
		console.log(copiable);
		var texte = this.prendreTexte(copiable);
		var input = document.body.appendChild(document.createElement("textarea"));
		input.value = texte;
		input.select();
		document.execCommand("Copy");
		input.parentNode.removeChild(input);
		var tag = copiable.insertBefore(document.createElement("span"), copiable.firstChild);
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
