const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utilisateurs = require("./models/utilisateurs.js")
const product = require("./models/product.js");
const database = require('./models/database.js');
const md5 = require('md5');
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'patate',                   // Clé secrète utilisée pour signer le cookie de session
    resave: false,                     // Ne pas enregistrer la session si elle n'a pas été modifiée
    saveUninitialized: true,           // Sauvegarder une session non initialisée
    cookie: { secure: false }
    // Assurez-vous que "secure" est à true en production (HTTPS)
}));

app.use(function (req, res, next) {
    if (req.session.username) {
        res.locals.identifiant = req.session.username;
    }
    if (req.session.role) {
        res.locals.role = req.session.role;
    }
    if (req.session.login) {
        res.locals.login = req.session.login;
    }
    else {
        res.locals.login = false;
    }
    if (req.session.userId) {
        res.locals.id = req.session.userId;
    }
    next();
});


app.get('/', async function (req, res) {
    try {
        let user = await utilisateurs.getUserById(req.session.id);
        res.render('info_profil', { user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    };
});

app.get('/', async function(req, res) { 
    try {
        let product = await product.getAllProduct();
        res.render('catalogue', { product });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    };
});

app.get('/nav', function (req, res) {
    res.render("./nav");
});

app.get('/accueil', function (req, res) {
    res.render("./accueil");
});

app.get('/connexion', function (req, res) {
    res.render("./connexion");
});

app.get('/test', function (req, res) {
    res.render("./test");
});

app.get('/product', function (req, res) {
    res.render("./product");
});

app.get('/footer', function (req, res) {
    res.render("./footer");
});

app.get('/inscription', function (req, res) {
    res.render("./inscription");
});

app.get('/inscription_admin', function (req, res) {
    res.render("./inscription_admin");
});

app.get('/catalogue', function (req, res) {
    res.render('catalogue', { liste_product });
});

app.get('/panier', function (req, res) {
    res.render("./panier");
});



app.get('/info_profil', function (req, res) {
    res.render("./info_profil");
});



app.post('/connexion', async (req, res) => {
    const identifiant = req.body.identifiant;
    const mdp = req.body.mdp;
    if (identifiant && mdp) {
        try {
            let user = await utilisateurs.getUserBylogin(identifiant);
            if (user.length > 0) {

                if (user[0].password === md5(mdp)) {

                    req.session.login = true;
                    req.session.username = identifiant;
                    req.session.role = user[0].type_utilisateur;
                    req.session.userId = user[0].id;
                    console.log("l id est " + req.session.userId);
                    console.log('l utilisateur est connécté en tant que ' + req.session.role);
                    return res.redirect('/accueil');

                }
                else {
                    res.send('Mot de passe incorrect.');
                }
            }
            else {
                res.send('Identifiant incorrect')
            }


        } catch (err) {
            console.log(err);
            res.status(500).send('Erreur lors de la récuperation des données');
        };
    }
    else {
        res.send('Veuillez remplir tout les champs');
        console.error('Tout les champs n ont pas été remplis', err);
    }

});



app.post('/inscription', async (req, res) => {
    const prenom = req.body.prenom;
    const nom = req.body.nom;
    const idenfifiant = req.body.identifiant;
    const mdp = md5(req.body.mdp);
    const date = req.body.date;
    const mail = req.body.mail;

    try{
        let user = await utilisateurs.insertuser(prenom, nom, idenfifiant, mdp, date, mail);
        return res.redirect('/connexion');
    }
    catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    }
    
});

app.post('/inscription_admin', async (req, res) => {
    const prenom = req.body.prenom;
    const nom = req.body.nom;
    const idenfifiant = req.body.identifiant;
    const mdp = md5(req.body.mdp);
    const date = req.body.date;
    const mail = req.body.mail;

    try{
        let user = await utilisateurs.insertagent(prenom, nom, idenfifiant, mdp, date, mail);
        return res.redirect('/inscription_admin');
    }
    catch (err){
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    }

});



app.use((req, res) => {
    res.status(404).render("404");
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})