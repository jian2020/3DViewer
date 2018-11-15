define([
    "../lib/xeogl"
], function () {

    "use strict";

    xeogl.Mover = xeogl.Component.extend({

        type: "xeogl.Mover",

        _init: function (cfg) {
            var scene = this.scene;
            var input = scene.input;
            var camera = scene.camera;
            var canvas = scene.canvas;
            var math = xeogl.math;
            var status = cfg.status;

            var isStart = false;
            var isSelect = false;

            var actions = {
                NONE: -1,
                PUSHPULL: 0,
            };

            this.cancelPushPull = function () {
                isStart = false;
            };

            var currentAction = actions.NONE;

            var pushPullPlanePositions = [];
            var pushPullPlaneIndices = [];

            var calibratePushPullPreview = new xeogl.Entity(scene, {
                geometry: new xeogl.Geometry(scene, {
                    primitive: "triangles",
                    positions: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    indices: [0, 1, 2]
                }),
                material: new xeogl.PhongMaterial(scene, {
                    diffuse: [0, 0, 0],
                    backfaces: true,
                    lineWidth: 5
                }),
                ghostMaterial: new xeogl.EmphasisMaterial(scene, {
                    edges: true,
                    edgeAlpha: 1.0,
                    edgeColor: [1, 0.0039, 0.782],
                    edgeWidth: 5,
                    vertices: true,
                    vertexAlpha: 0.5,
                    vertexColor: [1, 0.0039, 0.782],
                    vertexSize: 10,
                    fill: false,
                    fillColor: [1, 0.0039, 0.782],
                    fillAlpha: 0.8
                }),
                ghosted: true,
                pickable: false,
                layer: 0,
                visible: false
            });

            var initMover = function () {
                isStart = false;
                isSelect = false;
                currentAction = actions.NONE;
                pushPullPlanePositions = [];
                pushPullPlaneIndices = [];
                calibratePushPullPreview.visible = false;
            };

            this.newMover = function (actionName) {
                initMover();
                switch (actionName) {
                    case 'PushPull':
                        currentAction = actions.PUSHPULL;
                        break;
                    default:
                        break;
                }
                isStart = true;
            };

            input.on("mousemove",
                function (canvasPos) {
                    if (isStart && !isSelect) {
                        updateHitCursorForMover(canvasPos);
                    }
                    if (isSelect) {
                        moveTarget(canvasPos);
                    }
                });
            input.on("mousedown",
                function (canvasPos) {
                    if (isStart && input.mouseDownLeft) {
                        oldCanvasPos = canvasPos;
                        if (!isSelect)
                            moverDecide(canvasPos);
                        else {
                            moverFinish();
                        }
                    }
                });

            var updateHitCursorForMover = function (canvasPos) {
                var hit = scene.pick({
                    canvasPos: canvasPos,
                    pickSurface: true
                });

                if (hit) {
                    // setCursor("pointer", true);
                    if (hit.worldPos) {
                        switch (currentAction) {
                            case actions.PUSHPULL:
                                calibratePushPull(hit);
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    calibratePushPullPreview.visible = false;
                }
            };

            var moverDecide = function (canvasPos) {
                var hit = scene.pick({
                    canvasPos: canvasPos,
                    pickSurface: true
                });
                if (hit) {
                    if (hit.worldPos) {
                        // TODO: This should be somehow hit.viewPos.z, but doesn't seem to be
                        switch (currentAction) {
                            case actions.PUSHPULL:
                                pushPullDecide(hit);
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    // setCursor("auto", true);
                }
            };


            var pushpullPlaneNormal;

            var calibratePushPull = function (hit) {
                var entity = hit.entity;
                var positions = entity.worldPositions;
                var hitPlaneIndices = hit.indices;
                var indices = entity.geometry.indices;
                var hitPos = hit.worldPos;
                pushPullPlanePositions = [];
                pushpullPlaneNormal = math.vec3();

                var hitPlanePos0 = [entity.worldPositions[hitPlaneIndices[0] * 3], entity.worldPositions[hitPlaneIndices[0] * 3 + 1], entity.worldPositions[hitPlaneIndices[0] * 3 + 2]];
                var hitPlanePos1 = [entity.worldPositions[hitPlaneIndices[1] * 3], entity.worldPositions[hitPlaneIndices[1] * 3 + 1], entity.worldPositions[hitPlaneIndices[1] * 3 + 2]];
                var hitPlanePos2 = [entity.worldPositions[hitPlaneIndices[2] * 3], entity.worldPositions[hitPlaneIndices[2] * 3 + 1], entity.worldPositions[hitPlaneIndices[2] * 3 + 2]];

                math.triangleNormal(hitPlanePos0, hitPlanePos1, hitPlanePos2, pushpullPlaneNormal);
                math.normalizeVec3(pushpullPlaneNormal, pushpullPlaneNormal);

                var _sI = [];
                for (var i = 0; i < positions.length / 3; i++) {
                    var v = [positions[i * 3] - hitPlanePos0[0], positions[i * 3 + 1] - hitPlanePos0[1], positions[i * 3 + 2] - hitPlanePos0[2]];
                    var dot = math.dotVec3(pushpullPlaneNormal, v);
                    if (dot === 0) {
                        pushPullPlanePositions.push(positions[i]);
                        pushPullPlanePositions.push(positions[i + 1]);
                        pushPullPlanePositions.push(positions[i + 2]);
                        _sI.push(i);
                    }
                }

                pushPullPlaneIndices = [];
                for (var j = 0; j < indices.length / 3; j++) {
                    var i_0 = indices[j * 3];
                    var i_1 = indices[j * 3 + 1];
                    var i_2 = indices[j * 3 + 2];

                    if (_sI.indexOf(i_0) !== -1 && _sI.indexOf(i_1) !== -1 && _sI.indexOf(i_2) !== -1) {
                        pushPullPlaneIndices.push(i_0);
                        pushPullPlaneIndices.push(i_1);
                        pushPullPlaneIndices.push(i_2);
                    }
                }

                // console.log(positions,indices);
                var geo = new xeogl.Geometry(scene, {
                    primitive: "triangles",
                    positions: positions,
                    indices: pushPullPlaneIndices
                });
                calibratePushPullPreview.geometry = geo;
                calibratePushPullPreview.visible = true;

            };

            var selectedEntity;
            var moveIndices = [];
            var selectedEntityPositions;
            var selectedEntityWPositions;
            var deltaLandW;
            var pushPullDecide = function (hit) {
                if (!calibratePushPullPreview.visible)
                    return;

                if (isSelect) {
                    isSelect = false;
                } else {
                    isSelect = true;
                    selectedEntity = hit.entity;

                    math.normalizeVec3(pushpullPlaneNormal, pushpullPlaneNormal);

                    selectedEntityPositions = selectedEntity.geometry.positions;
                    selectedEntityWPositions = selectedEntity.worldPositions;
                    deltaLandW = [selectedEntityPositions[0] - selectedEntityWPositions[0], selectedEntityPositions[1] - selectedEntityWPositions[1],selectedEntityPositions[2] - selectedEntityWPositions[2]];

                    var ind = [];
                    moveIndices = [];
                    for (var a = 0; a < pushPullPlaneIndices.length; a++) {
                        var i = pushPullPlaneIndices[a];
                        if (ind.indexOf(i) !== -1)
                            continue;
                        ind.push(i);
                        var s_p0 = selectedEntityPositions[i * 3];
                        var s_p1 = selectedEntityPositions[i * 3 + 1];
                        var s_p2 = selectedEntityPositions[i * 3 + 2];

                        var s_p = [s_p0, s_p1, s_p2];

                        //find same positions
                        for (var b = 0; b < selectedEntityPositions.length / 3; b++) {
                            var p_p = [selectedEntityPositions[b * 3], selectedEntityPositions[b * 3 + 1], selectedEntityPositions[b * 3 + 2]];
                            if (distanceVec3(s_p, p_p) < 0.3) {
                                moveIndices.push(b);
                            }
                        }

                    }
                }
            };

            var oldCanvasPos;
            var moveSensitivity = 15;
            var moveTarget = function (canvasPos) {
                if (oldCanvasPos[0] === canvasPos[0] && oldCanvasPos[1] === canvasPos[1]) {
                    return;
                }
                var deltaMove = canvasPos[0] - oldCanvasPos[0] + oldCanvasPos[1] - canvasPos[1];
                oldCanvasPos = canvasPos;

                for(var i = 0; i<moveIndices.length; i++){
                    selectedEntityPositions[moveIndices[i]*3] += deltaMove * pushpullPlaneNormal[0] * moveSensitivity;
                    selectedEntityPositions[moveIndices[i]*3+1] += deltaMove * pushpullPlaneNormal[1] * moveSensitivity;
                    selectedEntityPositions[moveIndices[i]*3+2] += deltaMove * pushpullPlaneNormal[2] * moveSensitivity;
                }

                selectedEntity.geometry.positions = selectedEntityPositions;

                selectedEntityWPositions = []; 
                for(var j=0; j<selectedEntityPositions.length/3; j++){
                    selectedEntityWPositions.push( selectedEntityPositions[j*3] - deltaLandW[0] ); 
                    selectedEntityWPositions.push( selectedEntityPositions[j*3+1] - deltaLandW[1] ); 
                    selectedEntityWPositions.push( selectedEntityPositions[j*3+2] - deltaLandW[2] ); 
                }

                selectedEntity.worldPositions = selectedEntityWPositions;
                // console.log(pushPullPlaneIndices);
            };

            var moverFinish = function () {
                isSelect = false;
                pushPullPlanePositions = [];
                pushPullPlaneIndices = [];
                calibratePushPullPreview.visible = false;
            };

            var distanceVec3 = function (a, b) {
                var c0 = a[0] - b[0];
                var c1 = a[1] - b[1];
                var c2 = a[2] - b[2];
                return Math.sqrt(c0 * c0 + c1 * c1 + c2 * c2);
            };

        },

        _props: {

        }
    });
});