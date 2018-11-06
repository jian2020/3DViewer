(() => {
  angular.module("app").controller("issuesCtrl", issuesCtrl);

  function issuesCtrl(
    $scope,
    $rootScope,
    $timeout,
    authFactory,
    $state,
    $q,
    apiFactory,
    Notification,
    globals,
    fileManagerFactory,
    Upload,
    localStorageService,
    uploadFactory
  ) {
    let vm = this;
    vm.backImg;
    const { logout, userStore, debounce } = globals;
    vm.UploadFiles = [];
    vm.issueData = {};
    $scope.issueModel = {};
    $scope.file;
    $scope.comment = "";
    //   $scope.inputFiles = [];
    $scope.openEdit = false;
    $scope.filesToRemove = [];
    $scope.isSelectedBtn = false;
    $scope.updateform = false;
    $scope.UndoArray = [];
    $scope.redoArray = [];
    vm.planToMark = [];
    vm.LocalImgs = [];
    // const { logout } = globals;
    $scope.searchingText = false;
    $scope.openFillColor = false;
    //color picker variables
    $scope.colorpick = "#0000ff";
    $scope.colorWell;
    $scope.fillWell;
    $scope.fillColor = "transparent";
    $scope.textForm = false;
    $scope.canvas = document.getElementById("slideCanvas");
    vm.errorImage = "assets/images/enduserissue.png";
    $scope.btnMarker = "../assets/images/gps.png";
    $scope.btnCircle = "../assets/images/circle-shape-outline.png";
    $scope.btnLine = "../assets/images/lineicon.png";
    $scope.btnText = "../assets/images/text-option-interface-symbol.png";

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
    vm.uploadImg = [];
    vm.inputFiles = [];
    vm.uploadFiles = [];

    /* Data table setup **************************/
    $(".issuesList").DataTable();
    $scope.activeJustified = 0;

    vm.currentPage = 1;

    vm.toggleObj = {
      toggleIssue: {
        systemTag: false,
        title: false,
        description: false,
        projectName: false,
        created: true
      }
    };
    vm.searchText = "";
    vm.sortissues = (type, resource) => {
      /* For toggling ascending and descending order */
      vm.toggleObj[resource][type] === undefined
        ? (vm.toggleObj[resource][type] = true)
        : (vm.toggleObj[resource][type] = !vm.toggleObj[resource][type]);
      apiFactory
        .listAllIssues({
          page: 1,
          chunk: 10,
          sort: type,
          search: vm.searchText,
          sortType: vm.toggleObj[resource][type]
        })
        .then(resp => {
          // vm[resource]= resp.data.list;
          // vm[resource + "Count"] = resp.data.total;
          vm.allIssues = resp.data.list;
          console.log("all issues", vm.allIssues);
          vm.issueCount = resp.data.total;
          $timeout(() => {
            $scope.searchingText = false;
            $("#pagination").pagination({
              items: vm.issueCount,
              itemsOnPage: 10,
              cssStyle: "light-theme",
              hrefTextPrefix: "#",
              ordering: false,
              currentPage: 1,
              onPageClick: function(page, event) {
                event.preventDefault();
                apiFactory
                  .listAllIssues({
                    page: page,
                    chunk: 10,
                    sort: type,
                    sortType: vm.toggleObj[type]
                  })
                  .then(resp => {
                    vm.allIssues = resp.data.list;
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
    vm.searchIssues = text => {
      /**
       * @param {function} fn - pass the function which you want to debounce
       * @param {Array} args - pass the arguments from the view as an array
       */
      searchDebounce(
        () => {
          apiFactory
            .listAllIssues({
              page: 1,
              chunk: 10,
              search: text,
              sort: "created",
              sortType: false
            })
            .then(resp => {
              vm.allIssues = resp.data.list;
              vm.issueCount = resp.data.total;

              $timeout(() => {
                $scope.searchingText = true;
                $("#paging").pagination({
                  items: vm.issueCount,
                  itemsOnPage: 10,
                  cssStyle: "light-theme",
                  hrefTextPrefix: "#",
                  ordering: false,
                  currentPage: 1,

                  onPageClick: function(page, event) {
                    event.preventDefault();
                    apiFactory
                      .listAllIssues({
                        page: page,
                        chunk: 10,
                        sort: type,
                        sortType: vm.toggleObj[resource][type]
                      })
                      .then(resp => {
                        vm.allIssues = resp.data.list;
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
        [text]
      );
    };

    /* Initially sort issue in descending order */
    vm.sortissues("created", "toggleIssue");

    vm.dtOptions = {
      paging: false,
      info: false,
      ordering: false,
      searching: false
    };

    /* End of  Data table setup **********************/

    $scope.issueCategory = ["Safety", "Quality", "Issue"];

    apiFactory.listAllUsers().then(resp => {
      vm.allUsers = resp.data.list;
    });

    apiFactory.listAllRoofers().then(resp => {
      vm.allRoofers = resp.data.list;
    });

    apiFactory.listAllProjects().then(resp => {
      vm.allProjects = resp.data.list;
    });

    apiFactory.getIssuesList().then(resp => {
      vm.listOfIssue = resp.data.list;
    });

    vm.descriptionPopover = (indexVal, type) => {
      $scope.fileType = type;
      $scope.fileIndex = indexVal;
    };
    vm.addDescription = (index, data) => {
      if ($scope.fileType == "image") {
        vm.uploadImg[index].description = data;

        $("#closePopoverImg_" + index).trigger("click");
      } else {
        vm.uploadFiles[index].description = data;

        $("#closePopoverFile_" + index).trigger("click");
      }
    };

    vm.fileAdded = (files, event, modal) => {
      console.log(vm.inputImg);
      let fileObj = event.target.files;
      vm.fileNames = Object.keys(fileObj).map(x => fileObj[x].name);
      angular.forEach(files, function(x, index) {
        x.description = "";
        if (modal == "image") {
          if (vm.uploadImg.length == 0) {
            vm.uploadImg.push(x);
          } else {
            let duplicateImg = false;
            angular.forEach(vm.uploadImg, function(y) {
              if (x.name == y.name) {
                duplicateImg = true;
                return;
              }
            });
            if (!duplicateImg) {
              vm.uploadImg.push(x);
            } else {
              Notification.error("File name already exist");
            }
          }
        } else {
          if (vm.uploadFiles.length == 0) {
            if (/image/.test(x.type)) {
              vm.uploadImg.push(x);
            } else {
              vm.uploadFiles.push(x);
            }
          } else {
            let duplicateImg = false;
            angular.forEach([].concat(vm.uploadFiles, vm.uploadImg), function(
              y
            ) {
              if (x.name == y.name) {
                duplicateImg = true;
                return;
              }
            });
            if (!duplicateImg) {
              if (/image/.test(x.type)) {
                vm.uploadImg.push(x);
              } else {
                vm.uploadFiles.push(x);
              }
            } else {
              Notification.error("File name already exist");
            }
          }
        }
      });
      console.log(vm.uploadImg);
    };

    vm.deleteFile = (indexVal, type) => {
      if (type == "image") {
        vm.uploadImg.splice(indexVal, 1);
      } else {
        vm.uploadFiles.splice(indexVal, 1);
      }
    };

    vm.addIssueDetails = () => {
      if (!vm.issueData.project) {
        Notification.error("Please Select project");
        return;
      } else if (!vm.issueData.category) {
        Notification.error("Please Select issue Category");
        return;
      } else if (!vm.issueData.assignedTo) {
        Notification.error("Please Select assigned user");
        return;
      } else if (!vm.issueData.owner) {
        Notification.error("Please Select issue owner");
        return;
      } else {
        $scope.imgAndFiles = [].concat(vm.uploadImg, vm.uploadFiles);
        console.log($scope.imgAndFiles);
        var formData = {
          title: vm.issueData.title,
          description: vm.issueData.description,
          projectId: vm.issueData.project,
          issueCategory: vm.issueData.category,
          assignedTo: vm.issueData.assignedTo,
          issueStatus: vm.issueData.issueStatus,
          ownerId: vm.issueData.owner,
          dependencyOn: vm.issueData.dependencyOn,
          deadLine: vm.issueData.deadLine,
          files: $scope.imgAndFiles,
          assetObj: $scope.imgAndFiles.map((x, i) => {
            return {
              assetDescription: x.description
            };
          })
        };
        apiFactory
          .createIssue(formData)
          .then(resp => {
            Notification.success(resp.data.message);
            $("#issue_modal").modal("hide");
            $("#issue_marker").modal("show");
            vm.inputImg = [];
            vm.uploadImg = [];
            vm.inputFiles = [];
            vm.uploadFiles = [];
            vm.issueData = {};

            /* Setting below prop true to force decending order on material add instead of toggling states */

            vm.toggleObj.toggleIssue.createdAt = true;
            vm.sortMaterials("createdAt");
          })
          .catch(e => {
            console.log(e);
          });
      }
    };

    vm.updateIssueDetails = formData => {
      var issueObject = {};
      if (vm.updateIssue == undefined) {
        console.log("update issue is undefined");
        issueObject.Title = $scope.issueModel.title;
        issueObject.description = $scope.issueModel.description;
        issueObject.deadLine = $scope.issueModel.deadLine;
        issueObject.issueStatus = $scope.issueModel.issueStatus;
      } else {
        console.log("update isuue is not undfined so in esle case");
        if (vm.updateIssue.title == undefined) {
          issueObject.Title = $scope.issueModel.title;
        } else {
          issueObject.Title = vm.updateIssue.title;
        }
       // $('#issue_modal').modal('hide');
        //$('#issue_marker').modal('show');
      };

      vm.updateIssueDetails = formData => {
       
        var issueObject={};
        if(vm.updateIssue==undefined){
          console.log("update issue is undefined");
          issueObject.Title =  $scope.issueModel.title;
          issueObject.description = $scope.issueModel.description;
        } else {
          issueObject.description = vm.updateIssue.description;
        }
        if (vm.updateIssue.deadLine == undefined) {
          issueObject.deadLine = $scope.issueModel.deadLine;
        } else {
          issueObject.deadLine = vm.updateIssue.deadLine;
        }
        if (vm.updateIssue.issueStatus == undefined) {
          issueObject.issueStatus = $scope.issueModel.issueStatus;
        } else {
          issueObject.issueStatus = vm.updateIssue.issueStatus;
        }
      }

      if ($scope.inputFiles.length > 0) {
        issueObject.files = $scope.inputFiles;
      }
      if ($scope.filesToRemove.length > 0) {
        console.log("files to remove", $scope.filesToRemove);
        issueObject.removedFiles = $scope.filesToRemove;
      }
      console.log("ISUUEOBJECT", issueObject);
      apiFactory
        .updateIssue(issueObject, $scope.issueModel._id)
        .then(resp => {
          Notification.success("Issue has been updated successfully");
          $scope.inputFiles = [];
          $scope.filesToRemove = [];
          $scope.updateform = false;
          $("#issuedetail").modal("hide");
          vm.sortissues("created", "toggleIssue");
        })
        .catch(e => {
          console.log(e);
          $scope.inputFiles = [];
          $scope.filesToRemove = [];
          $scope.updateform = false;
          Notification.error("Something went wrong");
        });
    };

    //reading file images
    $scope.readImg = function(fileImg) {
      var output = document.getElementById("blah");
      output.src = URL.createObjectURL(fileImg);
    };

    $scope.deleteImg = function(index, array) {
      array.splice(index, 1);
    };

    vm.localFiles = [];
    $scope.getFilesFromLocal = function(files) {
      console.log("local files: ", files);
      if (files) {
        apiFactory
          .saveLocalIssueAsset(files)
          .then(resp => {
            console.log("RESP: ", resp);
            resp.data.data.forEach(onefile => {
              //var SRC = URL.createObjectURL(onefile);
              vm.planToMark.push(onefile);
            });
            $("#issue_marker").modal("hide");
            var firstCanvasImg = vm.planToMark.slice(-1);
            $("#carousellist")
              .carousel("pause")
              .removeData();
            $("#carousellist").carousel(vm.planToMark);
          })
          .catch(e => {
            Notification.error(
              "couldnot load images please select images again."
            );
          });

        // $("#slideCanvas").css("background-image","url("+firstCanvasImg[0].url+")");

        //  $("#localfilesmodel").modal("show");
      } else {
        Notification.error("No Files selected.");
      }

      // $("#issue_modal").modal("hide");
      // $("#issue_marker").modal("show");
    };

    $("#issue_marker").on("hidden.bs.modal", function(e) {
      $(this).removeData("bs.modal");
      if ($("#chooseIssueRoofModal").is(":visible")) {
        console.log("Modal is open");
      } else {
        console.log("Modal is closed");
        $(this).modal("show");
      }
    });

    $scope.getImagesInCarosel = function() {
      var projectID = "58eb9d2ec921d67036787832";

      apiFactory
        .getProjectRoofPlans(projectID)
        .then(resp => {
          //$("#issue_modal").modal("hide");
          let ProjectPlans = resp.data.data;
          vm.planPickerPlans = ProjectPlans;
          console.log("planpicker: ", vm.planPickerPlans);
          $("#issue_marker").modal("hide");
          $("#chooseIssueRoofModal").modal("show");
        })
        .catch(e => {
          console.log(e);
        });
    };

    vm.choosePlanData = function(plan) {
      vm.planToMark.push(plan.assetObj);
      //  console.log(vm.planToMark);
    };
    //Test pan
    vm.choosePlanData1 = function(plan) {
      vm.planToMark.push(plan);
      //  console.log(vm.planToMark);
    };

    $scope.addToDetails = function(imgarray) {
      $("#chooseIssueRoofModal").modal("hide");
      $("#issue_marker").modal("show");
      console.log("vm.plan to mrk:", vm.planToMark);
      var firstCanvasImg = imgarray.slice(-1);
      //$("#slideCanvas").css("background-image","url("+firstCanvasImg[0].url+")");
      $("#carousellist")
        .carousel("pause")
        .removeData();
      $("#carousellist").carousel(vm.planToMark);
    };

    $scope.getDetail = function(issue) {
      $("#issuedetail").modal();
      $scope.issueModel = issue;

      $scope.Title = $scope.issueModel.title;
      $scope.Description = $scope.issueModel.description;

      $scope.DeadLineDate = new Date($scope.issueModel.deadLine);
      document.getElementById("deadline").defaultValue = $scope.DeadLineDate;
      $scope.day = $scope.DeadLineDate.getDate() - 1;

      $scope.month = $scope.DeadLineDate.getMonth() + 1;

      $scope.year = $scope.DeadLineDate.getFullYear();

      $scope.deadLineDate = $scope.month + "/" + $scope.day + "/" + $scope.year;

      $scope.Status = $scope.issueModel.issueStatus;
    };

    $scope.addFileToUpdate = function(file, comment) {
      $scope.inputFiles.push({ file: file, comment: comment });
      console.log($scope.inputFiles);
      $scope.file = "";
      $scope.comment = "";
    };

    $scope.updateRequest = function(updateobj) {
      console.log("to update data", updateobj);

      $scope.updateform = true;
      $scope.openEdit = false;
    };

    $scope.removeFiles = function(index, array, imageId) {
      array.splice(index, 1);
      console.log("removing files", "index", index, "imageId", imageId);
      $scope.filesToRemove.push(imageId);
      console.log("removing files", $scope.filesToRemove);
    };
    vm.closeUpdteModel = function() {
      $scope.updateform = false;
    };

    $scope.openEditDate = function() {
      $scope.openEdit = true;
    };
    $scope.closeEditDate = function() {
      $scope.openEdit = false;
    };

    $scope.imageTempUrl = "../assets/images/rooftestimages/image1.jpg";
    $scope.rooftestDemo = function(string) {
      console.log("string", string);
      $scope.imageTempUrl = ".." + string;
    };

    // $scope.canvas = document.getElementById('slideCanvas');
    $("#issue_marker").on("shown.bs.modal", function(e) {
      $("#carousellist").flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 200,
        itemMargin: 3
      });
      //$scope.canvas = document.getElementById('slideCanvas');
    });

    $scope.thisImage = "";
    vm.markingsArray = [];
    $scope.ratio;
    $scope.openSliderImage = function(plan, index, count) {
      // alert("to open image");
      // if(count==2){
      //   alert("count 2");
      //   if($scope.previousplan){
      //     alert("previous plan is there.");
      //     if($scope.previousplan.url==plan.url){
      //       console.log("");
      //     }else{
      //       alert("previous plan not .");
      //       var dataImage=$scope.canvas.toDataURL("image/png");
      //       fetch(dataImage)
      //       .then(res => res.blob())
      //       .then(blob => {
      //         const file = new File([blob], "detailfile");
      //         var link = document.getElementById('link');
      //         link.setAttribute('download', 'MintyPaper.png');
      //         let dataimage=link.setAttribute('href',blob);
      //         link.click();

      //        vm.UploadFiles.push({/*image: $scope.previousplan._id,markings:vm.markingsArray,*/markedImg:file});
      //        console.log("click event upload array: ",vm.UploadFiles);
      //        alert("pushed in array");
      //        $scope.previousplan=plan;
      //       })
      //     }
      //   }else{
      //     alert("to set previous plan first");
      //     $scope.previousplan=plan;

      //   }

      //  }else{
      //   alert("not count 2");
      //  }

      $scope.thisImage = plan;

      $scope.context = $scope.canvas.getContext("2d");
      let base_image = new Image();
      base_image.crossOrigin = "Anonymous";
      base_image.src = plan.url;
      console.log("base image");
   
    var hRatio = $scope.canvas.width  / base_image.width    ;
    var vRatio =  $scope.canvas.height / base_image.height  ;
    $scope.ratio  = Math.min ( hRatio, vRatio );
    console.log("RATIO: ", $scope.ratio);
    var centerShift_x = ( $scope.canvas.width - base_image.width* $scope.ratio ) / 2;
    var centerShift_y = ( $scope.canvas.height - base_image.height* $scope.ratio ) / 2;  
    $scope.context.clearRect(0,0,$scope.canvas.width, $scope.canvas.height);
    vm.markingsArray=[];
    $scope.context.drawImage(base_image, 0,0, base_image.width, base_image.height,
                    centerShift_x,centerShift_y,base_image.width* $scope.ratio, base_image.height* $scope.ratio); 
     console.log("placed image");
  }

  vm.addMarkedImgData=function(){
    console.log("add mark image function");
    var dataImage=$scope.canvas.toDataURL("image/png");
    fetch(dataImage)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], "detailfile")
      console.log("file: ",file);
      vm.UploadFiles.push({image: $scope.thisImage._id,markings:vm.markingsArray,markedImg:file});
       console.log("vm.UploadFiles",vm.UploadFiles);
    })
        
     

      var hRatio = $scope.canvas.width / base_image.width;
      var vRatio = $scope.canvas.height / base_image.height;
      $scope.ratio = Math.min(hRatio, vRatio);
      console.log("RATIO: ", $scope.ratio);
      var centerShift_x =
        ($scope.canvas.width - base_image.width * $scope.ratio) / 2;
      var centerShift_y =
        ($scope.canvas.height - base_image.height * $scope.ratio) / 2;
      $scope.context.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
      vm.markingsArray = [];
      $scope.context.drawImage(
        base_image,
        0,
        0,
        base_image.width,
        base_image.height,
        centerShift_x,
        centerShift_y,
        base_image.width * $scope.ratio,
        base_image.height * $scope.ratio
      );
      console.log("placed image");
    };

    vm.addMarkedImgData = function() {
      console.log("add mark image function");
      var dataImage = $scope.canvas.toDataURL("image/png");
      fetch(dataImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "detailfile");
          console.log("file: ", file);
          vm.UploadFiles.push({
            image: $scope.thisImage._id,
            /*markings:vm.markingsArray,*/ markedImg: file
          });
          console.log("vm.UploadFiles", vm.UploadFiles);
        });
    };

    //CANVAS METHODS EVENTS
    $scope.isLine = false;
    $scope.isCircle = false;
    $scope.isMarker = false;
    $scope.isText = false;

    $scope.drawLineOnCanvas = function() {
      $scope.openFillColor = false;
      $scope.snapshot;
      $scope.textForm = false;
      $scope.dragging = false;
      $scope.dragStartLocation;
      $("#gpsbtn").css("background-color", "#D3D3D3");

      $scope.btnMarker = "../assets/images/gps.png";
      $scope.btnCircle = "../assets/images/circle-shape-outline.png";
      $scope.btnLine = "../assets/images/linewhite.png";
      $scope.btnText = "../assets/images/text-option-interface-symbol.png";

      $("#txtbtn").css("background-color", "#D3D3D3");
      $("#circlebtn").css("background-color", "#D3D3D3");
      $("#linebutton").css("background-color", "#009ACD");
      $scope.context1 = $scope.canvas.getContext("2d");

      $scope.rect = $scope.canvas.getBoundingClientRect();
      if (
        $scope.isCircle == true ||
        $scope.isMarker == true ||
        $scope.isText == true
      ) {
        $scope.canvas.removeEventListener("mousedown", dragStart);
        $scope.canvas.removeEventListener("mousemove", drag);
        $scope.canvas.removeEventListener("mouseup", dragStop);
        $scope.canvas.removeEventListener("mousedown", MarkWrite);
        $scope.canvas.removeEventListener("mousedown", TextWrite);
      }
      $scope.canvas.addEventListener("mousedown", dragStartLine);
      $scope.canvas.addEventListener("mousemove", dragLine);
      $scope.canvas.addEventListener("mouseup", dragStopLine);
    };

    //Line Functions
    function dragStartLine(e) {
      $scope.isLine = true;
      $scope.dragging = true;
      var x = Math.floor(
          ((e.clientX - $scope.rect.left) /
            ($scope.rect.right - $scope.rect.left)) *
            $scope.canvas.width
        ),
        y = Math.floor(
          ((e.clientY - $scope.rect.top) /
            ($scope.rect.bottom - $scope.rect.top)) *
            $scope.canvas.height
        );
      $scope.dragStartLocation = { X: x, Y: y };
      $scope.snapshot = $scope.context1.getImageData(
        0,
        0,
        $scope.canvas.width,
        $scope.canvas.height
      );
    }
    function dragLine(e) {
      var position;
      var x = Math.floor(
          ((e.clientX - $scope.rect.left) /
            ($scope.rect.right - $scope.rect.left)) *
            $scope.canvas.width
        ),
        y = Math.floor(
          ((e.clientY - $scope.rect.top) /
            ($scope.rect.bottom - $scope.rect.top)) *
            $scope.canvas.height
        );
      if ($scope.dragging === true) {
        $scope.context1.putImageData($scope.snapshot, 0, 0);
        position = { X: x, Y: y };
        $scope.context1.beginPath();
        $scope.context1.moveTo(
          $scope.dragStartLocation.X,
          $scope.dragStartLocation.Y
        );
        $scope.context1.lineTo(position.X, position.Y);
        $scope.context1.strokeStyle = $scope.colorpick;
        $scope.context1.lineWidth = 2;
        $scope.context1.lineCap = "round";
        $scope.context1.stroke();
      }
    }
    function dragStopLine(e){
        $scope.dragging=false;
        $scope.context1.putImageData($scope.snapshot,0,0);
        var position;
        var x=Math.floor( ( e.clientX - $scope.rect.left ) / ( $scope.rect.right - $scope.rect.left ) * $scope.canvas.width ),
        y=Math.floor( ( e.clientY - $scope.rect.top ) / ( $scope.rect.bottom - $scope.rect.top ) * $scope.canvas.height )
        position={'X':x,'Y':y};
       // console.log("drag location",position.X,position.Y);
        $scope.context1.beginPath();
        $scope.context1.moveTo($scope.dragStartLocation.X,$scope.dragStartLocation.Y);
        $scope.context1.lineTo(position.X,position.Y);
        $scope.context1.strokeStyle = $scope.colorpick;
        $scope.context1.lineWidth=2;
        $scope.context1.lineCap='round';
        $scope.context1.stroke();
       var imageData = $scope.context1.getImageData(0,0,$scope.canvas.width,$scope.canvas.height);
       $scope.UndoArray.push(imageData);
       vm.markingsArray.push(imageData);
       console.log("undoArray: ",$scope.UndoArray);
       
    }

    //CIRCLE

    $scope.drawCircleOnCanvas = function() {
      $scope.openFillColor = true;
      $scope.textForm = false;
      $("#gpsbtn").css("background-color", "#D3D3D3");

      $scope.btnMarker = "../assets/images/gps.png";
      $scope.btnCircle = "../assets/images/circlewhite.png";
      $scope.btnLine = "../assets/images/lineicon.png";
      $scope.btnText = "../assets/images/text-option-interface-symbol.png";

      $("#linebutton").css("background-color", "#D3D3D3");
      $("#txtbtn").css("background-color", "#D3D3D3");
      $("#circlebtn").css("background-color", "#009ACD");
      $("#circlebtn").css("color", "#ffffff");

      $scope.ctx = $scope.canvas.getContext("2d");
      $scope.canvasx = $($scope.canvas).offset().left;
      $scope.canvasy = $($scope.canvas).offset().top;
      $scope.last_mousey, $scope.mousey;
      $scope.last_mousex = $scope.last_mousey = 0;
      $scope.mousex = $scope.mousey = 0;
      $scope.mousedown = false;
      $scope.rect1 = $scope.canvas.getBoundingClientRect();
      if ($scope.isLine == true || $scope.isMarker == true) {
        $scope.canvas.removeEventListener("mousedown", dragStartLine);
        $scope.canvas.removeEventListener("mousemove", dragLine);
        $scope.canvas.removeEventListener("mouseup", dragStopLine);
        $scope.canvas.removeEventListener("mousedown", MarkWrite);
        $scope.canvas.removeEventListener("mousedown", TextWrite);
      }
      $scope.canvas.addEventListener("mousedown", dragStart);
      $scope.canvas.addEventListener("mousemove", drag);
      $scope.canvas.addEventListener("mouseup", dragStop);
    };

    //circl functions
    function dragStart(e) {
      $scope.isCircle = true;
      // $scope.last_mousex = parseInt(e.clientX-$scope.canvasx);
      // $scope.last_mousey = parseInt(e.clientY-$scope.canvasy);
      $scope.last_mousex = parseInt(
        ((e.clientX - $scope.rect1.left) /
          ($scope.rect1.right - $scope.rect1.left)) *
          $scope.canvas.width
      );
      $scope.last_mousey = parseInt(
        ((e.clientY - $scope.rect1.top) /
          ($scope.rect1.bottom - $scope.rect1.top)) *
          $scope.canvas.height
      );
      $scope.mousedown = true;
      $scope.snapshotCircle = $scope.ctx.getImageData(
        0,
        0,
        $scope.canvas.width,
        $scope.canvas.height
      );
    }
    function drag(e) {
      // $scope.mousex = parseInt(e.clientX-$scope.canvasx);
      // $scope.mousey = parseInt(e.clientY-$scope.canvasy);
      $scope.mousex = parseInt(
        ((e.clientX - $scope.rect1.left) /
          ($scope.rect1.right - $scope.rect1.left)) *
          $scope.canvas.width
      );
      $scope.mousey = parseInt(
        ((e.clientY - $scope.rect1.top) /
          ($scope.rect1.bottom - $scope.rect1.top)) *
          $scope.canvas.height
      );

      if ($scope.mousedown) {
        //  $scope.ctx.clearRect(0,0,$scope.canvas.width,$scope.canvas.height); //clear canvas
        //Save
        $scope.ctx.save();
        $scope.ctx.putImageData($scope.snapshotCircle, 0, 0);
        $scope.ctx.beginPath();
        //Dynamic scaling

        var scalex = 1 * (($scope.mousex - $scope.last_mousex) / 2);
        var scaley = 1 * (($scope.mousey - $scope.last_mousey) / 2);
        $scope.ctx.scale(scalex, scaley);
        //Create ellipse
        $scope.centerx = $scope.last_mousex / scalex + 1;
        $scope.centery = $scope.last_mousey / scaley + 1;

        $scope.ctx.arc($scope.centerx, $scope.centery, 1, 0, 2 * Math.PI);
        //Restore and draw
        $scope.ctx.restore();
        $scope.ctx.strokeStyle = $scope.colorpick;
        $scope.ctx.fillStyle = $scope.fillColor;
        $scope.ctx.fill();
        $scope.ctx.lineWidth = 2;
        $scope.ctx.stroke();
      }
    }
    function dragStop(e) {
      $scope.mousedown = false;
      var imageData = $scope.ctx.getImageData(
        0,
        0,
        $scope.canvas.width,
        $scope.canvas.height
      );
      $scope.UndoArray.push(imageData);
      vm.markingsArray.push(imageData);
    }

    //MARKER
    $scope.drawmarkerOnCanvas = function() {
      $scope.openFillColor = true;
      $scope.textForm = false;
      $scope.markercontext = $scope.canvas.getContext("2d");
      if (
        $scope.isCircle == true ||
        $scope.isLine == true ||
        $scope.isText == true
      ) {
        $scope.canvas.removeEventListener("mousedown", dragStart);
        $scope.canvas.removeEventListener("mousemove", drag);
        $scope.canvas.removeEventListener("mouseup", dragStop);
        $scope.canvas.removeEventListener("mousedown", dragStartLine);
        $scope.canvas.removeEventListener("mousemove", dragLine);
        $scope.canvas.removeEventListener("mouseup", dragStopLine);
        $scope.canvas.removeEventListener("mousedown", TextWrite);
      }
      $("#gpsbtn").css("background-color", "#009ACD");

      $scope.btnMarker = "../assets/images/gpswhite.png";
      $scope.btnCircle = "../assets/images/circle-shape-outline.png";
      $scope.btnLine = "../assets/images/lineicon.png";
      $scope.btnText = "../assets/images/text-option-interface-symbol.png";

      $("#txtbtn").css("background-color", "#D3D3D3");
      $("#circlebtn").css("background-color", "#D3D3D3");
      $("#linebutton").css("background-color", "#D3D3D3");
      $scope.rectmarker = $scope.canvas.getBoundingClientRect();
      $scope.canvas.addEventListener("mousedown", MarkWrite);
    };

    function MarkWrite(e) {
      $scope.isMarker = true;
      var mousex = parseInt(
        ((e.clientX - $scope.rectmarker.left) /
          ($scope.rectmarker.right - $scope.rectmarker.left)) *
          $scope.canvas.width
      );
      var mousey = parseInt(
        ((e.clientY - $scope.rectmarker.top) /
          ($scope.rectmarker.bottom - $scope.rectmarker.top)) *
          $scope.canvas.height
      );
      $scope.markercontext.beginPath();
      $scope.markercontext.arc(mousex, mousey, 8, 0, 2 * Math.PI);
      $scope.markercontext.strokeStyle = $scope.colorpick;
      $scope.markercontext.fillStyle = "blue";
      $scope.markercontext.fill();
      $scope.markercontext.stroke();
      var imageData = $scope.markercontext.getImageData(
        0,
        0,
        $scope.canvas.width,
        $scope.canvas.height
      );
      $scope.UndoArray.push(imageData);
      vm.markingsArray.push(imageData);
    }

    //text writing
    $scope.fillTextOnCanvas = function() {
      $scope.openFillColor = false;
      $scope.textForm = true;
      $("#gpsbtn").css("background-color", "#D3D3D3");

      $scope.btnMarker = "../assets/images/gps.png";
      $scope.btnCircle = "../assets/images/circle-shape-outline.png";
      $scope.btnLine = "../assets/images/lineicon.png";
      $scope.btnText = "../assets/images/textwhite.png";

      $("#txtbtn").css("background-color", "#009ACD");
      $("#circlebtn").css("background-color", "#D3D3D3");
      $("#linebutton").css("background-color", "#D3D3D3");
      if (
        $scope.isCircle == true ||
        $scope.isLine == true ||
        $scope.isMarker == true
      ) {
        $scope.canvas.removeEventListener("mousedown", dragStart);
        $scope.canvas.removeEventListener("mousemove", drag);
        $scope.canvas.removeEventListener("mouseup", dragStop);
        $scope.canvas.removeEventListener("mousedown", dragStartLine);
        $scope.canvas.removeEventListener("mousemove", dragLine);
        $scope.canvas.removeEventListener("mouseup", dragStopLine);
        $scope.canvas.removeEventListener("mousedown", MarkWrite);
      }

      $scope.canvas.addEventListener("mousedown", TextWrite);
      // $scope.canvas.addEventListener('mouseup',extUp);
    };
    function TextWrite(e) {
      $scope.isText = true;

      $scope.cntxt = $scope.canvas.getContext("2d");
      var coords = $scope.canvas.getBoundingClientRect();
      var mousex = parseInt(
        ((e.clientX - coords.left) / (coords.right - coords.left)) *
          $scope.canvas.width
      );
      var mousey = parseInt(
        ((e.clientY - coords.top) / (coords.bottom - coords.top)) *
          $scope.canvas.height
      );
      $scope.cntxt.font = "15px Times New Roman";
      $scope.cntxt.fillStyle = $scope.colorpick;
      $scope.cntxt.strokeText($scope.placeDataAtPixel, mousex, mousey);
      var imageData = $scope.cntxt.getImageData(
        0,
        0,
        $scope.canvas.width,
        $scope.canvas.height
      );
      $scope.UndoArray.push(imageData);
      vm.markingsArray.push(imageData);
      $scope.placeDataAtPixel = "";
    }

    $scope.UndoDrawing = function() {
      if ($scope.UndoArray.length > 0) {
        var undoCtx = $scope.canvas.getContext("2d");
        undoCtx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
        var imgdata = $scope.UndoArray.pop();
        $scope.redoArray.push(imgdata);

        $scope.UndoArray.forEach(element => {
          undoCtx.putImageData(element, 0, 0);
        });
      }
    };

    $scope.RedoDrawing = function() {
      var undoCtx = $scope.canvas.getContext("2d");
      if ($scope.redoArray.length > 0) {
        var redo = $scope.redoArray.pop();

        undoCtx.putImageData(redo, 0, 0);
      }
    };

    vm.saveMarkInfo=function(){
    


       var markedfile = JSON.stringify(vm.UploadFiles);
      
       apiFactory.postMarkImg(markedfile)
          .then(resp=>{
            console.log("after post markings");
            
            console.log("newData: ",newData);
          })
    

      var markedfile = { data: "datafile", allObj: vm.UploadFiles };

      apiFactory.postMarkImg(markedfile).then(resp => {
        console.log("after post markings");

        console.log("newData: ", newData);
      });
      // })
    };

    //return a promise that resolves with a File instance
    function urltoFile(url, filename, mimeType) {
      return fetch(url)
        .then(function(res) {
          return res.arrayBuffer();
        })
        .then(function(buf) {
          return new File([buf], filename, { type: mimeType });
        });
    }

    $(document).on("click", ".lightbox img", function(e) {});
  }
})();
