angular.module("routesModule", []).config(routeConfig);

function routeConfig($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider.state("preLogin", {
    url: "/",
    templateUrl: "/partials/preLogin.html",
    controller: "preLoginCtrl as vm"
  });

  $stateProvider.state("dashboard", {
    url: "/dashboard",
    templateUrl: "/partials/dashboard.html",
    controller: "dashboardCtrl as vm"
  });

  /* $stateProvider.state("dashboard_old", {
    url: "/dashboard_old",
    templateUrl: "/partials/dashboard_old.html",
    controller: "dashboardCtrl as vm"
  }); */

  $stateProvider.state("createProject", {
    url: "/create_project",
    templateUrl: "/partials/createProject.html",
    controller: "createProjectCtrl as vm"
  });

  $stateProvider.state("visualPlanner", {
    url: "/visual_planner",
    templateUrl: "/partials/visualPlanner.html",
    controller: "visualPlannerCtrl as vm"
  });

  $stateProvider.state("projects", {
    url: "/projects",
    templateUrl: "/partials/projects.html",
    controller: "projectCtrl as vm"
  });

  $stateProvider.state("materials", {
    url: "/materials",
    templateUrl: "/partials/materials.html",
    controller: "materialCtrl as vm"
  });

  $stateProvider.state("materialView", {
    url: "/material/:id",
    templateUrl: "/partials/materialView.html",
    controller: "materialViewCtrl as vm"
  });

  $stateProvider.state("comboMaterialView", {
    url: "/combo_material/:id",
    templateUrl: "/partials/comboMaterialView.html",
    controller: "comboMaterialViewCtrl as vm"
  });

  $stateProvider.state("equipments", {
    url: "/equipments",
    templateUrl: "/partials/equipments.html",
    controller: "equipmentCtrl as vm"
  });

  $stateProvider.state("fileManager", {
    url: "/file_manager",
    templateUrl: "/partials/fileManager.html",
    controller: "fileManagerCtrl as vm"
  });

  $stateProvider.state("payroll", {
    url: "/payroll",
    templateUrl: "/partials/payroll.html",
    controller: "payrollCtrl as vm"
  });

  $stateProvider.state("calculation", {
    url: "/calculation",
    templateUrl: "/partials/calculation.html",
    controller: "calculationCtrl as vm"
  });

  $stateProvider.state("report", {
    url: "/report",
    templateUrl: "/partials/reports.html",
    controller: "reportsCtrl as vm"
  });

  $stateProvider.state("issues", {
    url: "/issues",
    templateUrl: "/partials/issues.html",
    controller: "issuesCtrl as vm"
  });
  $stateProvider.state("issuesDetail", {
    url: "/issues_details/:id",
    templateUrl: "/partials/issues_details.html",
    controller: "issueDetailCtrl as vm"
  });

  $stateProvider.state("reportsDetail", {
    url: "/reports_details/:id",
    templateUrl: "/partials/reportsdetails.html",
    controller: "reportDetailCtrl as vm"
  });

  $stateProvider.state("billingArchive", {
    url: "/billing_archive",
    templateUrl: "/partials/billingArchive.html",
    controller: "billingArchiveCtrl as vm"
  });

  $stateProvider.state("reportsListing", {
    url: "/reports_listing",
    templateUrl: "/partials/reportsListing.html",
    controller: "reportsListingCtrl as vm"
  });

  $stateProvider.state("3dDashboard", {
    url: "/3d_dashboard",
    templateUrl: "/partials/3d-dashboard.html",
    controller: "_3dDashboardCtrl as vm"
  });

  $stateProvider.state("setPassword", {
    url: "/set_password",
    templateUrl: "/partials/set_password.html",
    controller: "setPasswordCtrl as vm"
  });
  $stateProvider.state("setting", {
    url: "/setting",
    templateUrl: "/partials/setting.html",
    controller: "settingCtrl as vm"
  });

  $stateProvider.state("employees", {
    url: "/employees",
    templateUrl: "/partials/employee.html",
    controller: "employeesCtrl as vm"
  });

  $stateProvider.state("3dviewer", {
    url: "/3dviewer",
    templateUrl: "/partials/3d-viewer.html",
    controller: "_3dviewerCtrl as vm"
  });

  $stateProvider.state("clients", {
    url: "/clients",
    templateUrl: "/partials/clients.html",
    controller: "clientsCtrl as vm"
  });

  $stateProvider.state("supplier", {
    url: "/supplier",
    templateUrl: "/partials/supplier.html",
    controller: "supplierCtrl as vm"
  });
  $stateProvider.state("supplierDetail", {
    url: "/supplier_details/:id",
    templateUrl: "/partials/supplierdetails.html",
    controller: "supplierDetailCtrl as vm"
  });

  $stateProvider.state("subcontractor", {
    url: "/subcontractor",
    templateUrl: "/partials/subcontractor.html",
    controller: "subcontractorCtrl as vm"
  });

  $stateProvider.state("subcontractorDetail", {
    url: "/subcontractor_details/:id",
    templateUrl: "/partials/subcontractordetails.html",
    controller: "subcontractorDetailCtrl as vm"
  });
}
