const express = require('express');
const app = express();
const utilisateurs = require("./models/utilisateurs.js")

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




app.use((req, res) => {
    res.status(404).render("404");
})

app.listen(3000 , () => {
   console.log('Server running on port 3000');
})