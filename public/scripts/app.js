/**
 * Created by Minhaj on 6/20/15.
 */
angular.module('mulkiyaOCR',
    [
        'ui.router',
        'ngFileUpload',
        'ngMaterial'
    ]
);

angular.module('mulkiyaOCR').config(function($stateProvider, $urlRouterProvider, $locationProvider,  $mdGestureProvider) {

    $mdGestureProvider.skipClickHijack();

    $locationProvider.html5Mode({
        enabled: false,
        hashPrefix: '!',
        requireBase: false
    });

    /* Add New States Above */
    $urlRouterProvider.otherwise('/');


}).controller('ApplicationController', function ($scope, Upload, $mdDialog) {
    $scope.progress = false;

    $scope.uploadMulkiya = function(event){
        $scope.progress = true;
        $scope.upload($scope.files, event);
    };

    $scope.upload = function (files, event) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/api/ocr',
                    file: file,
                    fileName: "file"
                }).progress(function (evt) {
                    if(!$scope.progress) {
                        $scope.progress = true;
                    }

                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $scope.progress = false;
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title('Text Scanned from Mulkiya')
                            .content(data)
                            .ariaLabel('Alert Dialog')
                            .ok('Got it!')
                            .targetEvent(event)
                    );
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };

});

angular.module('mulkiyaOCR').run(function($rootScope) {
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
});