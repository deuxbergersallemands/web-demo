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

app.use(bodyParser.json())
app.use(cookieParser())

var getETag = function(body) {
    return md5(body)
}

app.set("etag", getETag)

MongoClient.connect(url, function(err, db) {



    /**************** Collection Historique******************/
    db.collection("Historique", function(err, Historique) {

        function saveHistaurique(msg,Concernes,d){

          var dateHistorique = new Date();
          var data=new Object()
          data.date=dateHistorique;          
          data.date=dateHistorique;
          data.Concernes=Concernes;
          data.d=d;
          data.message=msg;
          Historique.insert(data);
        }
        db.collection("Utilisateur", function(err, Utilisateur) {
          app.use(express.static(__dirname+'/client'));
            app.post('/', function(req, res) {
                var melReq=req.body.mel;
                var MotDePasseReq=req.body.motDePasse;
                var u=Utilisateur.findOne({"mel":melReq}, function(err, u) {
                    if (err) res.send(err);

                    else {
                        if((u.mel==melReq)&&(u.MotDePasse==MotDePasseReq)){
                            res.send(u.solde);
                        }
                        else{
                            res.status(500).send({ error: "Les cordonées que vous avez fournisses ne sont pas valides." });
                        }

                    }

                });
            });

            app.post('/inscription', function(req, res) {
                var melReq=req.body.mel;
                var NouveauUtilisateur= Utilisateur.findOne({"mel":melReq}, function(err, u) {
                  if (err) res.send(err);
                  if (u==null){
                    UtilisateurAAjouter=req.body;
                    UtilisateurAAjouter.solde = 0;
                            var message="inscription ";
                            var Concernes=new Array();
                            var concerne=new Object();
                            var data=new Object();
                            concerne.mel=UtilisateurAAjouter.mel;
                            concerne.nom=UtilisateurAAjouter.nom;
                            Concernes.push(concerne);
                            message+= Concernes.concerne;
                            data.Concernes=concerne;
                            saveHistaurique(message,Concernes,data); 
                    Utilisateur.insert(UtilisateurAAjouter);
                    res.send();
                  }
                  else{
                    res.status(500).send({ error: "utilisateur existe déja" });
                  }
                });
            });

            app.get('/amis', function(req, res) {
                Utilisateur.find({}).toArray(function(err, amis) {
                    if (err) res.send(err);
                  
                    res.send(amis);
                });
            });

            app.post('/amis',function(req,res){
                 Utilisateur.findOne({"mel":req.cookies.utilisateur}, function(err, utilisateur) {
                    if (err) res.send(err);
                    if (utilisateur == null) {}
                    else {
                        var idAmi = new require('mongodb').ObjectID(req.body.id);
                        Utilisateur.findOne({'_id' : idAmi}, function(err, ami) {
                          if (err) res.send(err);
                          if (ami == null) {}
                          else {
                            var objHistorique= new Object();
                            objHistorique.Concernes=({nom: ami.nom, mel: ami.mel});
                            var message= req.cookies.utilisateur + " a ajouté " + ami.mel;
                            var Concernes=new Array();
                            var concerne=new Object();
                            var data=new Object();
                            concerne.mel=req.cookies.utilisateur;
                            Concernes.push(concerne);

                            message+= Concernes.concerne;
                            data.Concernes=concerne;
                            saveHistaurique(message,Concernes,data);
            
                            
                            Utilisateur.update({"mel":req.cookies.utilisateur}, 
                                            { $push : 
                                                 { amis: 
                                                    { $each: [{nom: ami.nom, mel: ami.mel}]}} });
                            res.send();
                          }
                        });
                    }


                 });
            });
            
            app.get('/amis/:id',function(req,res){
                var ami = new require('mongodb').ObjectID(req.params.id)
                 Utilisateur.findOne({'_id' : ami}, function(err, amis) {
                   if (err) res.send(err);
                   else {
                    res.send(amis);
                   }
                });
            });

            app.get('/relations', function(req, res){

                Utilisateur.find({'mel' : req.cookies.utilisateur}, {_id:0, amis:1}).toArray(function(err, amis) {
                    if (err) return next(err);
                    res.send(amis);
                });
            });
 
            app.get('/solde', function(req, res) {
              var u=Utilisateur.findOne({'mel':req.cookies.utilisateur}, {'solde':1, 'nom': 1}, function(err, solde) {
                if (err)  res.send(err);
                else {
                    res.send(solde);
                }
              });
            });

        });

        /**************** Collection Transaction******************/
        db.collection("Transaction", function(err, Transaction) {
            app.get('/transaction/:id',function(req,res){
                var test = new require('mongodb').ObjectID(req.params.id)
                 Transaction.findOne({'_id' : test}, function(err, transaction) {
                   if (err) res.send(err);
                   else {
                    res.send(transaction);
                   }
                });
            });
 
            // Régler une transaction
            app.post('/transaction',function(req,res){
                var test = new require('mongodb').ObjectID(req.body.transId);
                 Transaction.findOne({'_id' : test}, function(err, transaction) {
                   if (err) res.send(err);
                   else {
                     var obj = transaction.participants;
                     var utilisateur = req.cookies.utilisateur;
                     var unDu = 0
                     for (var i = 0; i < obj.length; i++)
                     {
                      if (obj[i].participant.mel == utilisateur) {

                            var message= req.cookies.utilisateur + " a réglé une transaction.";
                            var Concernes=new Array();
                            var concerne=new Object();
                            var data=new Object();
                            Concernes=req.body.participants;
                            //message+= Concernes.concerne;
                            data=Transaction.findOne({'_id' : test, 'participants.participant.mel' : utilisateur});

                         unDu = obj[i].montantDu;
                        Transaction.update({'_id' : test, 'participants.participant.mel' : utilisateur}, {
                          $set: {"participants.$.statut": "Reglée", "participants.$.montantRegle": obj[i].montantDu}
                        })
                      }
                     }
                     db.collection("Utilisateur", function(err, Utilisateur) {
                      Utilisateur.findOne({"mel": req.cookies.utilisateur}, function(err, utilisateur){
                         if (err) {
                          res.send(err);
                         }
                         else {
                           var soldeNouveau = utilisateur.solde + unDu;
                           Utilisateur.update({"mel": req.cookies.utilisateur}, {
                           $set: {"solde": soldeNouveau}
                        })
                           res.send();
                         }
                      });
                     })
                   }
                });
            });

            app.get('/tableauDeBord', function(req, res) {
                var users=Transaction.find({'preteur.mel' : req.cookies.utilisateur, 'participants.statut': "Ouverte"}).toArray( function(err, trans) {
                    if (err) res.send(err);
                    if (trans == null)
                      res.status(404).end()
                    else{
                      res.send(trans);
                    }
               })
            });

            app.get('/tableauDeBord/Transactions/Participant', function(req, res) {
                var users=Transaction.find({'participants.participant.mel' : req.cookies.utilisateur, 'participants.statut': "Ouverte"}).toArray( function(err, trans) {
                    if (err) res.send(err);
                    if (trans == null)
                      res.status(404).end()
                    else{
                      res.send(trans);
                    }
               })
            });
    
        app.post('/transaction/nouvelle', function(req, res) { 

            var message= req.cookies.nom + " a ajouté une transaction ";
            var Concernes=new Object();
            var data = new Object();
            data =req.body;
            Concernes=req.body.participants;
            saveHistaurique(message,Concernes,data); 
             
            for (var i = 0; i < req.body.participants.length; i++) {
              if (req.body.participants[i].participant.mel != req.body.preteur.mel) {
                    var unDu = req.body.participants[i].montantDu;
                    var melUtil = req.body.participants[i].participant.mel;
                     db.collection("Utilisateur", function(err, Utilisateur) {
                      Utilisateur.findOne({"mel": melUtil}, function(err, utilisateur){
                         if (err) {
                          res.send(err);
                         }
                         else {
                           var soldeNouveau = utilisateur.solde - unDu;
                           Utilisateur.update({"mel": melUtil}, {
                           $set: {"solde": soldeNouveau}
                        });
                       req.body.DateCreation = new Date();
                       Transaction.insert(req.body);
                       res.send();

                         }
                      });
                    });


               
              }
            }
        });



          app.get('/transaction/nouvelle', function(req, res) { 
            Transaction.find({'preteur.mel' : req.cookies.utilisateur, 'participants.statut': "Ouverte"}).toArray( function(err, trans) {
            res.send(trans);

            }); 
          })

    });

/**************** Collection Groupe******************/
    db.collection("Groupe", function(err, Groupe) {

        // Récupérer tous les groups dont l'utilisateur fait parti.
        app.get('/groupes',function(req,res){
            Groupe.find({'membres.mel' : req.cookies.utilisateur}).toArray( function(err, groupes) {
              if (err) res.send(err);
              else {
                    res.send(groupes);
                }

        });
    })
    
        app.post('/groupes/nouveau', function(req, res) {   
            Groupe.insert(req.body);
            var Concernes=new Object();
            var data= new Object();
            Concernes=req.body.membres;
            data=req.body;
            var message="ajout de groupes";
            message+= req.body.nom;
            saveHistaurique(message,Concernes,data);
            res.send();
        });
    })
        
    app.get('/ActivitesRecentes',function(req,res){
            if (err) res.send(err);
            if(req!=null){
                //Concernes ----> Concernes.mel si votre objet personne et pas seulement l'email 
                Historique.find({'Concernes.participant.mel' : req.cookies.utilisateur}).sort({_id:-1}).limit(10).toArray( function(err, x) {
                    if(err==null){
                    res.send(x);
                    }
                    else 
                         res.send("Aucun évènement trouvé dans la base de données");
                });
            }
        });
    app.get('/historique',function(req,res){
            if(req!=null){
                Historique.find({'Concernes.participant.mel' : req.cookies.utilisateur}).sort({_id:-1}).toArray( function(err, x) {
                    if(err==null){
                    res.send(x);
                    }
                    else 
                      res.send("Aucun évènement trouvé dans la base de données");

                });

            } 
        });      
    })

    /**************///
          
     //app.use(express.static(__dirname+'/client'));   
     app.listen(3000, function() {
       console.log("Server running...")
    });
});
