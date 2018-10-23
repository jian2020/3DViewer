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
    Upload,
    moment
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

    vm.inputImg = [];
    vm.inputFiles = [];
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
    $(".tab-content .tab-pane")
      .eq(inventoryState.get().tab)
      .addClass("show");
    vm.currentPage = 1;

    vm.toggleTab = val => {
      inventoryState.setTab(val);
    };

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

    apiFactory
      .getAllSuppliers()
      .then(resp => {
        vm.suppliers = resp.data.list;
      })
      .catch(e => {
        console.log(e);
      });

    vm.searchText = inventoryState.get().searchText;

    $scope.$watch(
      "vm.searchText",
      text => {
        inventoryState.text(text);
      },
      true
    );

    vm.unitSelect = data => {
      vm.selectedUnit = data.name;
    };

    vm.sortDisplay = (type, resource) => {
      if (type && resource) {
        return `Sorted By: ${type} - ${
          vm.toggleObj[resource][type] ? "ASC" : "DSC"
        }`;
      }
    };

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
        search: inventoryState.get().searchText,
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
                  search: inventoryState.get().searchText,
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
    let defaultMaintenancePeriod = 90;
    vm.addMaterial = {
      conversionFactor: 1,
      maintenancePeriod: defaultMaintenancePeriod,
      maintenanceDate: moment()
        .add(defaultMaintenancePeriod, "days")
        .format()
    };
    vm.changeMaintenancePeriod = days => {
      vm.addMaterial.maintenanceDate = moment()
        .add(days, "days")
        .format();
    };

    vm.tabSettings = { disable: true };

    vm.tabChange = (val, flag) => {
      if (flag == "combo") {
        if (val == 0) {
          tabChangeFun(val);
        } else if (val == 1) {
          if (!vm.addComboMaterialForm.name || !vm.editComboMaterial.name) {
            Notification.error("Please enter combo material name");
            return;
          } else if (!vm.selectedUnit) {
            Notification.error("Please select unit");
            return;
          } else if (!vm.addComboMaterialForm.description || !vm.editComboMaterial.description) {
            Notification.error("Please enter combo description");
            return;
          } else {
            tabChangeFun(val);
          }
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
              vm.TotalRC =
                parseFloat(vm.TotalRC) + parseFloat(value.rooferCost);
            });
            vm.TotalMC = parseFloat(Math.round(vm.TotalMC * 100) / 100);
            vm.TotalRC = parseFloat(Math.round(vm.TotalRC * 100) / 100);
            tabChangeFun(val);
          }
        }
        function tabChangeFun(val) {
          $(".dcp_modal .nav-tabs li .nav-link").removeClass("active");
          $(".dcp_modal .nav-tabs li .nav-link")
            .eq(val)
            .addClass("active");

          $(".dcp_modal .tab-content .tab-pane").removeClass("active");
          $(".dcp_modal .tab-content .tab-pane").removeClass("show");
          $(".dcp_modal .tab-content .tab-pane")
            .eq(val)
            .addClass("show");
          $(".dcp_modal .tab-content .tab-pane")
            .eq(val)
            .addClass("active");
        }
      } else {
        if(val==0) {
          $(".material_modal .nav-tabs li .nav-link").removeClass("active");
          $(".material_modal .nav-tabs li .nav-link")
            .eq(val)
            .addClass("active");

          $(".material_modal .tab-content .tab-pane").removeClass("active");
          $(".material_modal .tab-content .tab-pane").removeClass("show");
          $(".material_modal .tab-content .tab-pane")
            .eq(val)
            .addClass("show");
          $(".material_modal .tab-content .tab-pane")
            .eq(val)
            .addClass("active");
        }
        if(val==1){
          if (!vm.addMaterial.materialName) {
            Notification.error("Please enter material name");
            return;
          } else if (!vm.selectedUnit) {
            Notification.error("Please select material unit");
            return;
            /* } else if (!vm.addMaterial.currency) {
              Notification.error("Please select currency");
              return; */
          } else {
            $(".material_modal .nav-tabs li .nav-link").removeClass("active");
            $(".material_modal .nav-tabs li .nav-link")
              .eq(val)
              .addClass("active");

            $(".material_modal .tab-content .tab-pane").removeClass("active");
            $(".material_modal .tab-content .tab-pane").removeClass("show");
            $(".material_modal .tab-content .tab-pane")
              .eq(val)
              .addClass("show");
            $(".material_modal .tab-content .tab-pane")
              .eq(val)
              .addClass("active");
          }
        } else if(val==2) {

        }
        
      }
    };

    apiFactory
      .getCompanyById(vm.userData.companyId)
      .then(resp => {
        vm.companyData = resp.data;
        vm.addMaterial.currency = angular.copy(vm.companyData.currentCurrency.currencyCode);
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

    vm.addMaterialNext = () => {
      console.log(vm.addMaterial.materialUnit);
      if (
        vm.addMaterial.materialName == undefined &&
        vm.addMaterial.materialName == ""
      ) {
        Notification.error("Please enter material name");
        return;
      }

      if (!vm.addMaterial.materialUnit && vm.addMaterial.materialUnit == "") {
        Notification.error("Please select material Unit");
        return;
      }

      if (
        vm.addMaterial.currency == undefined &&
        vm.addMaterial.currency == ""
      ) {
        Notification.error("Please select Currency");
        return;
      }

      $scope.activeJustified = 1;
    };

    vm.changeCost = (cost, conversionRate) => {
      return cost * conversionRate;
    };

    vm.deleteFile = (indexVal,type) => {
      if(type=='image') {
        vm.inputImg.splice(indexVal, 1);
      } else {
        vm.inputFiles.splice(indexVal, 1);
      }
    };

    vm.descriptionPopover = (indexVal, type) => {
      $scope.fileType = type;
      $scope.fileIndex = indexVal;
    };
    vm.addDescription = (index, data) => {
      if ($scope.fileType == "image") {
        vm.inputImg[index].description = data;
      } else {
        vm.inputFiles[index].description = data;
      }
      $(this).closest('.popover').addClass('Mohamed')
    }
    vm.clearData = (val) => {
      if (val == 'dcp') {
        vm.addComboMaterialForm = {}
        vm.inputImg = []
        vm.inputFiles = []
        vm.selectedUnit = ''
      } else {
        vm.addMaterial = {
          conversionFactor: 1,
          maintenancePeriod: 90,
          currency: angular.copy(vm.companyData.currentCurrency.currencyCode)
        };
        console.log(vm.addMaterial)
        vm.inputImg = []
        vm.inputFiles = []
        vm.selectedUnit = ''
        $('#profile-tab, #dcp1').removeClass('active')
        $('#home-tab, #material1').addClass('active')
        $('#material1').addClass('show')
        vm.changeMaintenancePeriod(vm.addMaterial.maintenancePeriod)
      }
    }
    vm.addMaterialDetails = () => {
      if (!vm.selectedUnit) {
        Notification.error('Please Select Unit');
        return
      } else if (!vm.addMaterial.materialCostValue) {
        Notification.error('Please Select material cost value');
        return 
      } else if (!vm.addMaterial.rooferCostValue) {
        Notification.error('Please Select roofer cost value');
        return 
      } else {
        $scope.uploadFiles = [].concat(vm.inputImg, vm.inputFiles);
        console.log($scope.uploadFiles)
        var formData = {
          name: vm.addMaterial.materialName,
          unit: vm.selectedUnit,
          materialCost: {
            value: vm.changeCost(
              vm.addMaterial.materialCostValue,
              vm.addMaterial.conversionFactor
            ),
            currencyCode: vm.addMaterial.currency
          },
          rooferCost: {
            value: vm.changeCost(
              vm.addMaterial.rooferCostValue,
              vm.addMaterial.conversionFactor
            ),
            currencyCode: vm.addMaterial.currency
          },
          suppliers: vm.addMaterial.suppliers,
          files: $scope.uploadFiles,
          assetObj: $scope.uploadFiles.map((x, i) => {
            return {
              assetDescription: x.description
            }
          })
        };

        apiFactory
          .createMaterials(formData)
          .then(resp => {
            $scope.tab = 1;
            Notification.success(resp.data.message);
            $("#todo_modal").modal("hide");
            $('#profile-tab, #dcp1').removeClass('active')
            $('#home-tab, #material1').addClass('active')
            $('#material1').addClass('show')
            vm.inputImg = []
            vm.inputFiles = []
            vm.selectedUnit = ''
            
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
      }
      
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

    apiFactory
      .listAllMaterials()
      .then(resp => {
        vm.allmaterilaList = resp.data.list;
      })
      .catch(e => {
        console.log(e);
      });

    vm.comboList = {
      quantity: 1,
      materialCost: 0,
      rooferCost: 0
    };

    vm.getMaterialInfo = material => {
      let materialInfo = JSON.parse(material);
      if (material) {
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
        $("a.item-selected span").removeClass("glyphicon glyphicon-remove");
        $("a.item-selected span").addClass("fas fa-times mr-3");
      }
    };

    vm.QtyChange = (val, data) => {
      let material = JSON.parse(data);
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

    vm.materialCombination = material => {
      let data = JSON.parse(material);
      console.log("material--", data);
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

    vm.fileUpdated = (files, event, model) => {
      let fileObj = event.target.files;
      vm.fileNames = Object.keys(fileObj).map(x => fileObj[x].name);
      angular.forEach(files, function(x, index) {
        x.description = "";
      });
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
        unit: vm.selectedUnit,
        comboMaterialList: cmList,
        files: vm.inputImg
      };

      apiFactory
        .getSystemTag()
        .then(resp => {
          data.systemTag = resp.data.comboTag;
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
