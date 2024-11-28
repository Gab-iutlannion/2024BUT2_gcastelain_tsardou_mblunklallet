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

async function addLocation(productId, date_debut, date_fin, user_id) {
    const update = "UPDATE produit SET etat = 1 WHERE etat = 0 AND id = ?";
    const insert = "INSERT INTO location (date_debut, date_retour_prevue, utilisateur_id, produit_id) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
        database.beginTransaction((err) => {
            if (err) return reject(err);

            database.query(update, [productId], (updateErr, updateResults) => {  
                if (updateErr) {
                    return database.rollback(() => reject(updateErr));
                }

                if (updateResults.affectedRows === 0) {
                    return database.rollback(() => reject(new Error("Produit indisponible ou déjà réservé")));
                }

                database.query(insert, [date_debut, date_fin, user_id, productId], (insertErr, insertResults) => {
                    if (insertErr) {
                        return database.rollback(() => reject(insertErr));
                    }

                    database.commit((commitErr) => {
                        if (commitErr) {
                            return database.rollback(() => reject(commitErr));
                        }

                        resolve(insertResults); 
                    });
                });
            });
        });
    });
}

async function liste_location () {
    
    liste = " SELECT * FROM location ";
    
    return new Promise((resolve, reject) => {
        database.query(liste,  (err, results) => {
            if (err) {
                return reject(err);
            }
            
            resolve(results);
        });
    });
};


module.exports = {getAllProduct, getProductbyid, addProduct, addLocation, liste_location};