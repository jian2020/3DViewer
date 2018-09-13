(() => {
    angular.module("app").controller("_3dViewerCtrl", _3dViewerCtrl);

    function _3dViewerCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    localStorageService,
    globals,
    NgMap
  ) {
    /* Requiring vars */

    let vm = this;
      vm.loggedIn = true
    const { logout, userStore, throttler } = globals;

    if (!authFactory.checkUser()) {
      logout();
      vm.loggedIn = false
      return;
    }

    vm.logout = () => {
      logout();
    };
  }
})();
