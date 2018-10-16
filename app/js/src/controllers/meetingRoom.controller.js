(() => {
  angular.module("app").controller("meetingRoomCtrl", meetingRoomCtrl);

  function meetingRoomCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals,
    Upload
  ) {
    /* Requiring vars */

    $scope.todo_list = [
      { img: '/assets/images/To-Do-Icon.png', subtitle: '1.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 1 Hour', classname: 'red-color' },
      { img: '/assets/images/To-Do-Icon.png', subtitle: '2.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 1 Day', classname: 'yellow-color' },
      { img: '/assets/images/To-Do-Icon.png', subtitle: '3.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 1 Week', classname: 'green-color' },
      { img: '/assets/images/To-Do-Icon.png', subtitle: '4.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 2 Weeks', classname: 'gray-color' },
      { img: '/assets/images/To-Do-Icon.png', subtitle: '5.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 3 Weeks', classname: 'gray-color' },
      { img: '/assets/images/To-Do-Icon.png', subtitle: '6.', title: 'Lorem ipsum dolor sit amet,consectetur adipisicing elit,sed do eiusmod tempor.', work: 'In 4 Weeks', classname: 'gray-color' }
    ]

    
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
