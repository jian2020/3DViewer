(() => {
    angular.module("app").controller("subcontractorDetailCtrl", subcontractorDetailCtrl);

    function subcontractorDetailCtrl(
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
          vm.subcontractorId = $stateParams.id;
          $scope.getSubcontractorDetail = () => {
            apiFactory
              .getSubcontractorById(vm.subcontractorId)
              .then(resp => {
                vm.subcontractorData = resp.data;
                
              })
            }

            $scope.getSubcontractorDetail();
      }

    })();