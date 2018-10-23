(() => {
  angular
    .module("app")
    .controller("comboMaterialViewCtrl", comboMaterialViewCtrl);

  function comboMaterialViewCtrl(
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
    
    vm.editFlag = false
    vm.comboId = $stateParams.id;
    vm.mUnits = globals.mUnits;
    vm.removedFiles = [];
    vm.comboMaterialList = [];
    vm.materialTotal = 0;
    vm.rooferTotal = 0

    function getComboMatDetail() {
      apiFactory.getComboMaterialById(vm.comboId).then(resp => {
        vm.comboData = resp.data.data;
        vm.comboMmatrialName = vm.comboData.name
        vm.description = vm.comboData.description
        vm.uom = vm.comboData.unit
        
        console.log(vm.comboData)
        angular.forEach(vm.comboData.comboMaterialList, function (item) {
          vm.materialCost = item.materialId.currentRate.materialCost.value * item.quantity;
          vm.materialTotal = vm.materialTotal + vm.materialCost
          vm.rooferCost = item.materialId.currentRate.rooferCost.value * item.quantity;
          vm.rooferTotal = vm.rooferTotal + vm.rooferCost
        });
        console.log(vm.comboData);
        $timeout(imgSlider, 1500);
      }).catch(e => {
        console.log(e);
      });
    }
    getComboMatDetail()

    vm.removeImg = (img) => {
      vm.removedFiles.push(vm.matrialData.files[img]._id)
      vm.matrialData.files.splice(img, 1)
    }

    vm.editComboMaterialList = (item) => {
      vm.materialList = vm.comboData.comboMaterialList[item]
      vm.materialQty = vm.materialList.quantity
      vm.selectedMaterialCost = vm.materialQty * vm.materialList.materialId.currentRate.materialCost.value
      vm.selectedMaterialRooferCost = vm.materialQty * vm.materialList.materialId.currentRate.rooferCost.value
      if (vm.materialList.percentageAdditions.length != 0 && vm.materialList.percentageAdditions.length != undefined) {
        vm.percentageAddition = vm.materialList.percentageAdditions
      } else {
        vm.percentageAddition = []
      }
      vm.materialIndex = item
      $('#editComboMaterial').modal('show');
      if(item == 'new') {
        $('#editComboMaterial .modal-header h5').text('Add Combo Material Details');
      } else {
        $('#editComboMaterial .modal-header h5').text('Update Combo Material Details');
      }
    }

    vm.addPercentageValue = () => {
      vm.percentageAddition.push({
        percentageType: "",
        value: ""
      });
    };
    vm.removePercentageAddition = index => {
      vm.percentageAddition.splice(index, 1);
    };

    vm.fileUpdated = (files, event) => {
      let fileObj = event.target.files;
      vm.fileNames = Object.keys(fileObj).map(x => fileObj[x].name);
    };
    
    vm.tabChange = (val, flag) => {
      if (val == 1) {
        if (!vm.editComboMaterial.name) {
          Notification.error("Please enter material name");
        } else if (!vm.selectedUnit) {
          Notification.error("Please select material unit");
        /* } else if (!vm.editComboMaterial.description) {
          Notification.error("Please enter description"); */
        } else {
          nextPrevTab(val)
        }
      } else if (val == 2) {
        if (vm.comboMaterialList.length == 0 && vm.editComboMaterial.comboMaterialList.length == 0) {
          Notification.error("Please add Combination list");
        } else {
          nextPrevTab(val)
        }
      } else {
        nextPrevTab(val);
      }
      function nextPrevTab(val) {
        $(".dcp_modal .nav-tabs li .nav-link").removeClass("active");
        $(".dcp_modal .nav-tabs li .nav-link").eq(val).addClass("active");
        
        $(".dcp_modal .tab-content .tab-pane").removeClass("active");
        $(".dcp_modal .tab-content .tab-pane").removeClass("show");
        $(".dcp_modal .tab-content .tab-pane").eq(val).addClass("show");
        $(".dcp_modal .tab-content .tab-pane").eq(val).addClass("active");
      }

    };

    vm.editCombo = (val) => {
      if (val == 1) { // edit Material
        vm.editFlag = true
        vm.editComboMaterial = angular.copy(vm.comboData)
        vm.selectedUnit = vm.editComboMaterial.unit
        
        $('#todo_modal.dcp_modal').modal('show')
        /* $('.materialDetail textarea, .materialDetail input, .materialDetail select').attr('disabled', false)
        console.log(vm.comboData.comboMaterialList) */
      } else if (val == 2) {
        $('.materialDetail textarea, .materialDetail input, .materialDetail select').attr('disabled', true)
        vm.editFlag = false

        var comboListData = {
          comboListArray: vm.comboData.comboMaterialList
        };

        var comboMaterialData = {
          name: vm.comboMmatrialName,
          description: vm.description,
          unit: vm.uom,
          // removedFiles: $scope.removedFiles,
          files: vm.inputFiles
        };
        console.log(comboListData)

        apiFactory.updateComboMaterialList(vm.comboData._id, comboListData).then(resp => {
          console.log(resp);

          apiFactory.updateComboMaterial(vm.comboData._id, comboMaterialData).then(resp => {
            console.log(resp);
            Notification.success(resp.data.message);
            getComboMatDetail()
            vm.fileNames = []
            $timeout(imgSlider, 1000);
          }).catch(e => {
            console.log(e);
          });

        }).catch(e => {
          console.log(e);
        });

        // var comboMaterialData = {
        //   name: $scope.rateAnalysisOBJ.name,
        //   description: $scope.rateAnalysisOBJ.description,
        //   unitSymbol: $scope.rateAnalysisOBJ.unitSymbol,
        //   removedFiles: $scope.removedFiles,
        //   files: vm.newFiles
        // };
      }
    }

    vm.updateCombo = (item, data) => {
      vm.comboData.comboMaterialList[item].quantity = vm.materialQty
      vm.comboData.comboMaterialList[item].percentageAdditions = data
      console.log(vm.comboData.comboMaterialList[item].percentageAdditions)
      $('#editComboMaterial').modal('hide')
    }

    function imgSlider() {
      $("#comboCarousel").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 75,
        itemMargin: 5,
        asNavFor: "#comboSlider"
      });

      $("#comboSlider").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#comboCarousel"
      });
    }

    apiFactory
      .listAllMaterials()
      .then(resp => {
        vm.allmaterilaList = resp.data.list;
        vm.comboList = {
          quantity: 1,
          materialCost: 0,
          rooferCost: 0
        };
      })
      .catch(e => {
        console.log(e);
      });
    // material on change function
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

    vm.removeMateril = (item,flag) => {
      if(flag == 'new') {
        vm.comboMaterialList.splice(item, 1);
      } else {
        vm.editComboMaterial.comboMaterialList.splice(item, 1)
      }
    };
  }
})();
