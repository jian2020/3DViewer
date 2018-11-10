
// Material Dialog
// Make the DIV element draggagle:
// var dragItem = document.querySelector("#dlg_materials");
// var dragItem_focus = document.querySelector("#dlg_materials_focus");
// var container = document.querySelector("#toolbarContainer");

// var active = false;
// var xOffset = 0;
// var yOffset = 0;

// container.addEventListener("touchstart", dragStart, false);
// container.addEventListener("touchend", dragEnd, false);
// container.addEventListener("touchmove", drag, false);

// container.addEventListener("mousedown", dragStart, false);
// container.addEventListener("mouseup", dragEnd, false);
// container.addEventListener("mousemove", drag, false);
// function dragStart(e) {
//   if (e.target === dragItem || e.target === dragItem_focus) {
//     active = true;
//   }
//   else
//     return;
//   var posX = dragItem.getBoundingClientRect().x;
//   var posY = dragItem.getBoundingClientRect().y;
//   if (e.type === "touchstart") {
//     xOffset = e.touches[0].clientX - posX;
//     yOffset = e.touches[0].clientY - posY;
//   } else {
//     xOffset = e.clientX - posX;
//     yOffset = e.clientY - posY;
//   }
// }

// function dragEnd(e) {
//   active = false;
// }

// function drag(e) {
//   if (active) {
//     e.preventDefault();
//     if (e.type === "touchmove") {
//       dragItem.style.left = e.touches[0].clientX - xOffset + 'px';
//       dragItem.style.top = e.touches[0].clientY - yOffset + 'px';
//     } else {
//       dragItem.style.left = e.clientX - xOffset + 'px';
//       dragItem.style.top = e.clientY - yOffset + 'px';
//     }
//   }
// }

// Circle Toolbar
//Make the DIV element draggagle:
// var dragItem = document.querySelector("#toolbar");
// var dragItem_center = document.querySelector("#toolbar_center");
// var container = document.querySelector("#toolbarContainer");

// var active = false;
// var currentX;
// var currentY;
// var initialX;
// var initialY;
// var xOffset = 0;
// var yOffset = 0;

// container.addEventListener("touchstart", dragStart, false);
// container.addEventListener("touchend", dragEnd, false);
// container.addEventListener("touchmove", drag, false);

// container.addEventListener("mousedown", dragStart, false);
// container.addEventListener("mouseup", dragEnd, false);
// container.addEventListener("mousemove", drag, false);

// function dragStart(e) {
//   console.log(e)
//   if (e.type === "touchstart") {
//     initialX = e.touches[0].clientX - xOffset;
//     initialY = e.touches[0].clientY - yOffset;
//   } else {

//     initialX = e.clientX - xOffset;
//     initialY = e.clientY - yOffset;
//     console.log(initialX);
//   }

//   if (e.target === dragItem || e.target === dragItem_center) {
//     active = true;
//   }
// }

// function dragEnd(e) {
//   initialX = currentX;
//   initialY = currentY;

//   active = false;
// }

// function drag(e) {
//   if (active) {

//     e.preventDefault();

//     if (e.type === "touchmove") {
//       currentX = e.touches[0].clientX - initialX;
//       currentY = e.touches[0].clientY - initialY;
//     } else {
//       currentX = e.clientX - initialX;
//       currentY = e.clientY - initialY;
//     }

//     xOffset = currentX;
//     yOffset = currentY;

//     setTranslate(currentX, currentY, dragItem);
//   }
// }

// function setTranslate(xPos, yPos, el) {
//   el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
// }
//position into circle for toolbar icon
// var circle = document.getElementById('toolbar'),
//   btnToolbars = document.getElementsByClassName('toolbar-icon'),
//   total = btnToolbars.length,
//   coords = {},
//   diam, radius1, radius2, imgW;
// var bigcirclediam = 110;
// var icondiam = 40;

