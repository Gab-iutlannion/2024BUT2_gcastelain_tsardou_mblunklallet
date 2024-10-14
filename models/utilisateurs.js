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


async function Connexion (login, password) {
    user ="SELECT login, password FROM utilisateur WHERE login LIKE ? ";
    return new Promise((resolve, reject) => {
        database.query(sql, login, password,  (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


module.exports = {getUserById};
module.exports = {Connexion};

