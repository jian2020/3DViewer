//Measure
function onNewDimensions(actionName) {
    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('measure');
    iframe.contentWindow.newDimensions(actionName);
}

function onDeleteDimensions() {
    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.deleteDimensions();
}

function getScene() {
    if ($('#bimviewer').contents().find('canvas').length !== 0) {
        var iframe = document.getElementById('bimviewer');
        return iframe.contentWindow.getScene();
    } else
        return false;
}

//Drawing tools
var btnStraightLine = document.getElementById("btn_draw_straightline");
var btnFreeHandLine = document.getElementById("btn_draw_freeline");
var btnSeveralLine = document.getElementById("btn_draw_severalline");
var btnCircle = document.getElementById("btn_draw_circle");
var btnText = document.getElementById("btn_draw_text");
var btnLocationText = document.getElementById("btn_draw_locationtext");

var btnCalcAngle = document.getElementById("btn_calc_angle");
var btnCalcArea = document.getElementById("btn_calc_area");
var btnCalcLength = document.getElementById("btn_calc_length");
var btnCalcVolume = document.getElementById("btn_calc_volume");
var btnCalcCircleDiameter = document.getElementById("btn_calc_circle_diameter");
var btnCalcCircleCircum = document.getElementById("btn_calc_circle_circum");
var btnDeleteDimension = document.getElementById("btn_delete_dimension");

var btnPicker = document.getElementById("btn_picker");
var btnPanMove = document.getElementById("btn_pan");
var btnOrbit = document.getElementById("btn_orbit");

var btnPushPull = document.getElementById("pushpull");

var btnDrawingTools = [];
btnDrawingTools.push(btnStraightLine);
btnDrawingTools.push(btnFreeHandLine);
btnDrawingTools.push(btnSeveralLine);
btnDrawingTools.push(btnCircle);
btnDrawingTools.push(btnText);
btnDrawingTools.push(btnLocationText);
btnDrawingTools.push(btnCalcAngle);
btnDrawingTools.push(btnCalcArea);
btnDrawingTools.push(btnCalcLength);
btnDrawingTools.push(btnCalcVolume);
btnDrawingTools.push(btnCalcCircleDiameter);
btnDrawingTools.push(btnCalcCircleCircum);
btnDrawingTools.push(btnDeleteDimension);
btnDrawingTools.push(btnPicker);
btnDrawingTools.push(btnPanMove);
btnDrawingTools.push(btnOrbit);
btnDrawingTools.push(btnPushPull);

function initDrawingToolbar() {
    btnDrawingTools.forEach(element => {
        if (element.classList.contains("toolbar-select")) {
            element.classList.remove("toolbar-select");
        }
    });
}


//Option tools 


var chkShaded = document.getElementById("view_shaded");
var chkWire = document.getElementById("view_wire");
var chkTransp = document.getElementById("view_transp");
var chkEdge = document.getElementById("view_edge");
var chkGrid = document.getElementById("view_grid");


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
chkCameras.push(document.getElementById("cam_persp"));
chkCameras.push(document.getElementById("cam_ortho"));
chkCameras.push(document.getElementById("cam_top"));
chkCameras.push(document.getElementById("cam_bottom"));
chkCameras.push(document.getElementById("cam_front"));
chkCameras.push(document.getElementById("cam_back"));
chkCameras.push(document.getElementById("cam_left"));
chkCameras.push(document.getElementById("cam_right"));

var modalDlgContainer = document.getElementById("modal_dlg_container");
var dlgEditText = document.getElementById("dlg_edittext");
var dlgOpenProject = document.getElementById("dlg_openproject");

function initDialog() {
    closeDlgEditText();
    closeDlgProject();
}


initDialog();

function onbtnPicker() {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnPicker.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDefaultDragAction('picker');
}

function onbtnPanMove() {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnPanMove.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDefaultDragAction('pan');
}

function onbtnOrbit() {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnOrbit.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDefaultDragAction('orbit');
}

// Control Camera View
function onCheckCameras(type) {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;
    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.setCameraView(type);
}
// Control view method
var isWire = false;
var isGrid = true;

function initViews() {
    chkShaded.classList.add("toolbar-select");
    chkGrid.classList.add("toolbar-select");
}
initViews();

function onCheckViews(type) {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;
    switch (type) {
        case "shaded":
            isWire = false;
            if (!chkShaded.classList.contains("toolbar-select")) {
                chkShaded.classList.add("toolbar-select");
                chkWire.classList.remove("toolbar-select");
            }
            break;
        case "wire":
            isWire = true;
            if (!chkWire.classList.contains("toolbar-select")) {
                chkWire.classList.add("toolbar-select");
                chkShaded.classList.remove("toolbar-select");
            }
            break;
        case "transp":
            if (isWire)
                return;
            if (chkTransp.classList.contains("toolbar-select")) {
                chkTransp.classList.remove("toolbar-select");
            } else {
                chkTransp.classList.add("toolbar-select");
            }
            break;
        case "edge":
            if (isWire)
                return;
            if (chkEdge.classList.contains("toolbar-select")) {
                chkEdge.classList.remove("toolbar-select");
            } else {
                chkEdge.classList.add("toolbar-select");
            }
            break;
        case "grid":
            if (chkGrid.classList.contains("toolbar-select")) {
                chkGrid.classList.remove("toolbar-select");
                isGrid = false;
            } else {
                chkGrid.classList.add("toolbar-select");
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

function openDlgProject(){
    dlgOpenProject.style.display = "flex";
    modalDlgContainer.style.display = "flex";
}
function closeDlgProject(){
    dlgOpenProject.style.display = "none";
    modalDlgContainer.style.display = "none";
}

$('#btn_open_project').click(function () {
    openDlgProject();
    initDomElements();
    openProject();
});

$('#btn_upload').click(function () {
    // var url = "https://13.233.123.29:8082/apps/bimviews/?page=Projects";
    var url = "http://localhost:8082/apps/bimviews/?page=Projects";
    window.open(url);
});

$('.collision-sub').click(function () {
    if (!$(this).parent().hasClass("active")) {
        $(this).find('.eye-small').css("display", "none");
        $(this).find('.eye-large').css('display', 'block');
    } else {
        $(this).find('.eye-small').css("display", "block");
        $(this).find('.eye-large').css('display', 'none');
    }

});

// measure length
$('.chk-measure-length').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcLength.classList.add("toolbar-select");

    $('#img_measure_length').attr('src', $(this).find('.measure-length-icon').attr('src'));
    var actionName = $(this).text().trim();
    onNewDimensions(actionName);
});

// measure area
$('.chk-measure-area').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcArea.classList.add("toolbar-select");

    $('#img_measure_area').attr('src', $(this).find('.measure-area-icon').attr('src'));
    var actionName = $(this).text().trim();
    onNewDimensions(actionName);
});

