var today = new Date();
var yyyy = today.getFullYear();
today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
var date = new Date(today.getFullYear(), today.getMonth());
var year = yyyy;
var litGads = '';

const nedDiena = ["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena"];
const weekDayName = ["P", "O", "T", "C", "P", "S", "Sv"];
const litDiena = ["Ziemassvētku laika ", "Parastā laika ", "Gavēņa ", "Lieldienu laika ", "Adventa ", "Lielās nedēļas ", "Tridiuum ", "Ziemassvētku oktāvas ", "Lieldienu oktāvas "];
var menesis = ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris"];
var Menesis = ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"];
const svetdienuCikls = ["A", "B", "C"];


const isEmpty = function(x) { // window[liturgiskaisLaiks][psn][nd].laudes.ievdant
	try {
		  x();
		} catch (error) {
		  // console.error(error);
		  return true;
		  // expected output: ReferenceError: nonExistentFunction is not defined
		  // Note - error messages will vary depending on browser
		}
	return false; 
}

const dateFormat = function(date) {
  var d = date;
  var dateFormated = d.getFullYear() + '. gada ' + d.getDate() + '. ' + menesis[d.getMonth()];
  return dateFormated;
}

const litGadaCikls = function(year) {
	litGads = svetdienuCikls[(year - 1) % 3];
  document.querySelector("#litGads").innerHTML = litGads;
}

const psalmuNedela = function(n) { //  n = (n - 1) % 4; n = (n == 0) ? 4 : n;
		n = n % 4;
		if(n == 0) n = 4;
return n;
}

const getDaysInMonth = function(date) {
  return new Date(date.getYear(), date.getMonth() + 1, 0).getDate();
}

const dayOfYear = function(d) {
  var yn = d.getFullYear();
  var mn = d.getMonth();
  var dn = d.getDate();
  var d1 = new Date(yn, 0, 1, 12, 0, 0); // noon on Jan. 1
  var d2 = new Date(yn, mn, dn, 12, 0, 0); // noon on input date
  var ddiff = Math.round((d2 - d1) / 864e5);
  return ddiff + 1;
}

const isWeekend = function(day) { // 6 = sestdiena, 0 = svētdiena
  return day.getDay() == 6 || day.getDay() == 0;
}

const shiftMonth = function(date, n) {
  shift = new Date(date);
  shift.setMonth(shift.getMonth() + n);
  return shift;
}
const shiftDate = function(date, days) {
  shift = new Date(date);
  shift.setDate(shift.getDate() + days);
  return shift;
}

