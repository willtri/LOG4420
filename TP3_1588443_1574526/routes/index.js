var express = require('express');
var router = express.Router();

var donnees = require('../models/donnees.js');


/* GET home page */
router.get('/', function (req, res, next) {
    res.render('accueil');
});

/* GET Creation du joueur */
router.get('/creationJoueur', function (req, res, next) {
    res.render('creationJoueur');
});

/* GET Aide */
router.get('/aide', function (req, res, next) {
    res.render('aide', {disciplines: disciplines, equipement: equipement});
});

/* GET Page HTML */
router.get('/jeu/:pageId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId + "/1"
    res.render(pageJeu, function (err, html) {
        res.render('page/pageJeu', {
            numeroPage: req.params.pageId,
            htmlPage: html,
            disciplines: disciplines,
            equipement: equipement,
            joueur: req.session.joueur
        });
    });
});

/* GET Page HTML specifique a la section */
router.get('/jeu/:pageId/:sectionId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId + "/" + req.params.sectionId
    res.render(pageJeu, function (err, html) {
        res.render('page/pageJeu', {
            numeroPage: req.params.pageId,
            htmlPage: html,
            disciplines: disciplines,
            equipement: equipement,
            joueur: req.session.joueur
        });
    });
});

/* GET Page JSON */
router.get('/page/:pageId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId
    var dictEntry = "p" + req.params.pageId;
    var htmlSections = [];
    for (i = 0; i < infoPages[dictEntry].nbSections; i++) {
    	var pageJeu = "page/" + req.params.pageId + "/" + (i + 1)
    	res.render(pageJeu, function(err, html) {
    		htmlSections[i] = html;
    	});
    }
      	
    var returnJSON = {
    	pageId: req.params.pageId, 
    	nbSections: infoPages[dictEntry].nbSections,
    	sectionHtml: htmlSections,    	
    	infosJoueur: req.session.joueur, 
    	numerosPagesAccessibles: infoPages[dictEntry].pagesAccess
    };
    res.json(returnJSON);
});

/* GET Page JSON specifique a la section */
router.get('/page/:pageId/:sectionId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId + "/" + req.params.sectionId
    var dictEntry = "p" + req.params.pageId;
    res.render(pageJeu, function (err, html) {
        var returnJSON = {
        	pageId: req.params.pageId, 
        	sectionId: req.params.sectionId, 
        	sectionHtml: html, 
        	infosJoueur: req.session.joueur, 
        	numerosPagesAccessibles: infoPages[dictEntry][1]};
        res.json(returnJSON);
    });
});