// measure area
$('#btn_calc_volume').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcVolume.classList.add("toolbar-select");

    onNewDimensions("Volume");
});

// measure angle
$('#btn_calc_angle').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcAngle.classList.add("toolbar-select");

    onNewDimensions("Angle");
});

// measure circle diameter
$('#btn_calc_circle_diameter').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcCircleDiameter.classList.add("toolbar-select");

    onNewDimensions("CircleDiameter");
});

// measure circle circumference
$('#btn_calc_circle_circum').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCalcCircleCircum.classList.add("toolbar-select");

    onNewDimensions("CircleCircum");
});

// delete dimensions
$('#btn_delete_dimension').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnDeleteDimension.classList.add("toolbar-select");

    onDeleteDimensions();
});

// draw straight lines
$('#btn_draw_straightline').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnStraightLine.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('line');
    iframe.contentWindow.newStraightLine();
});
// draw free lines
$('#btn_draw_freeline').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnFreeHandLine.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('line');
    iframe.contentWindow.newFreeLine();
});

// draw serveral lines
$('#btn_draw_severalline').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnSeveralLine.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('line');
    iframe.contentWindow.newSeveralLine();
});

// draw circles
$('#btn_draw_circle').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnCircle.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('circle');
    iframe.contentWindow.newCircle();
});

var actionText;
function setValueForText(){
    closeDlgEditText();
    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('text');

    var textContent = document.getElementById("text_content").value;
    var textSize = document.getElementById("text_size").value;
    iframe.contentWindow.newText(actionText, textContent, textSize);
}

function openDlgEditText(){
    dlgEditText.style.display = "flex";
    modalDlgContainer.style.display = "flex";
}
function closeDlgEditText(){
    dlgEditText.style.display = "none";
    modalDlgContainer.style.display = "none";
}
// draw texts
$('#btn_draw_text').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnText.classList.add("toolbar-select");

    openDlgEditText();
    actionText = "text";
});



// draw location texts
$('#btn_draw_locationtext').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;

    initDrawingToolbar();
    btnLocationText.classList.add("toolbar-select");

    openDlgEditText();
    actionText = "locationtext";
});

//push pull
$('#pushpull').click(function () {
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;
    initDrawingToolbar();
    btnPushPull.classList.add("toolbar-select");

    var iframe = document.getElementById('bimviewer');
    iframe.contentWindow.initDrawingTools();
    iframe.contentWindow.setDrawAction('pushpull');
    iframe.contentWindow.onPushPull();
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
    if ($('#bimviewer').contents().find('canvas').length === 0)
        return;
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

});


function openProject() {
    var projectUrls = {};
    var bimServerStatus = document.getElementById('bimserver_status');

    function loadFromBimserver(address, username, password, target) {
        target.innerHTML = "";
        var client = new BimServerClient(address);
        if (client.user === null) {
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
                            var id = 'project' + projectIndex;
                            pName.id = id;
                            projectUrls[id] = "../bimsurfer/examples/bimserver.html?address=" + encodeURIComponent(address) + "&token=" + client.token + "&poid=" + project.oid;
                            pName.addEventListener('click', function (event) {
                                $('#bimviewer').attr('src', projectUrls[id]);
                                $('#modal_dlg_container').css('display', 'none');
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

    // loadBimServerApi("https://thisisanexperimentalserver.com/apps/bimserverjavascriptapi", false).then(() => {
    //     try {
    //         loadFromBimserver("http://localhost:8082", "admin@ifcserver.com", "admin", document.getElementById("project_list"));
    //         //loadFromBimserver("https://13.233.123.29:8082", "admin@ifcserver.com", "admin", document.getElementById("project_list"));
    //     } catch (e) {


    //     }
    // });

    loadBimServerApi("http://localhost:8082/apps/bimserverjavascriptapi", false).then(() => {
        try {
            loadFromBimserver("http://localhost:8082", "admin@ifcserver.com", "admin", document.getElementById("project_list"));
            //loadFromBimserver("https://13.233.123.29:8082", "admin@ifcserver.com", "admin", document.getElementById("project_list"));
        } catch (e) {


        }
    });
}

var dlgStructuresContent = document.getElementById("dlg_structures_content");
var dlgLayersContent = document.getElementById("dlg_layers_content");
var dlgTypesContent = document.getElementById("dlg_types_content");

function initDomElements() {
    dlgStructuresContent.innerHTML = '';
    dlgLayersContent.innerHTML = '';
    dlgTypesContent.innerHTML = '';
}