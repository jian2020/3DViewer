(() => {
  angular.module("app").controller("equipmentViewCtrl", equipmentViewCtrl);

  function equipmentViewCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals,
    $stateParams,
    Upload
  ) {
    /* Requiring vars */

    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }
    vm.logout = () => {
        logout();
    };
    /* Get project list */
    vm.userData = userStore.get();
      
    vm.equipmentId = $stateParams.id;
    apiFactory.getEquipmentById(vm.equipmentId).then(resp => {
    console.log(resp)
    }).catch(e => {
            console.log(e);
        });





  }
})();
