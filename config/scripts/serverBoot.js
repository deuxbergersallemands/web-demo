console.log("Begin server boot localhost', 27017");
var connect = require("connect");
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;


var db = new Db('deuxbergersallemands_web-demo', new Server('localhost', 27017));


// Establish connection to db
db.open(
    function(err, db) {
    if(err==null){
        console.log("connexion reussite au serveur base de données réussite  localhost', 27017");
        console.log("demarrage de serveur http l'application ");

        var app=connect.createServer(function(req,res){
        res.end("bonjour, il reste l'interaction de serveur avec les requete à developper ...");

    }
       
    });
    app.listen(3000);
    console.log(" serveur http lancé sur le port 3000");
    }
);


/*
db = connect("myDatabase");
var dbs=db.adminCommand("listDatabases");
printjson(dbs);
*/

/*
var connect = require("connect");
var app=connect.createServer(function(req,res){
    //res.end("bonjour");
});
app.listen(3000);
console.log(" serveur http lancé sur le port 3000");
*/


/*
conn = new Mongo()//localhost:27017);
db = conn.getDB("deuxbergersallemands_web-demo");
//db = connect("localhost:27017/deuxbergersallemands_web-demo");
cursor = db.collection.find();
while ( cursor.hasNext() ) {
   printjson( cursor.next() );
}
*/


/*

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/my_database' ,function(err, db,next) {
                          if(!err) {
                            console.log("We are connected my_database");
                          }
                          else
                            console.log("connection problem!!! my_database");
                        
                        next();
                    }

                );
*/



/*var ff = new Folder("~/Desktop/my_new_fodler");  
ff.create();
console.log("c1");
 var f = new Folder('/c/myfolder/');
    if (!f.exists)
        f.create();
console.log("c1");
var fso = new ActiveXObject("Scripting.FileSystemObject");  

// creates a folder with specified name at the specified location  
fso.CreateFolder(".\\Temp\\myFolder");  

console.log("c1");
fso = null;//db = connect("deuxbergersallemands_web-demo"); 
*/

/*
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    db = new Db('deuxbergersallemands_web-demo', new Server('localhost', 27017));
    db.connect();
  */

    /*

*/

/////////////var dbs = db.adminCommand("listDatabases"); 
////////printjson(dbs);
/*

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/composants/reception/reception.html',
      })
      .when('/inscription', {
        templateUrl: 'app/composants/inscription/inscription.html',
      })
      .when('/tableauDeBord', {
        templateUrl: 'app/composants/tableauDeBord/tableauDeBord.html',
        resolve: {
                connected: checkIsConnected
            }
      })
      .otherwise({ redirectTo: '/'});
});


$stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html'
        })
        .state('restricted', {
            url: '/restricted',
            templateUrl: 'views/restricted.html',
            resolve: {
                connected: checkIsConnected
            }
        });


var checkIsConnected = function($q, $timeout, $http, $location) {
    var deferred = $q.defer();
 
    $http.get('/loggedin').success(function(user) {
        if (user !== '-1') {
            $timeout(deferred.resolve, 0);
        } else {
            $timeout(deferred.reject, 0);
            $location.url('/login');
        }
    });
 
    return deferred.promise;
};



conn = new Mongo();4
//db = conn.getDB("myDatabase");
db = connect("localhost:27020/myDatabase");*/