// diam = parseInt( window.getComputedStyle(circle).getPropertyValue('width') ),
// radius = bigcirclediam,
// imgW = btnToolbars[0].getBoundingClientRect().width,
// radius2 = radius - icondiam;

// var i,
//     alpha = Math.PI / 2,
//     len = btnToolbars.length,
//     corner = 2 * Math.PI / total;

// for ( i = 0 ; i < total; i++ ){

//   btnToolbars[i].style.left = parseInt( ( radius - icondiam / 2-10) + ( radius2 * Math.cos( alpha ) ) ) + 'px'
//   btnToolbars[i].style.top =  parseInt( ( radius - icondiam / 2-10) - ( radius2 * Math.sin( alpha ) ) ) + 'px'

//   alpha = alpha - corner;
// }

// Toolbar
// var _isMeasure = false;
// function onToolbarSelect(type){
//   console.log(type);
//   switch(type){
//     case "measure":
//       document.getElementById('subMeasure').style.display === 'none' ? document.getElementById('subMeasure').style.display = 'block' : document.getElementById('subMeasure').style.display = 'none';
//       for(var i=0; i<btnToolbars.length; i++)
//       {
//         if(btnToolbars[7].classList.contains("select")){
//           btnToolbars[7].classList.remove("select");
//           _isMeasure = false;
//           continue;
//         }
//         if(!btnToolbars[7].classList.contains("select")){
//           btnToolbars[7].classList.add("select");
//           _isMeasure = true;
//           continue;
//         }
//         if(btnToolbars[i].classList.contains("select")){
//           btnToolbars[i].classList.remove("select");
//         }
//       }
//       if(_isMeasure){

//       }
//       break;
//   }
// }

//Measure
function onNewDimensions(actionName) {
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.newDimensions(actionName);
    }
}
function onDeleteDimensions() {
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.deleteDimensions();
    }
}
function getScene() {
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        return iframe.contentWindow.getScene();
    }
    else
        return false;
}
//Save
// var link = document.createElement('a');
// link.style.display = 'none';
// document.body.appendChild(link); // Firefox workaround, see #6594

// function save(blob, filename) {

//     link.href = URL.createObjectURL(blob);
//     link.download = filename;
//     link.click();

//     // URL.revokeObjectURL( url ); breaks Firefox...

// }

// function saveString(text, filename) {

//     save(new Blob([text], { type: 'text/plain' }), filename);

// }


// function saveArrayBuffer(buffer, filename) {

//     save(new Blob([buffer], { type: 'application/octet-stream' }), filename);

// }

// function onSaveToGltf() {
//     var scene = getScene();
//     console.log(scene);
//     if (!scene)
//         return;

//     exportGLTF(scene);
// };

//left toolbar 
var btnStructures = document.getElementById("btn_structures");
var btnLayers = document.getElementById("btn_layers");
var btnTypes = document.getElementById("btn_types");
var dlgStructures = document.getElementById("dlg_structures");
var dlgLayers = document.getElementById("dlg_layers");
var dlgTypes = document.getElementById("dlg_types");

var btnSelector = document.getElementById("btn_selector");
var btnPanMove = document.getElementById("btn_pan");
var btnOrbit = document.getElementById("btn_orbit");

var chkShaded = document.getElementById("chk_shaded");
var chkWire = document.getElementById("chk_wire");
var chkTransp = document.getElementById("chk_transp");
var chkEdge = document.getElementById("chk_edge");
var chkGrid = document.getElementById("chk_grid");

