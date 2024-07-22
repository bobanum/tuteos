import '../node_modules/marked/marked.min.js';
import './Prism.js';
// import Prism from './Prism.js';
export default class Markdown {
    static selector = ".md, .markdown";
    static aliases = {
        "": "plaintext",
        "blade": "html"
    }
    static init() {
        marked.setOptions({
            highlight: (code, lang) => {
                lang = this.aliases[lang] || lang;
                return Prism.highlight(code, Prism.languages[lang], lang);
            }
        });
        var link = document.head.appendChild(document.createElement("link"));
        var url = new URL(import.meta.url);
        url.pathname = "/src/css/prism.css";
        link.rel = "stylesheet";
        link.href = url.href;
    }
    static process(domain) {
        var elements = domain.querySelectorAll(this.selector);
        elements.forEach(element => {
            var lines = element.outerHTML.split(/\r\n|\n\r|\r|\n/g).slice(1, -1);
            var indents = lines.map(line => {
                return line.match(/^\s*/)[0].length;
            });
            indents = Math.min(...indents);
            lines = lines.map(line => {
                return line.slice(indents);
            }).join("\n");
            var code = marked.parse(lines);
            element.innerHTML = code;
            var codes = element.querySelectorAll("pre>code").forEach(code => code.classList.add("copyable"));
        });
    }
}
Markdown.init();