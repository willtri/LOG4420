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
    req.session.joueur.habileteDeBase = 10 + Math.floor((Math.random() * 9) + 1);
    req.session.joueur.habilete = req.session.joueur.habileteDeBase
    req.session.joueur.pieceDOr = 10 + Math.floor((Math.random() * 9) + 1);
    console.log(req.session.joueur);
    res.redirect('/jeu/1');
});

router.get('/joueur', function (req, res) {
    res.json(req.session.joueur);
});

module.exports = router;
