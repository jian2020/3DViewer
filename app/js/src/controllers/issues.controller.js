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
      const { logout, userStore,debounce } = globals;
      $scope.UploadedFiles=[];
      vm.issueData = {};
      $scope.issueModel={};
      $scope.file;
      $scope.comment="";
      $scope.inputFiles = [];
      $scope.openEdit=false;
      $scope.filesToRemove=[];
      $scope.isSelectedBtn=false;
      $scope.updateform=false;
      $scope.UndoArray=[];
      $scope.redoArray=[];
      vm.planToMark=[];
      vm.LocalImgs=[];
     // const { logout } = globals;
      $scope.searchingText= false;
      $scope.openFillColor=false;
      //color picker variables
      $scope.colorpick = "#0000ff";
      $scope.colorWell;
      $scope.fillWell;
      $scope.fillColor = 'transparent';
      $scope.textForm=false;
      vm.errorImage="assets/images/enduserissue.png";
     $scope.btnMarker="../assets/images/gps.png";
     $scope.btnCircle="../assets/images/circle-shape-outline.png";
     $scope.btnLine="../assets/images/lineicon.png";
     $scope.btnText="../assets/images/text-option-interface-symbol.png";
 
      if (!authFactory.checkUser()) {
        logout();
        return;
      }

       /* Get project list */
      vm.userData = userStore.get();

      vm.logout = () => {
        logout();
      };

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
          created: true,
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
            vm.issueCount = resp.data.total;
            $timeout(() => {
              $scope.searchingText= false;
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
          $scope.searchingText= true;
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
  
      $scope.issueCategory = ['Safety', 'Quality', 'Issue'];
    

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
       
       //reading file images
      $scope.readImg = function(fileImg){
        var output = document.getElementById('blah');
        output.src = URL.createObjectURL(fileImg);
      }

       $scope.addFile = function(file,comment){
     
      //  if(file.type=='image/png'||file.type=='image/jpg'||file.type=='image/jpeg'){
      //   var SRC = URL.createObjectURL(file);
      //   $scope.inputFiles.push({file:file,comment:comment,source:SRC});

      //  }else{
        $scope.inputFiles.push({file:file,comment:comment,source:"NS"});
        console.log("input:",$scope.inputFiles);
       //}
      //  var SRC = URL.createObjectURL(file);
      //  console.log("SRC",SRC);
      //   $scope.inputFiles.push({file:file,comment:comment,source:SRC});
       
      //   console.log($scope.inputFiles);
      //   $scope.file='';
      //   $scope.comment='';
       // $("#commentdiv").hide();
       }

       $scope.deleteImg = function(index,array){
        array.splice(index, 1);
                
      }

      $scope.fileUpEvent = function(file){
        
         $scope.thumbnail="";
         console.log("file event",file);
        if(file!==null){
          if(file.length>0){
            file.forEach(onefile=>{
              if(onefile.type=='image/png'||onefile.type=='image/jpg'||onefile.type=='image/jpeg'){
                var SRC = URL.createObjectURL(onefile);
                $scope.thumbnail=SRC
              }
              else if(onefile.type=='application/pdf'){
                $scope.thumbnail='assets/images/file_icon/pdficon.jpg'
              }
              else if(onefile.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                $scope.thumbnail='assets/images/file_icon/msword.png'
              }
              else if(onefile.type=='application/vnd.ms-excel'||onefile.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                $scope.thumbnail='assets/images/file_icon/excel.jpg'
              }
              else if(onefile.type=='application/x-zip-compressed'){
                $scope.thumbnail='assets/images/file_icon/zip.png'
              }else{
                $scope.thumbnail='assets/images/file_icon/anytype.jpg'
              }
              $scope.inputFiles.push({file:onefile,image:$scope.thumbnail});
            })
          }
         
      
        }

      }

      $scope.getDescription=function(index,array,coment){
         array[index].comment=coment;
        
      }

      vm.files3Update=function(array){
        console.log("in s3 function");
        angular.forEach(array, x => {
          //console.log("S3 FILE FOREACH MEthod as array is not null");
          /* Attach events and props to fileObj so that we can use them in the view */
          let uploadHandler = evaporate => {
            /* upload to s3 if value is less than 3 */
            x.file.pause = uploadFactory.pause.bind(evaporate, x);
            x.file.resume = uploadFactory.resume.bind(evaporate, x);
            x.file.abort = uploadFactory.abort.bind(evaporate, x);
            let addConfig = {
              name: x.file.name,
              file: x.file,
              progress: (p, stats) => {
             //   console.log(p);
                /* AWS progress percentage falls back sometimes due to missing fragmentation. 
                Update progress value only when it's higher than the previous value */
                x.file.progress =
                  x.file.progress > Math.round(p * 100)
                    ? x.file.progress
                    : Math.round(p * 100);
                /* Check completion */
                vm.completedAll = fileManagerFactory.checkUploadCompletion(
                  vm.uploadViewFiles
                );
                /* Refresh view with scope > apply */
                $timeout(() => {
                  $scope.$apply();
                });
              },
              complete: (_xhr, awsKey) => {
                x.file.completed = true;
                /* Refresh view with scope > apply */
                $timeout(() => {
                  $scope.$apply();
                });
                console.log("Complete!");
              }
            };
  
            evaporate.add(addConfig).then(
              function(awsObjectKey) {
                /* Success block */
                console.log(x);
                let payload = {
                  type: fileManagerFactory.resolveDestType(x.file),
                  
                  assetData: {
                    assetName: x.file.name,
                    assetdescription:x.comment,
                    bucket: "3dfilesdata",
                    key: `test/${x.file.name}`,
                    mimetype: x.file.type,
                    bytes: x.file.size
                  }
                };
                apiFactory
                  .newIssues3FileUpload(payload)
                  .then(resp => {
                //   console.log("response from s3:",resp);
                   itemProcessed++;
                   $scope.UploadedFiles.push(resp);
                   if(itemProcessed===vm.uploadViewFiles.s3.length){
                   //return $scope.UploadedFiles;
                   return "response from s3";
                   }
                  })
                  .catch(e => {
                    console.log(e);
                  });
                Notification.success("File successfully uploaded");
                //console.log("File successfully uploaded to:", awsObjectKey);
              },
              function(reason) {
                /* Failure block */
                x.aborted = true;
                /* Check completion */
                vm.completedAll = fileManagerFactory.checkUploadCompletion(
                  vm.uploadViewFiles
                );
                /* Refresh view with scope > apply */
                $timeout(() => {
                  $scope.$apply();
                });
                //console.log("File did not upload sucessfully:", reason);
              }
            );
          };
  
          uploadFactory.start(uploadHandler);
        });
      },

      vm.filescloudinaryUpdate=function(array){
        if (array.length) {
          $scope.cloudinaryPayload = {
            files: array,
          };
        
  
            apiFactory
            .issueImage($scope.cloudinaryPayload)
            .then(resp => {
              console.log("response of cloudinary: ", resp);
              // vm.uploadViewFiles.cloudinary = vm.uploadViewFiles.cloudinary.map(
              //   x => {
              //     x.completed = true;
              //     return x;
              //   }
              // );
              /* Check completion */
              vm.completedAll = fileManagerFactory.checkUploadCompletion(
                vm.uploadViewFiles
              );
              /* Refresh view with scope > apply */
              $timeout(() => {
                $scope.$apply();
              });
  
              Notification.success(resp.data.message);
              return "response from cloudinary";
            })
            .catch(e => {
              console.log(e);
            });
        }
        else{
          console.log("No file found to save n cloudinary");
        }
      },

      vm.saveIssueDetail=function(issueData){
        var issueObject = {};
        issueObject.title =  issueData.title;
        issueObject.description =  issueData.description;
        issueObject.project =  issueData.project._id;
        issueObject.issueCategory =  issueData.category;
        issueObject.ownerId = issueData.roofer._id;
        issueObject.deadLine = issueData.deadLine;
        if(issueObject.dependencyOn){
         issueObject.dependencyOn=issueData.dependencyOn._id;
        }
        
        issueObject.assignedTo=issueData.assignedTo._id;
        issueObject.issueStatus=issueData.issueStatus;
        console.log("issueObj:",issueData);
      
  
        apiFactory
          .createIssue(issueObject)
          .then(resp => {
            Notification.success("Issue has been saved successfully");
            $scope.inputFiles = [];
            $scope.updateform=false;
            
            // $('#issue_modal').modal('hide');
            // $('#issue_marker').modal();
            vm.sortissues("created", "toggleIssue");
            return resp;
          })
          .catch(e => {
            console.log(e);
          });
      }


       //fun1
       function f1(){
         console.log("f1");
        apiFactory.getIssuesList().then(resp => {
          vm.listOfIssue1 = resp.data.list;
          console.log("f1", vm.listOfIssue1);
           return vm.listOfIssue1 ;
          });
       }
       //fun2
       function f2(){
        console.log("f2");

        apiFactory.listAllRoofers().then(resp => {
          vm.listOfRoofers1 = resp.data.list;
          console.log("f2", vm.listOfRoofers1);

          return vm.listOfRoofers1 ;
          });
       }
       //fun 3
       function f3(){
        console.log("f3");

        apiFactory.listAllProjects().then(resp => {
          vm.listOfProjects1 = resp.data.list;
          console.log("f3", vm.listOfProjects1);

          return vm.listOfProjects1 ;
          });
       }

      vm.ADDISSUE = function(issueData){
        //$scope.filesArray=$scope.inputFiles;
        //vm.uploadViewFiles = fileManagerFactory.splitFileDest($scope.filesArray);
        $("#issue_modal").modal("hide");
        $("#issue_marker").modal("show");
       // var projectID=issueData.project._id;

       

          
         

      };
      vm.localFiles=[];
      $scope.getFilesFromLocal = function(files){
       console.log("local files: ",files);
        if(files){
          files.forEach(onefile=>{
            var SRC = URL.createObjectURL(onefile);
            vm.planToMark.push({url:SRC});
        });
        console.log("after src called");
        $("#issue_marker").modal("hide");
        var firstCanvasImg=vm.planToMark.slice(-1);
         $("#slideCanvas").css("background-image","url("+firstCanvasImg[0].url+")");
          
       //  $("#localfilesmodel").modal("show");
       
        }else{
          Notification.error("No Files selected.");
        }
        
        // $("#issue_modal").modal("hide");
        // $("#issue_marker").modal("show");

      }
      
     
      $( "#issue_marker").on('hidden.bs.modal', function (e) {
        // alert("localpopup");
      
          $(this).removeData('bs.modal');
          if($('#chooseIssueRoofModal').is(':visible')){
          console.log("Modal is open");
          }
          else{
            console.log("Modal is closed");
            $(this).modal("show");
          }
       
       
      });

      $scope.getImagesInCarosel = function(){
        
        var projectID='58eb9d2ec921d67036787832';
        
        apiFactory
        .getProjectRoofPlans(projectID)
        .then(resp => {
          //$("#issue_modal").modal("hide");
          let ProjectPlans = resp.data.data;
          vm.planPickerPlans = ProjectPlans;
          console.log("planpicker: ",vm.planPickerPlans);
          $("#issue_marker").modal("hide");
          $("#chooseIssueRoofModal").modal("show");
         
        })
        .catch(e => {
          console.log(e);
        });
        
      }
 
      vm.choosePlanData = function(plan){
         vm.planToMark.push(plan.assetObj);
        //  console.log(vm.planToMark);
      }
      //Test pan
      vm.choosePlanData1 = function(plan){
        vm.planToMark.push(plan);
       //  console.log(vm.planToMark);
     }

      $scope.addToDetails = function(imgarray){
        $("#chooseIssueRoofModal").modal("hide");
        $("#issue_marker").modal("show");
       console.log("vm.plan to mrk:", vm.planToMark);


        var firstCanvasImg=imgarray.slice(-1);
        $("#slideCanvas").css("background-image","url("+firstCanvasImg[0].url+")");
       
      
      }

      

      //test get details
      $scope.addToDetails1 = function(imgarray){
        $("#localfilesmodel").modal("hide");
        $("#issue_marker").modal("show");
       
        var firstCanvasImg=imgarray.slice(-1);
         $("#slideCanvas").css("background-image","url("+firstCanvasImg[0].url+")");
       
      
      }

      $scope.getDetail = function(issue){
        $('#issuedetail').modal();
        $scope.issueModel = issue;
        
        $scope.Title=  $scope.issueModel.title;
        $scope.Description= $scope.issueModel.description;
        
        $scope.DeadLineDate =new Date($scope.issueModel.deadLine);
        document.getElementById("deadline").defaultValue =$scope.DeadLineDate;
        $scope.day = $scope.DeadLineDate.getDate()-1;
       
        $scope.month = $scope.DeadLineDate.getMonth()+1;
       
        $scope.year = $scope.DeadLineDate.getFullYear();

        $scope.deadLineDate =  $scope.month+"/"+$scope.day+"/"+ $scope.year;
       
       
        $scope.Status = $scope.issueModel.issueStatus;
        
       
      }
      
      $scope.addFileToUpdate = function(file,comment){
        $scope.inputFiles.push({file:file,comment:comment});
        console.log($scope.inputFiles);
        $scope.file='';
        $scope.comment='';
      }
     

      $scope.updateRequest = function(updateobj){
        console.log("to update data",updateobj);
       
        $scope.updateform = true;
        $scope.openEdit=false;
        
      }

      $scope.removeFiles = function(index,array,imageId){
        array.splice(index, 1);
        console.log("removing files","index",index,"imageId",imageId);
        $scope.filesToRemove.push(imageId);
        console.log("removing files",$scope.filesToRemove);
      }
      vm.closeUpdteModel = function(){
        
        $scope.updateform=false;
      }

     $scope.openEditDate = function(){
   
       $scope.openEdit=true;
     }
     $scope.closeEditDate = function(){
     
      $scope.openEdit=false;
     }

      vm.updateIssueDetails = formData => {
       
        var issueObject={};
        if(vm.updateIssue==undefined){
          console.log("update issue is undefined");
          issueObject.Title =  $scope.issueModel.title;
          issueObject.description = $scope.issueModel.description;
          issueObject.deadLine=$scope.issueModel.deadLine;
          issueObject.issueStatus=$scope.issueModel.issueStatus;
        }else{
          console.log("update isuue is not undfined so in esle case");
          if(vm.updateIssue.title==undefined){
            issueObject.Title =  $scope.issueModel.title;
           }
           else{
            issueObject.Title =  vm.updateIssue.title;
           }
           if(vm.updateIssue.description==undefined){
            issueObject.description = $scope.issueModel.description;
           }
           else{
            issueObject.description = vm.updateIssue.description;
           }
           if(vm.updateIssue.deadLine==undefined){

            issueObject.deadLine=$scope.issueModel.deadLine;
           }
           else{
             issueObject.deadLine=vm.updateIssue.deadLine;
           }
           if(vm.updateIssue.issueStatus==undefined){
            issueObject.issueStatus=$scope.issueModel.issueStatus;
           }else{
            issueObject.issueStatus=vm.updateIssue.issueStatus;
           }
        }
        
        if($scope.inputFiles.length>0){
          issueObject.files = $scope.inputFiles;
        }
        if($scope.filesToRemove.length>0){
          console.log("files to remove",$scope.filesToRemove);
          issueObject.removedFiles = $scope.filesToRemove;
        }
        console.log("ISUUEOBJECT", issueObject);
        apiFactory
        .updateIssue(issueObject,$scope.issueModel._id)
        .then(resp => {
          Notification.success("Issue has been updated successfully");
          $scope.inputFiles = [];
          $scope.filesToRemove=[];
          $scope.updateform=false;
          $('#issuedetail').modal('hide')
          vm.sortissues("created", "toggleIssue");
        })
        .catch(e => {
          console.log(e);
          $scope.inputFiles = [];
          $scope.filesToRemove=[];
          $scope.updateform=false;
          Notification.error("Something went wrong");
        });
       
      }

     
      $scope.imageTempUrl="../assets/images/rooftestimages/image1.jpg";
      $scope.rooftestDemo=function(string){
        console.log("string",string);
        $scope.imageTempUrl=".."+string;
       
      }

      

      $scope.canvas = document.getElementById('slideCanvas');
    $( "#issue_marker").on('shown.bs.modal', function (e) {
   
     $("#carousellist").flexslider({
      animation: "slide",
      controlNav: false,
      animationLoop: false,
      slideshow: false,
      itemWidth: 200,
      itemMargin: 3,
     
    });
    //$scope.canvas = document.getElementById('slideCanvas');
    
    });
    
   
    $scope.openSliderImage =function(url,index){
      console.log("url: ",url);
     $("#slideCanvas").css("background-image","url("+url+")");
    
    }

    //CANVAS METHODS EVENTS
    $scope.isLine=false;
    $scope.isCircle=false;
    $scope.isMarker=false;
    $scope.isText=false;
   
    $scope.drawLineOnCanvas = function(){
      $scope.openFillColor=false;
      $scope.snapshot;
      $scope.textForm=false;
      $scope.dragging=false;
      $scope.dragStartLocation;
      $('#gpsbtn').css("background-color","#D3D3D3");

      $scope.btnMarker="../assets/images/gps.png";
      $scope.btnCircle="../assets/images/circle-shape-outline.png";
      $scope.btnLine="../assets/images/linewhite.png";
      $scope.btnText="../assets/images/text-option-interface-symbol.png";


      $('#txtbtn').css("background-color","#D3D3D3");
       $('#circlebtn').css("background-color","#D3D3D3");
       $('#linebutton').css("background-color","#009ACD");
      $scope.context=$scope.canvas.getContext('2d');
    
      $scope.rect = $scope.canvas.getBoundingClientRect();
      if($scope.isCircle==true||$scope.isMarker==true||$scope.isText==true){
        $scope.canvas.removeEventListener('mousedown',dragStart);
        $scope.canvas.removeEventListener('mousemove',drag);
        $scope.canvas.removeEventListener('mouseup',dragStop);
        $scope.canvas.removeEventListener('mousedown',MarkWrite);
        $scope.canvas.removeEventListener('mousedown',TextWrite);

    }
      $scope.canvas.addEventListener('mousedown',dragStartLine);
      $scope.canvas.addEventListener('mousemove',dragLine);
      $scope.canvas.addEventListener('mouseup',dragStopLine);

    }
   

    //Line Functions
    function dragStartLine(e){
      $scope.isLine=true;
      $scope.dragging=true;
        var x= Math.floor( ( e.clientX - $scope.rect.left ) / ( $scope.rect.right - $scope.rect.left ) * $scope.canvas.width ),
         y=Math.floor( ( e.clientY - $scope.rect.top ) / ( $scope.rect.bottom - $scope.rect.top ) * $scope.canvas.height )
        $scope.dragStartLocation= {'X':x,'Y':y};
        $scope.snapshot=$scope.context.getImageData(0,0,$scope.canvas.width,$scope.canvas.height);
     
    }
    function dragLine(e){
      var position;
      var x=Math.floor( ( e.clientX - $scope.rect.left ) / ( $scope.rect.right - $scope.rect.left ) * $scope.canvas.width ),
      y=Math.floor( ( e.clientY - $scope.rect.top ) / ( $scope.rect.bottom - $scope.rect.top ) * $scope.canvas.height )
      if($scope.dragging===true){
        $scope.context.putImageData($scope.snapshot,0,0);
        position={'X':x,'Y':y};
        $scope.context.beginPath();
        $scope.context.moveTo($scope.dragStartLocation.X,$scope.dragStartLocation.Y);
        $scope.context.lineTo(position.X,position.Y);
        $scope.context.strokeStyle = $scope.colorpick;
        $scope.context.lineWidth=2;
        $scope.context.lineCap='round';
        $scope.context.stroke();
      }
    }
    function dragStopLine(e){
        $scope.dragging=false;
        $scope.context.putImageData($scope.snapshot,0,0);
        var position;
        var x=Math.floor( ( e.clientX - $scope.rect.left ) / ( $scope.rect.right - $scope.rect.left ) * $scope.canvas.width ),
        y=Math.floor( ( e.clientY - $scope.rect.top ) / ( $scope.rect.bottom - $scope.rect.top ) * $scope.canvas.height )
        position={'X':x,'Y':y};
       // console.log("drag location",position.X,position.Y);
        $scope.context.beginPath();
        $scope.context.moveTo($scope.dragStartLocation.X,$scope.dragStartLocation.Y);
        $scope.context.lineTo(position.X,position.Y);
        $scope.context.strokeStyle = $scope.colorpick;
        $scope.context.lineWidth=2;
        $scope.context.lineCap='round';
        $scope.context.stroke();
       var imageData = $scope.context.getImageData(0,0,$scope.canvas.width,$scope.canvas.height);
       $scope.UndoArray.push(imageData);
       console.log("undoArray: ",$scope.UndoArray);
       
    }

   

    

    $scope.UndoDrawing = function(){
      if($scope.UndoArray.length>0){
         var undoCtx = $scope.canvas.getContext('2d');
         undoCtx.clearRect(0,0,$scope.canvas.width,$scope.canvas.height);
         var imgdata=$scope.UndoArray.pop();
         $scope.redoArray.push(imgdata);
       
         $scope.UndoArray.forEach(element => {
         undoCtx.putImageData(element,0,0);
         });
      }
    }
     
    $scope.RedoDrawing = function(){
      var undoCtx = $scope.canvas.getContext('2d');
      if($scope.redoArray.length>0){
        var redo = $scope.redoArray.pop();
        
        undoCtx.putImageData(redo,0,0);
       
      }
    }

    vm.saveMarkInfo=function(){
      var link = document.getElementById('link');
  link.setAttribute('download', 'MintyPaper.png');
  link.setAttribute('href', $scope.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
    //   var image = new Image();
    //  var dt= $scope.canvas.toDataURL("image/png");
    //   console.log("vm.IMGSTORE in png: ",dt);
    //   urltoFile(dt, 'hello.png', 'image/png')
    // .then(function(file){
    //   vm.IMGSTORE = URL.createObjectURL(file);
    //   console.log("FILE SRC: ",vm.IMGSTORE);
      //   apiFactory.postMarkImg(file).then(resp=>{
      //    console.log(resp);
      //    console.log("CONVERTED FILE: ",file);
      // })
  // })
      
    }

   //return a promise that resolves with a File instance
  function urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename, {type:mimeType});})
  );
}
    

  }
})();