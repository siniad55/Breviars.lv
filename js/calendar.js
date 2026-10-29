// const calendar = document.querySelector("#kalendars"); // kā CSS # = id; . = class;
//gads[dienasIndekss].krasa; psalmuNedela; litGadaCikls; ≡

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

var todayIndex = dayOfYear(new Date());
var soDiena = "";
var laiks = new Date();
var selectedNedela;
var selectedDay;
var selectedDayId;
var selectedSvetdiena;
var selectedStunduDatums;
var selectedLitlaiks;
//var selectedFestum;
var selectedVesperesI;
var stunda;
var ll;

var izlaistKompetoriju = "<br><span class='note'>Tie, kuri piedalās Lieldienu vigīlijas dievkalpojumā, Kompletoriju var izlaist.</span>";

var festumShow={PSN:{ND:{vesperesI:{title:"",himna:"",ps1:"",ps2:"",ps3:"",ant1:"",ant2:"",ant3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",atb3:"",magbenant:"",lugumi:"",resplugums:"",lugums:{lugums1:"",lugums2:"",lugums3:"",lugums4:"",lugums5:""},lugsimies:""},laudes:{title:"",ievdant:"",himna:"",ps1:"",ps2:"",ps3:"",ant1:"",ant2:"",ant3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",atb3:"",magbenant:"",lugumi:"",resplugums:"",lugums:{lugums1:"",lugums2:"",lugums3:"",lugums4:"",lugums5:""},lugsimies:""},dienas:{title:"",himna:"",ps1:"",ps2:"",ps3:"",ant1:"",ant2:"",ant3:"",stunda:{3:{himna:"",ant:"",ps1:"",ps2:"",ps3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",lugsimies:""},6:{himna:"",ant:"",ps1:"",ps2:"",ps3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",lugsimies:""},9:{himna:"",ant:"",ps1:"",ps2:"",ps3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",lugsimies:""}},lugsimies:""},vesperes:{title:"",himna:"",ps1:"",ps2:"",ps3:"",ant1:"",ant2:"",ant3:"",lasijumstitle:"",lasijumstext:"",atb1:"",atb2:"",atb3:"",magbenant:"",lugumi:"",resplugums:"",lugums:{lugums1:"",lugums2:"",lugums3:"",lugums4:"",lugums5:""},lugsimies:""}}}};

// var currentTime = document.querySelector("#currentTime");
//currentTime.innerHTML = "Stunda " + laiks.getHours();
var lugsana = document.querySelector("#LugsanuTeksts");

const getPsalmWeek = function(weekNumber) { //nosaka psalmodija nedēļu
	return ((weekNumber - 1) % 4) + 1;
}

const drawCalendar = function(date, elementId) {
  document.getElementById("menesis").innerHTML = Menesis[date.getMonth()] + "-" + date.getFullYear();
  year = date.getFullYear();
  document.querySelector("#psNedela").innerHTML = "izvēlies dienu...";
  rubricella();

  const calendar = document.querySelector("#" + elementId);
  calendar.innerHTML = '';

  // KALENDĀRA IZVEIDE
  // == NEDĒĻAS DIENAS NOSAUKUMS ==
  for (weekDay = 0; weekDay < 7; weekDay++) {
    var nameWeekend = (weekDay > 4) ? "week-name-weekend" : "";
    calendar.insertAdjacentHTML("beforeend", `<div class='week-name ${nameWeekend}'> ${weekDayName[weekDay]} </div>`);
  }
  //== PIELIEK TUKŠUMUS MĒNEŠA SĀKUMĀ ==
  var nedelasDiena = (date.getDay() === 0) ? 6 : date.getDay() - 1; //  0 for Sunday, 1 for Monday, 2 for Tuesday, and so on
  for (blank = 0; blank < nedelasDiena; blank++) {
    calendar.insertAdjacentHTML("beforeend", `<div class='blank'> </div>`);
  }

  //== DATUMI & NOTIKUMI ==
  for (day = 1; day <= getDaysInMonth(date); day++) {
    var datums = new Date(date.getFullYear(), date.getMonth(), day);
    var dienasIndekss = dayOfYear(new Date(datums));
    const weekend = isWeekend(new Date(datums));
    litkrasa = gads[dienasIndekss].krasa;
    calendar.insertAdjacentHTML("beforeend", `<div id="${dienasIndekss}" class="diena ${litkrasa}">${day}</div>`);
    //debug(today,datums);
    if ( new Date(today).valueOf() == new Date(datums).valueOf() ) {
      // nedrīkst likt 'var' priekšā šiem mainīgajiem
      todayIndex = dienasIndekss;
      soDiena = datums;
      document.getElementById(dienasIndekss).classList.add("today", "selected");
    }
  }

}

drawCalendar(date, "kalendars"); //šeit zīmē kalendāru

const Banner = function(x){ // liturģiskā krāsa un svētku nosaukums
	var stunda = x;
	var krasa = "green";
	//if (x==null) { 		stunda = 0;	} else { 		stunda = x;		}
	var d = parseInt(selectedDayId);
	var d1 = parseInt(d)+1;
	//console.log("25.marts", selectedDayId, d, d1, typeof d, typeof d1);
	var baneris = document.querySelector("#liturgiskakrasabaneris");
	var svetki = document.querySelector("#liturgsvetki");
	console.log( selectedDayId +" Vesperes I rīt="+gads[d1].vesperesI + " stunda=" + stunda + x);
	
	if ( ( gads[d1].vesperesI == true || gads[d1].datums.getDay() == 0 ) && gads[d1].prior <= gads[d].prior && (stunda == 'vesperes' || stunda == 'vesperesI' || stunda == 'kompletorijs' ) && gads[d].litlaiks != 'trd') {
		console.log("MAINA baneri");
		baneris.className = "logobar " + gads[d+1].krasa;
		krasa = gads[d+1].krasa;
		svetki.innerHTML = gads[d+1].svetki;
	} else { 
		console.log("nemaina baneri", d);
		baneris.className = "logobar " + gads[d].krasa; // class = logobar
		krasa = gads[d].krasa;
		svetki.innerHTML = gads[d].svetki;
	}
	if (gads[d].litlaiks == 'trd' && gads[d].datums.getDay()==4 && (stunda == 'vesperes' || stunda == 'vesperesI' || stunda == 'kompletorijs') ){
		console.log("TRDM cet");
		svetki.innerHTML = "Trīs svētās dienas<br>KUNGA PĒDĒJO VAKARIŅU CETURTDIENA";
	}
/* 	if (gads[d].litlaiks == 'trd' && gads[d].datums.getDay()==6 && (stunda == 'vesperes' || stunda == 'vesperesI' || stunda == 'kompletorijs') ){
		console.log("TRDM sest", gads[d].krasa);
		krasa = gads[d].krasa;
		svetki.innerHTML = "Trīs svētās dienas<br>SVĒTĀ SESTDIENA";
	} */
	
	// Buy me Koffee
	if (krasa == 'violet') ziedo = 'button_colour=BD5FFF&font_colour=FFFFFF';
	else if (krasa == 'white') ziedo = 'button_colour=FFFFFF&font_colour=000000';
	else if (krasa == 'pink') ziedo =  'button_colour=FFC0CB&font_colour=000000';
	else if (krasa == 'red') ziedo =  'button_colour=FF0000&font_colour=000000';
	else if (krasa == 'black') ziedo = 'button_colour=404040&font_colour=FFFFFF';
	else ziedo = 'button_colour=40E705&font_colour=000000';
	document.querySelector('#koffee').innerHTML = '<a href="https://www.buymeacoffee.com/breviars"><img src="https://img.buymeacoffee.com/button-api/?text=Ziedo mums kafiju&emoji=&slug=breviars&'+ ziedo +'&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" /></a>';	
}

const lentNoAlleluia = function(d) { // gavēnī noņem Alleluja
	if (gads[d].datums >= cal.gav0 && gads[d].datums < cal.lieldienas)	{
		items = document.querySelectorAll('.alleluja');
		for(var i =0; i<items.length; i++) {
			items[i].style.display = 'none';
		}
	}
}

const easterNoAlleluia = function(d) { // noņem Alleluja ārpus lieldienām
	if (gads[d].litlaiks != 'ldl' && gads[d].litlaiks != 'lokt')	{
		console.log("easterNoAlleluia", d );
//		items = document.querySelectorAll('.alleluja');
//		for(var i =0; i<items.length; i++) {
//			items[i].style.display = 'none';
		console.log("noņemt alieluja");
		document.querySelectorAll('.Lieldienas').forEach(el => {
			el.remove();
		});
	}
}

	const sakartotAlleluja = function (d){	console.log("sakalrto alleluja")
		 if ( !(gads[d].datums >= cal.lieldienas && gads[d].datums <= cal.vasarsvetki) ) {
			items = document.querySelectorAll('.Lieldienas');
			//items = document.getElementsByClassName('Lieldienas');
			for(var i =0; i<items.length; i++) {
				items[i].style.display = 'none';
			}
		} else {
			items = document.querySelectorAll('.neLieldienas');
			for(var i =0; i<items.length; i++) {
				items[i].style.display = 'none';
			}
		}
	}

// Laudes un Vesperes stundu lugsanas izveide atkarībā no datuma, padod veidu "laudes vai vesperes", "svētki" pēc noklusējuma ir standarta liturģiskais laiks
const LaudesVesperes = function(stunda, svetki) { //svetki var būt  liturgiskaisLaiks
	var d = selectedDayId;
	var d1 = parseInt(d)+1;
	var nd = nd0 = selectedDay;
	var psn = psn0 = selectedNedela; 
	var svetdiena = selectedSvetdiena;
	var ll = selectedLitlaiks;
	var himna = himnaLat;
	var izveletaisPsalms = psalms95;
/* 	if (getPsalmWeek(selectedNedela)==1) var izveletaisPsalms = psalms95;
	else if (getPsalmWeek(selectedNedela)==2) var izveletaisPsalms = psalms100;
	else if (getPsalmWeek(selectedNedela)==3) var izveletaisPsalms = psalms24;
	else if (getPsalmWeek(selectedNedela)==4) var izveletaisPsalms = psalms67; */
	//console.log("IEVADPSALMS= ", izveletaisPsalms, selectedNedela);
	var izvele = 'ar';
	Banner(stunda); // liturģiskā krāsa un svētku nosaukums
	
	const svetoVardi = function () { // Ieiek svēto vārdus pēc ID
		if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#N')) { 
			sel = document.querySelectorAll('#N');
			for( i=0; i < sel.length; i++ ) sel[i].innerHTML = gads[d].N;
		}
		if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#G')) {
			sel = document.querySelectorAll('#G');
			for( i=0; i < sel.length; i++ ) sel[i].innerHTML = gads[d].G;
		}
		if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#D')) document.querySelector('#D').innerHTML = gads[d].Dat;
		if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#festum')) {
			if (gads[d].prior < 10) {
				sel = document.querySelectorAll('#memorial'); for( i=0; i < sel.length; i++ ) sel[i].style.display = 'none';
				sel = document.querySelectorAll('#festum'); for( i=0; i < sel.length; i++ ) sel[i].style.display = 'initial';
			} else {
				sel = document.querySelectorAll('#memorial'); for( i=0; i < sel.length; i++ ) sel[i].style.display = 'initial';
				sel = document.querySelectorAll('#festum'); for( i=0; i < sel.length; i++ ) sel[i].style.display = 'none';
			}
		}
	}
	
	const atkartoAnt = function() { // Ievadpsalmā ieliek atkārtojošos antifonu
	console.log("sakārtoAnt");
		container = document.querySelector('#containerIevadpsalms');
		var antifona = container.querySelectorAll('#ievadpsalmsAnt');
		console.log(antifona[0].innerHTML);
		sel = container.querySelectorAll('#atkartoAnt');
		for(var i = 0; i < sel.length; i++){
			//sel[i].innerHTML = '<span class="redbold">Ant.&nbsp;</span>' + window[liturgiskaisLaiks][psn][nd].laudes.ievdant;
			sel[i].innerHTML = '<span class="redbold">Ant.&nbsp;</span>' + antifona[0].innerHTML;
			sel[i].style.display = 'initial';
				}
		svetoVardi();
	}
	

	
	//Priekšpusdienas 9.00-12.00 Pudienu 12.00-15.00 Pēcpusdienas 15.00-18.00
	if (laiks.getHours() < 12) { var dienasStunda = 3; } 
	else if (laiks.getHours() >= 12 && laiks.getHours() < 15) { dienasStunda = 6; }
	else { dienasStunda = 9; }

// liturģiskā laika noteikšana
	if ( (gads[d].datums > cal.zsl1 && gads[d].datums < cal.gav0) || (gads[d].datums >= cal.pll2 && gads[d].datums <= cal.pll3) ) {
		var liturgiskaisLaiks = liturgiskaisLaiks0 = 'parastais';
		if ( gads[d].datums.valueOf() == cal.pll3.valueOf() && stunda == 'vesperes') {
			liturgiskaisLaiks = liturgiskaisLaiks0 = 'advents';  //console.log("Adventa sākums ar vesperēm",liturgiskaisLaiks,liturgiskaisLaiks);
			psn = psn0 = 0;
			nd = nd0 = 6
			}
	}
	else if ( ( gads[d].datums > cal.adv1 && gads[d].datums <= new Date ( year, 11, 31 ) ) || (gads[d].datums >= new Date ( year, 0, 1 ) && gads[d].datums <= cal.zsl1) ) { // ziemassvetki
		console.log("Ziemassvētki");
		liturgiskaisLaiks = liturgiskaisLaiks0 = 'ziemassvetki';
		psn0=psn;
		//nd0=nd;
		console.log("Sākums => psn0=",psn0,"nd0=",nd0, "datums=", gads[d].datums.getDate() );
		if ( gads[d].litlaiks == "zokt") {
			psn = 0;
			nd = gads[d].datums.getDate();// datums
		}
		else if ( gads[d].datums.valueOf() < cal.epifany.valueOf() && nd == 0 ){ // svētdiena pirms epifānijas
			psn = 2;
			nd=0;
		}
		else if ( gads[d].datums.valueOf() > cal.epifany.valueOf() || nd == 0 ) {
			psn = 2;
			nd = gads[d].datums.getDate() - 6 ;
			console.log("Datums pēc epifānijas", nd, cal.epifany);// ja izmanto datums pēc Epifānijas
			console.log( gads[d].datums, cal.epifany);// ja izmanto datums pēc Epifānijas
			// nd = gads[d].datums.getDay();// ja izmanto nedēļas diena pēc Epifānijas 
		}
		else {
			psn = 1;
			nd = gads[d].datums.getDate();// datums
		}
		console.log("Beigas => ZS psn:", psn, " nd:", nd);
		if ( nd < 0 ) { psn=1; nd = 1; console.log("Korekcija ZS psn:", psn, " nd:", nd);}
		
	}
	else if (gads[d].datums >= cal.adv0 && gads[d].datums <= cal.adv1) { //  cal.adv1 = 24.vesperes jau ir ZS
		liturgiskaisLaiks = liturgiskaisLaiks0 = 'advents';
		
		if ( ( nd !=0 || ( nd !=6  ) ) // && stunda == 'vesperes'
			&& gads[d].datums.valueOf() >= new Date(year, 11, 17).valueOf() 
			&& gads[d].datums.valueOf() <= new Date(year, 11, 24).valueOf()
			&& gads[d].datums.getDay() !=0 ) {
				// sākot no 17.datuma			
				console.log('AHA', gads[d].datums.getDate()); //================================
				psn0=psn;
				psn = 'advents';
				nd = gads[d].datums.getDate(); // datums
				ned = gads[d].datums.getDay(); // nedēļas diena
				
				if (gads[d].datums.valueOf() == new Date(year, 11, 24).valueOf()) {
					advents.advents[nd].laudes.ievdant = advents[0].ant24;
				} else {
					advents.advents[nd].laudes.ievdant = advents[0].ant17;
				}
				
				if ( stunda != 'dienas' 
					&& ned !=0 
					&& gads[d].datums.valueOf() != new Date(year, 11, 24).valueOf() ) {// pārraksta antifonas izņemot 24.dec.
						advents.advents[nd][stunda].ant1 = advents.ant[ned].ant1;
						advents.advents[nd][stunda].ant2 = advents.ant[ned].ant2;
						advents.advents[nd][stunda].ant3 = advents.ant[ned].ant3;
				}
		
				advents.advents[nd][stunda].ps1 = parastais[psn0][ned][stunda].ps1;
				advents.advents[nd][stunda].ps2 = parastais[psn0][ned][stunda].ps2;
				advents.advents[nd][stunda].ps3 = parastais[psn0][ned][stunda].ps3;
			}
		if ( gads[d].datums.valueOf() == new Date(year, 11, 17).valueOf() && nd ==0 ){
			console.log("17.dec ir svētdiena");
			psn = 'advents';
			nd = 170;
		}
		if ( gads[d].datums.valueOf() == new Date(year, 11, 24).valueOf() && nd ==0 ){
			console.log("24.dec ir svētdiena");
			psn = 'advents';
			nd = 24;
		}
		if ( gads[d].datums.valueOf() == new Date(year, 11, 24).valueOf() && stunda == 'vesperes'  ) { // ziemassvētku vigilija
			liturgiskaisLaiks = 'ziemassvetki';
			psn = 0;
			nd = 24;
		}
	}
	else if (gads[d].datums >= cal.gav0 && gads[d].datums < cal.lieldienas) {
		if(gads[d].datums >= cal.pelnutrsd && gads[d].datums <= cal.pelnuned) { psn = 0; } // pelnu nedēļas psn = 0;
		liturgiskaisLaiks = liturgiskaisLaiks0 = 'gavenis';
	}
	else if (gads[d].datums >= cal.lieldienas.valueOf() && gads[d].datums <= cal.vasarsvetki.valueOf()) {
		if(gads[d].datums.valueOf() == cal.vasarsvetki.valueOf()) psn=8; // Lieldnienu laika pēdējā diena ir Vasarsvētki
		liturgiskaisLaiks = liturgiskaisLaiks0 = 'lieldienas';
	}
	else {
	    liturgiskaisLaiks = liturgiskaisLaiks0 = 'parastais'; // = ja nav sataisīts citādi;
	    
	    }
	
	if (liturgiskaisLaiks == 'parastais') psn = psn0= psalmuNedela(selectedNedela);
	 if(gads[d].datums.valueOf() == cal.vasarsvetki.valueOf()) {  
		psn=8; // Lieldnienu laika pēdējā diena ir Vasarsvētki
		liturgiskaisLaiks = liturgiskaisLaiks0 = 'lieldienas'; 
		}
// AAAAA ))))) console.log; alert("vēl ir"+ liturgiskaisLaiks+ "psn: "+psn+ " nd: "+ nd);



// FESTUM liturģijas noteikšana ===
	const festum = function (x) {
		var f1 = gads[x].liturgija.split('-')[0]; // atbilst liturgiskaisLaiks
		var f2 = gads[x].liturgija.split('-')[1]; // atbilst psn
		var f3 = gads[x].liturgija.split('-')[2]; // atbilst nd
		
		for ( i in festumShow.PSN.ND ) { // i = stunda
			for ( j in festumShow.PSN.ND[i] ) { // j==ant1
				if( typeof window[f1][f2][f3][i] != 'undefined' ) { // svētkos, kuros nav I Vesperes šis zemākais ir jāizlaiž console.log("j = ", j); 
					if ( j == 'lugums' && window[f1][f2][f3][i][j].lugums1 != '' ) 
					{ // pēdējam salīdzinājumam var nebūt jēga, jo kaut kādam speciāla lūgumam ir jābūt
						console.log("AAAA lugums", i);						
						console.log(festumShow.PSN.ND[i][j], j,window[f1][f2][f3][i][j]);
						festumShow.PSN.ND[i][j] = window[f1][f2][f3][i][j]; // lūgumu var būt vairāk nekā parasti, tāpēc jāpārkopē viss objekts
					}
					else if ( typeof(festumShow.PSN.ND[i][j]) == 'object' )  {
						for ( o in festumShow.PSN.ND[i][j] ) { 
							//console.log(j,o);
							if ( typeof(festumShow.PSN.ND[i][j][o]) == 'object' ) {
								for ( q in festumShow.PSN.ND[i][j][o] ) { // q==ant, dienas stundās
									if (window[f1][f2][f3][i][j][o][q] != '' ) festumShow.PSN.ND[i][j][o][q] = window[f1][f2][f3][i][j][o][q];
									else festumShow.PSN.ND[i][j][o][q] = window[liturgiskaisLaiks][psn][nd][i][j][o][q];
								}
							}
							else {
								if (window[f1][f2][f3][i][j][o] != '' && window[f1][f2][f3][i][j][o] != undefined) {
									console.log("AAAA",o, window[f1][f2][f3][i][j][o] == undefined);
									festumShow.PSN.ND[i][j][o] = window[f1][f2][f3][i][j][o];
									console.log("lugums", i, f1, f2, f3, o);						
									//console.log(festumShow.PSN.ND[i][j], j, "standarts", window[f1][f2][f3][i][j]);
									}
								
								else if (window[f1][f2][f3][i][j][o] != undefined) festumShow.PSN.ND[i][j][o] = window[liturgiskaisLaiks][psn][nd][i][j][o];
								if (festumShow.PSN.ND[i][j][o] == '' || festumShow.PSN.ND[i][j][o] == undefined) delete festumShow.PSN.ND[i][j][o];
							}
						}
					}
					else {
						if (window[f1][f2][f3][i][j] != '' ) festumShow.PSN.ND[i][j] = window[f1][f2][f3][i][j];
						else {
							if  (i == 'vesperesI') festumShow.PSN.ND[i][j] = window[liturgiskaisLaiks][psn][nd]['vesperes'][j];
							else {
								//if ( j != '' ) 
									festumShow.PSN.ND[i][j] = window[liturgiskaisLaiks][psn][nd][i][j];
								}
						}
					}
				}
			}
		}
		psn = 'PSN';
		nd = 'ND';
		liturgiskaisLaiks = 'festumShow';
	}
	
	// I vesperes noteikšana
	// if ( gads[d1].liturgija && (gads[d1].prior <= gads[d].prior) && (stunda == 'vesperes') && (gads[d1].vesperesI == true || nd==6 ) && gads[d1].liturgija) {
	if ( gads[d1].liturgija && (gads[d1].prior <= gads[d].prior) && (stunda == 'vesperes') && (gads[d1].vesperesI == true || nd==6 ) ) {
		console.log("parastās festum vesperesI");
		festum(d1);
		stunda = 'vesperesI';
		if (gads[d1].prior <= gads[d].prior) d=d1;
		}
	else if (gads[d].liturgija) { 
		console.log("FESTUM parastās festum vesperes", gads[d].prior,gads[d1].prior,gads[d1].liturgija );
		var andrejs = new Date(year, 10, 30);
		console.log("=====", d, "Sv.Andrejs = ", gads[d].datums.valueOf() != andrejs.valueOf());
		if (gads[d].datums.valueOf() == andrejs.valueOf() && stunda == 'vesperes' && andrejs.getDay() == 6 ) { 
			console.log("IGNORE");  
			}
		else {
			festum(d);	
		}

	}
// FESTUM === END
 console.log(liturgiskaisLaiks, 'lit laiks')
	if ( gads[d].datums.valueOf() == cal.pll3.valueOf() && (stunda == 'vesperes' || stunda == 'vesperesI') ){ // adventa pirmās I VESPERES
		liturgiskaisLaiks = 'advents'; psn = 1;
	}
	
  //  I VESPERES Svētdien
  console.log("TEST" , stunda," d1=", gads[d1].prior, " d=",gads[d].prior, " nd0=", nd0, " LitLaiks=", liturgiskaisLaiks, " pamata=", liturgiskaisLaiks0, " vespI=", gads[d].vesperesI);
  console.log( stunda == 'vesperes' , gads[d1].prior < gads[d].prior ,  nd0==6 , gads[d].vesperesI == false, liturgiskaisLaiks == liturgiskaisLaiks0);
  
	if (stunda == 'vesperes' && gads[d1].prior < gads[d].prior && liturgiskaisLaiks == "festumShow" && gads[d1].vesperesI == true) {  //gads[d1].liturgija == "" jeb Agneses problēma
	// pagaidām tikai parastajā laikā, nestrādā uz laika maiņām testēt 24.12. vesperes // liturgiskaisLaiks0 == "parastais"
		console.log("Liturģiskā laika korekcija" , liturgiskaisLaiks, " uz ", liturgiskaisLaiks0);
		liturgiskaisLaiks = liturgiskaisLaiks0;
   }
	console.log("TEST" , stunda," d1=", gads[d1].prior, " d=",gads[d].prior, " nd0=", nd0, " LitLaiks=", liturgiskaisLaiks, " pamata=", liturgiskaisLaiks0, " vespI=", gads[d].vesperesI);
	console.log( stunda == 'vesperes' , gads[d1].prior < gads[d].prior ,  nd0==6 , gads[d].vesperesI == false, liturgiskaisLaiks == liturgiskaisLaiks0);
 	
	if ( stunda == 'vesperes' && ( gads[d1].prior <= gads[d].prior || gads[d].vesperesI == false) && nd0==6){// && liturgiskaisLaiks == liturgiskaisLaiks0 pētera katedra
	// lai svētdien būtu pirmās vesperes svarīgos svētkos viena liturģiskā laika ietvaros tāpēc beigās ir liturgiskaisLaiks == liturgiskaisLaiks0, testēt 24.12. vesperes
	console.log(liturgiskaisLaiks,"lai svētdien būtu pirmās vesperes svarīgos svētkos");
		liturgiskaisLaiks = liturgiskaisLaiks0;
		psn = psn0;
		nd = nd0;
	} 
  
  if ( stunda == 'vesperes' && nd == 6) {  
	console.log(liturgiskaisLaiks, 'Sestdienas vesperes')
	 console.log("TEST" );
		psn++; 
		if(liturgiskaisLaiks == 'parastais' && psn === 5 ) psn = 1; // parastajā laikā ir tikai 4 nedēļas
	 } // jāuzliek liturģisko laiku pāreja

	lugsana.innerHTML = htmlTemplate; // izsauc liturģijas pamatu
	if(stunda ==  'dienas'){ //noslēpj nevajadzīgos elementus
		document.querySelector('#containerLaudesIntro').style.display = 'none';
		document.querySelector('#containerIevadpsalms').style.display = 'none';
		document.querySelector('#containerDziedajums').style.display = 'none';
		document.querySelector('#containerLugumi').style.display = 'none';
		document.querySelector('#containerKungaLugsana').style.display = 'none';
		document.querySelector('#ievadPsalmaDropdown').style.display = 'none';
	}
	if (stunda == 'vesperes' || stunda == 'vesperesI') { //noslēpj nevajadzīgos elementus
	  document.querySelector('#containerLaudesIntro').style.display = 'none';
	  document.querySelector('#containerIevadpsalms').style.display = 'none';
	  document.querySelector('#ievadPsalmaDropdown').style.display = 'none';
  }
  
    //========================
	// containerStunduTitle	
	// < ======================== 
	console.log("containerStunduTitle", liturgiskaisLaiks, psn, nd, stunda);
	//container.log(liturgiskaisLaiks][psn][nd][stunda]);
	document.querySelector('#title').innerHTML = window[liturgiskaisLaiks][psn][nd][stunda].title;
	
	if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#N')) document.querySelector('#N').innerHTML = gads[d].N;
	
	console.log('Note: ' + liturgiskaisLaiks + ', dienaId: ' + d, 'psn:', psn);
	
	// containerBezIevadpsalma
	 if (stunda =='laudes') document.querySelector('#containerBezIevadpsalma').style.display = 'none';
	// containerLaudesIntro
	// containerIevadpsalms 
	console.log("ievadAnt. ",liturgiskaisLaiks, psn, nd,  isEmpty( () => { window[liturgiskaisLaiks][psn][nd].laudes.ievdant }  ) );
	console.log(liturgiskaisLaiks, window[liturgiskaisLaiks][psn][nd].laudes.ievdant);
	sel = document.querySelectorAll('#ievadpsalmsAnt'); sel[0].innerHTML = sel[1].innerHTML =  window[liturgiskaisLaiks][psn][nd].laudes.ievdant;     
	// window[liturgiskaisLaiks][psn][nd].laudes.ievdant; // isEmpty(x)
	document.querySelector('#ievadpsalms').innerHTML = izveletaisPsalms; //psalms95;
	atkartoAnt();

	// izvadpsalma izvēles
	sel = document.querySelector('#ievadPsalmaDropdownContent'); // automātiski pa nedēļām
	var ievads = '<a href="#psalms95">Psalms 95 Nāciet, dziedāsim Kungam ar prieku</a> \
						<a href="#psalms100">Psalms 100 Gavilējiet Kungam, visa zeme!</a> \
						<a href="#psalms24">Psalms 24 Kungam pieder zeme...</a> \
						<a href="#psalms67">Psalms 67 Lai Dievs apžēlojas par mums...</a> \
						<a href="#bez">Bez ievadpsalma</a>';
	sel.innerHTML = ievads;
	// izvadpsalma seletor
	var items = document.querySelectorAll('#ievadPsalmaDropdownContent a');
	for(var i =0; i<items.length; i++) {
		items[i].addEventListener("click", function(p) { 
			document.querySelector('#ievadPsalmaDropdownContent').classList.remove("show");
			izvele = p.target.hash.substring(1);
			if (izvele == 'bez') {
				document.querySelector('#containerLaudesIntro').style.display = 'none';
				document.querySelector('#containerIevadpsalms').style.display = 'none';
				document.querySelector('#containerBezIevadpsalma').style.display = 'initial';
			} else {
				document.querySelector('#containerLaudesIntro').style.display = 'initial';
				document.querySelector('#containerIevadpsalms').style.display = 'initial';
				document.querySelector('#containerBezIevadpsalma').style.display = 'none';
				izveletaisPsalms = p.target.hash.substring(1);
				document.querySelector('#ievadpsalms').innerHTML = window[izveletaisPsalms];
				// ieleik Ant. iekš #atkartoAnt
				atkartoAnt();
				// nomaina Ps psalmodijā, ja sakrīt
				if(izveletaisPsalms == window[liturgiskaisLaiks][psn][nd][stunda].ps1) document.querySelector('#psalms1').innerHTML = psalms95;
				if(izveletaisPsalms == window[liturgiskaisLaiks][psn][nd][stunda].ps2) document.querySelector('#psalms2').innerHTML = psalms95;
				if(izveletaisPsalms == window[liturgiskaisLaiks][psn][nd][stunda].ps3) document.querySelector('#psalms3').innerHTML = psalms95;
			}
			if(izvele == 'bez' || izveletaisPsalms == 'psalms95') { // šis nostāda noklusētos psalmus
				document.querySelector('#psalms1').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps1];
				document.querySelector('#psalms2').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps2];
				document.querySelector('#psalms3').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps3];
			}
		sakartotAlleluja(d);
		} );
	}

	// containerHimna
	if(stunda == 'dienas'){ // optimizēt, sk 520
		if (window[window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].himna] != null) {
						console.log("sel Dienas himna katrai stundai.", ziemassvetki[0][26].dienas.stunda[6].himna );
						document.querySelector('#himna').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].himna];
						}
					else { 
						console.log('sel Dienas himna viena visām stundām.');
						document.querySelector('#himna').innerHTML =window[window[liturgiskaisLaiks][psn][nd][stunda].himna];
						}
		}
	else { console.log('Dienas himna viena visām stundām.')
		document.querySelector('#himna').innerHTML =window[window[liturgiskaisLaiks][psn][nd][stunda].himna];
		}
	
	// containerPsalmodijs
	const dienasPs = function(x){
		ll = gads[d].litlaiks; // kaut kur pazuda 
		console.log('dienas psalmi', liturgiskaisLaiks, psn, nd, ll, 'stunda=',x);
		if ( ( ll == 'zokt'  || ll == 'zsl' ) && liturgiskaisLaiks != 'festumShow' ) {
			console.log('d= ', d,' ZS un ZSOKT svētku dienas psalmi', 'psn0=',psn0, 'nd0=', nd0, parastais[psn0][nd0].dienas.ps1);
			if (stunda == 'dienas' ) { // dienas stundā 	// prioritāte psalmam zem dienas stundas, tad zem stundas, tad pll psalmi
			console.log(liturgiskaisLaiks, psn0, "TEST", psn, nd, stunda, "PSALMS#", ziemassvetki[psn][nd][stunda].ps1, " vai ",parastais[psn0][nd0].dienas.ps1);
			console.log(typeof ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1, " vai ", ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1, " <-");
			console.log( typeof ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1 != "undefined" , ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1 != "" )
				if ( typeof ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1 != "undefined" && ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1 != "" ) { console.log("#1#");
						console.log("1D pslami", ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1); 
					document.querySelector('#psalms1').innerHTML = window[ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps1];
					document.querySelector('#psalms2').innerHTML = window[ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps2];
					document.querySelector('#psalms3').innerHTML = window[ziemassvetki[psn][nd][stunda].stunda[dienasStunda].ps3];
				}
				else if ( window[liturgiskaisLaiks][psn][nd][stunda].ps1 != "" ) { console.log("#2#");
					console.log("2D pslami", ziemassvetki[psn][nd][stunda].ps1); 
					document.querySelector('#psalms1').innerHTML = window[ziemassvetki[psn][nd][stunda].ps1];
					document.querySelector('#psalms2').innerHTML = window[ziemassvetki[psn][nd][stunda].ps2];
					document.querySelector('#psalms3').innerHTML = window[ziemassvetki[psn][nd][stunda].ps3];
				}
				else { console.log("#3#");
					console.log("3D pslami", parastais[psn0][nd0].dienas.ps1); 
					document.querySelector('#psalms1').innerHTML = window[parastais[psn0][nd0].dienas.ps1];
					document.querySelector('#psalms2').innerHTML = window[parastais[psn0][nd0].dienas.ps2];
					document.querySelector('#psalms3').innerHTML = window[parastais[psn0][nd0].dienas.ps3];
				}
			}
			else { // laudēs un vesperēs
			console.log("laudēs un vesperēs psn=", psn);
				if ( ziemassvetki[psn][nd][stunda].ps1 == "" ) { 
					document.querySelector('#psalms1').innerHTML = window[parastais[psn][nd0][stunda].ps1];
					document.querySelector('#psalms2').innerHTML = window[parastais[psn][nd0][stunda].ps2];
					document.querySelector('#psalms3').innerHTML = window[parastais[psn][nd0][stunda].ps3];
				} 
				else {
					document.querySelector('#psalms1').innerHTML = window[ziemassvetki[psn][nd][stunda].ps1];
					document.querySelector('#psalms2').innerHTML = window[ziemassvetki[psn][nd][stunda].ps2];
					document.querySelector('#psalms3').innerHTML = window[ziemassvetki[psn][nd][stunda].ps3];
				}
			}
		}
		else if( stunda == 'dienas' && window[window[liturgiskaisLaiks][psn][nd]["dienas"]["stunda"][x].ps1] ){ 
		console.log("dienas psalms1");
			document.querySelector('#psalms1').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda]["stunda"][x].ps1];
			document.querySelector('#psalms2').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda]["stunda"][x].ps2];
			document.querySelector('#psalms3').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda]["stunda"][x].ps3];
		}
		else {
			console.log("dienas psalms 2");
			document.querySelector('#psalms1').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps1];
			document.querySelector('#psalms2').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps2];
			document.querySelector('#psalms3').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].ps3];
		}
		
		if ( stunda == 'dienas' && gads[d].liturgija == 'festum-0-Baptism'  ) { //Psalmi no III nedēļas svētdienas. Ja svētki iekrīt 7. janvārī, tad ir no II nedēļas svētdienas Ps 23 (22), 76 (75) I un II
					document.querySelector('#psalms1').innerHTML = window[parastais[psn0][nd0].dienas.ps1];
					document.querySelector('#psalms2').innerHTML = window[parastais[psn0][nd0].dienas.ps2];
					document.querySelector('#psalms3').innerHTML = window[parastais[psn0][nd0].dienas.ps3];
		}
		
		if ( stunda == 'dienas' && gads[d].liturgija == 'festum-0-SvGimene' && gads[d].datums.valueOf() == new Date( year, 11, 30 ).valueOf() ) { //Psalmi no 1.nedēļas svētdienas Ps 118 (117) I, II, III. Ja svētki neiekrīt svētdien, tad psalmus ņem no dienas jeb pll 1.ned. piekdienas.
					document.querySelector('#psalms1').innerHTML = window[parastais[psn0][nd0].dienas.ps1];
					document.querySelector('#psalms2').innerHTML = window[parastais[psn0][nd0].dienas.ps2];
					document.querySelector('#psalms3').innerHTML = window[parastais[psn0][nd0].dienas.ps3];
		}
		
	}
	dienasPs(dienasStunda);

	const dienasAnt = function (x) {
		var ll = liturgiskaisLaiks0;
		//var specialasAnt = typeof window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant'];
		console.log('ll=', liturgiskaisLaiks0);
		if( stunda == 'dienas' 
			&& ( liturgiskaisLaiks == 'gavenis' 
				|| liturgiskaisLaiks == 'lieldienas' 
				|| (liturgiskaisLaiks == 'festumShow' && ll != 'parastais') 
				|| typeof window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant'] == 'string') ) 	{ //PSN.ND.dienas.stunda[3].ant
					// 
					console.log("gavēņa, lieldienu laikā dienas stundām psalmu antifona ir vienāda atkatībā no stundas");
					
					if(x == 3) {ant = 'ant1';} else if(x == 6) {ant = 'ant2';} else {ant = 'ant3';}
					
					if (window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant']) {
							sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant'];
							sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant'];
							sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda]['stunda'][x]['ant'];
						} 
					else {
							sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd]['dienas'][ant];
							sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd]['dienas'][ant];
							sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd]['dienas'][ant];
						}
				
					sel = document.querySelectorAll('.antifona');
					for(var i=1; i<5; i++) {
						sel[i].style.display = 'none';
						}
					document.querySelector('#pirmaAntifona').innerHTML = 'Ant.';
		} 
		else { console.log("ne-dienas stunda ","ANT =>");
			if ( liturgiskaisLaiks != 'festumShow' && ( ll == 'zokt'  || ll == 'zsl' ) && ziemassvetki[psn][nd][stunda].ant1 == null ) {
			// svarīgi ir salīdzinājuma secība     console.log(d,' nu tad antifonas?', stunda, psn0, nd0, " vs ", psn, nd, ziemassvetki[psn][nd][stunda].ant1, ziemassvetki[psn][nd][stunda].ant1 != null );
				sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant1;
				sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant2;
				sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant3;
			}
			else { 
				if (gads[d].datums.valueOf() == new Date(year, 11, 24).valueOf() && stunda == 'laudes' ) {
					sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks].advents[24][stunda].ant1;
					sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks].advents[24][stunda].ant2;
					sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks].advents[24][stunda].ant3;
				}
				else { 
					console.log(d,' haha ?', liturgiskaisLaiks,ll,  psn, nd, stunda);
					//console.log(d,' haha ?', typeof window[liturgiskaisLaiks][psn][nd][stunda].ant3, window[liturgiskaisLaiks][psn][nd][stunda].ant3 );
					if ( window[liturgiskaisLaiks][psn][nd][stunda].ant1 == '' ) {  // ja nav pirmās antifonas, tad visas ir no PLL
						console.log("Šeit PLL antifonas", parastais, psn0, nd0, stunda, ll);
							if (  liturgiskaisLaiks == 'gavenis' ) psn0=psalmuNedela(psn); // gavēnī ir no 0. līdz 7. nedēļai, kas neatbilst PLL 4 nedēļu ciklam 
							if (psn0 == 0) psn0=4; //getPsalmWeek(psn0);
							sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant1;
							sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant2;
							sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = parastais[psn0][nd0][stunda].ant3;
						} 
					else {
							sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda].ant1;
							sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda].ant2;
							sel = document.querySelectorAll('#ant3'); sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda].ant3;
						}
				}
			}
		}
	}
	dienasAnt(dienasStunda);

	// Dienas stundas izvēles ===>
		sel = document.querySelector('#dienasLasijumaDropdownContent'); // automātiski pa nedēļām
		var ievads = '<a href="#s3">Trešā stunda</a> \
							<a href="#s6">Sestā stunda</a> \
							<a href="#s9">Devītā stunda</a>';
		sel.innerHTML = ievads;
	// Dienas stundas seletor
			var items = document.querySelectorAll('#dienasLasijumaDropdownContent a');
			for(var i =0; i<items.length; i++) {
			items[i].addEventListener("click", function(p) { 
				document.querySelector('#dienasLasijumaDropdownContent').classList.remove("show");
				izvele = p.target.hash.substring(1);
					if (izvele == 's3') { dienasStunda = 3; }
					else if (izvele == 's6') { dienasStunda = 6; }
					else { dienasStunda = 9; }
					// nomaina himnu
					if (window[window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].himna] != null) {
						console.log('sel Dienas himna katrai stundai.', liturgiskaisLaiks, psn, nd, stunda);
						document.querySelector('#himna').innerHTML = window[window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].himna];
						}
					else { 
						console.log('sel Dienas himna viena visām stundām.');
						document.querySelector('#himna').innerHTML =window[window[liturgiskaisLaiks][psn][nd][stunda].himna];
						}
					
					// nomaina antifonas !! gavēņa laikam	
					dienasAnt(dienasStunda);
					
					// ieleik psalmus 			console.log(liturgiskaisLaiks, psn, nd, stunda, dienasStunda, window[liturgiskaisLaiks][psn][nd][stunda].ps1);
					dienasPs(dienasStunda);
					
					// nomaina lasījumu
					document.querySelector('#containerLasijums').innerHTML = '<hr><h4><span class="redbold">' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lasijumstitle + '</span></h4><p>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lasijumstext + '</p>';
					// nomaina atbildi
					document.querySelector('#responsorijs').innerHTML =  '<p><span class="redbold">℣. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].atb1 + '<br><span class="redbold">℟. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].atb2+ '</p>';
					
					if ( stunda=='dienas' ) { // sk. 777
						if ( nd ==0 || (liturgiskaisLaiks == 'advents' || liturgiskaisLaiks == 'gavenis' || liturgiskaisLaiks == 'lieldienas' || liturgiskaisLaiks == 'ziemassvetki')) {
							noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd]["laudes"].lugsimies + '</p>';
						}
						else {
							noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies;
						}
						
						if (liturgiskaisLaiks == 'festumShow' && gads[d].prior < 10) {
							console.log('=>Festum Dienas lūgšana');
							if (gads[d].lugsana) {
								noslegLugsana.innerHTML = '<p>' +gads[d].lugsana + '</p>';
							}
							else { console.log('=>Festum cita lūgšana', window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies);
								if (window[liturgiskaisLaiks][psn][nd][stunda].lugsimies) {
									console.log('=>Festum cita lūgšana šī:=>');
									noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
								}
								else {
									noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
								}
							}
						} else if  (liturgiskaisLaiks == 'festumShow' && gads[d].prior >= 10) {
							//console.log("Festu dienas vid lūgšana", liturgiskaisLaiks, liturgiskaisLaiks0, psn, nd, psn0, nd0);
								if (window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies) {
											noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
								} else {
								noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks0][psn0][nd0].laudes.lugsimies;
											}
						}
					}
				noslegLugsana.insertAdjacentHTML( 'beforeend' , '<p><span class="redbold">℟. </span>Āmen.</p>');
				
				if(document.querySelector('#gara')) {
					document.querySelector('#gara').style.display = 'none';
					document.querySelector('#dienas').style.display = 'initial';
				}
				
				sakartotAlleluja(d);
				
				noslegLugsana.insertAdjacentHTML( 'afterbegin' , '<p><span class="redbold">℣. </span>Lūgsimies.</p>');
				})
			}
	// <=== Dienas stundas izvēles
		
	// containerLasijums
	sel = document.querySelector('#containerLasijums');
	if(stunda == 'dienas') { 
		sel.innerHTML = '<hr><h4><span class="redbold">' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lasijumstitle + 
															'</span></h4><p>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lasijumstext + '</p>';
	}
	else {
		document.querySelector('#dienasLasijumaDropdown').style.display = 'none';
		sel.innerHTML = '<hr><h4><span class="redbold">' + window[liturgiskaisLaiks][psn][nd][stunda].lasijumstitle + 
															'</span></h4><p>' + window[liturgiskaisLaiks][psn][nd][stunda].lasijumstext + '</p>';
	}
	
		
	// containerAtbilde
	sel = document.querySelector('#responsorijs'); 
	if(stunda == 'dienas') {
		sel.innerHTML =  '<p><span class="redbold">℣. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].atb1 + 
		'<br><span class="redbold">℟. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].atb2+ '</p>';
	}
	// speciāla atbilde, kad ir tikai 1 antifona
	else if( (window[liturgiskaisLaiks][psn][nd][stunda].atb1 == window[liturgiskaisLaiks][psn][nd][stunda].atb2 || window[liturgiskaisLaiks][psn][nd][stunda].atb2 =='' ) &&
	(stunda == 'laudes' || stunda == 'vesperes') ) {
		sel.innerHTML =  '<p><span class="redbold" style="font-weight:bold">Ant. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb1 + '</p>';
	}
	else {
		sel.innerHTML =  '<p><span class="redbold">℣. </span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb1 +
			  '<br><span class="redbold">℟.&nbsp;</span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb1 +
			  '<br><span class="redbold">℣.&nbsp;</span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb2 +
			  '<br><span class="redbold">℟.&nbsp;</span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb3 +
			  '<br><span class="redbold">℣.&nbsp;</span>Gods lai ir Tēvam un Dēlam, un Svētajam Garam.' +
			  '<br><span class="redbold">℟.&nbsp;</span>' + window[liturgiskaisLaiks][psn][nd][stunda].atb1 + '</p>';
	}
		  
	// containerDziedajums MAGNIFICAT - BENEDICTUS
	
	if(stunda != 'dienas') {
		sel = document.querySelector('#containerDziedajums');
		if(stunda=='laudes') {sel.innerHTML = benedictus} else if( stunda=='vesperes' || stunda=='vesperesI' ) {
			sel.innerHTML = magnificat; 
		}
		
		sel = document.querySelectorAll('#antBenMag');
		console.log(liturgiskaisLaiks);
		if( (liturgiskaisLaiks == 'parastais' || liturgiskaisLaiks == 'advents'|| liturgiskaisLaiks == 'gavenis') && (( (nd == 6 || nd ==0) && stunda == 'vesperes' ) || (nd ==0 && stunda == 'laudes') ) ) { // ABC gadu svētdienu antifonas
		// if( (liturgiskaisLaiks == 'parastais' || liturgiskaisLaiks == 'advents') && ( (nd == 6 || nd ==0) && stunda == 'vesperes') || (nd ==0 && stunda == 'laudes') ) { // ABC gadu svētdienu antifonas
				var Sv = gads[d].psNedela;
				var St = stunda;
				if (nd === 6) {
					Sv++; 
					St = 'vesperesI';
				}
				if ( liturgiskaisLaiks == 'parastais' ) {
					sel[0].innerHTML = sel[1].innerHTML =  antifona_pll_sv[litGads][Sv][St]; // PLL svētdienu ant
				}
				 
				if ( liturgiskaisLaiks == 'advents') {
					var litGads0 = litGads;
						if ( gads[d].datums.valueOf() == cal.pll3.valueOf() ) { // 1.adventa I vesperes jānomaina gads
							var litGads0 = litGads;
							if ( litGads == 'A' ) { litGads = 'B' } 
							else if ( litGads == 'B' ) { litGads = 'C' }
							else if ( litGads == 'C' ) { litGads = 'A' }
							Sv = 1;
						}
					
//					nd = gads[d].datums.getDate(); // datums
//					ned = gads[d].datums.getDay(); // nedēļas diena
console.log("read => adventa problēmas");
					if ( gads[d].datums.valueOf() >= new Date(year, 11, 17).valueOf() && gads[d].datums.valueOf() <= new Date(year, 11, 24).valueOf() ) {
						if ( gads[d].datums.getDay() == 0 && stunda == 'laudes') {
							if ( gads[d].datums.valueOf() == new Date(year, 11, 21).valueOf() || gads[d].datums.valueOf() == new Date(year, 11, 23).valueOf() ) { // 2018.gads 23.dec.
								sel[0].innerHTML = sel[1].innerHTML = advents.advents[ gads[d].datums.getDate() ][stunda].magbenant;
							}
							else  {
								sel[0].innerHTML = sel[1].innerHTML =  antifona_adv_sv[litGads][Sv][St]; // adventa svētdienu ant
							}
						}
						else { 
							sel[0].innerHTML = sel[1].innerHTML = advents.advents[ gads[d].datums.getDate() ][stunda].magbenant;
						}
					} else {
						sel[0].innerHTML = sel[1].innerHTML =  antifona_adv_sv[litGads][Sv][St]; // adventa svētdienu ant
					}
					litGads = litGads0; // noliekam atpakaļ
				}
		
				if ( liturgiskaisLaiks == 'gavenis' ) { //console.log("Gavēņa svētdienas MagBen antifona", litGads, Sv, St, antifona_gav_sv[litGads][Sv][St]);
					sel[0].innerHTML = sel[1].innerHTML =  antifona_gav_sv[litGads][Sv][St]; // GAV svētdienu ant
				}
		}
		else {
			sel[0].innerHTML = sel[1].innerHTML = window[liturgiskaisLaiks][psn][nd][stunda].magbenant;
		}
		
			console.log(litGads); // derētu housekeeping funkciju
 	if (document.querySelector('.A')) { // dažos magbenant ir visi gadi iestrādāti
		if( litGads == 'A' ) { 
			sel = document.querySelectorAll('.A'); sel[0].style.display = sel[1].style.display = 'initial';
			sel = document.querySelectorAll('.B' ); sel[0].style.display = sel[1].style.display = 'none';
			sel = document.querySelectorAll('.C'); sel[0].style.display = sel[1].style.display  = 'none';
		}
		if( litGads == 'B' ) { 
			sel = document.querySelectorAll('.A'); sel[0].style.display = sel[1].style.display = 'none';
			sel = document.querySelectorAll('.B' ); sel[0].style.display = sel[1].style.display = 'initial';
			sel = document.querySelectorAll('.C'); sel[0].style.display = sel[1].style.display  = 'none';
		}
		if( litGads == 'C' ) { 
			sel = document.querySelectorAll('.A'); sel[0].style.display = sel[1].style.display = 'none';
			sel = document.querySelectorAll('.B' ); sel[0].style.display = sel[1].style.display = 'none';
			sel = document.querySelectorAll('.C'); sel[0].style.display = sel[1].style.display  = 'initial';
		}
	}
		
	}
	
	// containerLugumi
	if(stunda != 'dienas') { // ja ir Laudes un Vesperes
		
		const visparejieLugumi = function(str) {
		  return "<li class='lugsana'>" + window[liturgiskaisLaiks][psn][nd][stunda][str] + 
		  "<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		}
		
		sel = document.querySelector('#visparejieLugumi'); //funkcija
		
		var sLugumi = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].lugumi +
								'<br><span class="bolditalic">' + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + '</span></p><ul>';
		for (i in window[liturgiskaisLaiks][psn][nd][stunda].lugums) {
			sLugumi += "<li class='lugsana'>" + window[liturgiskaisLaiks][psn][nd][stunda]['lugums'][i] + 
			"<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
			}
		// Īpašie lūgumi
/* 		for(i=0; i<biskapi.length; i++){ // biskapi = pieminasdienas.js
			if(gads[d].datums.valueOf() == new Date(year,biskapi[i].m-1,biskapi[i].d).valueOf()) sLugumi += "<li class='lugsana'>Mīlošais Tēvs, svētī bīskapu "+biskapi[i].v+". Lai viņu pavada Svētais Gars, ka viņš vadītu Tavu ganāmpulku ar prieku un pazemību, no sirds, kā Tavs pašaizliedzīgais kalps, būdams par paraugu Tavam ganāmpulkam.<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		}
		for(i=0; i<biskapi_emeritus.length; i++){ // biskapi_emeritus = pieminasdienas.js
			if(gads[d].datums.valueOf() == new Date(year,biskapi_emeritus[i].m-1,biskapi_emeritus[i].d).valueOf()) sLugumi += "<li class='lugsana'>Mīlošais Tēvs, svētī bīskapu "+biskapi_emeritus[i].v+". Sūti pār viņu Svēto Garu, lai viņa vārdi iedvsmo, viņa darbi nes augļus un viņa dzīve atspoguļo Tavu godību.<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		}
		
		for(i=0; i<priesteri.length; i++){ // priesteri = pieminasdienas.js
			if(gads[d].datums.valueOf() == new Date(year,priesteri[i].m-1,priesteri[i].d).valueOf()) sLugumi += "<li class='lugsana'>Mīlošais Tēvs, svētī priesteri "+priesteri[i].v+", dāvā viņam spēku, drosmi un gudrību sludināt Tavu Vārdu, lai Tavs prieks viņā ir pilnīgs.<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		}
		
		for(i=0; i<diakoni.length; i++){ // diakoni = pieminasdienas.js
			if(gads[d].datums.valueOf() == new Date(year,diakoni[i].m-1,diakoni[i].d).valueOf()) sLugumi += "<li class='lugsana'>Mīlošais Tēvs, svētī diakonu "+diakoni[i].v+", lai caur viņu tiek pagodināts Tavs Dēls.<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		}
		
// Speciālais lūgums līdz datumam - akcija
		if(gads[d].datums.valueOf() <= new Date(2025,4,18).valueOf()) sLugumi += "<li class='lugsana'>Kungs, sargā un stiprini mūsu pāvestu Leonu XIV, dari auglīgu viņa darbu uz zemes, un neļauj viņam nokļūt viņa ienaidnieku varā.<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";
		*/
		
//		if(gads[d].datums.valueOf() == new Date(year,10,18).valueOf()) sLugumi += "<li class='lugsana'>Dievs svētī Latviju!<br><span class='bolditalic'>" + window[liturgiskaisLaiks][psn][nd][stunda].resplugums + "</span></li>";

		sLugumi += '</ul>';
		sel.innerHTML = sLugumi;		
		// for (i in lieldienas) { console.log(lieldienas[i]);}
	}

	
	// containerKungaLugsana
	document.querySelector('#containerKungaLugsana').innerHTML = kungaLugsana; // no mainīgā
	
	//containerNoslegumaLugsana noslegumaLugsana
	var noslegLugsana = document.querySelector("#noslegumaLugsana"); 

	if ( stunda == 'laudes' || stunda == 'vesperes' || stunda == 'vesperesI' ) { 
		console.log('=>Laudes/Vesperes lūgšana 809');

		if (nd === 6 && stunda == 'vesperes') { selectedSvetdiena = gads[d1].svetdiena; }
		
		console.log("Lūgšana: ", liturgiskaisLaiks, 'psn:',psn, 'nd:', nd, stunda, 'selectedSvetdiena', selectedSvetdiena, window[liturgiskaisLaiks][psn][nd][stunda].lugsimies);
		// noklusētā lūgšana
		noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
		
		if ( liturgiskaisLaiks == 'parastais' && ( nd === 0 || ( nd === 6 && stunda == 'vesperes' ) ) ) {
			console.log("SV lugšana vesperes");
				noslegLugsana.innerHTML = '<p>' + lugsana_pll_sv[selectedSvetdiena] + '</p>';
			}

		console.log(liturgiskaisLaiks, " + festum adventa laikā");
		if (liturgiskaisLaiks == 'festumShow' ) { // && gads[d].prior < gads[d1].prior hrizostomam nerādīja  && gads[d1].prior < gads[d].prior
		//( gads[d1].vesperesI == true || gads[d1].datums.getDay() == 0 ) && gads[d1].prior <= gads[d].prior && (stunda == 'vesperes' || stunda == 'vesperesI' || stunda == 'kompletorijs' )
			console.log('Festum=>Laudes/Vesperes lūgšana', gads[d]);
			if (gads[d].lugsana) {// iespēja atšķirīgām Vesperu I un II lūgšanām, sk. Kristītājs
				if (stunda == 'vesperesI') {noslegLugsana.innerHTML = '<p>' + gads[d].lugsana_I + '</p>'; console.log("gads.lugsana_I");}
				else {noslegLugsana.innerHTML = '<p>' + gads[d].lugsana + '</p>'; console.log("gads.lugsana_II");}
				} 
			else { 
					noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
				}
			if (gads[d].himnaLaudes && stunda == 'laudes'){ // šādi ļaujam dienai īpašās izmaiņas, balstoties uz kopīgiem tekstiem
				document.querySelector("#himna").innerHTML = gads[d].himnaLaudes;
			}
			console.log("Speciāla Vesperu himna", d, gads[d].himnaVesperes, stunda);
			if (gads[d].himnaVesperes && stunda == 'vesperes'){ // šādi ļaujam dienai īpašās izmaiņas, balstoties uz kopīgiem tekstiem
				console.log("Speciāla Vesperu himna");
				document.querySelector("#himna").innerHTML = gads[d].himnaVesperes;
			}
			if (gads[d].ievdant && stunda == 'laudes' )  { // šādi ļaujam dienai īpašās izmaiņas, balstoties uz kopīgiem tekstiem
				items = document.querySelectorAll('#ievadpsalmsAnt'); // + atkartoAnt
					for(var i =0; i<items.length; i++) {
						items[i].innerHTML = gads[d].ievdant;
					}
				items = document.querySelectorAll('#atkartoAnt');
					for(var i =0; i<items.length; i++) {
						items[i].innerHTML = '<span class="redbold">Ant.&nbsp;</span>' + gads[d].ievdant;
					}
			}
			if (gads[d].benedictus && stunda == 'laudes' )  { // šādi ļaujam dienai īpašās izmaiņas, balstoties uz kopīgiem tekstiem
				items = document.querySelectorAll('#antBenMag');
					for(var i =0; i<items.length; i++) {
						items[i].innerHTML = gads[d].benedictus;
					}
			}
			if (gads[d].magnificat  && stunda == 'vesperes' )  { // šādi ļaujam dienai īpašās izmaiņas, balstoties uz kopīgiem tekstiem
				items = document.querySelectorAll('#antBenMag');
					for(var i =0; i<items.length; i++) {
						items[i].innerHTML = gads[d].magnificat;
					}
			}
		} //else nd=6;


	}


