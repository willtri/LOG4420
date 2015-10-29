var express = require('express');
var router = express.Router();

var donnees = require('../models/donnees.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('accueil');
});

router.get('/creationJoueur', function (req, res, next) {
    res.render('creationJoueur');
});

router.get('/aide', function (req, res, next) {
    res.render('aide', {disciplines: disciplines, equipement: equipement});
});

router.get('/jeu/:pageId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId
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

router.get('/page/:pageId', function (req, res, next) {
    var pageJeu = "page/" + req.params.pageId
    res.render(pageJeu, function (err, html) {
        var returnJSON = {pageId: req.params.pageId, sectionHtml: html, infosJoueur: req.session.joueur, numerosPagesAccessibles: undefined};
        res.json(returnJSON);
    });

});

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
    // chiffre aléatoire pour choisir une maîtrise d’une arme
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
    // calcul des bonus
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
    //console.log(req.session.joueur);
    res.redirect('/jeu/1');
});

router.get('/joueur', function (req, res) {
    res.json(req.session.joueur);
});

module.exports = router;
