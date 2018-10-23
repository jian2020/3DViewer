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


    $scope.slider2 = [
      { img: '/assets/images/equipment2.jpg' },
      { img: '/assets/images/equipment2.jpg' },
      { img: '/assets/images/equipment2.jpg' }
    ] 
    $scope.equip_table = [
      { unit: 'Currency', mt: 'Danish Krone' },
      { unit: 'Conversion Factor', mt: '1' },
      { unit: 'Equipment Cost (DKK)', mt: '---' },
      { unit: 'Worker Cost (DKK)', mt: '---' },
      { unit: 'Worker ID', mt: 'NNS1 - Kim Mosegaard' }
    ]





  }
})();