/* if (liturgiskaisLaiks == 'festumShow' ) { // && gads[d].prior <= gads[d1].prior hrizostomam nerādīja
		if (stunda == 'laudes' || stunda == 'vesperes' || stunda == 'vesperesI') {
			if (gads[d].lugsana) {
				noslegLugsana.innerHTML = '<p>' + gads[d].lugsana + '</p>';
			} else {
				noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].lugsimies;
			}
		}
	} else if ( nd === 0 || (stunda == 'vesperes' && nd === 6  && gads[d1].prior <= gads[d].prior) ) { // svētdienu lūgšana
		liturgiskaisLaiks = liturgiskaisLaiks0;
		psn = psn0;
		nd =nd0;
		d = Number (d); // kaut kāda iemesla dēļ nomainās mainīgā tips
		if (nd === 6) {
			selectedSvetdiena = gads[d+1].svetdiena;
			}
		noslegLugsana.innerHTML = '<p>' + lugsana_pll_sv[selectedSvetdiena] + '</p>';
	} else {
		if ( stunda == 'dienas' && window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies) {
			noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
		} else {
			noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
		}
	} */
	
	  
	if ( stunda=='dienas' ) { 
		console.log('=>Dienas lūgšana: ', liturgiskaisLaiks);
		if ( nd ==0 || (liturgiskaisLaiks == 'advents' || liturgiskaisLaiks == 'gavenis' || liturgiskaisLaiks == 'lieldienas' || liturgiskaisLaiks == 'ziemassvetki') ) {
			console.log( 'A  dienas lūgšana ' , ll, ll == 'pll' );
			if ( nd == 0 && liturgiskaisLaiks == 'parastais') {
				noslegLugsana.innerHTML = '<p>' + lugsana_pll_sv[selectedSvetdiena] + '</p>';
				}
			else if ( ( ll == 'zokt'  || ll == 'zsl' ) && window[liturgiskaisLaiks][psn][nd]["dienas"].lugsimies != null ){ // ziemasssvēku laikā dienas nav kā laudēs, bet vesperēs
				noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd]["dienas"].lugsimies + '</p>';
				console.log( 'BB  dienas lūgšana ' , window[liturgiskaisLaiks][psn][nd]["dienas"].lugsimies);
				}
			else {
				noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd]["laudes"].lugsimies + '</p>';
			}
	
		}
		else if (liturgiskaisLaiks == 'festumShow' && gads[d].prior < 10) {
							console.log('=>Festum Dienas lūgšana');
							if (gads[d].lugsana) {
								console.log('=>Festum spesiāla lūgšana');
								noslegLugsana.innerHTML = '<p>' +gads[d].lugsana + '</p>';
							}
							else { console.log('=>Festum cita lūgšana', window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies);
								if (window[liturgiskaisLaiks][psn][nd][stunda].lugsimies) {
									console.log('=>Festum cita lūgšana šī:=>');
									noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
								}
								else {
									noslegLugsana.innerHTML = '<p>' + window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
								}
							}
						}
		else if  (liturgiskaisLaiks == 'festumShow' && gads[d].prior >= 10) {
			console.log("Festu dienas vid lūgšana", liturgiskaisLaiks, liturgiskaisLaiks0, psn, nd, psn0, nd0);
					if (window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies) {
											noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
					} else {
					noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks0][psn0][nd0].laudes.lugsimies;
								}
		}
		else { console.log( 'SV dienas lūgšana ' );
			noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
		}
	}
