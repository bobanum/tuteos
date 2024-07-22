export default class References {
    el = null;
    constructor(el) {
        this.el = el;
        this.refs = this.getRefs(el);
    }
    /**
     * Returns a Promise resolved when all references has been processed
     * @returns {[[Type]]} [[Description]]
    */
    static processAll(selector = ".ref") {
        console.pin("Processing references");
        var refs = Array.from(document.querySelectorAll(selector));
        refs = refs.map(ref => new this(ref));
        var promises = refs.map(ref => ref.process());
        return Promise.all(promises.flat());
    }
    getRefs(element) {
        if (element.hasAttribute("href")) {
            return [element]; // Cannot have an [href] inside an [href]
        } else {
            return Array.from(element.querySelectorAll("[href]"));
        }
    }
    /**
     * Returns a Promise that loads given reference and processes it.
     * @param   {HTMLElement} ref The element containing an url to reference
     * @returns {Promise}     Promise returning removed ref after treatment
     */
    process() {
        //TODO #3 Allow ignoring elements (clean code after loading) @bobanum
        var promises = this.refs.map(ref => {
            var href = ref.getAttribute("href");
            return this.loadReference(href).then(data => {
                console.pin("Processing ", href);
                var elements = Array.from(data.body.childNodes);
                elements.forEach(element => {
                    this.el.before(element);
                });
            });
        })
        return Promise.all(promises).then(() => {
            this.el.remove();
        });
    }
    /**
     * Returns a promise loading html file
     * @param   {string}  url The url to file
     * @returns {Promise} Promises giving loaded HTMLElement
     */
    loadReference(url) {
        return new Promise(resolve => {
            console.pin("Loading reference '" + url + "'");
            var xhr = new XMLHttpRequest();
            xhr.open("get", url);
            xhr.responseType = "document";
            xhr.addEventListener("load", (e) => {
                console.pin("Reference '" + url + "' loaded");
                resolve(e.target.response);
            });
            xhr.send();
        });
    }
}