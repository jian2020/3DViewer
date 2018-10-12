(() => {
    angular.module("app").controller("subcontractorCtrl", subcontractorCtrl);

    function subcontractorCtrl(
        $scope,
        $timeout,
        authFactory,
        $state,
        apiFactory,
        Notification,
        NgMap,
        globals,
        localStorageService,
      ) {
        let vm = this;

        vm.selectedMaterials=[];
        vm.members2=[];
        const { logout,debounce, userStore } = globals;
        if (!authFactory.checkUser()) {
          logout();
        }

          /**Get all suppliersdata */
          vm.getSubcontractors = (type) => {
            /* For toggling ascending and descending order */
           
              apiFactory
              .getAllSubcontractors({
                page: 1,
                chunk: 10,
                sort: type,
               // search: vm.searchText,
               // sortType: vm.toggleObj[resource][type]
              })
              .then(resp => {
                // vm[resource]= resp.data.list;
                // vm[resource + "Count"] = resp.data.total;
                vm.allSubcontractor = resp.data.list;
                vm.subcontractorsCount = resp.data.total;
                console.log("suppliers are:",vm.allSubcontractor);
                $timeout(() => {
                 // $scope.searchingText= false;
                  $("#pagination").pagination({
                    items: vm.subcontractorsCount,
                    itemsOnPage: 10,
                    cssStyle: "light-theme",
                    hrefTextPrefix: "#",
                    ordering: false,
                    currentPage: 1,
                   
                    onPageClick: function(page, event) {
                      event.preventDefault();
                      apiFactory
                        .getAllSubcontractors({
                          page: page,
                          chunk: 10,
                          // sort: type,
                          // sortType: vm.toggleObj[type]
                        })
                        .then(resp => {
                          vm.allSubcontractor = resp.data.list;
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
          /* Initially sort issue in descending order */
         vm.getSubcontractors("created");

         //next and previous button functions
         vm.addSubcontractorNext = () => {
          if($('#home').hasClass('active')){
            console.log("home");
           $('#navigation ul li a.active').removeClass("active");
           $('#profile-tab').addClass("active");
           $('#home').removeClass("show");
           $('#home').removeClass("active");
           $('#profile').addClass("show");
           $('#profile').addClass("active");
          }else if($('#profile-tab').hasClass('active')){
            console.log("profile");
            $('#navigation ul li a.active').removeClass("active");
            $('#contact-tab').addClass("active");
            $('#profile').removeClass("show");
            $('#profile').removeClass("active");
            $('#contact').addClass("show");
            $('#contact').addClass("active");
          }
         
        };
       

        vm.addSubcontractorPrevious=()=>{
          if($('#profile-tab').hasClass('active')){
            console.log("home");
           $('#navigation ul li a.active').removeClass("active");
           $('#home').addClass("active");
           $('#profile').removeClass("show");
           $('#profile').removeClass("active");
           $('#home').addClass("show");
           $('#home').addClass("active");
          }else if($('#contact-tab').hasClass('active')){
            console.log("profile");
            $('#navigation ul li a.active').removeClass("active");
            $('#profile-tab').addClass("active");
            $('#contact').removeClass("show");
            $('#contact').removeClass("active");
            $('#profile').addClass("show");
            $('#profile').addClass("active");
          }
         
        };
        //delete material from list
        $scope.deleteMaterial = function(index,array){
        array.splice(index, 1);
       }

       $scope.deleteStaff = function(index,array){
        array.splice(index, 1);
       }

        /**Insert functions */
         /**Insert Supplier functions */
         $scope.onChange = function (files) {
          
          if(files[0] == undefined) return;
          $scope.FILEIMG = URL.createObjectURL(files[0]);
          $scope.fileExt = files[0].name.split(".").pop();
          
          
        }

        globals.getCountryCode().then(resp => {
          vm.getCountryCode = resp.data;
         
          vm.loadCountryCode = $query => {
            return new Promise((resolve, reject) => {
              resolve(resp.data);
            });
          };
        });

        apiFactory.listAllMaterials().then(resp => {
          vm.allMaterials = resp.data.list;
          
        });

        vm.addMaterial = function(item){
          vm.selectedMaterials.push(item);
        
        }

        vm.addMember = function(name){
          vm.members2.push(name);
         
        }


        $scope.createSubcontractor = function(subcontractor){
          subcontractor.supplies=[];subcontractor.staff=[];
          console.log("subcontractor",subcontractor);
          if(vm.selectedMaterials.length>0){
            vm.selectedMaterials.forEach(element=>{
              subcontractor.supplies.push(element._id);
            });
          }
          if(vm.members2.length>0){
            vm.members2.forEach(element=>{
              subcontractor.staff.push(element);
            });
          }
          console.log("subcontractor",subcontractor);
          apiFactory
          .createNewSubcontractor(subcontractor)
          .then(resp => {
            Notification.success("Sub-contractor has been saved successfully");
            vm.supplier={};
            vm.selectedMaterials=[];
            vm.mambers2=[];
            $scope.inputFiles = [];
            subcontractor.supplies=[];
            subcontractor.staff=[];
            
            $('#sub-contractor_modal').modal('hide');
            vm.getSubcontractors("created");
          })
          .catch(e => {
            console.log(e);
            // vm.supplier={};
            // vm.selectedMaterials=[];
            // vm.mambers2=[];
            // $scope.inputFiles = [];
            // supplier.supplies=[];
            // supplier.staff=[];
            Notification.error("Something went wrong");
          });
          
        }

        $scope.contracts=[
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'},
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'},
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'},
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'},
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'},
          {title:'Subcontractor A',time:'Sep 25, 2018 at 4:00 PM',img:'assets/images/suppliers/tree_logo.png'}
        ]
    }

    })();