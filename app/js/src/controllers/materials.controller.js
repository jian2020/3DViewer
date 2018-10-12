(() => {
  angular.module("app").controller("materialCtrl", materialCtrl);

  function materialCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals,
    NgMap,
    Upload
  ) {
    /* Requiring vars */

    let vm = this;
    const { logout, userStore, debounce } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }

    /* Get project list */
    vm.userData = userStore.get();

    vm.logout = () => {
      logout();
    };

    $(".payrollMenu").hide();

    /* Data table setup **************************/
    vm.dtOptions = {
      retrieve: true,
      paging: false,
      info: false,
      ordering: false
    };

    // $(".materialList").DataTable();

    /* Setting up inventory state */
    const inventoryState = globals.inventoryState();
    vm.activeTab = inventoryState.get().tab;
    $scope.activeJustified = 0;
    vm.currentPage = 1;
    
    $scope.$watch(
      "vm.activeTab",
      tab => {
        inventoryState.setTab(tab);
      },
      true
    );

    vm.toggleObj = {
      material: {
        systemTag: true,
        materialCost: false,
        rooferCost: false,
        createdAt: true,
        name: false
      },
      combo: {
        systemTag: true,
        materialCost: false,
        rooferCost: false,
        createdAt: true,
        name: false
      }
    };

    vm.searchText = inventoryState.get().searchText;

    $scope.$watch(
      "vm.searchText",
      text => {
        inventoryState.text(text);
      },
      true
    );
    
    /* $('.avail_option li').click(function () {
      var txt = $(this).text();
      var val = $(this).val();
      $(this).parents().siblings('.selectbox').text(val);
    }) */
    vm.unitSelect = (data) => {
      vm.selectedUnit = data.name;
    }

    vm.sortMaterials = (type, resource) => {
      /* For toggling ascending and descending order */
      vm.toggleObj[resource][type] === undefined
        ? (vm.toggleObj[resource][type] = true)
        : (vm.toggleObj[resource][type] = !vm.toggleObj[resource][type]);
      let apiName =
        resource === "material" ? "listAllMaterials" : "listAllComboMaterials";

      apiFactory[apiName]({
        page: inventoryState.get().page[resource],
        chunk: 10,
        sort: type,
        search: vm.searchText,
        sortType: vm.toggleObj[resource][type]
      })
        .then(resp => {
          vm[resource] = resp.data.list;
          vm[resource + "Count"] = resp.data.total;
          $timeout(() => {
            $("#" + resource + "Pagination").pagination({
              items: vm[resource + "Count"],
              itemsOnPage: 10,
              cssStyle: "light-theme",
              hrefTextPrefix: "#",
              ordering: false,
              currentPage: inventoryState.get().page[resource],
              onPageClick: function(page, event) {
                event.preventDefault();
                inventoryState.setPage(resource, page);

                apiFactory[apiName]({
                  page: page,
                  chunk: 10,
                  sort: type,
                  sortType: vm.toggleObj[resource][type]
                })
                  .then(resp => {
                    vm[resource] = resp.data.list;
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            });
          });
        })
        .catch(e => {
          console.log(e);
        });
    };

    const searchDebounce = debounce(250); /* Passing in the debounce rate */
    vm.searchMaterials = (text, resource) => {
      /**
       * @param {function} fn - pass the function which you want to debounce
       * @param {Array} args - pass the arguments from the view as an array
       */
      searchDebounce(
        () => {
          let apiName =
            resource === "material"
              ? "listAllMaterials"
              : "listAllComboMaterials";

          apiFactory[apiName]({
            page: 1,
            chunk: 10,
            search: text,
            sort: "createdDate",
            sortType: false
          })
            .then(resp => {
              vm[resource] = resp.data.list;
              vm[resource + "Count"] = resp.data.total;
              $timeout(() => {
                $("#" + resource + "Pagination").pagination({
                  items: vm[resource + "Count"],
                  itemsOnPage: 10,
                  cssStyle: "light-theme",
                  hrefTextPrefix: "#",
                  ordering: false,
                  currentPage: 1,
                  onPageClick: function(page, event) {
                    event.preventDefault();
                    apiFactory[apiName]({
                      page: page,
                      chunk: 10,
                      sort: type,
                      sortType: vm.toggleObj[resource][type]
                    })
                      .then(resp => {
                        vm.materials = resp.data.list;
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }
                });
              });
            })
            .catch(e => {
              console.log(e);
            });
        },
        [text, resource]
      );
    };

    /* Initially getting the values of material and combo materials */
    vm.sortMaterials("createdAt", "material");
    vm.sortMaterials("createdAt", "combo");
    /* End of  Data table setup **********************/

    /* Add material functionality */
    vm.addMaterial = { conversionFactor: 1 };
    vm.tabSettings = { disable: true };
    apiFactory
      .getCompanyById(vm.userData.companyId)
      .then(resp => {
        vm.companyData = resp.data;
        vm.addMaterial.currency = vm.companyData.currentCurrency.currencyCode;
      })
      .then(e => {
        console.log(e);
      });

    $scope.$watch("vm.addMaterial.currency", function(value) {
      $("a.item-selected span").removeClass("glyphicon glyphicon-remove");
      $("a.item-selected span").addClass("fas fa-times mr-3");
    });

    vm.showConversionRate = (from, to) => {
      $(".loader").show();
      let currencyData = {
        from,
        to
      };
      apiFactory
        .showConversionRate(currencyData)
        .then(resp => {
          vm.addMaterial.conversionFactor = resp.data.conversionFactor;
          $timeout(function() {
            $(".loader").hide();
          }, 500);
        })
        .catch(e => {
          console.log(e);
        });
    };

    vm.tabStyle = val => {
      if (
        (vm.addMaterial.materialName !== undefined &&
          vm.addMaterial.materialName !== "") ||
        (vm.addComboMaterialForm.name !== undefined &&
          vm.addComboMaterialForm.name !== "")
      ) {
        if (
          (vm.addMaterial.matrialUnit !== undefined &&
            vm.addMaterial.matrialUnit !== " ") ||
          (vm.addComboMaterialForm.unitSymbol !== undefined &&
            vm.addComboMaterialForm.unitSymbol !== " ")
        ) {
          if (
            (vm.addMaterial.currency !== undefined &&
              vm.addMaterial.currency !== "") ||
            (vm.addComboMaterialForm.description !== undefined &&
              vm.addComboMaterialForm.description !== " ")
          ) {
            if (
              (vm.addMaterial.conversionFactor !== undefined &&
                vm.addMaterial.conversionFactor !== "") ||
              (vm.addComboMaterialForm.description !== undefined &&
                vm.addComboMaterialForm.description !== " ")
            ) {
              $("uib-tab-heading.info i.fa").attr(
                "style",
                "display: inline-block !important; color: #3cbdaa"
              );
              $("uib-tab-heading.info .number").hide();
              $(".btn-success.next").attr("disabled", false);
            } else {
              $("uib-tab-heading.info i.fa").attr(
                "style",
                "display: none !important; color: #3cbdaa"
              );
              $("uib-tab-heading.info .number").show();
              $(".btn-success.next").attr("disabled", true);
            }
          } else {
            $("uib-tab-heading.info i.fa").attr(
              "style",
              "display: none !important; color: #3cbdaa"
            );
            $("uib-tab-heading.info .number").show();
            $(".btn-success.next").attr("disabled", true);
          }
        } else {
          $("uib-tab-heading.info i.fa").attr(
            "style",
            "display: none !important; color: #3cbdaa"
          );
          $("uib-tab-heading.info .number").show();
          $(".btn-success.next").attr("disabled", true);
        }
      } else {
        $("uib-tab-heading.info i.fa").attr(
          "style",
          "display: none !important; color: #3cbdaa"
        );
        $("uib-tab-heading.info .number").show();
        $(".btn-success.next").attr("disabled", true);
      }
    };

    vm.addMaterialNext = () => {
      if (
        vm.addMaterial.materialName == undefined ||
        vm.addMaterial.materialName == " "
      ) {
        Notification.error("Please enter material name");
        return;
      }

      if (
        vm.addMaterial.matrialUnit == undefined ||
        vm.addMaterial.matrialUnit == ""
      ) {
        Notification.error("Please select material Unit");
        return;
      }

      if (
        vm.addMaterial.currency == undefined ||
        vm.addMaterial.currency == " "
      ) {
        Notification.error("Please select Currency");
        return;
      }

      $scope.activeJustified = 1;
    };

    vm.changeCost = (cost, conversionRate) => {
      return cost * conversionRate;
    };

    vm.addMaterialDetails = () => {
      var formData = {
        name: vm.addMaterial.materialName,
        unit: vm.addMaterial.matrialUnit,
        materialCost: {
          value: vm.changeCost(
            vm.addMaterial.materialCostValue,
            vm.addMaterial.conversionFactor
          ),
          currencyCode: vm.companyData.currentCurrency.currencyCode
        },
        rooferCost: {
          value: vm.changeCost(
            vm.addMaterial.rooferCostValue,
            vm.addMaterial.conversionFactor
          ),
          currencyCode: vm.companyData.currentCurrency.currencyCode
        },
        files: vm.inputFiles
      };

      apiFactory
        .createMaterials(formData)
        .then(resp => {
          $scope.tab = 1;
          $("#addMaterial").modal("hide");
          Notification.success(resp.data.message);

          /* Setting below prop true to force decending order on material add instead of toggling states */
          vm.toggleObj.material.createdAt = true;

          vm.sortMaterials("createdAt", "material");

          vm.addMaterial = {
            conversionFactor: 1
          };
        })
        .catch(e => {
          console.log(e);
        });
    };

    vm.getMaterialById = id => {
      apiFactory
        .getMaterialById(id)
        .then(resp => {
          console.log(resp);
        })
        .catch(e => {
          console.log(e);
        });
    };

    /* Event handler to reset add material modal */
    $("#addMaterial").on("hide.bs.modal", function() {
      $scope.activeJustified = 0;
      vm.addMaterial = {
        conversionFactor: 1
      };
    });

    /* Add Combo Material */
    vm.comboMaterialList = [];
    vm.addComboMaterialForm = {};
    vm.percentageAddition = [];
    vm.addComboMaterialNext = val => {
      if (val == 0) {
        $timeout(function() {
          $(".btn-success.next").attr("disabled", false);
        }, 500);
        $scope.comboActiveJustified = val;
      } else if (val == 1) {
        if (
          vm.addComboMaterialForm.name == undefined ||
          vm.addComboMaterialForm.name == " "
        ) {
          Notification.error("Please enter material name");
          return;
        }

        if (
          vm.addComboMaterialForm.unitSymbol == undefined ||
          vm.addComboMaterialForm.unitSymbol == ""
        ) {
          Notification.error("Please select material Unit");
          return;
        }

        if (
          vm.addComboMaterialForm.description == undefined ||
          vm.addComboMaterialForm.description == " "
        ) {
          Notification.error("Please select Currency");
          return;
        }
        $scope.comboActiveJustified = val;
      } else if (val == 2) {
        if (vm.comboMaterialList.length == 0) {
          Notification.error("Please add Combination list");
          return;
        } else {
          vm.TotalMC = 0;
          vm.TotalRC = 0;
          angular.forEach(vm.comboMaterialList, function(value) {
            vm.TotalMC =
              parseFloat(vm.TotalMC) + parseFloat(value.materialCost);
            vm.TotalRC = parseFloat(vm.TotalRC) + parseFloat(value.rooferCost);
          });
          vm.TotalMC = parseFloat(Math.round(vm.TotalMC * 100) / 100);
          vm.TotalRC = parseFloat(Math.round(vm.TotalRC * 100) / 100);
          $scope.comboActiveJustified = val;
        }
      }
    };

    /* get all material List */
    vm.mUnits = globals.mUnits;
    globals.getCurrency().then(resp => {
      vm.currencies = resp.data;
      vm.loadCurrencies = $query => {
        return new Promise((resolve, reject) => {
          resolve(resp.data);
        });
      };
    });

    /* apiFactory
      .listAllMaterials()
      .then(resp => {
        vm.allmaterilaList = resp.data.list;
      })
      .catch(e => {
        console.log(e);
      }); */

    vm.comboList = {
      quantity: 1,
      materialCost: 0,
      rooferCost: 0
    };

    vm.getMaterialInfo = materialInfo => {
      vm.comboList.materialCost = parseFloat(
        Math.round(
          vm.comboList.quantity *
            materialInfo.currentRate.materialCost.value *
            100
        ) / 100
      );
      vm.comboList.rooferCost = parseFloat(
        Math.round(
          vm.comboList.quantity *
            materialInfo.currentRate.rooferCost.value *
            100
        ) / 100
      );
      vm.tabStyle();
      $("a.item-selected span").removeClass("glyphicon glyphicon-remove");
      $("a.item-selected span").addClass("fas fa-times mr-3");
    };
    vm.QtyChange = (val, material) => {
      if (val == "" || val == 0) {
        vm.comboList.quantity = 1;
        val = 1;
        vm.comboList.materialCost = parseFloat(
          Math.round(val * material.currentRate.materialCost.value * 100) / 100
        );
        vm.comboList.rooferCost = parseFloat(
          Math.round(val * material.currentRate.rooferCost.value * 100) / 100
        );
      } else {
        vm.comboList.materialCost = parseFloat(
          Math.round(val * material.currentRate.materialCost.value * 100) / 100
        );
        vm.comboList.rooferCost = parseFloat(
          Math.round(val * material.currentRate.rooferCost.value * 100) / 100
        );
      }
      vm.tabStyle();
    };

    vm.addPercentageValue = () => {
      vm.percentageAddition.push({
        percentageType: "",
        percentageValue: ""
      });
    };
    vm.removePercentageAddition = index => {
      vm.percentageAddition.splice(index, 1);
    };

    vm.materialCombination = data => {
      if (data != "") {
        vm.comboMaterialList.push({
          materialId: data._id,
          name: data.name,
          quantity: vm.comboList.quantity,
          materialCost: vm.comboList.materialCost,
          rooferCost: vm.comboList.rooferCost,
          percentageAdditions: vm.percentageAddition
        });
        vm.percentageAddition = [];
        vm.comboList = {
          quantity: 1,
          materialCost: 0,
          rooferCost: 0
        };

        vm.addComboMaterialForm.comboMaterial = "";
        $(".select2-choice .select2-chosen").text("");
      }
    };

    vm.fileUpdated = (files, event) => {
      let fileObj = event.target.files;
      vm.fileNames = Object.keys(fileObj).map(x => fileObj[x].name);
    };

    vm.createComboMaterialList = () => {
      var cmList = [];

      vm.comboMaterialList.forEach(x => {
        var perAdditions = {};
        if (x.percentageAdditions.length !== 0) {
          x.percentageAdditions.forEach(x => {
            perAdditions[x.percentageType] = Number(x.percentageValue);
          });
        }
        cmList.push({
          materialId: x.materialId,
          quantity: x.quantity,
          percentageAdditions: perAdditions
        });
      });

      var data = {
        name: vm.addComboMaterialForm.name,
        unit: vm.addComboMaterialForm.unitSymbol,
        comboMaterialList: cmList,
        files: vm.inputFiles
      };

      apiFactory
        .getSystemTag()
        .then(resp => {
          var systemTag = { systemTag: resp.data.comboTag };
          angular.extend(data, systemTag);
          apiFactory
            .createComboMaterial(data)
            .then(resp => {
              Notification.success(resp.data.message);
              $("#addComboMaterial").modal("hide");
            })
            .catch(e => {
              Notification.error(e.data.message);
            });
        })
        .catch(e => {
          Notification.error(e.data.message);
        });
    };

    vm.removeMateril = item => {
      vm.comboMaterialList.splice(item, 1);
    };
  }
})();
