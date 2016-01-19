var connect = require("connect");
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;


var db = new Db('deuxbergersallemands_web-dev', new Server('localhost', 27017));
var express=require("express");
/****************************************************/
var bodyParser = require('body-parser')
var md5 = require("md5")
var cookieParser = require('cookie-parser')


var url = "mongodb://localhost:27017/deuxbergersallemands_web-dev"
var app = express()

app.use(bodyParser.json()) // Nécessaire pour parser le body des requêtes PUT (Q5)
app.use(cookieParser())

var getETag = function(body) {
    return md5(body)
}

app.set("etag", getETag)

MongoClient.connect(url, function(err, db) {

    db.collection("Utilisateur", function(err, Utilisateur) {
           app.use(express.static(__dirname+'/client'));
  
           app.post('/', function(req, res) {
                var melReq=req.body.mel;
                var MotDePasseReq=req.body.motDePasse;
                var u=Utilisateur.findOne({"mel":melReq}, function(err, u) {
                    if (err) return next(err)
                    if (u == null)
                        console.log("utilisateur non trouvable");
                    else {
                        console.log(u);
                        if((u.mel==melReq)&&(u.MotDePasse==MotDePasseReq)){
                            console.log(u.mel,melReq,u.MotDePasse,MotDePasseReq);
                            result=true;
                            res.send(u.solde);
                        }
                        else{
                            res.status(500).send({ error: "Les cordonées que vous avez fournisses ne sont pas valides." });
                        }

                    }

                });
            });

            app.post('/inscription', function(req, res) {
                console.log(req.body);
                var melReq=req.body.mel;
                var NouveauUtilisateur= Utilisateur.findOne({"mel":melReq}, function(err, u) {
                  if (err) return err;
                  if (u==null){
                    UtilisateurAAjouter=req.body;
                    Utilisateur.insert(UtilisateurAAjouter);
                    res.send();
                  }
                  else{
                    console.log("utilisateur existe déja :",u);
                    res.status(500).send({ error: "utilisateur existe déja" });
                  }
                });

            });

            app.get('/amis', function(req, res) {
             
                Utilisateur.find({}).toArray(function(err, amis) {
                    if (err) return next(err);
                  
                    res.send(amis);
                });
            });


            app.get('/relations', function(req, res){

                Utilisateur.find({'mel' : req.cookies.utilisateur}, {_id:0, amis:1}).toArray(function(err, amis) {
                    if (err) return next(err);
                  
                    res.send(amis);
                });

            });
             
 
            app.get('/solde', function(req, res) {
              var u=Utilisateur.findOne({'mel':req.cookies.utilisateur}, function(err, solde) {
                if (err) return err;
                if (solde == null) {

                }
                else {
                    var leSolde = "{\"solde\":" + solde.solde + "}";
                    res.send(leSolde);
                }
              });
            });
        });


        /**************** Collection Transaction******************/
        db.collection("Transaction", function(err, Transaction) {
            app.get('/transaction/:id',function(req,res){
                var test = new require('mongodb').ObjectID(req.params.id)
                 Transaction.findOne({'_id' : test}, function(err, transaction) {
                   if (err) return err;
                   if (transaction == null) {
                     console.log("n'existe passss");
                   }
                   else {
                    res.send(transaction);
                   }
                });
            });
            
            app.get('/tableauDeBord', function(req, res) {
                var users=Transaction.find({'preteur.mel' : req.cookies.utilisateur}).toArray( function(err, users) {
                    if (err) return next(err)
                    if (users == null)
                      res.status(404).end()
                    else{
                      res.send(users);
                    }
               })
            });

            app.get('/tableauDeBord/Transactions/Participant', function(req, res) {
                var users=Transaction.find({'participants.participant.mel' : req.cookies.utilisateur}).toArray( function(err, users) {
                    if (err) return next(err)
                    if (users == null)
                      res.status(404).end()
                    else{
                      res.send(users);
                    }
               })
            });

        app.get('/transaction',function(req,res){
            if(req!=null){
                var result =Transaction.find("req")
                if(result!=null){
                    res.result=result;
                    res.send();
                }
                else
                    console.log("reultat introuvable : app.get /transaction ")
            }
        });
    
        app.post('/transaction/nouvelle', function(req, res) { 
            var dateCreationTransaction= new Date();              
            Transaction.insert(req.body);
            res.send();

        });
    });

/**************** Collection Groupe******************/
    db.collection("Groupe", function(err, Groupe) {
        app.get('/groupe/:id',function(req,res){
            if(req!=null){
                var result =Groupe.findOne("req")
                if(result!=null){
                    res.result=result;
                    res.send();
                }
                else
                    console.log("resultat introuvable : app.get /groupe/One ")
            }
        });

        app.get('/groupe',function(req,res){
            if(req!=null){
                var result =Groupe.find("req")
                if(result!=null){
                    res.result=result;
                    res.send();
                }
                else
                    console.log("reultat introuvable : app.get /groupe ")
            }
        });
    
        app.post('/groupe/nouvelle', function(req, res) {             
            Groupe.insert(req.body);
            res.send();

        });
    })

    /**************** Collection Historique******************/
    db.collection("Historique", function(err, Historique) {
        app.get('/historique/:id',function(req,res){
            if(req!=null){
                var result =Historique.findOne("req")
                if(result!=null){
                    res.result=result;
                    res.send();
                }
                else
                    console.log("reultat introuvable : app.get /historique/One ")
            }
        });

        app.get('/historique',function(req,res){
            if(req!=null){
                var result =Historique.find("req")
                if(result!=null){
                    res.result=result;
                    res.send();
                }
                else
                    console.log("reultat introuvable : app.get /historique ")
            }
        });
    
        app.post('/historique/nouvelle', function(req, res) {             
            Historique.insert(req.body);
            res.send();
        });        
    })

    /**************///
          
     //app.use(express.static(__dirname+'/client'));   
     app.listen(3000, function() {
       console.log("Server running...")
    });
});
