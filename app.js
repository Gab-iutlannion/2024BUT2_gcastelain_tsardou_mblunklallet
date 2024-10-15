const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utilisateurs = require("./models/utilisateurs.js")
const database = require('./models/database.js');
const md5 = require('md5');
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', async function(req, res) { 
    try {
        let user = await utilisateurs.getUserById(1);
        res.render('index', { user });
    } catch (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la récuperation des données');
    };
});

app.get('/nav', function (req, res) {
    res.render("./nav");
});

app.get('/acceuil', function (req, res) {
    res.render("./acceuil");
});

app.get('/connexion', function (req, res) {
    res.render("./connexion");
});



app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'patate',                   // Clé secrète utilisée pour signer le cookie de session
    resave: false,                     // Ne pas enregistrer la session si elle n'a pas été modifiée
    saveUninitialized: true,           // Sauvegarder une session non initialisée
    cookie: { secure: false }          // Assurez-vous que "secure" est à true en production (HTTPS)
}));

app.post('/connexion', (req, res) => {
    const identifiant = req.body.identifiant;  
    const mdp = req.body.mdp;

    if (identifiant && mdp){
        const user = "SELECT login, password FROM utilisateur WHERE login = ?";
        const role = "SELECT type_utilisateur FROM utilisateur WHERE login = ? ";

        
            database.query(user, [identifiant], (err, userResult) =>{
            if (err){
                res.send('L identifiant n est pas bon');
                console.error('L idenfifiant n est pas bon', err);
            }
            if (userResult.length > 0){

                if(userResult[0].password === md5(mdp)){
                    console.log(userResult);
    
                    database.query(role, identifiant, (err, roleResult) =>{
                        console.log(roleResult);
                        if (err){
                            res.send('Aucun rôle ne vous est attribué.');
                            console.error('Erreur lors de la requête SQL pour le rôle:', err);
                        }
                        if (roleResult.length > 0){
                            req.session.login = true;
                            req.session.username = identifiant;
                            req.session.role = roleResult[0].type_utilisateur;
        
                                console.log('l utilisateur est connécté en tant que ' + roleResult[0].type_utilisateur );
                        }
                        else{
                            res.send('Aucun rôle n est attribué.');
                        }   
                       
                    });
                }
                else{
                    res.send('Mot de passe incorrect.');
                }
            }  
            
            else{
                res.send('Identifiant ou mot de passe éroné');
                console.error('l identifiant ou le mot de passe n est pas bon', err);
            }
            
        
    });
        
    }
    else{
        res.send('Veuillez remplir tout les champs');
        console.error('Tout les champs n ont pas été remplis', err);
    }
   
});





app.use((req, res) => {
    res.status(404).render("404");
})

app.listen(3000 , () => {
   console.log('Server running on port 3000');
})