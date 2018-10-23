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
    Upload,
    SBcommon,
    SBchannel
  ) {
    /* Requiring vars */

    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }

    vm.userData = userStore.get();
    let room = SBcommon;
    apiFactory
      .getAccessMeetingRoomToken()
      /* Step 1 - Obtain access token */
      .then(resp => {
        return resp.data.accessToken;
      })
      /* Step 2 - Login user */
      .then(token => {
        if (!token) throw new Error("Token unavailable");

        return room.connect(
          userStore.get().email,
          token
        );
      })
      /* Step 3 - Get channel list after successfull connection */
      .then(connectedUser => {
        Notification.success("Connected to meeting room");
        return SBchannel.listChannels();
      })
      /* Step 4 - Bind initial view vars here */
      .then(channelList => {
        vm.newMeeting = {};
        console.log("channeldata", channelList);
        vm.channelList = channelList;
      })
      .catch(room.error);

    /* Create a channel */

    vm.createChannel = formData => {
      SBchannel.createChannel(formData.name, "leo@askpundit.com")
        .then(channel => {
          console.log("CreatedChannel", channel);
          SBchannel.listChannels().then(channelList => {
            vm.channelList = channelList;
          });
        })
        .catch(room.error);
    };

    vm.logout = () => {
      logout();
    };
  }
})();