/* 	else { console.log( 'Laudes un Vesperu lūgšana ' );
		if ( stunda != 'dienas' ) noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
	} */
		
	
	/* if(stunda=='dienas' && nd != 0) {// šī ir neefektivitāte, jo laudes un vesperes ir iepriekš
		if ( liturgiskaisLaiks == 'advents' || liturgiskaisLaiks == 'gavenis' || liturgiskaisLaiks == 'lieldienas' ) {
			noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd]["laudes"].lugsimies + '</p>'; // gavēņa laikā visu stundu nozlēguma lūgšana ir vienāda
			}
		else { console.log("dienas problēma");
			noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies + '</p>';
			}
	} 
console.log("Adventa problema: ", "liturgiskaisLaiks:", liturgiskaisLaiks,"psn:",psn,"nd:",nd,"stunda:",stunda, dienasStunda);

	if (stunda=='dienas' && liturgiskaisLaiks == 'festumShow' && gads[d].prior < 10) {
			if (gads[d].lugsana) noslegLugsana.innerHTML = '<p>' +gads[d].lugsana + '</p>';
			else if (window[liturgiskaisLaiks][psn][nd][stunda].lugsimies) noslegLugsana.innerHTML = '<p>' +window[liturgiskaisLaiks][psn][nd][stunda].lugsimies + '</p>';
			else window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies ;
	} else if (stunda=='dienas') { console.log("dienas svētdiena");
		window[liturgiskaisLaiks][psn][nd][stunda].stunda[dienasStunda].lugsimies;
	} */
	
	
	
	if (stunda=='dienas') {
		if(document.querySelector('#gara')) {
			document.querySelector('#gara').style.display = 'none';
			document.querySelector('#dienas').style.display = 'initial';
			}
	}

	if ( stunda == 'dienas' ) noslegLugsana.insertAdjacentHTML( 'afterbegin' , '<p><span class="redbold">℣. </span>Lūgsimies.</p>');
	noslegLugsana.insertAdjacentHTML( 'beforeend' , '<p><span class="redbold">℟. </span>Āmen.</p>');
	
	//conatinerSvetiba
	if(stunda=='dienas') {
			document.querySelector('#svetiba').innerHTML = svetibaDienas;
		} else {
			document.querySelector('#svetiba').innerHTML = svetibaLaudesVesperes; // no mainīgā
		}
	//========================
	
	// Ieiek svēto vārdus pēc ID => function svetoVardi
	svetoVardi();
