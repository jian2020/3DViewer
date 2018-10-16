(() => {
    angular.module("app").controller("issueDetailCtrl", issueDetailCtrl);

    function issueDetailCtrl(
        $scope,
        $timeout,
        authFactory,
        $state,
        $stateParams,
        apiFactory,
        Notification,
        NgMap,
        globals,
        localStorageService,
        FileSaver
        
      ) {

        let vm = this;
        const { logout,userStore } = globals;
        if (!authFactory.checkUser()) {
            logout();
          }
          vm.userData = userStore.get();

  
          vm.logout = () => {
            logout();
          };
          vm.issueId = $stateParams.id;
          vm.ImageAssets=[];
          vm.DocumentAssets=[];
        
          $scope.currentPage = 1;
          $scope.itemsPerPage = 3;
          

          vm.getIssueDetail = () => {
            apiFactory
              .getIssueById(vm.issueId)
              .then(resp => {
                vm.issueData = resp.data;
                console.log("issuedata: ",vm.issueData);
               vm.totalItems = vm.issueData.comments.length;
               $scope.ArrayComments=vm.issueData.comments.reverse();
               $scope.ArrayActivities=vm.issueData.issueActivity.reverse();

                vm.allComments = $scope.ArrayComments.slice(0,3);
                vm.allActivities=$scope.ArrayActivities.slice(0,6);
                $timeout(() => {
                $("#pagination").pagination({
                  items: vm.totalItems,
                  itemsOnPage: $scope.itemsPerPage,
                  cssStyle: "light-theme",
                  hrefTextPrefix: "#",
                  ordering: false,
                  currentPage: 1,
                 
                  onPageClick: function(page, event) {
                    event.preventDefault();
                    setPagingData(page);
                    
                  }
                });
                $("#paginationActivity").pagination({
                  items: vm.issueData.issueActivity.length,
                  itemsOnPage: 7,
                  cssStyle: "light-theme",
                  hrefTextPrefix: "#",
                  ordering: false,
                  currentPage: 1,
                 
                  onPageClick: function(page, event) {
                    event.preventDefault();
                    setActivityPagingData(page);
                    
                  }
                });
              });

              vm.issueData.listAssets.map(x=>{
                if(x.mimetype=="image/png"||x.mimetype=="image/jpg"){
                  vm.ImageAssets.push(x);
                }
                else {
                  vm.DocumentAssets.push(x);
                }
                
              })
             
              })
            }
           
         



            function setPagingData(page) {
            
              var pagedData = vm.issueData.comments.slice(
                (page - 1) *  $scope.itemsPerPage,
                page * $scope.itemsPerPage
              );
              vm.allComments = pagedData;
              /**to refresh the comments when page click use $apply */
              $scope.$apply()
            }
            function setActivityPagingData(page) {
            
              var pagedData = vm.issueData.issueActivity.slice(
                (page - 1) *  7,
                page * 7
              );
              vm.allActivities = pagedData;
              /**to refresh the comments when page click use $apply */
              $scope.$apply()
            }

            vm.getIssueDetail();
            
           
           
      //Add comments....
      vm.postComment = function(comment){
        console.log("comment: ",comment);
       let comment1 = comment.replace(/\n\r?/g, '<br />');
       console.log("comment: ",comment1);

       if(comment==undefined){
         Notification.error("Please add comment.");
       }else{
         var commentobj={"comment":comment}
         apiFactory
            .postCommentForIssue(vm.issueId,commentobj)
            .then(resp=>{
              console.log("esp:",resp);
              vm.getIssueDetail();
              $("#commentarea").val('');
              Notification.success("Comment added successfully..");
            }).catch(e=>{
              Notification.error("Couldn't update comment");
            })
       }
      };

      $scope.changeCompletionStatus = function(){
        alert("completion");
      };

      //download attachment file
      vm.downloadFile = function(docs){
        console.log("docs",docs);
        
        var blob = new Blob([docs], {type: docs.mimetype});
         console.log("blob",blob);
         saveAs(blob, docs.origionalname);
        //window.location.href = window.URL.createObjectURL(blob);
      
      }


      $scope.reOpenIssue = function(){
        //var TempObject={"completionStatus":OPEN}
        apiFactory
           .reOpenIssueStatusUpdate(vm.issueId)
           .then(resp=>{
             vm.getIssueDetail();
             $("#confirmmodal").modal("hide");
             Notification.success("Issue status is now open");
           }).catch(e=>{
             Notification.error("could not update Status");
           })
      }

      $scope.markIssueAsComplete = function(comment,imageFiles){
        console.log(comment);
        console.log(imageFiles);
        var editObject={comment:comment,Images:imageFiles};
        apiFactory.saveIssueAsComplete(vm.issueId,editObject)
          .then(resp=>{
            vm.getIssueDetail();
             $("#completionstatusmodal").modal("hide");
             Notification.success("Issue is been marked as completed");
          }).catch(e=>{
            Notification.error("Something wrong happened. couldent update changes");
          })
      }
          
      }
    })();

  