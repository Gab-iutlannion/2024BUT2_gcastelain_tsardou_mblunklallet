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

module.exports = {getAllProduct};