const leapYear = function(year) {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

// == PARASTĀ LITURĢISKĀ LAIKA SVĒTDIENU SKAITS ==
const maxSv = function(d0, d1, d2, d3) {
  difDays1 = parseInt((d1 - d0) / (1000 * 60 * 60 * 24), 10);
  difDays2 = parseInt((d3 - d2) / (1000 * 60 * 60 * 24), 10);
  return Math.ceil(difDays1 / 7) + Math.ceil(difDays2 / 7);
}
// ================================

const baptismDate = function(date) {
  var weekday = date.getDay()
  w = weekday < 7 ? 7 - weekday : weekday;
  baptism = shiftDate(date, w);
  return baptism;
}

const getAdvent = function(year) {
  var date = new Date(year, 11, 25);
  var sundays = 0;
  while (sundays < 4) {
    date.setDate(date.getDate() - 1);
    if (date.getDay() === 0) sundays++;
  }
  return date;
}

const MarijaJazeps = function(Pers) {
  if (Pers == "M") svetki = new Date(year, 12 - 1, 8); // M=Marija 8.dec.,
  if (Pers == "J") svetki = new Date(year, 3 - 1, 19); // J=Jāzeps 19.mar.,
  if (Pers == "I") svetki = new Date(year, 3 - 1, 25); // I=Jēzus ienemšana 25.mar.,
  // ja iekrīt svētdienā, tad pārceļ +1 diena
  // J=Jāzeps 19.mar.,  (ja iekrīt lielajā nedēļā un palmu svētdienā, tad - sestdiena, ja gavēņa svētdienā tad +Pirmdiena)
  // I=Jezus25.mar. (var iekrist lielajā nedēļā vai oktāvā /piem. 2016. vai 2018.g./ pārceļ uz pimdienu pēc oktāvas)
  if (svetki >= cal.lielnedela && svetki <= cal.lieloktava1 && Pers == "I"){
			svetki = shiftDate(cal.lieloktava1, +1);
	}   else if (svetki >= cal.lielnedela && svetki < cal.lieldienas && Pers == "J" ) {
			svetki = shiftDate(cal.lielnedela, -1);
	}   else  if (svetki.getDay() == 0) {
			svetki = shiftDate(svetki, +1); 
	}
  return svetki;
}

const Metropolija = function (){
	var jekaba = new Date(year, 6, 25);
	var nedelasDiena = jekaba.getDay();
	if (nedelasDiena == 0 ) {
		svetki = jekaba;
		}
	else if (nedelasDiena <=3) {
		var substract = nedelasDiena;
		svetki = shiftDate(jekaba, -substract);
		}
	else	if (nedelasDiena >=4) {
		var add = 7 - nedelasDiena;
		svetki = shiftDate(jekaba, +add);
		}
	return svetki;
}

const GimenesDiena =function (){
	// If Christmas falls on a Sunday, then Holy Family is celebrated on Dec. 30. Otherwise, Holy Family is the Sunday after Christmas. piem., 2023
	var ziemassvetki = new Date( year, 11, 25 );
	var nedelasDiena = ziemassvetki.getDay();
	if (nedelasDiena == 0){
	 svetki = new Date( year, 11, 30 );
  } else {
	 svetki = new Date( year, 11, 25 + 7 - nedelasDiena );
  }
	return svetki;
}


const solemnities = function(year) {
  cal = {};

  // == LIELDIENU DATUMS ==
  a = year - 19 * parseInt(year / 19);
  b = parseInt(year / 100);
  c = year - 100 * parseInt(year / 100);
  d = parseInt(b / 4);
  e = b - 4 * parseInt(b / 4);
  f = parseInt((b + 8) / 25);
  g = parseInt((b - f + 1) / 3);
  ha = 19 * a + b - d - g + 15;
  h = ha - 30 * parseInt(ha / 30);
  i = parseInt(c / 4);
  k = c - 4 * parseInt(c / 4);
  la = 32 + 2 * (e + i) - h - k;
  l = la - 7 * parseInt(la / 7);
  m = parseInt((a + 11 * h + 22 * l) / 451);
  ma = h + l - 7 * m + 114;
  month = parseInt(ma / 31);
  day = ma - 31 * parseInt(ma / 31) + 1;
  if(month<10) month = '0'+month;
  if(day<10) day = '0'+day;
  dateTime = year + "-" + month + "-" + day + ' 00:00:00';

  // == SVARIGI DATUMI - MAINIGI SVETKI ==
  
  // gavēnis no Feb 4/Mar 17 līdz Mar 22/Apr 25
  // lieldienas no Mar 22/Apr 25 līdz May 10/Jun 13
  
  cal.lieldienas = new Date(year, month-1, day);
  cal.epifany = new Date(year, 0, 6);
  cal.baptism = baptismDate(cal.epifany);
  cal.pelnutrsd = shiftDate(cal.lieldienas, -46); 
  cal.pelnuned = shiftDate(cal.pelnutrsd, +3);
  cal.lielnedela = shiftDate(cal.lieldienas, -7);
  cal.lielpirmd = shiftDate(cal.lieldienas, -6);
  cal.lielotrd = shiftDate(cal.lieldienas, -5);
  cal.lieltresd = shiftDate(cal.lieldienas, -4);
  cal.lielceturtd = shiftDate(cal.lieldienas, -3);
  cal.lielpiektd = shiftDate(cal.lieldienas, -2);
  cal.lielsestd = shiftDate(cal.lieldienas, -1);
  cal.lieloktava0 = shiftDate(cal.lieldienas, +1);
  cal.lieloktava1 = shiftDate(cal.lieldienas, +7);
  cal.debeskapsana = shiftDate(cal.lieldienas, +39);
  cal.vasarsvetki = shiftDate(cal.lieldienas, +49);
  cal.trisvieniba = shiftDate(cal.lieldienas, +56);
  cal.miesaasins = shiftDate(cal.lieldienas, +60);
  cal.jezussirds = shiftDate(cal.lieldienas, +68);
  cal.marijasirds = shiftDate(cal.miesaasins, +9);
  cal.marijabaznica = shiftDate(cal.vasarsvetki, +1);
  cal.gimene = GimenesDiena();
  cal.kristuspriesteris = shiftDate(cal.vasarsvetki, +4);
 // cal.metro = Metropolija();

  // == LITURGISKA LAIKA ROBEZAS ==
  cal.adv0 = getAdvent(year);
  cal.karalis = shiftDate(cal.adv0, -7); // Kristus karaļa svētki, pēdējā PLL svētdiena
  cal.adv1 = new Date(year, 12 - 1, 24);
  cal.zsl0 = new Date(year, 1 - 1, 1);
  cal.zsl1 = cal.baptism;; //shiftDate(cal.baptism, -1);// cal.baptism;
  cal.zsl2 = new Date(year, 12 - 1, 25);
  cal.zsl3 = new Date(year, 12 - 1, 31);
  cal.pll0 = shiftDate(cal.baptism, +1); // PARASTAIS LITURĢISKAIS LAIKS 1 cal.baptism; // 
  cal.pll1 = shiftDate(cal.pelnutrsd, -1);
  cal.pll2 = cal.vasarsvetki;
  cal.pll3 = shiftDate(cal.adv0, -1);
  cal.gav0 = cal.pelnutrsd; // GAVĒŅA LAIKS
  cal.gav1 = cal.lieltresd;
  cal.trd0 = cal.lielceturtd;
  cal.trd1 = cal.lielsestd;
  cal.ldl0 = cal.lieldienas; // LIELDIENU LAIKS
  cal.ldl1 = shiftDate(cal.vasarsvetki, -1);

  return cal;
}

// FUNKCIJA == LITURĢISKĀ GADA IZVEIDOŠANA == SĀKUMS
const rubricella = function() {
  solemnities(year);
  var gadaGarums = leapYear(year) ? 366 : 365; 
  
  gads = {};
  
  gadaSakums = new Date(year, 1 - 1, 1); // janvāris mēnesis ir 0 ?

  // == SVĒTDIENU SKAITĪTĀJS ==
  parSv = 2; // nezinu, kur tiek samazināt par 1 pll jāsākas ar 1. ps nedēļu
  maxParSvStop = 0;
  gavSv = 0;
  ldlSv = 1;
  advSv = 0;
  zslSv = 1;

  for (d = 1; d <= gadaGarums+1; d++) {// fiktīva diena gada galā, lai 31.dec. nebūtu kļūda.
    gads[d] = {
      diena: d,
      datums: shiftDate(gadaSakums, (d - 1))
    };
    gads[d].weekday = nedDiena[gads[d].datums.getDay()];
    sunday = "";
	
    // ZIEMASSVĒTKU LAIKS
    if (gads[d].datums <= cal.zsl1) {
		gads[d].litlaiks = "zsl";
		gads[d].krasa = "white";
		gads[d].prior = 11;
		if (zslSv != 2) zslSv = 1;
		if (gads[d].datums.getDay() == 0) {
			sunday = "2. ";
			gads[d].prior = 8;
			zslSv = 2;
			gads[d].vesperesI = true;
		} else {
		sunday = "";
		}
		gads[d].svetki = litDiena[0] + sunday + gads[d].weekday;
		gads[d].psNedela = zslSv;
		if (gads[d].datums.valueOf() == cal.zsl1.valueOf() && gads[d].datums.valueOf() != new Date( year, 0, 7).valueOf() ) {console.log("bapt2");
			//Ja Kristīšanas svētki iekrīt 7. janvārī, tad psalmodijs ir no II nedēļas, citādi no III
			gads[d].psNedela = zslSv +1;
		}
    }
    // PARASTAIS LAIKS		
    if (gads[d].datums > cal.zsl1 && gads[d].datums < cal.gav0) {
      gads[d].litlaiks = "pll";
      gads[d].krasa = "green";
      gads[d].prior = 11;
      if (gads[d].datums.getDay() == 0) {
		gads[d].svetdiena = parSv;
        sunday = parSv + ". "; parSv++;
        gads[d].prior = 8;
		gads[d].vesperesI = true;
      } else {
        sunday = "";
      }
      gads[d].svetki = litDiena[1] + sunday + gads[d].weekday;
      gads[d].psNedela = parSv-1;
    }
    // GAVĒŅA LAIKS	
    if (gads[d].datums >= cal.gav0 && gads[d].datums < cal.trd0) {
      gads[d].litlaiks = "gav";
      gads[d].krasa = "violet";
      gads[d].prior = 9; // 11;
      if (gads[d].datums.getDay() == 0) {
		gavSv++; 
        sunday = gavSv + ". ";
		gads[d].vesperesI = true;
        if (gavSv == 4) gads[d].krasa = "pink";
        gads[d].prior = 4;
      } else {
        sunday = "";
      }
      gads[d].svetki = litDiena[2] + sunday + gads[d].weekday;
      gads[d].psNedela = gavSv;//gavēnī ir 6 psNedēļas psalmuNedela(gavSv)
    }
    // LIELĀ NEDĒĻA & TRIDIUUM LAIKS		
    if (gads[d].datums >= cal.lielceturtd && gads[d].datums < cal.ldl0) { cal.lielceturtd // cal.lielnedela
      gads[d].litlaiks = "trd";
      gads[d].krasa = "violet";
      gads[d].prior = 4;
      gads[d].svetki = litDiena[5] + gads[d].weekday;
      // psalmuNedela kā gavēļa laika noslēgums
    }
    // LIELDIENU LAIKS		
    if (gads[d].datums >= cal.ldl0 && gads[d].datums <= cal.pll2) {
      gads[d].litlaiks = "ldl"; 
      gads[d].krasa = "white";
      gads[d].prior = 11;
      if (gads[d].datums.getDay() == 0) {
        sunday = ldlSv + ". ";
        ldlSv++;
        gads[d].prior = 4;
		gads[d].vesperesI = true;
      } else {
        sunday = "";
      }
      if ( sunday == "" ) gads[d].svetki = litDiena[3] + sunday + gads[d].weekday;
	  else if (sunday == 2) gads[d].svetki = "Lieldienu " + sunday + gads[d].weekday + "<br>Kunga Žēlsirdības svētdiena";
	  else if (sunday == 4) gads[d].svetki = "Lieldienu " + sunday + gads[d].weekday + "<br>Labā Gana svētdiena";
	  else gads[d].svetki = "Lieldienu " + sunday + gads[d].weekday;
      gads[d].psNedela = ldlSv - 1;
    }
	// LIEDIENU OKTĀVA
	if(gads[d].datums >= cal.lieloktava0 && gads[d].datums < cal.lieloktava1){
		gads[d].litlaiks = "lokt";
		gads[d].krasa = "white";
        gads[d].prior = 4;
 //		if (sunday == 2) gads[d].svetki = litDiena[8] + " II " + gads[d].weekday + "<br>Kunga Žēlsirdības svētdiena";
		gads[d].svetki = litDiena[8] + sunday+ gads[d].weekday;  //
		gads[d].psNedela = 1;
	}
	// PARASTAIS LAIKS		
    if (gads[d].datums > cal.pll2 && gads[d].datums < cal.adv0) {
      gads[d].litlaiks = "pll";
      gads[d].krasa = "green";
      gads[d].prior = 11;
      if (maxSv(cal.pll0, cal.pll1, cal.pll2, cal.pll3) == 33 && maxParSvStop == 0) {
        parSv++;
        maxParSvStop++;
      }
      if (gads[d].datums.getDay() == 6) {
        gads[d].svetdiena = parSv-1;
      }
      if (gads[d].datums.getDay() == 0) {
		parSv++;
		gads[d].svetdiena = parSv;
        sunday = parSv + ". ";
        gads[d].prior = 8;
		gads[d].vesperesI = true;
      } else {
        sunday = "";
      }
      gads[d].svetki = litDiena[1] + sunday + gads[d].weekday;
      gads[d].psNedela = parSv;
    }
    // ADVENTA LAIKS		
    if (gads[d].datums >= cal.adv0 && gads[d].datums <= cal.adv1) {
      gads[d].litlaiks = "adv";
      gads[d].krasa = "violet";
      gads[d].prior = 11;
      if (gads[d].datums.getDay() == 0) {
		advSv++;
        sunday = advSv + ". ";
        if (advSv == 3) gads[d].krasa = "pink";
        gads[d].prior = 4;
		gads[d].vesperesI = true;
      } else {
        sunday = "";
      }
      gads[d].svetki = litDiena[4] + sunday + gads[d].weekday;
      gads[d].psNedela = advSv;
    }
    // ZIEMASSVĒTKU LAIKS		
    if (gads[d].datums > cal.adv1) {
      gads[d].litlaiks = "zokt";
      gads[d].krasa = "white";
      gads[d].prior = 11;
      if (zslSv == 2) zslSv = 4;
      if (gads[d].datums.getDay() == 0) {
        sunday = "1. ";
        gads[d].prior = 8;
        zslSv = 1;
		gads[d].vesperesI = true;
      } else {
        sunday = "";
      }
	// pirmās vesperes tikai ja ģimenes diena iekrīt svētdienā.
	if ( gads[d].datums.valueOf() == new Date( year+1, 0, 1 ).valueOf() && zslSv == 1) {
			gads[d].psNedela = 0; gads[d].svetki = ""; gads[d].prior = 11; gads[d].vesperesI = false;
		} else {
			gads[d].svetki = litDiena[7] + sunday + gads[d].weekday;
			gads[d].psNedela = zslSv;
			}

    }

    // MAINĪGĀS DIENAS NO const SOLEMNITIES	
    if (gads[d].datums.valueOf() == cal.gimene.valueOf()) {
      sunday = "Sv. ĢIMENE – Jēzus, Marija, Jāzeps, svētki";
      gads[d].krasa = "white";
      gads[d].prior = 6;
      gads[d].svetki = sunday;
	  if ( gads[d].datums.getDay() == 5 ) gads[d].vesperesI = false; else gads[d].vesperesI = true;
	  gads[d].liturgija = "festum-0-SvGimene";
	  gads[d].N = "Sv. Ģimene";
    } 
    if (gads[d].datums.valueOf() == cal.epifany.valueOf()) {
		sunday = "KUNGA EPIFĀNIJA, obligātas svinības";
		gads[d].krasa = "white";
		gads[d].prior = 6;
		gads[d].svetki = sunday; // + gads[d].weekday;
		gads[d].vesperesI = true;
		gads[d].liturgija ="festum-1-6";
		gads[d].N = "EPIFĀNIJA";
    }
    if (gads[d].datums.valueOf() == cal.baptism.valueOf()) {
		sunday = "KUNGA KRISTĪŠANA, svētki";
		gads[d].krasa = "white";
		gads[d].prior = 7;
		gads[d].svetki = sunday;
		gads[d].vesperesI = true;
		gads[d].liturgija ="festum-0-Baptism";
		gads[d].N = "KUNGA KRISTĪŠANA";
		gads[d].lugsana = "Visvarenais, mūžīgais Dievs, Tu Jēzu pēc kristības Jordānas upē un Svētā Gara nonākšanas pār Viņu svinīgi pasludināji par savu mīļoto Dēlu, – dari, lai mēs, Tavi pieņemtie bērni, kas atdzimuši no ūdens un Svētā Gara, vienmēr būtu Tev patīkami. "+ noslegums1;
    }
    if (gads[d].datums.valueOf() == cal.pelnutrsd.valueOf()) {
      sunday = "PELNU TREŠDIENA";
      gads[d].krasa = "violet";
      gads[d].prior = 3;
      gads[d].svetki = sunday;
    }
    if (gads[d].datums.valueOf() == cal.lielnedela.valueOf()) {
      sunday = "PALMU JEB KUNGA CIEŠANU SVĒTDIENA";
      gads[d].krasa = "red";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
    }
    if (gads[d].datums.valueOf() == cal.lielceturtd.valueOf()) {
      sunday = "Lielās nedēļas ceturtdiena";
      gads[d].krasa = "white";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
      gads[d].psNedela = 6; // ir speciāla liturģija
    }
    if (gads[d].datums.valueOf() == cal.lielpiektd.valueOf()) {
      sunday = "Trīs svētās dienas<br>KUNGA CIEŠANU PIEKTDIENA";
      gads[d].krasa = "red";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
      gads[d].psNedela = 6; // ir speciāla liturģija Tridium
    }
    if (gads[d].datums.valueOf() == cal.lielsestd.valueOf()) {
      sunday = "Trīs svētās dienas<br>SVĒTĀ SESTDIENA";
      gads[d].krasa = "violet";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
      gads[d].psNedela = 6; // ir speciāla liturģija Tridium
    }
    if (gads[d].datums.valueOf() == cal.lieldienas.valueOf()) {
      sunday = "KUNGA AUGŠĀMCELŠANĀS<br>LIELDIENU SVĒTDIENA,<br>obligātās svinības";
      gads[d].krasa = "white";
      gads[d].prior = 1;
      gads[d].svetki = sunday;
	  gads[d].lieldienas = true;
    }
    if (gads[d].datums.valueOf() == cal.debeskapsana.valueOf()) {
      sunday = "KUNGA DEBESKĀPŠANA, obligātās svinības";
      gads[d].krasa = "white";
      gads[d].prior = 2;
	  gads[d].Type = "svētki";
      gads[d].svetki = sunday;
	  gads[d].vesperesI = true;
	  gads[d].liturgija = "lieldienas-6-4";
    }
    if (gads[d].datums.valueOf() == cal.vasarsvetki.valueOf()) {
      sunday = "SVĒTĀ GARA NOSŪTĪŠANA (VASARSVĒTKI), <br>obligātās svinības";
      gads[d].krasa = "red";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
    }
	if (gads[d].datums.valueOf() == cal.kristuspriesteris.valueOf()) {
		sunday = "MŪSU KUNGS JĒZUS KRISTUS, AUGSTAIS UN MŪŽĪGAIS PRIESTERIS, svētki";
		gads[d].mobil = true;
		gads[d].mobilValue = "SacerdotisAEeterna";
		gads[d].krasa = "white";
		gads[d].prior = 5;
		gads[d].Type = "svētki";
		gads[d].svetki = sunday;
		gads[d].vesperesI = false;
		gads[d].liturgija = "festum-0-SacerdotisAEeterna";
		gads[d].lugsana = "Dievs, Tu savas varenības godam un cilvēces pestīšanai savu viendzimušo Dēlu esi iecēlis par augsto un mūžīgo priesteri. Liec, lai Svētais Gars palīdz tiem, ko Viņš ir izvēlējies par kalpiem un savu noslēpumu dalītājiem, uzticīgi pildīt saņemto kalpojumu. " + noslegums1
    }
    if (gads[d].datums.valueOf() == cal.trisvieniba.valueOf()) {
		sunday = "VISSVĒTĀ TRĪSVIENĪBA, obligātās svinības";
		gads[d].mobil = true;
		gads[d].mobilValue = "Trinitas";
		gads[d].krasa = "white";
		gads[d].prior = 5;
		gads[d].Type = "svētki";
		gads[d].svetki = sunday;
		gads[d].vesperesI = true;
		gads[d].liturgija = "festum-0-Trinitas";
		gads[d].lugsana = "Dievs Tēvs, Tu sūtot pasaulē savu patiesības Vārdu un Svētdarītāju Garu, esi atklājis cilvēkiem Tavas dabas brīnumaino noslēpumu, dari, lai mēs, praktizējot patieso ticību, atzītu mūžīgās Trīsvienības godību un pielūgtu Vienību tās majestātiskajā varenībā.  " + noslegums1
    }
    if (gads[d].datums.valueOf() == cal.karalis.valueOf()) {
      sunday = "MŪSU KUNGS JĒZUS KRISTUS, VISPASAULES KARALIS, svinības";
      gads[d].krasa = "white";
      gads[d].prior = 5;
      gads[d].svetki = sunday;
	  gads[d].vesperesI = true;
	  gads[d].lugsana = "Visvarenais mūžīgais Dievs, Tu vēlies atjaunot visu savā mīļotajā Dēlā, visas pasaules Valdniekā, esi žēlīgs un dod savu svētību, lai visa Tava radība, atbrīvota no ļaunā varas, kalpotu vienīgi Tev un slavētu Tevi mūžam. " + noslegums1;
	  gads[d].liturgija = "festum-0-Rex";
    }
    if (gads[d].datums.valueOf() == cal.miesaasins.valueOf()) {
		sunday = "KRISTUS VISSVĒTĀ MIESA UN ASINIS, obligātās svinības";
		gads[d].mobil = true;
		gads[d].mobilValue = "CorpusChristi";
		gads[d].krasa = "white";
		gads[d].prior = 5;
		gads[d].Type = "svētki";
		gads[d].svetki = sunday;
		gads[d].vesperesI = true;
		gads[d].liturgija = "festum-0-CorpusChristi";
		gads[d].lugsana = "Dievs, Tu brīnišķajā Sakramentā esi mums atstājis savu ciešanu piemiņu, – Tevi lūdzam, dari, ka mēs Tavas Miesas un Asiņu svēto noslēpumu tā godinām, lai varētu pastāvīgi saņemt Tavas pestīšanas augļus. " + noslegums3
    }
    if (gads[d].datums.valueOf() == cal.jezussirds.valueOf()) {
		sunday = "VISSVĒTĀ JĒZUS SIRDS, svinības";
		gads[d].mobil = true;
		gads[d].mobilValue = "JezusSirds";
		gads[d].krasa = "white";
		gads[d].prior = 5;
		gads[d].Type = "svētki";
		gads[d].svetki = sunday;
		gads[d].vesperesI = true;
		gads[d].liturgija = "festum-0-JezusSirds";
		gads[d].lugsana = "Visvarenais Dievs, dari, lai mēs, kas, godinot Tava mīļotā Dēla Sirdi, pieminam Viņa mīlestības brīnumdarbus mūsu labā, no šī debesu dāvanu avota saņemtu žēlastību pārpilnībā. " + noslegums1
    }
    if (gads[d].datums.valueOf() == cal.marijasirds.valueOf()) {
      sunday = "Vissv. Jaunavas Marijas Bezvainīgā Sirds,<br>piemiņas diena";
		gads[d].mobil = true;
		gads[d].mobilValue = "MarijasSirds";
		gads[d].krasa = "white";
		gads[d].prior = 10;
		gads[d].svetki = sunday;
		gads[d].vesperesI = false;
		gads[d].N = "Marijas Bezvainīgā Sirds";
		gads[d].benedictus = "Mana sirds un mana miesa līksmi sauc uz dzīvo Dievu.";
		gads[d].lugsana = "Dievs, Tu Vissvētākās Jaunavas Marijas Sirdi esi sagatavojis Svētajam Garam par cienīgu mājokli, viņas aizlūgumu dēļ palīdzi arī mums kļūt par Tavas godības svētnīcu. " + noslegums1;
		gads[d].liturgija = "festum-0-MarijaiMem";  // "festum-0-MarijaSirds";
    }
    if (gads[d].datums.valueOf() == cal.marijabaznica.valueOf()) {
      sunday = "VISSV. JAUNAVA MARIJA,<br>BAZNĪCAS MĀTE, svētki";
	  gads[d].mobil = true;
	  gads[d].mobilValue = "MarijaBaznica";
      gads[d].krasa = "white";
      gads[d].prior = 9;
	  gads[d].Type = "svētki";
      gads[d].svetki = sunday;
	  gads[d].vesperesI = false;
	  gads[d].N = "VISSV. Marija Baznīcas māte",
	  gads[d].himnalaudes = himnaMarijaLaudes;
	  gads[d].himnavesperes = himnaMarijaVesperes;
	  gads[d].benedictus = "Mācekļi vienprātīgi pavadīja laiku lūgšanā kopā ar Mariju, Jēzus Māti.",
	  gads[d].magnificat = "Kungs sacīja savai Mātei: “Sieviet, lūk, tavs dēls!” Bet māceklim: “Lūk, tava Māte!”",
	  gads[d].lugsana = "Visvarenais Dievs, visu mūsu Tēvs, mēs, Tavi bērni, šodien priecājamies, godinot Vissvētāko Jaunavu Mariju, Baznīcas Māti, un pazemībā saucam uz Tevi: vadi mūsu soļus miera un vienprātības ceļā, lai Tava Baznīca visā pasaulē, Svētā Gara vadīta un bezvainīgās Jaunavas sargāta, nonāktu mūžīgajā svētlaimē Tavā valstībā Debesīs. " + noslegums1;
	  gads[d].liturgija = "festum-0-MarijaiFestum";//"festum-0-EcclesiaeMatris";
    }
    if (gads[d].datums.valueOf() == MarijaJazeps("M").valueOf()) { // 8.decembris
		if (gads[d].datums.valueOf() == new Date(year, 12 - 1, 8).valueOf() ){
			sunday = "VISSV. JAUNAVAS MARIJAS BEZVAINĪGĀ IEŅEMŠANA, obligātās svinības"; // 8.decembris
			} else {
			sunday = "VISSV. JAUNAVAS MARIJAS BEZVAINĪGĀ IEŅEMŠANA, svinības"; // 9.decembris
			}
	gads[d].krasa = "white";
	gads[d].prior = 6;
	gads[d].Type = "svētki";
	gads[d].svetki = sunday;
	gads[d].vesperesI = true;
	gads[d].liturgija ="festum-12-8";
	gads[d].lugsana = "Kungs Dievs, Tu ar Vissvētākās Jaunavas Marijas bezvainīgo ieņemšanu savam Dēlam sagatavoji cienīgu mājokli, un Jēzus Kristus nopelnu dēļ pasargāji šo Jaunavu no ikviena grēka, esi mums žēlīgs un palīdzi mums, viņas aizbildnībā dzīvojot, ar tīrām sirdīm nonākt pie Tevis. "+ noslegums1;
	gads[d].N = "V.J.Marijas ieņemšana";
    }
    if (gads[d].datums.valueOf() == MarijaJazeps("I").valueOf()) { // 25.marts
      sunday = "KUNGA PASLUDINĀŠANA, svinības"; // 25.marts
      gads[d].krasa = "white";
      gads[d].prior = 6;
	  gads[d].Type = "svētki";
      gads[d].svetki = sunday;
	  gads[d].vesperesI = true;
	  gads[d].liturgija = "festum-3-25";
	  gads[d].lugsana = "Dievs, Tu vēlējies, lai Tavs Vārds pieņemtu cilvēcisko dabu Jaunavas Marijas klēpī, Tevi lūdzam, dari, lai mēs, kas atzīstam savu Pestītāju par Dievu un cilvēku, kļūtu līdzdalīgi Viņa dievišķajā dabā. "+ noslegums2;
    }
    if (gads[d].datums.valueOf() == MarijaJazeps("J").valueOf()) { //19.marts
			if (gads[d].datums.valueOf() == new Date(year, 3 - 1, 19).valueOf() ){
			sunday = "SV. JĀZEPS, VISSV. JAUNAVAS MARIJAS LĪGAVAINIS, obligātās svinības"; // 19.marts, ja pārceļ nav obligātas
			} else {
			sunday = "SV. JĀZEPS, VISSV. JAUNAVAS MARIJAS LĪGAVAINIS, svinības"; // 19.marts, ja pārceļ nav obligātas
			}
      gads[d].krasa = "white";
      gads[d].prior = 6;
	  gads[d].Type = "svētki";
      gads[d].svetki = sunday;
	  gads[d].vesperesI = true;
	  gads[d].liturgija = "festum-3-19";
	  gads[d].lugsana = "Visvarenais Dievs, Tu svētā Jāzepa gādībai biji uzticējis mūsu Pestītāju un viņa Māti Jaunavu Mariju, uzklausi mūs, lai Tava Baznīca, viņam aizbilstot, sekmīgi turpinātu cilvēces atpestīšanas darbu. "+ noslegums1;
    }
/* 	if (gads[d].datums.valueOf() == cal.metro.valueOf()) { // katrai diecēzei savi svētki
		gads[d].krasa = "white";
		gads[d].prior = 5;
		gads[d].svetki = "RĪGAS METROPOLIJAS DIEVNAMU IESVĒTĪŠANAS GADADIENA,<br>obligātās svinības";
		gads[d].vesperesI = true;
		gads[d].liturgija = "festum-0-Metropole";
	} */
	if( (d== 366 || d == 367 ) && d != 1 && gads[d].datums.valueOf() == new Date(year+1, 0, 1).valueOf() ){
		gads[d] = gads[1];
	}
	
    // IELĀDĒJAM PĀRĒJĀS PIEMIŅAS DIENAS ATBILSTOŠI PRIORITĀTEI
    leap = (gads[d].datums.getMonth() > 2 && !leapYear(year)) ? 0 : 1;
    for (var i = 0; i < pd.dienas.length; i++) {
      var p = new Date(year, pd.dienas[i]['M']-1, pd.dienas[i]['D']);
	  
 	  if (cal.jezussirds.valueOf() == p.valueOf() ) {// Ja Jēzus sirds svētki iekrīt 24.jūnijā
		  pd.dienas[i].D = "23"; // Jāņa Kristītāja svētkus pārceļ uz 23.jūniju
	  } 
	  
      if (gads[d].datums.valueOf() == p.valueOf()) {
        if (pd.dienas[i]['Priority'] < gads[d].prior) {
			gads[d].prior = parseInt(pd.dienas[i]['Priority']);
			gads[d].svetki = pd.dienas[i]['Name'];
			gads[d].Type = pd.dienas[i].Type;
			gads[d].vesperesI = pd.dienas[i].vesperesI;
			gads[d].liturgija = pd.dienas[i].liturgija;
			gads[d].N = pd.dienas[i].N; // nominatīvs
			gads[d].G = pd.dienas[i].G; // ģenetīvs
			gads[d].Dat = pd.dienas[i].Dat; // datīvs
			gads[d].lugsana = pd.dienas[i].lugsana;
			gads[d].lugsana_I = pd.dienas[i].lugsana_I;
			if (pd.dienas[i]['Colour'] == "B") gads[d].krasa = "white";
			if (pd.dienas[i]['Colour'] == "S") gads[d].krasa = "red";
			if (pd.dienas[i]['Colour'] == "M") gads[d].krasa = "black";
			if (pd.dienas[i].magnificat) gads[d].magnificat =  pd.dienas[i].magnificat;
			if (pd.dienas[i].benedictus) gads[d].benedictus =  pd.dienas[i].benedictus;
			if (pd.dienas[i].ievdant) gads[d].ievdant =  pd.dienas[i].ievdant;
			if (pd.dienas[i].himnaLaudes)     gads[d].himnaLaudes    =  pd.dienas[i].himnaLaudes;
			if (pd.dienas[i].himnaVesperes) gads[d].himnaVesperes =  pd.dienas[i].himnaVesperes;
        }
        if (gads[d].prior >= 11) {
          gads[d].svetki += "<br><span class='italicblack'>" + pd.dienas[i]['Name'] + "</span>";
        }
      }
    }	
	
  } // FUNKCIJA == LITURĢISKĀ GADA IZVEIDOŠANA == BEIGAS
}
rubricella(); // == izveido LITURĢISKO GADU ==