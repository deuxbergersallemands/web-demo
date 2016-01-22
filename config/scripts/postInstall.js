conn = new Mongo();
db = conn.getDB('deuxbergersallemands_web-dev');
db = db.getSiblingDB('deuxbergersallemands_web-dev');


db.createCollection("Utilisateur",
   {
      validator: { $or:
         [
            { phone: { $type: "string" } },
            { mail: { $regex: /@mongodb\.com$/ } },
            //{ status: { $in: [ "Unknown", "Incomplete" ] } }
         ]
      }
   }

);
//db.accounts.createIndex( { "mel": 1 }, { unique: true }    );
db.Utilisateur.insert(
   {
      "nom":"saber",
      "mel":"frejsaber@yahoo.fr",
      "MotDePasse":"MotDePasseDeSaber",
      "solde":0,
      "amis":[
         {"nom":"tristan","mel":"tristan@gmail.com"},
         {"nom":"netty", "mel" :"netty@gmail.com"}
      ]
   }
   );
db.Utilisateur.insert(
   {
      "nom":"tristan",
      "mel":"tristan@gmail.com",
      "MotDePasse":"MotDePasseDeTristan",
      "solde":0,
      "amis":[
         {"nom":"saber","mel":"frejsaber@yahoo.fr"},
         {"nom":"netty", "mel" :"netty@gmail.com"}
         ]
   }
   );
db.Utilisateur.insert(
   {
      "nom":"netty",
      "mel":"netty@gmail.com",
      "MotDePasse":"MotDePasseNetty",
      "solde":0,
      "amis":[
         {"nom":"tristan","mel":"tristan@gmail.com"},
         {"nom":"saber", "mel" :"frejsaber@yahoo.fr"}
         ]
      }
   );
db.Utilisateur.insert(
   {
      "nom":"seif",
      "mel":"seifeddinefraj@live.fr",
      "MotDePasse":"MotDePasseSeif",
      "solde":0,
      "amis":[
         {"nom":"tristan","mel":"tristan@gmail.com"},
         {"nom":"saber", "mel" :"frejsaber@yahoo.fr"},
         {"nom":"netty", "mel" :"netty@gmail.com"}
         ]
      }
   );


db.createCollection( "Groupe");
//db.accounts.createIndex( { "nom": 1 }, { unique: true }    );
db.Groupe.insert(
   {
      "NomGroupe":"ski",
      "createur":{"nom":"saber","mel":"frejsaber@yahoo.fr"}, 
      "description":"voyage scolaire au Mont-blanc",
      "membres":[
         {"nom":"tristan","mel":"tristan@gmail.com"},
         {"nom":"saber", "mel" :"frejsaber@yahoo.fr"},
         {"nom":"netty", "mel" :"netty@gmail.com"},
         {"nom":"seif","mel":"seifeddinefraj@live.fr"}
      ]
   }
   );



db.createCollection("Historique");
var dateHistorique = new Date();
db.Historique.insert({"date":dateHistorique,"texte":"Saber à ajouter netty à l'evenement ski"}
   );
db.Historique.insert({"date":dateHistorique,"texte":"Saber à ajouter tristan à l'evenement ski"}
   );
db.Historique.insert({"date":dateHistorique,"texte":"Saber à ajouter seif à l'evenement ski"}
   );

db.createCollection("Transaction");
var dateCreationTransaction = new Date();
db.Transaction.insert({
   "createur":{"nom":"saber","mel":"frejsaber@yahoo.fr"},
   "Groupe":{"NomGroupe":"ski"},
   "description":"Assiettes Savoyardes",
   "type":"Equitable",
   "MontantTotal":42.60,
   "DateCreation":dateCreationTransaction,
   "participants":[
      {"participant":{"nom":"tristan","mel":"tristan@gmail.com"},"montantDu":14.6,"montantRegle":0, "statut": "Ouverte"},
      {"participant":{"nom":"netty","mel":"netty@gmail.com"},"montantDu":14.6,"montantRegle":0, "statut": "Ouverte"},
      {"participant":{"nom":"seif","mel":"seifeddinefraj@live.fr"},"montantDu":14.6,"montantRegle":0, "statut": "Ouverte"}
   ],
   "DateDeFermeture":null,
   "preteur":{"nom":"netty","mel":"netty@gmail.com"}
}
);

var dateCreationTransaction = new Date();
var dateArrangement = new Date();
db.Transaction.insert({
   "createur":{"nom":"tristan","mel":"tristan@gmail.com"},
   "Groupe":{"NomGroupe":"ski"},
   "description":"Fondue savoyarde",
   "type":"Equitable",
   "MontantTotal":100,
   "DateCreation":dateCreationTransaction,
   "participants":[
      {
         "participant":{"nom":"tristan","mel":"tristan@gmail.com"},
         "montantDu":25,
         "montantRegle":25,
         "statut": "Ouverte"
      },
      {
         "participant":{"nom":"netty","mel":"netty@gmail.com"},
         "montantDu":0,
         "montantRegle":0,
         "statut": "Ouverte"
      },
      {
         "participant":{"nom":"seif","mel":"seifeddinefraj@live.fr"},
         "montantDu":25,
         "montantRegle":0,
         "statut": "Ouverte"
      },
      {
         "participant":{"nom":"saber","mel":"frejsaber@yahoo.fr"},
         "montantDu":25,
         "montantRegle":0,
         "statut": "Ouverte"
      }
   ],
   "statut":"Equitable",
   "DateDeFermeture":dateArrangement,
   "preteur":{"nom":"netty","mel":"netty@gmail.com"}
   
}
);




