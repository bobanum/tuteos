import ParentTuteos from "http://localhost:5555/src/Tuteos.js";
class Tuteos extends ParentTuteos {
	static useAppFavicon = false;
	static indentation = "    ";
    static stylesheets =  ["css/style.css"];
    static menuSelector = "#app";
    static menu =  [
        {
            "label": "Complet",
            "url": "index.html",
            "icon": "btn_complet.svg",
        },
        {
            "label": "Laravel 1",
            "url": "cours1.html",
            "playlist": "https://www.youtube.com/watch?v=sZ8crC_QQKU&list=PLR5YZQKvy9U2-I1e6m0pNPLQS07p-X0xg",
        },
        {
            "label": "Laravel 2",
            "url": "cours2.html",
            "playlist": "https://www.youtube.com/watch?v=ZpOq9oimnpM&list=PLR5YZQKvy9U1hb1uK_tIc_zEhV8PyEFLp",
        },
        {
            "off": false,
            "label": "Laravel 2.5 (minitest)",
            "url": "cours2.5.html",
            "playlist": "https://www.youtube.com/watch?v=iYUwe99a8Xc&list=PLR5YZQKvy9U2u-AjvxN4sznkBlHxRXjXE",
        },
        {
            "label": "Laravel 3",
            "url": "cours3.html",
            "playlist": "https://www.youtube.com/watch?v=7EEGVGmQlew&list=PLR5YZQKvy9U3AHVDbsk1clZwAhMyzS090",
        },
        {
            "label": "Chaîne Youtube",
            "url": "https://www.youtube.com/channel/UCFWzWuHnqYOlBN2lJhBIGNg",
            "blank": true,
            "icon": "logo_youtube_white.svg",
        },
        {
            "label": "Web3",
            "url": "http://prof-tim.cstj.qc.ca/cours/web3",
            "blank": true,
            "icon": "./img/logo_web3.svg",
        },
        {
            "label": "Github",
            "url": "https://github.com/web3cstj",
            "blank": true,
            "icon": "logo_github.svg",
        }
    ];
}

Tuteos.load().then(() => console.pin("Finished!"));