/* 	if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#N')) { 
		sel = document.querySelectorAll('#N');
		for( i=0; i < sel.length; i++ ) sel[i].innerHTML = gads[d].N;
		}
	if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#G')) {
		sel = document.querySelectorAll('#G');
		for( i=0; i < sel.length; i++ ) sel[i].innerHTML = gads[d].G;
	}
	if( gads[d].N && liturgiskaisLaiks == 'festumShow' && document.querySelector('#D')) document.querySelector('#D').innerHTML = gads[d].Dat;
	 */
	 
	 
	//	 if(liturgiskaisLaiks == 'gavenis') document.querySelector('.alleluja').style.display = 'none'; // Gavēni noņem Alleluja

	// Gavēnī noslēpj Alleluja
	lentNoAlleluia(d);
	
	sakartotAlleluja(d);

// Viva Latvia
if ( stunda != 'dienas' && (gads[d].datums.valueOf() == new Date(year,10,18).valueOf() )) {
	document.getElementById('conatinerSvetiba').insertAdjacentHTML( 'beforeend' , '<hr>' + DievsSvetiLatviju );
}
if ( stunda != 'dienas' && (gads[d].datums.valueOf() == new Date(year,0,1).valueOf() )) {
	document.getElementById('conatinerSvetiba').insertAdjacentHTML( 'beforeend' , '<hr>' + VeniCreatorSpiritus );
}

