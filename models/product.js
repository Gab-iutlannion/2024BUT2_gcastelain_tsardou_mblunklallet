const database = require("./database.js");


async function getAllProduct () {
    sql ="SELECT * FROM produit";
    return new Promise((resolve, reject) => {
        database.query(sql,  (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


async function getProductbyid (id) {
    sql ="SELECT * FROM produit WHERE id = ? ";
    return new Promise((resolve, reject) => {
        database.query(sql, id,  (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

async function addProduct (type, description, marque, modele, prix_location) {
    ajout ="INSERT INTO produit ( type, description, marque, modele, prix_location, etat) VALUES (?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        database.query(ajout, [type, description, marque, modele, prix_location, '0'], (err, results) => {
            if (err) {
                return reject(err);
            }
            console.log(results);
            resolve(results);
          
        });
    });
};

async function location (id) {
    sql ="UPDATE produit SET etat = 1 WHERE etat = 0 AND id = 4";
    return new Promise((resolve, reject) => {
        database.query(sql, id,  (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {getAllProduct, getProductbyid, addProduct};