var chkCameras = [];
var camType = [];
camType.push("perspective");
camType.push("ortho");
camType.push("top");
camType.push("bottom");
camType.push("front");
camType.push("back");
camType.push("left");
camType.push("right");
chkCameras.push(document.getElementById("chk_persp"));
chkCameras.push(document.getElementById("chk_ortho"));
chkCameras.push(document.getElementById("chk_top"));
chkCameras.push(document.getElementById("chk_bottom"));
chkCameras.push(document.getElementById("chk_front"));
chkCameras.push(document.getElementById("chk_back"));
chkCameras.push(document.getElementById("chk_left"));
chkCameras.push(document.getElementById("chk_right"));
function initDialog() {
    dlgStructures.style.display = "none";
    dlgLayers.style.display = "none";
    dlgTypes.style.display = "none";
}
function initLeftToolbar() {
    btnSelector.classList.add("select");
}
initDialog();
initLeftToolbar();
function onbtnStructures() {
    if (!btnStructures.classList.contains("select")) {
        btnStructures.classList.add("select");
        dlgStructures.style.display = "block";
    }
    else {
        btnStructures.classList.remove("select");
        dlgStructures.style.display = "none";
    }
    if (btnLayers.classList.contains("select")) {
        btnLayers.classList.remove("select");
    }
    if (btnTypes.classList.contains("select")) {
        btnTypes.classList.remove("select");
    }

    dlgLayers.style.display = "none";
    dlgTypes.style.display = "none";
}
function onbtnLayers() {
    if (btnStructures.classList.contains("select")) {
        btnStructures.classList.remove("select");
    }
    if (!btnLayers.classList.contains("select")) {
        btnLayers.classList.add("select");
        dlgLayers.style.display = "block";
    }
    else {
        btnLayers.classList.remove("select");
        dlgLayers.style.display = "none";
    }
    if (btnTypes.classList.contains("select")) {
        btnTypes.classList.remove("select");
    }

    dlgStructures.style.display = "none";
    dlgTypes.style.display = "none";
}
function onbtnTypes() {
    if (btnStructures.classList.contains("select")) {
        btnStructures.classList.remove("select");
    }
    if (btnLayers.classList.contains("select")) {
        btnLayers.classList.remove("select");
    }
    if (!btnTypes.classList.contains("select")) {
        btnTypes.classList.add("select");
        dlgTypes.style.display = "block";
    }
    else {
        btnTypes.classList.remove("select");
        dlgTypes.style.display = "none";
    }

    dlgStructures.style.display = "none";
    dlgLayers.style.display = "none";
}
function onbtnSelector() {
    if (!btnSelector.classList.contains("select")) {
        btnSelector.classList.add("select");
    }
    else {
        btnSelector.classList.remove("select");
    }
    if (btnPanMove.classList.contains("select")) {
        btnPanMove.classList.remove("select");
    }
    if (btnOrbit.classList.contains("select")) {
        btnOrbit.classList.remove("select");
    }
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.setDefaultDragAction("selector");
    }
}
function onbtnPanMove() {
    if (btnSelector.classList.contains("select")) {
        btnSelector.classList.remove("select");
    }
    if (!btnPanMove.classList.contains("select")) {
        btnPanMove.classList.add("select");
    }
    else {
        btnPanMove.classList.remove("select");
    }
    if (btnOrbit.classList.contains("select")) {
        btnOrbit.classList.remove("select");
    }
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.setDefaultDragAction("pan");
    }
}
function onbtnOrbit() {
    if (btnSelector.classList.contains("select")) {
        btnSelector.classList.remove("select");
    }
    if (btnPanMove.classList.contains("select")) {
        btnPanMove.classList.remove("select");
    }
    if (!btnOrbit.classList.contains("select")) {
        btnOrbit.classList.add("select");
    }
    else {
        btnOrbit.classList.remove("select");
    }
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.setDefaultDragAction("orbit");
    }
}