//==bookmark===
bookMark(stunda);
}

const kopmletorijsLugsana = function() {
	var d = selectedDayId;
	var d1 = parseInt(d)+1;
	var psn = selectedNedela; 
	var nd = selectedDay;
Banner('kompletorijs');
  lugsana.innerHTML = komplet_template;

	if ( gads[d].litlaiks == 'ldl') { // lieldienās ir svētku kompletorijs darba dienā selectedLitlaiks
		var liturgiskaisLaiks = 'lieldienas';
		if ( typeof window[liturgiskaisLaiks][psn][nd].kompletorijs != 'undefined' ) nd = window[liturgiskaisLaiks][psn][nd].kompletorijs;
		}
	var sd = selectedDay;
	var kompletDatums = selectedStunduDatums;
	
	komplet[nd].title = "Kompletorijs";
	if ( gads[d].litlaiks == 'trd' || gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'zokt' ) { // gads[d].litlaiks == 'trd' || 
		nd = 0; console.log("trd lokt zokt II kompletorijs", gads[d].litlaiks, sd, "d1=", gads[d1].liturgija);
		komplet[nd].title = "Kompletorijs"; // Jābūt, kā rindā 1098, Truduum izlaist kompletoriju savādāk nestrādā.
		if (sd == 6 && gads[d].litlaiks == 'trd') komplet[nd].title = "Kompletorijs "+ izlaistKompetoriju;
		if (sd == 6 && gads[d1].liturgija == 'festum-0-SvGimene') nd=6; // kad sv Ģimene ir svētdienā un ir vesperesI
		if (gads[d1].liturgija == 'ziemassvetki-1-1') {nd=6; console.log("Kompletorisj I")}// kad 1.janvāris un ir vesperesI
	}
	else if ( gads[d].liturgija && gads[d].vesperesI && (gads[d].prior <= gads[d1].prior) || gads[d].datums.valueOf() == new Date(year, 0, 1).valueOf() ) {
		nd = 0; console.log("svētki II kompletorijs");
		// komplet[nd].title = "Svinību II Kompletorijs"
		}
	else if ( gads[d1].vesperesI && gads[d1].prior <= gads[d].prior || gads[d].datums.valueOf() == new Date(year, 11, 31).valueOf() ) { 
		nd = 6; console.log("svētki I kompletorijs");
		// komplet[nd].title = "Svinību I Kompletorijs"
		}
	else if ( gads[d1].vesperesI && !selectedDay ==0 ) {
		nd = 6;
	}
	
console.log("izvēlētais kompletorijs nd = ", nd, document.querySelector('#title'));

  if (selectedStunduDatums > cal.zsl0 && selectedStunduDatums < new Date (selectedStunduDatums.getFullYear()+1, 0, 2, 0, 0, 0)) dat=0; // ārkātas gadījumi, kad ir svētdienas kompletorijs
  

 // lugsana.innerHTML = komplet_template;
//========================
	// containerStunduTitle
	document.querySelector('#title').innerHTML = komplet[nd].title;
	
	// containerGrekuNozela
	sel = document.querySelector('#containerGrekuNozela');
	var nozela = '<hr>';
	nozela += '<div class="dropdown">\
						<button onclick="choose(\'nozelasAktsBtn\')" class="dropbtn">▼</button>\
						 <div id="nozelasAktsBtn" class="dropdown-content">\
							<a href="#0">1. variants</a>\
							<a href="#1">2. variants</a>\
							<a href="#2">3. variants</a>\
						 </div> \
					 </div>';
	nozela += '<h4><span class="redbold">GRĒKU NOŽĒLA</span></h4>';
	nozela += '<div id = "nozelasAktsVar">' + nozelasAkts[0] + '</div>';
	sel.innerHTML = nozela;
	// seletor
	items = document.querySelectorAll('#nozelasAktsBtn a');
	for(var i =0; i<items.length; i++) {
		items[i].addEventListener("click", function(p) { 
			document.querySelector('#nozelasAktsBtn').classList.remove("show");
			document.querySelector('#nozelasAktsVar').innerHTML = nozelasAkts[p.target.hash.substring(1)];
		} );
	}
//========================
	
	
	// containerHimna
	
/*
ir	[11:47 pm, 04/12/2021] pr. Māris Laureckis: Kompletorija 1.himna adventā ir līdz 16.dec., nevis kā parastajā laikā katru nedēļu mainās
ir  [11:49 pm, 04/12/2021] pr. Māris Laureckis: 2.himna ir no 17.-23.dec.
ir [11:50 pm, 04/12/2021] pr. Māris Laureckis: 1.himna 24.dec.-4.jan. Diena beigusies
ir [11:52 pm, 04/12/2021] pr. Māris Laureckis: 2.himna no 5-Kunga kristīšana Kungs Jēzu, kas esi teicis
*/
	
	sel = document.querySelector('#himna');
	if(gads[d].litlaiks == 'zokt' || gads[d].litlaiks == 'zsl') {
		if( gads[d].datums >= new Date(year, 11, 25) || gads[d].datums < new Date(year, 0, 5) ) {
			sel.innerHTML = himnaKomplet_1;
			} 
		else { 
			sel.innerHTML = himnaKomplet_2;
			}
	} 
	else if( gads[d].litlaiks == 'adv' && gads[d].datums < new Date(year, 11, 17) ) {
		sel.innerHTML = himnaKomplet_1;
	}
	else if (gads[d].litlaiks == 'adv' && gads[d].datums < new Date(year, 11, 25)) {
		if ( gads[d].datums.valueOf() == new Date(year, 11, 24).valueOf() ) {
			sel.innerHTML = himnaKomplet_1;
		} else {
			sel.innerHTML = himnaKomplet_2;
		}
	}
	else if( gads[d].psNedela % 2 == 1 ) { // nepāra nedēļā
		if ( sd != 6 ) {sel.innerHTML = himnaKomplet_1;} else {sel.innerHTML = himnaKomplet_2;}
	}
	else if( gads[d].psNedela % 2 == 0 ) { // pāra nedēļā 
		if ( sd != 6 ) {sel.innerHTML = himnaKomplet_2;} 
		else { 
			if ( gads[d].datums.valueOf() == cal.lielsestd.valueOf() ) {sel.innerHTML = himnaKomplet_2; }
			else sel.innerHTML = himnaKomplet_1; 
		}
	}
	if (( gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'ldl' || cal.lielsestd.valueOf() == gads[d].datums.valueOf() ) &&  gads[d].datums.valueOf() != cal.lielsestd.valueOf() ){
		if (sel.innerHTML == himnaKomplet_1 || cal.lielsestd.valueOf() == gads[d].datums.valueOf() ) sel.innerHTML = himnaKompletLieldienas;
		if (sel.innerHTML == himnaKomplet_2 ) sel.innerHTML = himnaKompletLieldienas2;
	}
	
	// containerPsalmodijs
	document.querySelector('#psalms1').innerHTML = window[komplet[nd].ps1];
	document.querySelector('#psalms2').innerHTML = window[komplet[nd].ps2];
	
	sel = document.querySelectorAll('#ant1'); sel[0].innerHTML = sel[1].innerHTML = komplet[nd].ant1;
	if(gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'ldl') sel[0].innerHTML  = sel[1].innerHTML  = 'Alleluja, alleluja, alleluja.';
	
	sel = document.querySelectorAll('#ant2'); sel[0].innerHTML = sel[1].innerHTML = komplet[nd].ant2;
	if(gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'ldl') sel[0].innerHTML  = sel[1].innerHTML  = 'Alleluja, alleluja, alleluja.';
	
	if ( komplet[nd].ps2 == "" ) document.querySelector('#otraisPsalms').style.display = 'none';
	
	if((gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'ldl') && komplet[nd].ps2 != "") {
		sel = document.querySelectorAll('.antifona'); 
		for(var i=1; i<3; i++) { sel[i].style.display = 'none'; }
	}// novāc alleluja pie 2 psalmiem
	

	// containerLasijums
	document.querySelector('#containerLasijums').innerHTML = '<hr><h4><span class="redbold">' + 
	komplet[nd].lasijumstitle + '</span></h4><p>' + komplet[nd].lasijumstext + '</p>';
	
	// containerAtbilde
	sel = document.querySelector('#responsorijs');
			// triduum atbildes
	if(kompletDatums.valueOf() == cal.lielceturtd.valueOf()) sel.innerHTML = '<p><span class="redbold" style="font-weight:bold;">Ant. </span>' + komplet.tridiuum[4] + '</p>';
	if(kompletDatums.valueOf() == cal.lielpiektd.valueOf())  sel.innerHTML = '<p><span class="redbold" style="font-weight:bold;">Ant. </span>' + komplet.tridiuum[5] + '</p>';
	if(kompletDatums.valueOf() == cal.lielsestd.valueOf())   sel.innerHTML = '<p><span class="redbold" style="font-weight:bold;">Ant. </span>' + komplet.tridiuum[6] + '</p>';
	if(gads[d].litlaiks == 'lokt' || kompletDatums.valueOf() == cal.lieldienas.valueOf() || kompletDatums.valueOf() == shiftDate(cal.lieldienas,7).valueOf() ) {
		sel.innerHTML = '<p><span class="redbold" style="font-weight:bold;">Ant. </span>' + komplet.lieldienuOkt + '</p>';
	}
	if(gads[d].litlaiks == 'ldl' && kompletDatums.valueOf() != cal.lieldienas.valueOf() && kompletDatums.valueOf() != shiftDate(cal.lieldienas,7).valueOf() ) { 
		sel.innerHTML = '\
		<p><span class="redbold">℣.&nbsp;</span>Tavās rokās, Kungs, es atdodu savu garu,* alleluja, alleluja.<br> \
		<span class="redbold">℟.&nbsp;</span>Tavās rokās, Kungs, es atdodu savu garu,* alleluja, alleluja.<br> \
		<span class="redbold">℣.&nbsp;</span>Kungs, uzticīgais Dievs, Tu esi mūs atpircis.*<br> \
		<span class="redbold">℟.&nbsp;</span>Alleluja, alleluja.<br> \
		<span class="redbold">℣.&nbsp;</span>Gods lai ir Tēvam un Dēlam, un Svētajam Garam.<br> \
		<span class="redbold">℟.&nbsp;</span>Tavās rokās, Kungs, es atdodu savu garu,* alleluja, alleluja.</p>';
	}
	
	// containerDziedajums
	sel = document.querySelector('#containerDziedajums'); sel.innerHTML = simeons;
	items = document.querySelectorAll('.sim');
	if( gads[d].litlaiks == 'ldl' || gads[d].litlaiks == 'lokt' ) {
		for(var i =0; i<items.length; i++)  items[i].style.display = 'initial';
		} else {
			for(var i =0; i<items.length; i++)  items[i].style.display = 'none';
			}

	
	// containerNoslegumaLugsana
		// komplet[nd].lugsimies  svētdienās, kā arī Lieldienu oktāvas laikā
		// komplet[nd].lugsimies2 svētkos, ja  neiekrīt svētdienā, kā arī Trīs Lielajās dienās
	sel = document.querySelector('#noslegumaLugsana');
	var nLugsana =  '<p><span class="redbold">℣. </span>Lūgsimies.</p>' + '<p>';
	if(sd == 0 && nd ==0 || gads[d].litlaiks == 'lokt') { nLugsana +=  komplet[nd].lugsimies; }
	else if( (sd != 0 && nd ==0) || (sd != 6 && nd ==6) || gads[d].litlaiks == 'trd' ) { nLugsana +=  komplet[nd].lugsimies2; } // vai nevajadzētu vienkāršot?
	else { nLugsana +=  komplet[sd].lugsimies; }
	sel.innerHTML = nLugsana + '</p><p><span class="redbold">℟. </span>Āmen.</p>';	
	//document.querySelector('#lugsana2').style.display = 'none';
	
	// conatinerSvetiba
	document.querySelector('#svetiba').innerHTML = svetibaKompl;
	
	// noslegumsMarijai
	sel = document.querySelector('#noslegumsMarijai');
	var marijai = '<hr>';
	marijai += '<div class="dropdown"> \
						<button onclick="choose(\'marijaiDropdown\')" class="dropbtn">▼</button> \
						 <div id="marijaiDropdown" class="dropdown-content"> \
							<a href="#slavasPilnaKaraliene">Slavas pilnā Karaliene</a> \
							<a href="#debessKaralieneLiksmojies">Debess Karaliene, līksmojies</a> \
							<a href="#tavaPatveruma">Tavā patvērumā</a> \
							<a href="#maigaPestitajaMate">Maigā Pestītāja Māte</a> \
							<a href="#esiSveicinataKaraliene">Esi sveicināta Karaliene</a> \
						 </div> \
					 </div>'; 
	if (gads[d].litlaiks == 'trd' || gads[d].litlaiks == 'gav') antMarijai='slavasPilnaKaraliene';
	else if(gads[d].litlaiks == 'lokt' || gads[d].litlaiks == 'ldl') antMarijai='debessKaralieneLiksmojies';
	else if(gads[d].litlaiks == 'adv' || gads[d].litlaiks == 'zokt' || gads[d].litlaiks == 'zsl' || gads[d].datums.valueOf() == cal.pll3.valueOf() ) antMarijai='maigaPestitajaMate';
	else antMarijai = 'esiSveicinataKaraliene';
	marijai += '<div id = "dziesmaMarijai">' + window[antMarijai] + '</div>';
	sel.innerHTML = marijai;
	// seletor
	items = document.querySelectorAll('#marijaiDropdown a');
	for(var i =0; i<items.length; i++) {
		items[i].addEventListener("click", function(p) { 
			document.querySelector('#marijaiDropdown').classList.remove("show");
			document.querySelector('#dziesmaMarijai').innerHTML = window[p.target.hash.substring(1)];
		} );
	}
	
	
	// Gavēnī noslēpj Alleluja
	if (gads[d].datums >= cal.gav0 && gads[d].datums < cal.lieldienas){
		items = document.querySelectorAll('.alleluja');
		for(var i =0; i<items.length; i++) {
			items[i].style.display = 'none';
		}
		
	}
	
//==bookmark===
bookMark("kompletorijs");
};

