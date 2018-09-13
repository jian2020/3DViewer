(() => {
  angular.module("app").factory("fileManagerFactory", fileManagerFactory);

  function fileManagerFactory(apiFactory, Notification) {
    return {
      clipBoard: (function() {
        /*  */
        let items = {
          type: 0,
          data: [],
          source: null
        };
        return {
          copy: function(item) {
            items.source = null;
            items.type = 0;
            items.data = [item];
          },
          cut: function(item, source) {
            items.source = source;
            items.type = 1;
            items.data = [item];
          },
          paste: function(destId) {
            return new Promise((resolve, reject) => {
              if (items.data.length < 1) {
                Notification.warning("Clipboard is empty");
                resolve(false);
                return;
              }

              const apiType = items.type === 0 ? "cloneAssets" : "moveAssets";

              /* Change payload depending upon cut or copy */
              let payload = {
                assetId: items.data.map(x => x._id),
                sourceId: items.type === 0 ? undefined : items.source,
                destId: items.type === 0 ? undefined : destId,
                hierarchyId: items.type === 0 ? destId : undefined
              };

              apiFactory[apiType](payload)
                .then(resp => {
                  Notification.success(resp.data.message);
                  /* Clear clipboard after pasting */
                  items = {
                    type: 0,
                    data: [],
                    source: null
                  };
                  resolve(true);
                })
                .catch(e => {
                  reject(e);
                });
            });
          }
        };
      })(),

      navigationStack: function() {
        let stack = [],
          head = stack.length - 1,
          // TODO: no action handler required for now
          attachHandler = action => {
            let obj = {};
            return obj;
          };
        return {
          push: item => {
            stack.splice(head + 1, stack.length, item);
            head = stack.length - 1;
          },
          forward: () => {
            let obj;
            if (!stack.length) {
              /* Ignore for empty stack */
              return;
            }
            if (head === stack.length - 1) {
              /* Ignore for end of the stack */
              return;
            }

            head++;
            if (stack[head]) {
              stack[head].toggle();
              obj = stack[head];
              return obj;
            }
          },
          backward: () => {
            let obj;
            if (!stack.length) {
              /* Ignore for empty stack */
              return;
            }

            if (head < 0) {
              /* Ignore for end of the stack */
              return;
            }
            if (stack[head]) {
              stack[head].toggle();
              head--;
              obj = stack[head];
              return obj;
            }
          }
        };
      },

      breadCrumb: function() {
        let breadCrumbs = [];
        return {
          set: val => {
            breadCrumbs.push(val);
          },
          get: () => {
            return breadCrumbs;
          }
        };
      },

      /**
       * @param {Object} fileObj
       * @returns {Object}  { s3: [files], cloudinary: [files] }
       */

      splitDestination: filesArray => {
        return filesArray.reduce(
          (acc, x) => {
            if (
              x.size < 20000000 &&
              (x.type === "application/pdf" || /image*/.test(x.type))
            ) {
              acc.cloudinary.push(x);
            } else {
              acc.s3.push(x);
            }
            return acc;
          },
          { s3: [], cloudinary: [] }
        );
      },
      /**
       * @param {Number} fileSize
       * @returns {Number}  1 - direct s3, 2 - s3 -> cloudinary
       */

      resolveDestType: file => {
        if (
          file.size < 150000000 &&
          (file.type === "application/pdf" || /image*/.test(file.type))
        ) {
          return 2;
        }
        return 1;
      },

      checkUploadCompletion: files => {
        let bool = true;
        files.s3.forEach(x => {
          if (!x.completed && !x.aborted && bool) {
            bool = false;
          }
        });
        files.cloudinary.forEach(x => {
          if (!x.completed && !x.aborted && bool) {
            bool = false;
          }
        });
        return bool;
      }
    };
  }
})();
