/*jslint browser:true, esnext:true*/
//function doSomething() {
//  return new Promise((resolve, reject) => {
//    console.log("It is done.");
//    // Succeed half of the time.
//    if (Math.random() > .5) {
//      resolve("SUCCESS")
//    } else {
//      reject("FAILURE")
//    }
//  })
//}
//
//const promise = doSomething();
//promise.then(successCallback, failureCallback);
//
//function successCallback(result) {
//  console.log("It succeeded with " + result);
//}
//
//function failureCallback(error) {
//  console.log("It failed with " + error);
//}

class Etapes {
	static load() {
//		this.traiterReferences();
		var promesse = this.traiterReferences();
		promesse.then(function() {
			Etapes.ajouterSommaire();
			Etapes.rendreCopiable();
			Etapes.rendrePliable();
			Etapes.ajouterIconesYt();
			Etapes.ajouterIframesYt();
		});
//		var body = document.body.querySelector("div.interface>div.body");
//		body.insertBefore(this.creerSommaire("li[id]", "h2"), body.firstChild);
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
					this.obj.loadRef(ref, this.response);
//					var elements = Array.from(this.response.querySelectorAll("div.body>ol>li"));
//					elements.forEach(function (e) {
//						ref.parentNode.insertBefore(e, ref);
//					});
					ref.parentNode.removeChild(ref);
					resolve(true);
				});
				xhr.send();

			});
		});
		return Promise.all(pRefs);
	}
	static traiterElements(elements, callback) {
		if (typeof elements === "string") {
			elements = document.querySelectorAll(elements);
		}
		elements = Array.from(elements);
		var pRefs = elements.map(function (element) {
			return new Promise(function (resolve){
				var url = element.querySelector("a").getAttribute("href");
				var xhr = new XMLHttpRequest();
				xhr.open("get", url);
				xhr.responseType = "document";
				xhr.obj = this;
				xhr.addEventListener("load", function() {
					this.obj.loadRef(element, this.response);
//					var elements = Array.from(this.response.querySelectorAll("div.body>ol>li"));
//					elements.forEach(function (e) {
//						ref.parentNode.insertBefore(e, ref);
//					});
					element.parentNode.removeChild(element);
					resolve(true);
				});
				xhr.send();

			});
		});
		return Promise.all(pRefs);
	}
	static xhr_loadRef() {
		var elements = Array.from(this.response.querySelectorAll("div.body>ol>li"));
		elements.forEach(function (e) {
			this.ref.parentNode.insertBefore(e, this.ref);
		});
		this.resolve(true);
	}
	static loadRef(ref, doc) {
		var elements = Array.from(doc.querySelectorAll("div.body>ol>li"));
		elements.forEach(function (e) {
			ref.parentNode.insertBefore(e, ref);
		});
		ref.parentNode.removeChild(ref);
		return ref;
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