// LASĪJUMA STUNDA
const lasijumastunda = function(){
	console.log('Lasījuma stunda'); 
	var d = selectedDayId;
	var d1 = parseInt(d)+1;
	var nd = nd0 = selectedDay;
	var psned = parseInt(nd/4)
	var psn = psn0 = selectedNedela;
	if (gads[d].litlaiks == 'pll') var liturgiskaislaiks = 'parastais';
	if (gads[d].litlaiks == 'adv') var liturgiskaislaiks = 'advents';
	if (gads[d].litlaiks == 'gav') var liturgiskaislaiks = 'gavenis';
	if (gads[d].litlaiks == 'trd') var liturgiskaislaiks = 'gavenis'; // ??? vai nemainās psalmi
	if (gads[d].litlaiks == 'ldl' || gads[d].litlaiks == 'lokt') var liturgiskaislaiks = 'lieldienas';
	
	Banner(stunda); // liturģiskā krāsa un svētku nosaukums
	
	
if (gads[d]?.lieldienas === undefined) {
	lugsana.innerHTML = lasijums_template; // izsauc liturģijas pamatu
	
	// Svētkiem
	 var f_ll =''; var f_psn=''; var f_nd=''; var isfestum='';
	 if (gads[d]?.liturgija) {// festum-0-MarijaiFestum
		f_ll = gads[d].liturgija.split('-')[0]; // atbilst liturgiskaisLaiks
		f_psn = gads[d].liturgija.split('-')[1]; // atbilst psn
		f_nd = gads[d].liturgija.split('-')[2]; // atbilst nd
		isfestum = 'festum';
	 }
	 console.log("Hei=", isfestum);
	 var specialaLugsana = gads[d].lugsana;
	 var lasijumaNoslegLugsana = lugsana_pll_sv[psn];
	 if ( liturgiskaislaiks == 'gavenis') lasijumaNoslegLugsana = gavenis[psn0][nd].laudes.lugsimies;
	 if ( liturgiskaislaiks == 'lieldienas') lasijumaNoslegLugsana = lieldienas[psn0][nd].laudes.lugsimies;
	// mēnesis un diena, ja būs svētki
	var mm = gads[d].datums.getMonth() +1;
	var dd = gads[d].datums.getDate();
	console.log("Vai ir svētku liturģija? ", f_ll, "isfestum = ", isfestum, "mēnesis = ", mm, "datums = ", dd);
	console.log("Mobilie? ", gads[d]?.mobil, gads[d]?.mobilValue);
	if ( gads[d]?.mobil ) {mm=0; dd=gads[d]?.mobilValue}
	
	function lasijums(i, liturgiskaislaiks, psn, nd){ // garo lasījumu ielasīšana
		document.querySelector('#containerLasijums' + i ).innerHTML = '<hr>\
		<h4><span class="redbold">'+pirmaisotrais+' LASĪJUMS</span></h4>\
		<p><span class="blackbold">' + officium[liturgiskaislaiks][psn][nd][i].lasijumstitle + '</span> \
		<span class="sarkans">' + officium[liturgiskaislaiks][psn][nd][i].lasijumaRef +'</span></p>\
		<p style = "text-align: center;"><span class="italic">'+officium[liturgiskaislaiks][psn][nd][i].lasijumsNos+'</span></p>\
		<p>' + officium[liturgiskaislaiks][psn][nd][i].lasijumstext + '</p>';
		document.querySelector('#atbildeReference' +i).innerHTML = '\
		<span class="sarkans">' +officium[liturgiskaislaiks][psn][nd][i].atbildesReference + '</span>';
		document.querySelector('#responsorijs' + i).innerHTML = '<p>\
			<span class="redbold">℣. </span>' + officium[liturgiskaislaiks][psn][nd][i].vers1 + '<br>\
			<span class="redbold">℟. </span>' + officium[liturgiskaislaiks][psn][nd][i].resp + '<br>\
			<span class="redbold">℣. </span>' + officium[liturgiskaislaiks][psn][nd][i].vers2 + '<br>\
			<span class="redbold">℟. </span>' + officium[liturgiskaislaiks][psn][nd][i].resp + '</p>';
	}
	
	//console.log(officium.festum[2][2].ps1);
	//console.log(officium.psalmodijs[2][2].ps1);  	
	function Psalmi(psalmodijs, psn, nd){ // psalmodija un atbilžu ielasīšana
		console.log("Izvelas psalmodiju", "Ps ned.", psn, "Ned.d.", nd, "Nedēļa.", psn0);
		if (psn==0) psn=4; // nepieciešams gavēnim
/* 		for (i=1; i <= 3; i++) {
			var psName = 'ps'+i; 
			var antName = 'ant'+i;
			document.querySelector('#psalms'+ i ).innerHTML = window[officium.psalmodijs[psn][nd][psName]];
			sel = document.querySelectorAll('#ant' +i)
			sel[0].innerHTML = sel[1].innerHTML = officium[psalmodijs][psn][nd][antName];
			if ( liturgiskaislaiks == 'gavenis' ){
				if (nd == 5 ){
					document.querySelector('#psalms'+ i ).innerHTML = window[officium.gavenis.psalmodijs[nd][psName]];
					sel = document.querySelectorAll('#ant' +i)
					sel[0].innerHTML = sel[1].innerHTML = officium.gavenis.psalmodijs[nd][antName];
				}
			}
		} */
		for (let i = 1; i <= 3; i++) {
			const psName  = `ps${i}`;
			const antName = `ant${i}`;

			const isGavenisOverride = (liturgiskaislaiks === 'gavenis' && ( nd === 5 || nd === 6 ) );
			const isTiduumOverride = (liturgiskaislaiks === 'gavenis' && psn0 === 6 && ( nd === 5 || nd === 6 ));//trd
			const isLieldienasOverride = (liturgiskaislaiks === 'lieldienas');
			const isFestumOverride = (isfestum === 'festum');
			console.log("Triduum", psn0, isTiduumOverride, nd);
			console.log("Lieldienas", psn0, isLieldienasOverride, "PSN=", psn, "ND=", nd);			

		let effectiveNd = nd0;
		let effectivePsn = psn;
		if (isTiduumOverride) {
			if (nd0 === 5) effectiveNd = 55;
			else if (nd0 === 6) effectiveNd = 66;
			effectivePsn = 0;
		}

	console.log("Triduum", psn0, isTiduumOverride, nd0, effectiveNd, effectivePsn);

	let src;
	if (isTiduumOverride) {
		src = officium.gavenis.psalmodijs[effectiveNd][effectivePsn];
	} else if (isFestumOverride) {
		console.log("svētku psalmi");
			if (officium.festum?.[mm]?.[dd]?.ps1) { // mainīgajos mm=0 un dd ir "nosaukums"
				src = officium.festum[mm][dd];
			} else {
				src = isLieldienasOverride
					? officium.lieldienas.psalmodijs[psn0][nd0]
					: officium.psalmodijs[psn][nd0];
			}
	} else if (isLieldienasOverride) {
		console.log("lieldienu psalmi", psn0, nd0);
		src = officium.lieldienas.psalmodijs[psn0][nd0];
	} else if (isGavenisOverride) {
		console.log("gavēņa psalmi", psn0, nd0);
		src = officium.gavenis.psalmodijs[nd0][psn];
	} else {
		console.log("parastie psalmi", psn, nd0);
		src = officium.psalmodijs[psn][nd0];
	}

//if (!src) {	console.error('SRC ir undefined!', { psn, nd, mm, dd });} else {	console.log('SRC:', src);}

			// psalms: obligāti caur window[...]
			console.log(psName, liturgiskaislaiks);
			const psKey = src[psName];
			document.querySelector(`#psalms${i}`).innerHTML = window[psKey];

			// antifonas
			const antHtml = src[antName];
			const ants = document.querySelectorAll(`#ant${i}`);
			for (const el of ants) el.innerHTML = antHtml;
		}

// pēc psalmu responsorijs beigas
		document.querySelector('#responsorijsPs').innerHTML = '<p>\
			<span class="redbold">℣. </span>' + officium[psalmodijs][psn][nd]?.atb1 + '<br>\
			<span class="redbold">℟. </span>' + officium[psalmodijs][psn][nd]?.atb2 + '</p>';
		if ( liturgiskaislaiks == 'gavenis' ) {
			if ( psn0 == 6 ) { // lielā nedēļa
				nd0 = 7;
				if (nd == 5 ) nd0 = 55;
				if (nd == 6 ) nd0 = 66;
				console.log("nd0=", nd0)
			}
			if ( nd0 ===0 ){
				console.log("Svētd.atbildes", psn, psn0);
				document.querySelector('#responsorijsPs').innerHTML = '<p>\
				<span class="redbold">℣. </span>' + officium.gavenis.psalmodijs[nd0][psn0].atb1 + '<br>\
				<span class="redbold">℟. </span>' + officium.gavenis.psalmodijs[nd0][psn0].atb2 + '</p>';
			}
			else {
				document.querySelector('#responsorijsPs').innerHTML = '<p>\
				<span class="redbold">℣. </span>' + officium.gavenis.psalmodijs[nd0].atb1 + '<br>\
				<span class="redbold">℟. </span>' + officium.gavenis.psalmodijs[nd0].atb2 + '</p>';
			}
		}
		if ( liturgiskaislaiks == 'lieldienas' ) {
			document.querySelector('#responsorijsPs').innerHTML = '<p>\
			<span class="redbold">℣. </span>' + officium.lieldienas.psalmodijs[psn0][nd0].atb1 + '<br>\
			<span class="redbold">℟. </span>' + officium.lieldienas.psalmodijs[psn0][nd0].atb2 + '</p>';
		}
		if (isfestum === 'festum' && officium.festum?.[mm]?.[dd]?.ps1) {
			console.log(mm,dd);
			document.querySelector('#responsorijsPs').innerHTML = '<p>\
				<span class="redbold">℣. </span>' + officium.festum[mm][dd].atb1 + '<br>\
				<span class="redbold">℟. </span>' + officium.festum[mm][dd].atb2 + '</p>';
		}
	}
// pēc psalmu responsorijs beigas
	
//	var svetdiena = selectedSvetdiena;
	//var ll = selectedLitlaiks;
	//var himna = himnaLat;
	var izveletaisPsalms = psalms95;
/* 	if (getPsalmWeek(selectedNedela)==1) var izveletaisPsalms = psalms95;
	else if (getPsalmWeek(selectedNedela)==2) var izveletaisPsalms = psalms100;
	else if (getPsalmWeek(selectedNedela)==3) var izveletaisPsalms = psalms24;
	else if (getPsalmWeek(selectedNedela)==4) var izveletaisPsalms = psalms67; */
	var izvele = 'ar';	
	var nedela = (psn % 2 === 0) ? 2 : 1;
	var isFestum = (gads[d].liturgija) ? true : false;
	var naktsdiena = (laiks.getHours() < 6) ? 'Nakts' : 'Diena';
	console.log(liturgiskaislaiks,selectedNedela, psn,"=>",getPsalmWeek(psn),nd,nedela, "isFestum = "+isFestum, naktsdiena);

	// containerStunduTitle
	sel = document.querySelector('#title');
	sel.innerHTML = "Lasījumu stunda";
		if (gads[d].N) sel.innerHTML += "<br>" + gads[d].N;

	// containerHimna
	sel = document.querySelector('#himna');
		const festumHimna = officium?.festum?.[mm]?.[dd]?.himna;
		if (festumHimna !== undefined) { //console.log("Speciala himna", festumHimna);
			sel.innerHTML = festumHimna;
		} 
 		else if (liturgiskaislaiks == 'gavenis') {//console.log("Gavenis himna", nd, himnaOfficiumGavenisDarbadiena, himnaOfficiumGavenisSvetdiena);
			if ( psn0 == 6) { console.log("Lielās nedēļas himna")
				sel.innerHTML = himnaOfficiumLielaNedela;
				if ( nd===6 ) sel.innerHTML = himnaOfficiumKlusaSestdiena;
			}
			else {
				if ( nd == 0 ) {//console.log("Svētdienas gavēņa himna")
				sel.innerHTML = himnaOfficiumGavenisSvetdiena;
				}
				else {//console.log("Darbadienu gavēņa himna")
					sel.innerHTML = himnaOfficiumGavenisDarbadiena;
				}
			}
		}
		else if (liturgiskaislaiks == 'lieldienas') {
			
			if ( (psn0 === 6 && nd >= 4) || psn0 === 7 ) sel.innerHTML = himnaOfficiumLieldieasDebeskapsana;
			else if (psn0 === 8) sel.innerHTML = himnaOfficiumLieldieasVasarsvetki;
			else sel.innerHTML = himnaOfficiumLieldieasSvetdiena;
			console.log("Lieldienu himna", psn0, nd, sel.innerHTML);
		}
		else {
			var lasijumuHimna = "himnaOfficium"+ naktsdiena + "_" + nedela + "_" + nd;
			//console.log(lasijumuHimna);
			sel.innerHTML = window[lasijumuHimna];
		}

	// containerPsalmodijs
	//var psalmWeek = getPsalmWeek(psn);
	const festumPsalmi = officium?.festum?.[mm]?.[dd]?.ps1;
		if (festumPsalmi !== undefined) {
			Psalmi("festum", mm, dd);
		}
		else Psalmi("psalmodijs", getPsalmWeek(psn), nd);
	
	// LASĪJUMi
	console.log('liturgiskaislaiks =', liturgiskaislaiks, typeof liturgiskaislaiks);
	console.log("Speciāla lūgšana = ", gads[d].lugsana);
	for (i=1; i <= 2; i++) {
		var pirmaisotrais = (i ==1) ? 'I': 'II';
		const festumvalue = officium?.festum?.[mm]?.[dd]?.[i];
		if (festumvalue !== undefined) {
			console.log(i, mm, dd, officium.festum[mm][dd][i].lasijumstitle);
			lasijums( i, "festum", mm, dd);
		}
		else {
			console.log("lasījums", i, psn, nd);
			lasijums( i, liturgiskaislaiks, psn, nd);
		}
	}


	// noslēguma Himna svētdienās un svētkudienās
	console.log("Himna vajag? ", gads[d].Type, "svētdiena=",nd==0, "svētki=", d, gads[d].Type == 'svētki', !(nd==0 || gads[d].Type == 'svētki'));
/* 	if ( (nd != 0 && gads[d].Type != 'svētki') || liturgiskaislaiks == 'gavenis') {
		console.log("nav Sētdiena, nav svētki");
		document.querySelector("#containerTeDeumLaudamus").style.display = 'none'; 
	} else {console.log("ir Sētdiena vai svētki");} */

	const irSvetdiena = nd == 0;
	const irSvetki = ['svētki', 'svinības'].includes(gads[d].Type);
	const irGavenis = liturgiskaislaiks == 'gavenis';
	const irOktava = gads[d].litlaiks == 'lokt';
	const raditTeDeum = irOktava || irSvetki || (irSvetdiena && !irGavenis);
	if (!raditTeDeum) {
		console.log("nav svētdiena vai ir gavēnis");
		document.querySelector("#containerTeDeumLaudamus").style.display = 'none';
	} else {
		console.log("ir svētdiena vai svētki, vai oktava");
	}

	// noslēguma Lūgšana
	console.log("nosleguma lūgšana = ", psn, lasijumaNoslegLugsana);
	if (gads[d].lugsana) lasijumaNoslegLugsana = gads[d].lugsana;	
	document.querySelector("#noslegumaLugsana").innerHTML = '<p><span class="redbold">℣. </span>Lūgsimies.</p><p>'+lasijumaNoslegLugsana+'</p><p><span class="redbold">℟. </span>Āmen.</p>';
	
// Gavēnī noslēpj Alleluja
	lentNoAlleluia(d);
	
//sakartotAlleluja();
	sakartotAlleluja(d);
	easterNoAlleluia(d);

}
else {
	console.log("Lieldienu LS");
	lugsana.innerHTML = lasijums_lieldienas_template;
}	


//==bookmark===
bookMark("lasijumu stunda");
}

