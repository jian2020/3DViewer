(() => {
  angular.module("app").factory("globals", globals);

  function globals(
    $http,
    $state,
    $location,
    ngProgressFactory,
    Notification,
    localStorageService
  ) {
    /* To avoid redundant function calls of the same type (Eg. multiple token expired messages) */
    let throttler = (() => {
      let enabled = true;
      return fn => {
        if (enabled) {
          enabled = false;
          setTimeout(() => {
            enabled = true;
          });
          fn();
        }
      };
    })();

    return {
      progress: (() => {
        let progressbar = ngProgressFactory.createInstance();
        return progressbar;
      })(),
      logout: () => {
        localStorageService.remove("access-token");
        localStorageService.remove("userData");
        localStorageService.remove("companyData");
        localStorageService.remove("currentProject");
        localStorageService.remove("inventoryState");

        $state.go("preLogin");
        //throttler(() => Notification.error("Please login"));
      },
      /* Access user info globally */
      userStore: (() => {
        let userData = localStorageService.get("userData") || {};

        return {
          set: data => {
            const userRoles = [
              "admin",
              "manager",
              "sub_contractor",
              "team_leader",
              "worker"
            ];
            data.privilege = userRoles.indexOf(data.designation);

            localStorageService.set("userData", data);
            userData = data;
            return userData;
          },
          get: () => userData,
          reset: () => {
            localStorageService.remove("userData");
            userData = {};
          }
        };
      })(),

      companyStore: (() => {
        let companyData = localStorageService.get("companyData") || null;

        return {
          set: data => {
            localStorageService.set("companyData", data);
            companyData = data;
            return companyData;
          },
          get: () => companyData,
          /* Call refetch when company dependant data is modified */
          refetch: id => {
            $http({
              method: "GET",
              headers: {
                "x-access-token": localStorageService.get("access-token"),
                platform: JSON.stringify({ source: "web" })
              },
              url: `https://api.staging.cloudes.eu/api/getCompanyById/${id}`
            })
              .then(resp => {
                localStorageService.set("companyData", resp.data);
              })
              .catch(e => {
                console.log(e);
              });
          },
          reset: () => {
            localStorageService.remove("companyData");
            companyData = {};
          }
        };
      })(),

      projectStore: (() => {
        let currentProject = localStorageService.get("currentProject") || null;
        return {
          set: data => {
            localStorageService.set("currentProject", data);
            currentProject = data;
            return currentProject;
          },
          get: () => currentProject,
          reset: () => {
            localStorageService.remove("currentProject");
            currentProject = null;
          }
        };
      })(),

      inventoryState: () => {
        let state = localStorageService.get("inventoryState") || {
          tab: 0,
          page: {
            material: 1,
            combo: 1
          }
        };

        return {
          setPage: (type, value) => {
            state.page[type] = value;
            localStorageService.set("inventoryState", state);
          },
          setTab: val => {
            state.tab = val;
            localStorageService.set("inventoryState", state);
          },
          get: () => {
            return state;
          }
        };
      },

      mUnits: [
        {
          name: "mt",
          value: "mt"
        },
        {
          name: "sq.mt",
          value: "sq.mt"
        },
        {
          value: "cu.mt",
          name: "cu.mt"
        },
        {
          name: "ft",
          value: "ft"
        },
        {
          name: "sq.ft",
          value: "sq.ft"
        },
        {
          value: "cu.ft",
          name: "cu.ft"
        },
        {
          value: "unit",
          name: "unit"
        }
      ],

      getCurrency: () => {
        return $http.get("/data/currencies.json");
      },
      getCountryCode: () => {
        return $http.get("/data/CountryCode.json");
      },
      getIndustry: () => {
        return $http.get("/data/industry.json");
      },

      debounce: rate => {
        let timer;
        return function(fn, args) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            fn.apply(null, args);
          }, rate);
        };
      },

      genericStore: () => {
        let item;
        return {
          store: val => {
            item = val;
          },
          get: () => {
            return item;
          }
        };
      }
    };
  }
})();