// Control Camera View
function onCheckCameras(type) {
    chkCameras.forEach(function (chkCam) {
        if (chkCam.classList.contains("fa-check")) {
            chkCam.classList.remove("fa-check");
        }
    });
    chkCameras[camType.indexOf(type)].classList.add("fa-check");

    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.setCameraView(type);
    }
}
// Control view method
var isWire = false;
var isGrid = true;
function onCheckViews(type) {
    switch (type) {
        case "shaded":
            isWire = false;
            if (!chkShaded.classList.contains("fa-check")) {
                chkShaded.classList.add("fa-check");
                chkWire.classList.remove("fa-check");
            }
            break;
        case "wire":
            isWire = true;
            if (!chkWire.classList.contains("fa-check")) {
                chkWire.classList.add("fa-check");
                chkShaded.classList.remove("fa-check");
            }
            break;
        case "transp":
            if (isWire)
                return;
            if (chkTransp.classList.contains("fa-check")) {
                chkTransp.classList.remove("fa-check");
            }
            else {
                chkTransp.classList.add("fa-check");
            }
            break;
        case "edge":
            if (isWire)
                return;
            if (chkEdge.classList.contains("fa-check")) {
                chkEdge.classList.remove("fa-check");
            }
            else {
                chkEdge.classList.add("fa-check");
            }
            break;
        case "grid":
            if (chkGrid.classList.contains("fa-check")) {
                chkGrid.classList.remove("fa-check");
                isGrid = false;
            }
            else {
                chkGrid.classList.add("fa-check");
                isGrid = true;
            }
            break;
    }
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.setViewMethod(type);
    }
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        iframe.contentWindow.showGrid(isGrid);
    }
}

$('#btn_open_project').click(function () {
    // var iframe = document.getElementById('bimviewer');
    // var doc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;
    // if(doc.getElementById('dlg_openproject'))
    //     doc.getElementById('dlg_openproject').style.display = 'block';
    document.getElementById('dlg_openproject').style.display = 'block';
});

$('#btn_upload').click(function(){
    var url = "https://13.233.123.29:8082/apps/bimviews/?page=Projects";
    window.open(url);
});

$('.collision-sub').click(function () {
    if (!$(this).parent().hasClass("active")) {
        $(this).find('.eye-small').css("display", "none")
        $(this).find('.eye-large').css('display', 'block');
    } else {
        $(this).find('.eye-small').css("display", "block")
        $(this).find('.eye-large').css('display', 'none');
    }

});
// measure length
$('.chk-measure-length').click(function () {
    $('#img_measure_length').attr('src', $(this).find('.measure-length-icon').attr('src'));

    var actionName = $(this).text().trim();
    onNewDimensions(actionName);
});

// measure area
$('.chk-measure-area').click(function () {
    $('#img_measure_area').attr('src', $(this).find('.measure-area-icon').attr('src'));

    var actionName = $(this).text().trim();
    onNewDimensions(actionName);
});

// measure area
$('#btn_calc_volume').click(function () {
    onNewDimensions("Volume");
});

// measure angle
$('#btn_calc_angle').click(function () {
    onNewDimensions("Angle");
});

// delete dimensions
$('#btn_delete_dimension').click(function () {
    onDeleteDimensions();
});

function convertFloat3ColorToString(color) {
    var r = color[0];
    var g = color[1];
    var b = color[2];

    var r_ = Math.floor(r * 255);
    var g_ = Math.floor(g * 255);
    var b_ = Math.floor(b * 255);

    // convert hex
    var r__ = r_.toString(16);
    var g__ = g_.toString(16);
    var b__ = b_.toString(16);
    return '#' + r__ + g__ + b__;
}

function convertStringToFloat3Color(str) {

    var r = str.substring(1, 3);
    var g = str.substring(3, 5);
    var b = str.substring(5, 7);

    // convert dex
    var r_ = parseInt(r, 16);
    var g_ = parseInt(g, 16);
    var b_ = parseInt(b, 16);

    var r__ = r_ / 255;
    var g__ = g_ / 255;
    var b__ = b_ / 255;

    var color = [r__, g__, b__];
    return color;
}

