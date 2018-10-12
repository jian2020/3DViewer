(() => {
    angular.module("app").controller("_3dviewerCtrl", _3dviewerCtrl);

    function _3dviewerCtrl(
        $scope,
        $timeout,
        authFactory,
        $state,
        apiFactory,
        Notification,
        NgMap,
        globals,
        localStorageService,
      ) {
        let vm = this;

        const { logout } = globals;
    
        if (!authFactory.checkUser()) {
          logout();
        }


        vm.logout = () => {
          logout();
        };
      }
      

})();