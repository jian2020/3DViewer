(() => {
    angular.module("app").controller("supplierDetailCtrl", supplierDetailCtrl);

    function supplierDetailCtrl(
        $scope,
        $timeout,
        authFactory,
        $state,
        $stateParams,
        apiFactory,
        Notification,
        NgMap,
        globals,
        localStorageService,
      ) {
        let vm = this;

        const { logout,userStore } = globals;
        if (!authFactory.checkUser()) {
            logout();
          }
          vm.userData = userStore.get();

  
          vm.logout = () => {
            logout();
          };
          vm.supplierId = $stateParams.id;
          $scope.getSupplierDetail = () => {
            apiFactory
              .getSupplierById(vm.supplierId)
              .then(resp => {
                vm.supplierData = resp.data;
                
              })
            }

            $scope.getSupplierDetail();
      }

    })();