/* POST Informations du joueur lors de sa creation */
router.post('/creationJoueur', function (req, res) {
    var messageErreurDiscipline = req.body.disciplines == undefined || req.body.disciplines.length != 5 ? "Veuillez choisir 5 disciplines" : undefined;
    var messageErreurEquipement = req.body.equipement == undefined || req.body.equipement.length != 2 ? "Veuillez choisir 2 items" : undefined;

    if (messageErreurDiscipline != null || messageErreurEquipement != null) {
        res.render('creationJoueur', {
            disciplines: disciplines,
            equipement: equipement,
            messageErreurDiscipline: messageErreurDiscipline,
            messageErreurEquipement: messageErreurEquipement
        });

    }

    req.session.joueur = req.body;
    req.session.joueur.objetSpecial = undefined;
    req.session.joueur.enduranceTotal = 20 + Math.floor((Math.random() * 9) + 1);
    req.session.joueur.enduranceRestant = req.session.joueur.enduranceTotal;
    req.session.joueur.enduranceDeBase = req.session.joueur.enduranceTotal;
    req.session.joueur.habileteDeBase = 10 + Math.floor((Math.random() * 9) + 1);
    req.session.joueur.habilete = req.session.joueur.habileteDeBase;
    req.session.joueur.pieceDOr = 10 + Math.floor((Math.random() * 9) + 1);
    req.session.joueur.maitriseDArme = maitriseDArme.AUCUN;
    
    // Chiffre al�atoire pour choisir une ma�trise d'une arme
    for (i = 0; i < req.session.joueur.disciplines.length; i++) {
        if (req.session.joueur.disciplines[i] == disciplines.MAITRISE_DES_ARMES) {
            var calcul_maitrise = Math.floor((Math.random() * 9) );
            console.log(calcul_maitrise);
            switch (calcul_maitrise) {
                case 0:
                    req.session.joueur.maitriseDArme = maitriseDArme.POIGNARD;
                    break;
                case 1:
                    req.session.joueur.maitriseDArme = maitriseDArme.LANCE;
                    break;
                case 2:
                    req.session.joueur.maitriseDArme = maitriseDArme.MASSE_D_ARMES;
                    break;
                case 3:
                    req.session.joueur.maitriseDArme = maitriseDArme.SABRE;
                    break;
                case 4:
                    req.session.joueur.maitriseDArme = maitriseDArme.MARTEAU_DE_GUERRE;
                    break;
                case 5:
                    req.session.joueur.maitriseDArme = maitriseDArme.EPEE;
                    break;
                case 6:
                    req.session.joueur.maitriseDArme = maitriseDArme.HACHE;
                    break;
                case 7:
                    req.session.joueur.maitriseDArme = maitriseDArme.BATON;
                    break;
                case 8:
                    req.session.joueur.maitriseDArme = maitriseDArme.GLAIVE;
                    break;
            }
        }
    }
    
    // Calcul des bonus
    for (i = 0; i < req.body.equipement.length; i++) {
        switch (req.body.equipement[i]) {
            case equipement.BATON:
                if (req.session.joueur.maitriseDArme == maitriseDArme.BATON){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.EPEE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.EPEE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.GILET_DE_CUIR_MATELASSE:
                req.session.joueur.enduranceTotal = req.session.joueur.enduranceTotal + 2;
                req.session.joueur.enduranceRestant = req.session.joueur.enduranceTotal;
                break;
            case equipement.GLAIVE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.GLAIVE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.HACHE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.HACHE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.LANCE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.LANCE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.MARTEAU_DE_GUERRE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.MARTEAU_DE_GUERRE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.MASSE_D_ARMES:
                if (req.session.joueur.maitriseDArme == maitriseDArme.MASSE_D_ARMES){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
            case equipement.SABRE:
                if (req.session.joueur.maitriseDArme == maitriseDArme.SABRE){
                    req.session.joueur.habilete = req.session.joueur.habilete + 2;
                }
                break;
        }
    }
    
    res.redirect('/jeu/1');
});

/* GET Page JSON apres un choix aleatoire */
router.get('/choixAleatoire/:pageId', function (req, res) {
    var dictEntry = "p" + req.params.pageId;
    if (infoPages[dictEntry].fct != null) {
    
		switch(infoPages[dictEntry].fct) {
			case "rand10": // Entre 0 et 9
				var rand = Math.floor((Math.random() * 9));
				break;
		}
		
		intervals = infoPages[dictEntry].pageIntervals;
		for(i = 0; i < intervals.length; ++i) {
			if(rand >= intervals[i][0] && rand <= intervals[i][1])
				var pageToGo = infoPages[dictEntry].pagesAccess[i];
		}
		
		res.json({randNumber:rand, pageToGo:pageToGo});
    }
    else
    	res.end();
});

/* GET Page JSON contenant les informations d'un combat */
router.get('/combat/:habJoueur/:habEnnemi', function (req, res) {
    var combatRatio = req.params.habJoueur - req.params.habEnnemi;
    var rand = Math.floor((Math.random() * 9));
    var index = Math.abs(combatRatio) > 11 ? 11: Math.abs(combatRatio);
    
    if(combatRatio > 0) {    	
    	var ennemiDmg = combatRatioPos[rand][index][0];
	   	var joueurdDmg = combatRatioPos[rand][index][1];
    }
    else {
    	var ennemiDmg = combatRatioNeg[rand][index][0];
	   	var joueurdDmg = combatRatioNeg[rand][index][1];
    }    
		
	res.json({combatRatio:combatRatio, randNumber:rand, DommageSubiEnnemi:ennemiDmg, DommageSubiJoueur:joueurdDmg});    
});

/* GET Page JSON avec les informations du joueur */
router.get('/joueur', function (req, res) {
    res.json(req.session.joueur);
});


module.exports = router;


/* Fonction permettant d'initialiser l'objet page */
function page(id, nbSections, pagesAccessibles) {
    this.id = id;
    this.nbSections = nbSections;
    this.pagesAccess = pagesAccessibles;
}

/* Fonction permettant d'initialiser l'objet page dans lequel il y a un choix aleatoire */
function page(id, nbSections, pagesAccessibles, fct, intervals) {
    this.id = id;
    this.nbSections = nbSections;
    this.pagesAccess = pagesAccessibles;
    this.fct = fct;
    this.pageIntervals = intervals;
}

/* Collection de pages et ses informations. Structure definie par les fonctions page(..) */
var infoPages = {
	"p1":   new page(1, 1, [160, 273]),
	"p12":  new page(12, 3, [180, 259]), 
	"p57":  new page(57, 2, [331]),   
	"p62":  new page(62, 1, [288]),   
	"p70":  new page(70, 1, [209, 339]),
	"p78":  new page(78, 2, [245]), // Combat
	"p85":  new page(85, 1, [300]),
	"p91":  new page(91, 1, [134]),  
	"p129": new page(129, 2, [155]), 
	"p134": new page(134, 1, [57, 188, 331], "rand10", [[0,3], [4,6], [7,9]]),  // hasard
	"p155": new page(155, 3, [248, 191]),  // hasard avec endurance
	"p160": new page(160, 1, [204, 318, 78]),
	"p167": new page(167, 1, [85, 300], "rand10", [[0,6], [7,9]]),  // hasard
	"p172": new page(172, 1, [134]), 
	"p180": new page(180, 2, [70, 129]), // Combat
	"p188": new page(188, 1, [331]),    
	"p204": new page(204, 1, [134]), 
	"p209": new page(209, 3, [155]), 
	"p245": new page(245, 1, [91, 172]),   
	"p248": new page(248, 1, []),   // Mort
	"p288": new page(288, 1, [167]),   
	"p300": new page(300, 1, [12, 238]),
	"p318": new page(318, 1, [134]),  
	"p331": new page(331, 3, [62, 288], "rand10", [[0,4], [5,9]]), // hasard
	"p339": new page(339, 1, []), // Mort
}

/* Usage combatRatioPos/Neg[randomNumber][abs(combatRatio)][0 = ennemi, 1 = joueur]
 * Gracieusete de Bernard Pallotta sur le forum du cours
 */
var combatRatioNeg = 
[
[[12,0],[11,0],[11,0],[10,0],[10,0],[9,0],[9,0],[8,0],[8,0],[7,0],[7,0],[6,0]],
[[3,5],[2,5],[2,5],[1,6],[1,6],[0,6],[0,6],[0,8],[0,8],[0,999],[0,999],[0,999]],
[[4,4],[3,5],[3,5],[2,5],[2,5],[1,6],[1,6],[0,7],[0,7],[0,8],[0,8], [0,999]],
[[5,4],[4,4],[4,4],[3,5],[3,5],[2,5],[2,5],[1,6],[1,6],[0,7],[0,7],[0,8]],
[[6,3],[5,4],[5,4],[4,4],[4,4],[3,5],[3,5],[2,6],[2,6],[1,7],[1,7],[0,8]],
[[7,2],[6,3],[6,3],[5,4],[5,4],[4,4],[4,4],[3,5],[3,5],[2,6],[2,6],[1,7]],
[[8,2],[7,2],[7,2],[6,3],[6,3],[5,4],[5,4],[4,5],[4,5],[3,6],[3,6],[2,6]],
[[9,1],[8,2],[8,2],[7,2],[7,2],[6,3],[6,3],[5,4],[5,4],[4,5],[4,5],[3,5]],
[[10,0],[9,1],[9,1],[8,1],[8,1],[7,2],[7,2],[6,3],[6,3],[5,4],[5,4],[4,4]],
[[11,0],[10,0],[10,0],[9,0],[9,0],[8,0],[8,0],[7,2],[7,2],[6,3],[6,3],[5,3]]
];

var combatRatioPos = 
[
[[12,0],[14,0],[14,0],[16,0],[16,0],[18,0],[18,0],[999,0],[999,0],[999,0],[999,0],[999,0]],
[[3,5], [4,5], [4,5], [5,4] ,[5,4] ,[6,4] ,[6,4] ,[7,4] ,[7,4] ,[8,3] ,[8,3] ,[9,3] ],
[[4,4], [5,4], [5,4], [6,3] ,[6,3] ,[7,3] ,[7,3] ,[8,3] ,[8,3] ,[9,3] ,[9,3] ,[10,2]],
[[5,4], [6,3], [6,3], [7,3] ,[7,3] ,[8,3] ,[8,3] ,[9,2] ,[9,2] ,[10,2] ,[10,2] ,[11,2]],
[[6,3], [7,3], [7,3], [8,2] ,[8,2] ,[9,2] ,[9,2] ,[10,2],[10,2],[11,2] ,[11,2] ,[12,2]],
[[7,2], [8,2], [8,2], [9,2] ,[9,2] ,[10,2],[10,2],[11,2],[11,2],[12,2] ,[12,2] ,[14,1]],
[[8,2], [9,2], [9,2], [10,2],[10,2],[11,1],[11,1],[12,1],[12,1],[14,1] ,[14,1] ,[16,1]],
[[9,1], [10,1],[10,1],[11,1],[11,1],[12,0],[12,0],[12,0],[12,0],[16,0] ,[16,0] ,[18,0]],
[[10,0],[11,0],[11,0],[12,0],[12,0],[14,0],[14,0],[14,0],[14,0],[18,0] ,[18,0] ,[999,0]],
[[11,0],[12,0],[12,0],[14,0],[14,0],[16,0],[16,0],[16,0],[16,0],[999,0],[999,0],[999,0]]
];