$('#btn_edit_material').click(function () {
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        document.getElementById('dlg_edit_materials').style.display = document.getElementById('dlg_edit_materials').style.display === 'none' ? 'flex' : 'none';
        var iframe = document.getElementById('bimviewer');
        var material = iframe.contentWindow.getSelectedMaterial();
        var type = material._state.type;
        var edit_material_name = document.getElementById('edit_mat_name');
        edit_material_name.innerText = type + ' - ' + material.id;

        var edit_values = document.getElementById('edit_mat_values');
        edit_values.innerHTML = '';
        switch (type) {
            case 'EmphasisMaterial':
                var fill_tr = document.createElement('tr');
                var fill_td_0 = document.createElement('td');
                var fill_td_1 = document.createElement('td');
                var fill_label = document.createElement('label');
                fill_label.innerText = 'Fill';
                fill_label.classList.add('material-edit-value-label');
                var fill_check = document.createElement('input');
                fill_check.type = 'checkbox';
                fill_check.classList.add('material-edit-value-check');
                fill_td_0.appendChild(fill_label);
                fill_td_1.appendChild(fill_check);
                fill_tr.appendChild(fill_td_0);
                fill_tr.appendChild(fill_td_1);

                var fill_color_tr = document.createElement('tr');
                var fill_color_td_0 = document.createElement('td');
                var fill_color_td_1 = document.createElement('td');
                var fill_color_label = document.createElement('label');
                fill_color_label.innerText = 'Fill Color';
                fill_color_label.classList.add('material-edit-value-label');
                var fill_color_div = document.createElement('div');
                fill_color_div.classList.add('material-edit-value-div');

                var fill_color_value = material.fillColor;
                fill_color_value = convertFloat3ColorToString(fill_color_value);
                fill_color_div.style.background = fill_color_value;
                fill_color_td_0.appendChild(fill_color_label);
                fill_color_td_1.appendChild(fill_color_div);
                fill_color_tr.appendChild(fill_color_td_0);
                fill_color_tr.appendChild(fill_color_td_1);



                var fill_color_picker = new Picker({
                    parent: fill_color_div,
                    popup: 'right',
                    alpha: false,
                    color: fill_color_value
                });

                fill_color_picker.onChange = function (color) {
                    fill_color_div.style.background = color.rgbaString;
                    material.fillColor = [color.rgba[0] / 255, color.rgba[1] / 255, color.rgba[2] / 255];
                    iframe.contentWindow.changeSelectedMaterial(material);
                };
                //Open the popup manually:
                // fill_color_picker.openHandler();

                edit_values.appendChild(fill_tr);
                edit_values.appendChild(fill_color_tr);


                break;
            case 'PhongMaterial':
                break;
            case 'MetallicMaterial':
                break;
            case 'SpecularMaterial':
                break;
            case 'OutlineMaterial':
                break;
            default:
                break;
        }
    }

});


//init materials and color dialog
// function initPreviewMatDialog(){
//     var canv=document.getElementById("material_preview");
//     var ctx= canv.getContext("2d");
//     var img = new Image();
//     img.src = "../../assets/images/dialog/sample.png";

//     var canv_w = ctx.canvas.clientWidth;
//     var canv_h = ctx.canvas.clientHeight;
//     var img_w = img.width;
//     var img_h = img.height;
//     var img_ratio = img_w / img_h;

//     var dWidth = 0;
//     var dHeight = 0;
//     if(img_ratio >= 1){
//         dWidth = canv_w;
//         dHeight = dWidth/img_ratio;
//     }
//     else{
//         dHeight = canv_h;
//         dWidth = dHeight * img_ratio;
//     }
//     var dx = (canv_w - dWidth)/2;
//     var dy = (canv_h - dHeight)/2;
//     ctx.drawImage(img,0,0, img_w, img_h, dx, dy, dWidth, dHeight);
// }

// function initSampleMatDialog(){
//     var canvs = document.getElementsByClassName("material-sample-icon")

//     for(var i=0; i<canvs.length; i++){
//         var canv=canvs[i];
//         var ctx= canv.getContext("2d");
//         var img = new Image();
//         img.src = "../../assets/images/dialog/material.png";

//         var canv_w = ctx.canvas.clientWidth;
//         var canv_h = ctx.canvas.clientHeight;
//         var img_w = img.width;
//         var img_h = img.height;
//         var img_ratio = img_w / img_h;

