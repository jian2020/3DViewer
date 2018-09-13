angular.module("routesModule", []).config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider.state("3dViewer", {
    url: "/",
    templateUrl: "/partials/3d-viewer.html",
    controller: "_3dViewerCtrl as vm"
  });
}
