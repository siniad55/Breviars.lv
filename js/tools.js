// == palūgtās Liturģisnās stundas atzīmēšana == # = id; . = class;
/* const bookMark = function(x) { 
	var y = (x == "vesperesI") ? "I vesperes" : x; 
	var bkmk = localStorage.getItem("bookmark");
	var messageHTML = "<p class='bookMarkText'>Iepriekšējā stunda, ko lūdzies bija <strong>" + bkmk + "</strong></p>";
	if (bkmk != null) document.querySelector("#bookMark").innerHTML = messageHTML;
	localStorage.setItem("bookmark", y);
} */


let bookMarkObserver = null;
const bookMark = function (stunda) {
    const stundasNosaukums =
        stunda === "vesperesI" ? "I vesperes" : stunda;

    const ieprieksejaStunda = localStorage.getItem("bookmark");
    const bookMarkElement = document.querySelector("#bookMark");

    if (ieprieksejaStunda !== null && bookMarkElement !== null) {
        bookMarkElement.innerHTML =
            "<p class='bookMarkText'>" +
            "Iepriekšējā stunda, ko lūdzies bija " +
            "<strong>" + ieprieksejaStunda + "</strong>" +
            "</p>";
    }

    // Atceļ iepriekšējās stundas novērošanu.
    if (bookMarkObserver !== null) {
        bookMarkObserver.disconnect();
        bookMarkObserver = null;
    }

    const svetibasBloks =
        document.getElementById("conatinerSvetiba");//conatinerSvetiba bugs

    if (svetibasBloks === null) {
        console.warn(
            'Nav atrasts elements ar id="conatinerSvetiba".' //conatinerSvetiba
        );
        return;
    }

    bookMarkObserver = new IntersectionObserver(
        function (entries) {
            const ieraksts = entries[0];

            if (!ieraksts.isIntersecting) {
                return;
            }

            localStorage.setItem(
                "bookmark",
                stundasNosaukums
            );

            bookMarkObserver.disconnect();
            bookMarkObserver = null;
        },
        {
            threshold: 0.25
        }
    );

    bookMarkObserver.observe(svetibasBloks);
};

{
	const root = document.documentElement;
	const step = 0.1; // soļa lielums
	var zoom = 1;
	var localZoom = localStorage.getItem("zoom");
	if (localZoom != null) zoom = parseFloat(localZoom);
	root.style.setProperty('--zoom', zoom);
	document.querySelector("#zoompercent").innerHTML = parseInt( zoom*10 );
	
	document.getElementById("increase").addEventListener("click", () => {
		zoom = zoom + step;
		updateZoom();
	});

	document.getElementById("decrease").addEventListener("click", () => {
		zoom = Math.max(0.8, zoom - step); // nepieļaut negatīvas vērtības
		updateZoom();
	});
	
	function updateZoom() {
		root.style.setProperty('--zoom', zoom);
		localStorage.setItem("zoom", zoom);
		document.querySelector("#zoompercent").innerHTML = parseInt( zoom*10 );
	}

}