const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utilisateurs = require("./models/utilisateurs.js")
const product = require("./models/product.js");
const database = require('./models/database.js');
const md5 = require('md5');
const session = require('express-session');
const moment = require('moment');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'patate',                   
    resave: false,                     
    saveUninitialized: true,           
    cookie: { secure: false }
    
}));

app.use(function (req, res, next) {
    if (req.session.username) {
        res.locals.identifiant = req.session.username;
    }
    if (req.session.mdp) {
        res.locals.mdp = req.session.mdp;
    }
    if (req.session.nom) {
        res.locals.nom = req.session.nom;
    }
    if (req.session.prenom) {
        res.locals.prenom = req.session.prenom;
    }
    if (req.session.ddn) {
        res.locals.ddn = req.session.ddn;
    }
    if (req.session.email) {
        res.locals.email = req.session.email;
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
        res.render('accueil', { user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    };
});

app.get('/catalogue', async function(req, res) { 
    try {
        let liste_product = await product.getAllProduct();
        res.render('./catalogue', { liste_product });
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

app.get('/panier', async function (req, res) {
    try {
        const liste_loc = await product.liste_location();
        console.log(liste_loc);
        const liste_produit = [];

        for (const location of liste_loc) {
            if (location.date) {
                location.date = moment(location.date).format('YYYY-MM-DD');
            }

            try {
                const produit = await product.getProductbyid(location.produit_id);
                liste_produit.push(produit);
            } catch (error) {
                console.error(`Erreur lors de la récupération du produit pour la location id : ${location.id}`, error);
            }
        }

        res.render('panier', { liste_loc, liste_produit });
    } catch (error) {
        console.error("Erreur lors de la récupération du panier : ", error);
        res.status(500).send("Erreur serveur.");
    }
});

app.get('/info_profil', function (req, res) {
    res.render("./info_profil");
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/info_profil'); 
        }
    res.clearCookie('connect.sid'); 
    res.redirect('/accueil');
    });
});
app.post('/info_profil', async (req, res) =>{
    const login = req.body.login;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const ddn = req.body.ddn;
    const email = req.body.email;
    try {
        let user = await utilisateurs.modifierUser(nom, prenom, ddn, email, login);
        req.session.nom = nom;
        req.session.prenom = prenom;
        req.session.ddn = ddn;
        req.session.email = email;
        return res.redirect('/info_profil');
    }
    
    catch (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la modification des données');
    };
});

app.get('/ajouter', function (req, res) {
    res.render("./ajouter");
 });


app.get('/product/:id', async (req, res) => {
    let productId = parseInt(req.params.id); 
    console.log(productId);
    let produit = await product.getProductbyid(productId);
    console.log(produit);

    res.render('./product', { produit });
    
});

app.post('/product', async (req, res) => {
    const { productId, startDate, endDate } = req.body;
    const user_id = req.session.userId;

    console.log(user_id);
    console.log(productId, startDate, endDate);
    if (!productId || !startDate || !endDate) {
        return res.status(400).send("Veuillez compléter tout les champs");
    }
    try {
        let location = await product.addLocation(productId, startDate, endDate, user_id);
        return res.redirect('panier');
    } catch (error) {
        console.log('Erreur lors de l\'ajout de la location:', error);  
        return res.status(500).send("Une erreur est survenue lors de l'ajout de la location.");
    }
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
                    req.session.mdp = mdp;
                    req.session.nom = user[0].nom;
                    req.session.prenom = user[0].prenom;
                    req.session.ddn = user[0].ddn;
                    req.session.email = user[0].email;
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

        let age = moment().diff(moment(date));
        if (age >= 18){
            let user = await utilisateurs.insertuser(prenom, nom, idenfifiant, mdp, date, mail);
            return res.redirect('/connexion');
            
        }
        else{
            res.status(500).send("Vous n'avez pas 18 ans");
        }
        
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

app.post('/ajouter', async (req, res) => {
    const type = req.body.type;
    const description = req.body.description;
    const marque = req.body.marque;
    const modele = req.body.modele;
    const prix_location = req.body.prix_location;

    try{
        let produit = await product.addProduct(type, description, marque, modele, prix_location);
        return res.redirect('/catalogue');
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