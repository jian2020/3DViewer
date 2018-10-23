(() => {
  angular.module("app").factory("SBcommon", SBcommon);

  function SBcommon($http, $location, localStorageService, Notification) {
    const credentials = {
        appId: "C83D94E0-F82E-4F22-A7AD-F9922569AAB4",
        url: "https://api.sendbird.com"
      },
      /* SendBird instance */
      sb = new SendBird({
        appId: credentials.appId
      });

    const methods = {
      getInstance: () => {
        return sb;
      },
      connect: (id, token) => {
        return new Promise((resolve, reject) => {
          sb.connect(
            id,
            token,
            (user, err) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(user);
              }
            }
          );
        });
      },
      disconnect: () => {
        return new Promise((resolve, reject) => {
          sb.disconnect(() => {
            resolve("Disconnected successfully");
          });
        });
      },
      error: e => {
        Notification.error("Something went wrong");
        console.log(e);
      }
    };
    return methods;
  }
})();