const stunduLugsana = function(dat, psn, svetdiena, stunduDatums) { //parametri nav vajadzīgi
	var lugsana = document.querySelector("#LugsanuTeksts");
	var noslegumaLugsana = document.querySelector("#noslegumaLugsana");
	var laudesPoga = document.querySelector("#laudespoga");
	var dienasPoga = document.querySelector("#dienaspoga");
	var vesperesPoga = document.querySelector("#vesperespoga");
	var kompletorijsPoga = document.querySelector("#kompletorijspoga");
	var lasijumsPoga = document.querySelector("#lasijumspoga");

  // Izsauc iepriekš sagatavotās lūgšanas LaudesVesperes();kopmletorijsLugsana();
  if (laiks.getHours() >= 0 && laiks.getHours() < 9) {
    laudesPoga.classList.add("aktualastunda");
    LaudesVesperes('laudes');
  }
  if (laiks.getHours() >= 9 && laiks.getHours() < 18) {
    dienasPoga.classList.add("aktualastunda");
    LaudesVesperes('dienas');
  }
  if (laiks.getHours() >= 18 && laiks.getHours() < 21) {
    vesperesPoga.classList.add("aktualastunda");
    LaudesVesperes('vesperes');
  }
  if (laiks.getHours() >= 21 && laiks.getHours() <= 23) {
    kompletorijsPoga.classList.add("aktualastunda");
    kopmletorijsLugsana();
  }
  // Stundu lūgšanas veidošana pabeigta  
}

