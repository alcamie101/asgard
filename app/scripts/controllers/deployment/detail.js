'use strict';

angular.module('asgardApp')
  .controller('DeploymentDetailCtrl', function ($scope, $routeParams, $http, $timeout) {
    var deploymentId = $routeParams.deploymentId;
    var shouldPoll = true;

    var retrieveDeployment = function() {
      $http.get('deployment/show/' + deploymentId + '.json').success(function(data, status, headers, config) {
        $scope.deployment = data;
        shouldPoll = !$scope.deployment.done;
        var text ='';
        angular.forEach($scope.deployment.log, function(value) {
          text = text + value + '\n';
        });
        $scope.logText = text;
      });
    };
    var poll = function() {
        retrieveDeployment();
      if (shouldPoll) {
        $timeout(poll, 1000);
      }
    };
    poll();

    $scope.encodedWorkflowExecutionIds = function() {
      var runId = $scope.deployment.workflowExecution.runId;
      var workflowId = $scope.deployment.workflowExecution.workflowId;
      return "runId=" + encodeURIComponent(runId) + "&workflowId=" + encodeURIComponent(workflowId);
    };

    $scope.stopDeployment = function() {
      $http.get('deployment/cancel/' + deploymentId + '.json');
    };

    $scope.rollbackDeployment = function() {
      judgeDeployment('rollback');
    };

    $scope.proceedWithDeployment = function() {
      judgeDeployment('proceed');
    };

    var judgeDeployment = function(judgment) {
      $http.post('deployment/' + judgment, {
        id: deploymentId,
        token: $scope.deployment.token
      });
    };
  });
