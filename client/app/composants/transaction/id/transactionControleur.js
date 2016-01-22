myApp.controller('TransactionIdControleur', ['$scope', '$route', '$routeParams', '$cookies', 'TransactionId','$location', function($scope, $route, $routeParams, $cookies, TransactionId, $location) {

  $scope.tid = $location.path().split("/")[2]||null;
  if ($scope.tid == null){
  	$location.path('/tableauDeBord')
  }
 

  $scope.recuperMontantDu = function() {
  	TransactionId.get({id:$scope.tid},function (transaction, headers) {

  		$scope.transaction = transaction;
      $scope.montantDu = transaction.participants[0].montantDu
      console.log($scope.montantDu)
                       }, function (error) {
                       });
  }

  $scope.payer = function() {
    var trans = new TransactionId();
    trans.transId = $scope.tid;
     $location.path('/tableauDeBord');
     trans.$save({function (transaction, headers) {
          console.log("post-save")
          $location.path('/tableauDeBord');
     }
    })};

  $scope.recuperMontantDu();

}]);