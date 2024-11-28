const database = require("./database.js");


async function getUserById (id) {
    sql ="SELECT * FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        database.query(sql, id,  (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

async function getUserBylogin (login) {
    info ="SELECT * FROM utilisateur WHERE login = ?";
    return new Promise((resolve, reject) => {
        database.query(info, login,  (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};

async function insertuser (prenom, nom, idenfifiant, mdp, date, mail) {
    ajout ="INSERT INTO utilisateur ( login, password, nom, prenom, ddn, email, type_utilisateur) VALUES (?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        database.query(ajout, [idenfifiant, mdp, nom, prenom, date, mail, 'client'], (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};



async function insertagent (prenom, nom, idenfifiant, mdp, date, mail){
    ajout ="INSERT INTO utilisateur ( login, password, nom, prenom, ddn, email, type_utilisateur) VALUES (?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        database.query(ajout, [idenfifiant, mdp, nom, prenom, date, mail, 'agent'], (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};


async function modifierUser (nom, prenom, ddn, email, login ){
    modifier ="UPDATE utilisateur  SET nom = ?, prenom = ?, ddn = ?, email = ?  WHERE login = ? ";
    return new Promise((resolve, reject) => {
        database.query(modifier, [nom, prenom, ddn, email, login], (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};

async function modifierMdp (password, login){
    modifier ="UPDATE utilisateur SET password = ?  WHERE login = ? ";
    return new Promise((resolve, reject) => {
        database.query(modifier, password, login, (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};

async function updatePassword(userId, newPassword) {
    const query = 'UPDATE utilisateurs SET password = ? WHERE id = ?';
    return db.query(query, [newPassword, userId]);
}






module.exports = {getUserById, getUserBylogin, insertuser, insertagent, modifierUser, modifierMdp };


