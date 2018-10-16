(() => {
  angular.module("app").controller("equipmentCtrl", equipmentCtrl);

  function equipmentCtrl(
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

    $scope.equipment = [
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Car', tag: 'NR. 99' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Car', tag: 'NR. 99' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Car', tag: 'NR. 99' },
      { img: '/assets/images/equipment.png', title: 'Equipment ABC', subtitle: 'EQ - 1234', work: 'Worker ID', tag: 'NNS1 - Kim Mosegaard' }
    ]
    $scope.img_upload = [
      { img: '/assets/images/equipment3.png' },
      { img: '/assets/images/equipment3.png' },
      { img: '/assets/images/equipment3.png' }
    ]
    $scope.equipdocuments = [
      { img: '/assets/images/pdf.png', type: 'Document_1.pdf' },
      { img: '/assets/images/pdf.png', type: 'Document_2.pdf' },
      { img: '/assets/images/pdf.png', type: 'Document_3.pdf' }
    ]

    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }
    $(".payrollMenu").hide();
    /* Get project list */

    vm.userData = userStore.get();

    vm.logout = () => {
      logout();
    };

    $(".materialList").DataTable();
    apiFactory
      .listAllEquipments()
      .then(resp => {
        vm.equipment = resp.data.list;
      })
      .catch(e => {
        console.log(e);
      });

    /* Data table setup **************************/
    vm.dtOptions = {
      paging: false,
      info: false,
      ordering: false
    };
    $(".equipmentList").DataTable();

    $scope.activeJustified = 0;

    vm.currentPage = 1;

    vm.toggleObj = {
      systemTag: true,
      materialCost: false,
      rooferCost: false,
      createdAt: false,
      name: false
    };
    vm.searchText = "";
    vm.sortEquipment = type => {
      /* For toggling ascending and descending order */
      vm.toggleObj[type] === undefined
        ? (vm.toggleObj[type] = true)
        : (vm.toggleObj[type] = !vm.toggleObj[type]);

      apiFactory
        .listAllEquipments({
          page: 1,
          chunk: 10,
          sort: type,
          search: vm.searchText,
          sortType: vm.toggleObj[type]
        })
        .then(resp => {
          vm.equipment = resp.data.list;
          vm.equipmentCount = resp.data.total;
          $timeout(() => {
            $("#equipmentPagination").pagination({
              items: vm.equipmentCount,
              itemsOnPage: 10,
              cssStyle: "light-theme",
              hrefTextPrefix: "#",
              ordering: false,
              currentPage: 1,
              onPageClick: function(page, event) {
                event.preventDefault();
                apiFactory
                  .listAllEquipments({
                    page: page,
                    chunk: 10,
                    sort: type,
                    sortType: vm.toggleObj[type]
                  })
                  .then(resp => {
                    vm.equipment = resp.data.list;
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

    vm.searchEquipment = text => {
      apiFactory
        .listAllEquipments({
          page: 1,
          chunk: 10,
          search: text,
          sort: "createdDate",
          sortType: false
        })
        .then(resp => {
          vm.equipment = resp.data.list;
          vm.equipmentCount = resp.data.total;
          $timeout(() => {
            $("#equipmentPagination").pagination({
              items: vm.equipmentCount,
              itemsOnPage: 10,
              cssStyle: "light-theme",
              hrefTextPrefix: "#",
              ordering: false,
              currentPage: 1,
              onPageClick: function(page, event) {
                event.preventDefault();
                apiFactory
                  .listAllEquipments({
                    page: page,
                    chunk: 10,
                    sort: type,
                    sortType: vm.toggleObj[type]
                  })
                  .then(resp => {
                    vm.equipment = resp.data.list;
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

    /* Initially getting the values of material and combo materials */
    vm.sortEquipment("createdAt");
    /* End of  Data table setup **********************/

    /* Add material functionality */

    vm.addMaterial = {
      conversionFactor: 1
    };

    vm.tabSettings = {
      disable: true
    };

    apiFactory
      .getCompanyById(vm.userData.companyId)
      .then(resp => {
        vm.companyData = resp.data;
        vm.addMaterial.currency = vm.companyData.currentCurrency.currencyCode;
      })
      .then(e => {
        console.log(e);
      });

    vm.showConversionRate = (from, to) => {
      let currencyData = {
        from,
        to
      };
      apiFactory
        .showConversionRate(currencyData)
        .then(resp => {
          vm.addMaterial.conversionFactor = resp.data.conversionFactor;
        })
        .catch(e => {
          console.log(e);
        });
    };

    vm.mUnits = globals.mUnits;

    globals.getCurrency().then(resp => {
      vm.currencies = resp.data;
    });

    vm.tabStyle = () => {
      if (
        vm.addMaterial.materialName !== undefined &&
        vm.addMaterial.materialName !== " "
      ) {
        if (
          vm.addMaterial.materialUnit !== undefined &&
          vm.addMaterial.materialUnit !== " "
        ) {
          if (
            vm.addMaterial.currency !== undefined &&
            vm.addMaterial.currency !== ""
          ) {
            if (
              vm.addMaterial.conversionFactor !== undefined &&
              vm.addMaterial.conversionFactor !== ""
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
        vm.addMaterial.materialUnit == undefined ||
        vm.addMaterial.materialUnit == " "
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
        unit: vm.addMaterial.materialUnit,
        equipmentCosts: {
          value: vm.changeCost(
            vm.addMaterial.equipmentCostValue,
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
        .createEquipment(formData)
        .then(resp => {
          $("#addEquipments").modal("hide");
          Notification.success(resp.data.message);
          vm.sortEquipment("createdAt");

          vm.addMaterial = {
            conversionFactor: 1
          };
        })
        .catch(e => {
          console.log(e);
        });
    };
  }
})();