// == SELECTORS ==
const eventSelector = function() {
  var baneris = document.querySelector("#liturgiskakrasabaneris");
  var svetki = document.querySelector("#liturgsvetki");
  var dat = document.querySelector("#datums");
  var psNed = document.querySelector("#psNedela");
  var lugsana = document.querySelector("#LugsanuTeksts");

  // selektori katrai dienai kalendārā
  document.querySelectorAll(".diena").forEach( function(day) {
    day.addEventListener("click", function(e) {
      // console.log(day.id, gads[day.id].svetki, gads[day.id].psNedela); // <== ŠEIT
      selectedNedela = gads[day.id].psNedela;
      selectedDay = gads[day.id].datums.getDay();
	  selectedDayId = day.id;
      selectedSvetdiena = gads[day.id].svetdiena;
      selectedStunduDatums = gads[day.id].datums;
//	  selectedLitlaiks = gads[day.id].litlaiks;
//	  selectedFestum = gads[day.id].psalmi;
	  selectedVesperesI = gads[day.id].vesperesI;
      baneris.className = "logobar " + gads[day.id].krasa;
      svetki.innerHTML = gads[day.id].svetki;
      dat.innerHTML = dateFormat(gads[day.id].datums);
      psNed.innerHTML = psalmuNedela(gads[day.id].psNedela);
	  // console.log(day.id, gads[day.id].psNedela, psalmuNedela(gads[day.id].psNedela));

      if (gads[day.id].datums < cal.adv0) {
        litGadaCikls(year);
      } else {
        litGadaCikls(year + 1);
      } // jāmainās līdz ar 1 adventu

	  stunduLugsana(); //bija stunduLugsana( selectedDay, selectedNedela, selectedSvetdiena, gads[day.id].datums );

      var selected = document.querySelector(".selected");
      if (selected !== null) selected.classList.remove("selected");
      document.getElementById(day.id).classList.add("selected");

    });
  });
}
//selektori mēneša izvēles bultiņām
document.querySelector("#prevButton").addEventListener("click", function(e) {
  window.date = shiftMonth(window.date, -1);
  drawCalendar(window.date, "kalendars");
  eventSelector();
});
document.querySelector("#nextButton").addEventListener("click", function(e) {
  window.date = shiftMonth(window.date, +1);
  drawCalendar(window.date, "kalendars");
  eventSelector();
});
//selektori stundu pogām
document.querySelector("#laudespoga").addEventListener("click", function(p) {
  LaudesVesperes('laudes');
});
document.querySelector("#dienaspoga").addEventListener("click", function(p) {
  LaudesVesperes('dienas');
});
document.querySelector("#vesperespoga").addEventListener("click", function(p) {
  LaudesVesperes('vesperes');
});
document.querySelector("#kompletorijspoga").addEventListener("click", function(p) {
  kopmletorijsLugsana('kompletorijs');
});
document.querySelector("#lasijumspoga").addEventListener("click", function(p) {
  lasijumastunda('lasijumastunda');
});
// == SELECTORS END==

// == ŠODIENAS LITURĢIJA =atverot lapu=


if(gads[todayIndex] <=11)  {} // kāpēc?
var dat = document.querySelector("#datums");
dat.innerHTML = dateFormat(gads[todayIndex].datums);
var psNed = document.querySelector("#psNedela");
psNed.innerHTML = psalmuNedela(gads[todayIndex].psNedela);

if (gads[todayIndex].datums < cal.adv0) {// ligurģiskā gada burta maiņa  līdz ar 1 adventu
  litGadaCikls(year);
} else {
  litGadaCikls(year + 1);
} // jāmainās līdz ar 1 adventu

selectedNedela = gads[todayIndex].psNedela; 
selectedDay = gads[todayIndex].datums.getDay();
selectedDayId = todayIndex;
selectedSvetdiena = gads[todayIndex].svetdiena;
selectedStunduDatums = gads[todayIndex].datums;
selectedLitlaiks = gads[todayIndex].litlaiks; // ?? kāpēc bijja atslēgts? vajadzīgs dienas vidum, testēt uz Sv. Stefans
selectedFestum = gads[todayIndex].psalmi;
selectedVesperesI = gads[todayIndex].vesperesI;

//Banner(stunda); // liturģiskā krāsa un svētku nosaukums tiek pmainīts pie stundu izvēles.
stunduLugsana(); //stunduLugsana(selectedDay, selectedNedela, selectedSvetdiena, selectedStunduDatums);
eventSelector();
// == ŠODIENAS BEIGAS ==