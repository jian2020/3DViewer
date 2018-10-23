(() => {
  angular.module("app").factory("SBchannel", SBchannel);

  function SBchannel(
    $http,
    $location,
    localStorageService,
    SBcommon,
    Notification
  ) {
    let sb = SBcommon.getInstance();
    const methods = {
      createChannel: (channelName, id) => {
        return new Promise((resolve, reject) => {
          let params = new sb.GroupChannelParams();
          params.isPublic = false;
          params.isEphemeral = false;
          params.isDistinct = false;
          params.addUserIds([id]);
          params.operators = [id];
          params.name = channelName;
          // params.coverImage = FILE;
          // params.coverUrl = COVER_URL;
          // params.data = DATA;
          // params.customType = CUSTOM_TYPE;

          sb.GroupChannel.createChannel(params, function(groupChannel, error) {
            if (error) {
              reject(err);
              return;
            } else {
              resolve(groupChannel);
            }
          });
        });
      },
      /* TODO: Move create params to a separate function */
      createParams: () => {},
      listChannels: () => {
        return new Promise((resolve, reject) => {
          let channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
          channelListQuery.includeEmpty = true;
          if (channelListQuery.hasNext) {
            channelListQuery.next((channelList, error) => {
              if (error) {
                reject(err);
                return;
              } else {
                resolve(channelList);
              }
            });
          }
        });
      }
    };
    return methods;
  }
})();
