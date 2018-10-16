(() => {
  angular.module("app").controller("calenderCtrl", calenderCtrl);

  function calenderCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals,
    Upload
  ) {

    $scope.invitees = [
        { id: '1', img: '/assets/images/user_pic2.png', name: 'Lisa Guerrero', lb: true, 'status': false },
        { id: '2', img: '/assets/images/user_pic3.png', name: 'Peter Gregor', lb: false, 'status': false },
        { id: '3', img: '/assets/images/user_pic2.png', name: 'Lisa Guerrero', lb: false, 'status': false },
        { id: '4', img: '/assets/images/user_pic3.png', name: 'Peter Gregor', lb: false, 'status': false }
    ]
    
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
    
  }
})();
