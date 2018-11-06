(() => {
  angular.module("app").controller("calculationCtrl", calculationCtrl);

  function calculationCtrl(
    $scope,
    $timeout,
    $location,
    authFactory,
    $state,
    apiFactory,
    Notification,
    globals
  ) {
    /* Requiring vars */
    let vm = this;
    const { logout, userStore } = globals;
    if (!authFactory.checkUser()) {
      logout();
      return;
    }
    $scope.isEdit=false;

    /* Get project list */
    vm.userData = userStore.get();
    vm.logout = () => { logout(); };
    $scope.outerIndex=0;
    $scope.innerIndex=0;
    $scope.outInn=0;
    $scope.tableInventory=[];
    $scope.Inventory = [];
    $scope.materialList = [];
    $scope.entityType = 1;
    apiFactory
      .listAllMaterials()
      .then(resp => {
        $scope.materialList = resp.data.list;
        $scope.selectedMaterial = angular.copy($scope.materialList[0]);
      })
      .catch(e => {});

    // get DCP List
    $scope.dcpList = [];
    apiFactory
      .listAllComboMaterials()
      .then(resp => {
        $scope.dcpList = resp.data.list;
      })
      .catch(e => {});

    // get Equioment List
    $scope.equipmentList = [];
    apiFactory
      .listAllEquipments()
      .then(resp => {
        $scope.equipmentList = resp.data.list;
      })
      .catch(e => {});

      $scope.materialSelection = item => {
        $scope.selectedMaterial = item;
        
      };

      $scope.assignInventory=function(){
        $("#loadInventories").modal("hide");
        $("#addquantity").modal("show");
        
       // $scope.Inventory.push($scope.selectedMaterial);
      };

      $scope.users=[{ 
        "John":[{"salary":"15K","year":"2013"},{"salary":"20K","year":"2014"}]
       },{
        "Ben":[{"salary":"17K","year":"2013"},{"salary":"20K","year":"2014"},{"salary":"25K","year":"2014"}]
        }];

      vm.addQuantity=function(quantity){
        $("#addquantity").modal("hide");
       
      $scope.selectedMaterial.Quantity=quantity;
      $scope.Inventory[$scope.innerIndex]=$scope.selectedMaterial;
      $scope.tableInventory[$scope.outerIndex]=$scope.Inventory;
        $scope.innerIndex=$scope.innerIndex+1;
      //  $scope.outInn=$scope.outInn+1;
         console.log("inventory: ",$scope.Inventory);
         console.log("tableinventory: ",$scope.tableInventory);
      //   console.log("index: ",$scope.innerIndex);

      };
    $('.payrollList').DataTable();
   
   
    
  $scope.headers=[
    {name:'No'},
    {name:'Material Name'},
    {name:'Add on'},
    {name:'Add on'},
    {name:'Unit'},
    {name:'Quanity'},
    {name:'Cost'},
    {name:'Materials cost'},
    {name:'Total cost'},
    {name:'Profit'},
    {name:'%'},
    {name:'Sales price'},
    {name:'Labor cost'},
    {name:'Labor sum'},
    {name:'Action'}
  ]

  $scope.items=[
    {no:'1.1',location:'Safety staircase',adon1:'',adon2:'',unit:'psc',quantity:'4',cost:'6,500.00kr',m_cost:'6,500.00kr'
    ,t_cost:'6,500.00kr',profit:'6,500.00kr',perc:'70%',s_price:'6,500.00kr',l_cost:'6,500.00kr',l_sum:'6,500.00kr'},
    {no:'1.2',location:'Setup and Clearsite',adon1:'',adon2:'',unit:'m2',quantity:'10',cost:'3,500.00kr',m_cost:'3,500.00kr'
    ,t_cost:'3,500.00kr',profit:'3,500.00kr',perc:'80%',s_price:'3,500.00kr',l_cost:'3,500.00kr',l_sum:'3,500.00kr'},
    {no:'1.3',location:'Safety',adon1:'',adon2:'',unit:'pcs',quantity:'400',cost:'0.00kr',m_cost:'0.00kr'
    ,t_cost:'0.00kr',profit:'0.00kr',perc:'10%',s_price:'0.00kr',l_cost:'0.00kr',l_sum:'0.00kr'},
    {no:' ',location:'Total',adon1:'',adon2:'',unit:' ',quantity:' ',cost:'3,500.00kr',m_cost:'3,500.00kr'
    ,t_cost:'3,500.00kr',profit:'3,500.00kr',perc:'80%',s_price:'3,500.00kr',l_cost:'3,500.00kr',l_sum:'3,500.00kr'}
  ]




  $scope.material_dcp=[
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'},
    {img:'img/dcp-img.png',title:'DCP ABC',date:'Sep 25, 2018 at 4:00 PM',m_cost:'MATERIAL COST',m_price:'200 DKK',w_cost:'WORKER COST',w_price:'200 DKK',red_txt:'DCP - 1234'}
  ]

  
  // $scope.functioncallBefore = function(){
   
  //   $scope.tableInventory.push($scope.Inventory);
  //   console.log($scope.tableInventory);
   
  // };
  // $scope.functioncallBefore();
  $( document ).ready(function() {

    $('#button_left').hide();
    
});
  $scope.leftClick = function(){
    if($('.example-one-header').scrollLeft() <= 100 )
    {$('#button_left').hide()}
    $('#button_right').show();
    $('.example-one-header').animate({
      scrollLeft: "-=100px"
    }, "slow");
  };
  $scope.rightClick = function(){
    if ($('.example-one-header').scrollLeft() >= 200)
    {$("#button_right").hide()}
  $('#button_left').show(); 
    $('.example-one-header').animate({
      scrollLeft: "+=100px"
    }, "slow");
  };

  vm.deleteInventory=function(index,array){
    array.splice(index, 1);
  };

  vm.editInventory = function(index,item){
    $scope.isEdit=true;
  //  $scope.updateToInventory=item;
  //  $scope.selectedIndex=index;
  //   $("#updatequantity").modal("show");
  };

  vm.updateQuantity=function(quantity){
    $("#updatequantity").modal("hide");
  };

  $scope.addProjectPlan = function(){
   // $("#calc-table-header").clone().appendTo("#calc-table");
   $scope.outerIndex=$scope.outerIndex+1;
   $scope.innerIndex=0;
   $scope.Inventory=[];
   console.log("outinn");
  }

  }
})();
