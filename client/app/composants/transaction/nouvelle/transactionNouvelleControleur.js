
myApp.controller('TransactionNouvelleControleur', ['$scope', '$route', '$routeParams', '$location', '$cookies','TransactionNouvelle', 'Relations', function($scope, $route, $routeParams, $location, $cookies, TransactionNouvelle, Relations) {
  
  $scope.participants = [];

  var utilisateur = new Object();
  utilisateur.participant = new Object();
  utilisateur.participant.nom = $cookies.get('nom');
  utilisateur.participant.mel = $cookies.get('utilisateur');
  utilisateur.montantRegle = 0;
  $scope.participants.push(utilisateur);

  
  $scope.ajouterAmi = function(ami) {
    var amiAjouter = new Object();
      amiAjouter.participant = new Object();

    amiAjouter.participant.nom = ami.nom;
    amiAjouter.participant.mel = ami.mel;
    amiAjouter.montantRegle = 0;
  	$scope.participants.push(amiAjouter);
  }

  $scope.sauvegarder = function() {
   
  	$scope.transaction = new TransactionNouvelle();
    $scope.transaction.createur = $cookies.get('utilisateur');
    $scope.transaction.participants = $scope.participants;
    $scope.transaction.description = $scope.description;
    $scope.transaction.montant = $scope.montant;
    $scope.transaction.type = $scope.typeTransaction;
    $scope.transaction.preteur = new Object();
    $scope.transaction.preteur.mel = $scope.participantRembourse;

    var aPayer = $scope.montant / $scope.participants.length;
    
    // Mettre à jour le montant à payer
    for (var i = 0; i < $scope.participants.length; i++) {
      if($scope.transaction.participants[i].mel != $cookies.get('utilisateur')) {
        $scope.transaction.participants[i].montantDu = aPayer;
      }
    }
    $scope.transaction.$save(function (transaction, headers) {
         $location.path('/tableauDeBord');

                }, function (error) {
                    // échec
                });
  }

   Relations.query(function(amis, headers ) {
     $scope.amis = amis;

   });
}]);