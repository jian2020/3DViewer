(() => {
  angular.module("app").controller("materialViewCtrl", materialViewCtrl);

  function materialViewCtrl(
    $scope,
    $timeout,
    authFactory,
    $state,
    $stateParams,
    apiFactory,
    Notification,
    globals,
    $location,
    Upload
  ) {
    /* Requiring vars */
    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }

    /* Get project list */
    vm.userData = userStore.get();
    vm.logout = () => {
      logout();
    };

    vm.materialId = $stateParams.id;
    vm.mUnits = globals.mUnits;
    globals.getCurrency().then(resp => {
      vm.currencies = resp.data;
      vm.loadCurrencies = $query => {
        return new Promise((resolve, reject) => {
          resolve(resp.data);
        });
      };
    });

    vm.showConversionRate = (from, to) => {
      $(".loader").show();
      let currencyData = {
        from,
        to
      };
      if (from) {
        apiFactory
          .showConversionRate(currencyData)
          .then(resp => {
            vm.editMaterial.conversionFactor = resp.data.conversionFactor;
            $timeout(function () {
              $(".loader").hide();
            }, 500);
          })
          .catch(e => {
            console.log(e);
          });
      }
      
    };

    vm.tabChange = (val) => {
      if (!vm.editMaterial.name) {
        Notification.error("Please enter material name");
      } else if (!vm.selectedUnit) {
        Notification.error("Please select material unit");
      } else if (!vm.editMaterial.currency) {
        Notification.error("Please select currency");
      } else {
        $(".material_modal .nav-tabs li .nav-link").removeClass("active");
        $(".material_modal .nav-tabs li .nav-link").eq(val).addClass("active");

        $(".material_modal .tab-content .tab-pane").removeClass("active");
        $(".material_modal .tab-content .tab-pane").removeClass("show");
        $(".material_modal .tab-content .tab-pane").eq(val).addClass("show");
        $(".material_modal .tab-content .tab-pane").eq(val).addClass("active");
      }
    };

    vm.editFlag = false;
    vm.removedFiles = [];
    $scope.getMatDetail = () => {
      apiFactory
        .getMaterialById(vm.materialId)
        .then(resp => {
          vm.matrialData = resp.data;
          vm.matrialName = vm.matrialData.name;
          vm.matrialUnit = vm.matrialData.unit;
          console.log(vm.matrialData)
          vm.matrialCost = Number(
            vm.matrialData.currentRate.materialCost.value
          ).toFixed(2);
          vm.matrialCurrencyCode =
            vm.matrialData.currentRate.materialCost.currencyCode;
          vm.matrialRooferCost = Number(
            vm.matrialData.currentRate.rooferCost.value
          ).toFixed(2);
          vm.matrialRooferCurrencyCode =
            vm.matrialData.currentRate.rooferCost.currencyCode;
          vm.matrialCreatedBy = vm.matrialData.providerData.updatedBy.name;
          vm.matrialCreatedAt = vm.matrialData.createdAt;
          vm.matrialUpdatedAt = vm.matrialData.createdAt;
          $scope.gray_box = [
            { 'img': '/assets/images/Unit-Icon.png', 'title': 'Unit', 'value': vm.matrialUnit },
            { 'img': '/assets/images/Dollar-Icon.png', 'title': 'Material Cost', 'value': vm.matrialCost, 'currencyCode': vm.matrialCurrencyCode },
            { 'img': '/assets/images/Dollar-Icon.png', 'title': 'Roofer Cost', 'value': vm.matrialRooferCost, 'currencyCode': vm.matrialRooferCurrencyCode }
          ]
        })
        .catch(e => {
          console.log(e);
        });
    }
    $scope.getMatDetail();

    vm.removeImg = img => {
      vm.removedFiles.push(vm.matrialData.files[img]._id);
      vm.editMaterial.files.splice(img, 1);
    };
    
    vm.editMaterialFunction = val => {
      if (val == 1) {
        // edit Material
        vm.editFlag = true;
        vm.editMaterial = angular.copy(vm.matrialData)
        vm.selectedUnit = vm.editMaterial.unit
        vm.currentCurrency = vm.editMaterial.currentRate.rooferCost.currencyCode
        vm.editMaterial.currency = vm.editMaterial.currentRate.rooferCost.currencyCode
        vm.showConversionRate(vm.currentCurrency, vm.editMaterial.currency)
        console.log(vm.editMaterial)
        $('#todo_modal.material_modal').modal('show')
        // $(".materialDetail input, .materialDetail select").attr("disabled", false );
      } else if (val == 2) {
        // update Material
        vm.editFlag = false;
        var materialupdatedata = {
          name: vm.editMaterial.name,
          unit: vm.selectedUnit,
          removedFiles: vm.removedFiles,
          currentRate: {
            materialCost: {
              value: vm.editMaterial.currentRate.materialCost.value,
              currencyCode: vm.editMaterial.currency //$scope.checkNull($scope.materialObj.materialCostcurrencyCode)["cc"]
            },
            rooferCost: {
              value: vm.editMaterial.currentRate.rooferCost.value,
              currencyCode: vm.editMaterial.currency //$scope.checkNull($scope.materialObj.rooferCostcurrencyCode)["cc"]
            }
          },
          file: vm.inputFiles
        };
        apiFactory
          .updateMaterialById(vm.materialId, materialupdatedata)
          .then(resp => {
            Notification.success(resp.data.message);
            $('#todo_modal.material_modal').modal('hide')
            $scope.getMatDetail();
            vm.fileNames=[];
          })
          .catch(e => {
            console.log(e);
          });
      }
    };

    vm.fileUpdated = (files, event) => {
      let fileObj = event.target.files;
      vm.fileNames = Object.keys(fileObj).map(x => fileObj[x].name);
    };

    function imgSlider() {
      $("#carousel").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 75,
        itemMargin: 5,
        asNavFor: "#slider"
      });

      $("#slider").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel"
      });
    }

    $scope.mat_headers = [
      { mat_head: 'S. No.' },
      { mat_head: 'Date' },
      { mat_head: 'Material Cost' },
      { mat_head: 'Worker Cost' }
    ]
    $scope.mat_items = [
      { s_no: '1', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '2', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '3', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '4', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '5', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '6', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '7', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '8', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '9', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '10', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '11', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' },
      { s_no: '12', date: 'Sep 25, 2018', m_cost: '200 DKK', w_cost: '200 DKK' }
    ]


  }
  
  
})();