//         var dWidth = 0;
//         var dHeight = 0;
//         if(img_ratio >= 1){
//             dWidth = canv_w;
//             dHeight = dWidth/img_ratio;
//         }
//         else{
//             dHeight = canv_h;
//             dWidth = dHeight * img_ratio;
//         }
//         var dx = (canv_w - dWidth)/2;
//         var dy = (canv_h - dHeight)/2;
//         ctx.drawImage(img,0,0, img_w, img_h, dx, dy, dWidth, dHeight);
//     }

// }

// window.onload = function() {
//     initPreviewMatDialog();
//     initSampleMatDialog();
// };



var projectUrls = {};
var bimServerStatus = document.getElementById('bimserver_status');
function loadFromBimserver(address, username, password, target) {
    target.innerHTML = "";
    var client = new BimServerClient(address);
    if(client.user === null){
        bimServerStatus.innerText = "BimServer not found";
    }
    client.init(function () {
        var projectIndex = 0;
        projectUrls = {};
        bimServerStatus.textContent = "Logging in...";
        client.login(username, password, function () {
            bimServerStatus.textContent = "Getting all projects...";
            client.call("ServiceInterface", "getAllProjects", {
                onlyTopLevel: true,
                onlyActive: true
            }, function (projects) {
                var totalFound = 0;
                projects.forEach(function (project) {
                    if (project.lastRevisionId != -1) {
                        var pName = document.createElement("div");
                        pName.textContent = project.name;
                        pName.classList.add('project-name');
                        var id = 'project'+ projectIndex;
                        pName.id = id;
                        projectUrls[id] = "../bimsurfer/examples/bimserver.html?address=" + encodeURIComponent(address) + "&token=" + client.token + "&poid=" + project.oid; 
                        pName.addEventListener('click', function (event) {
                            $('#bimviewer').attr('src', projectUrls[id]);
                            $('#dlg_openproject').css('display', 'none');
                        });
                        target.appendChild(pName);
                        totalFound++;
                        projectIndex++;
                    }
                });
                if (totalFound == 0) {
                    bimServerStatus.textContent = "No projects with revisions found on this server";
                } else {
                    bimServerStatus.textContent = "";
                }
            });
        }, function (error) {
            console.error(error);
            bimServerStatus.innerText = error.message;
        });
    });
}

function loadBimServerApi(apiAddress, loadUmd) {
    //console.log(loadUmd);
    var p = new Promise(function (resolve, reject) {
        if (loadUmd) {
            // TODO
            LazyLoad.js([Settings.getBimServerApiAddress() + "/bimserverapi.umd.js?_v=" + apiVersion], function () {
                window.BimServerClient = bimserverapi.default;
                window.BimServerApiPromise = bimserverapi.BimServerApiPromise;

                resolve(bimserverapi);
            });
        } else {
            // Using eval here, so we don't trip the browsers that don't understand "import"
            // The reason for using it this way is so we can develop this library and test it without having to transpile.
            // Obviously developers need to have a browser that understands "import" (i.e. a recent version of Chrome, Firefox etc...)

            // TODO One remaining problem here is that dependencies are not loaded with the "apiVersion" attached, so you need to have your browser on "clear cache" all the time

            var apiVersion = new Date().getTime();
            //console.log(apiVersion);

            var str = "import(\"" + apiAddress + "\" + \"/bimserverclient.js?_v=" + apiVersion + "\").then((bimserverapi) => {	window.BimServerClient = bimserverapi.default; window.BimServerApiPromise = bimserverapi.BimServerApiPromise; resolve(bimserverapi);});";

            eval(str);
        }
    });
    return p;
}

loadBimServerApi("https://thisisanexperimentalserver.com/apps/bimserverjavascriptapi", false).then(() => {	
    try {
        loadFromBimserver("https://13.233.123.29:8082", "admin@ifcserver.com", "admin", document.getElementById("project_list"));
    } catch (e) {
        

    }
});

