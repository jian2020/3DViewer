(() => {
  angular.module("app").controller("economicPayrollCtrl", economicPayrollCtrl);

  function economicPayrollCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals,
    NgMap,
    Upload,
    moment,
    $location
  ) {
    /* Requiring vars */
    let vm = this;
    const { logout, userStore, debounce } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }

    /* Get project list */
    vm.userData = userStore.get();

    console.log(vm.userData)
    vm.logout = () => {
      logout();
    };

    $scope.activeClass = function (path) {
      return ($location.path() === path) ? 'active' : '';
    }

  }
})();
