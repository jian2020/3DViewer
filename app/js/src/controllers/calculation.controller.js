(() => {
  angular.module("app").controller("calculationCtrl", calculationCtrl);

  function calculationCtrl(
    $scope,
    $timeout,
    $location,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals
  ) {
    /* Requiring vars */
    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }

    /* Get project list */
    vm.userData = userStore.get();
    vm.logout = () => { logout(); };


    $('.payrollList').DataTable();
    
    
  }
})();
