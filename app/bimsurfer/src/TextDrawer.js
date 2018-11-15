define([
    "../lib/xeogl"
], function () {

    "use strict";

    xeogl.TextDrawer = xeogl.Component.extend({

        type: "xeogl.TextDrawer",

        _init: function (cfg) {
            var scene = this.scene;
            var input = scene.input;
            var camera = scene.camera;
            var canvas = scene.canvas;
            var math = xeogl.math;
            var status = cfg.status;

            var isNew = false;
            var originPos = math.vec3();

            var text;
            var texts = [];

            var txtContent;
            var txtSize;

            var actions = {
                NONE: -1,
                TEXT: 0,
                LOCATIONTEXT: 1
            };

            var currentAction = actions.NONE;



            var matText = new xeogl.PhongMaterial(scene, {
                diffuse: [0, 0, 0],
                backfaces: true,
                lineWidth: 5,
                alpha: 0.4
            });

            var matLocationText = new xeogl.PhongMaterial(scene, {
                diffuse: [0.4, 0.6, 0],
                backfaces: true,
                lineWidth: 5,
                alpha: 0.4
            });

            var hmatText = new xeogl.EmphasisMaterial(scene, {
                edges: true,
                edgeAlpha: 1.0,
                edgeColor: [0, 0, 1],
                edgeWidth: 5,
                vertices: true,
                vertexAlpha: 0.5,
                vertexColor: [0, 0, 1],
                vertexSize: 10,
                fill: false,
                fillColor: [0, 0, 1],
                fillAlpha: 1
            });

            var gmatText = new xeogl.EmphasisMaterial(scene, {
                edges: true,
                edgeAlpha: 1.0,
                edgeColor: [0, 0, 0],
                edgeWidth: 2,
                vertices: true,
                vertexAlpha: 0.5,
                vertexColor: [0, 0, 0],
                vertexSize: 5,
                fill: true,
                fillColor: [0, 0, 0],
                fillAlpha: 0.6
            });

            input.on("mousedown",
                function (canvasPos) {
                    if (isNew) {
                        switch (currentAction) {
                            case actions.TEXT:
                                drawingText(canvasPos);
                                break;
                            case actions.LOCATIONTEXT:
                                drawingLocationText(canvasPos);
                                break;
                            default:
                                break;
                        }
                    }
                });

            this.cancelDrawText = function () {
                isNew = false;
            };

            this.newText = function (action, txt, size) {
                txtContent = txt;
                txtSize = size;
                isNew = true;
                switch (action) {
                    case 'text':
                        currentAction = actions.TEXT;
                        break;
                    case 'locationtext':
                        currentAction = actions.LOCATIONTEXT;
                        break;
                    default:
                        break;
                }
            };

            var drawingText = function (canvasPos) {
                var hit = scene.pick({
                    canvasPos: canvasPos,
                    pickSurface: true
                });
                if (hit) {
                    if (hit.worldPos) {
                        // TODO: This should be somehow hit.viewPos.z, but doesn't seem to be
                        text = new xeogl.Entity(scene, { // Label
                            geometry: new xeogl.VectorTextGeometry(scene, {
                                text: txtContent,
                                size: txtSize
                            }),
                            material: matText,
                            pickable: true,
                            collidable: true,
                            visible: true,
                            transform: new xeogl.Translate(scene, {
                                xyz: hit.worldPos
                            })
                            // billboard: "spherical"
                        });
                        isNew = false;
                    }
                } else {
                    // setCursor("auto", true);
                }
            };

            var drawingLocationText = function (canvasPos) {
                var hit = scene.pick({
                    canvasPos: canvasPos,
                    pickSurface: true
                });
                if (hit) {
                    if (hit.worldPos) {
                        // TODO: This should be somehow hit.viewPos.z, but doesn't seem to be
                        text = new xeogl.Entity(scene, { // Label
                            geometry: new xeogl.VectorTextGeometry(scene, {
                                text: txtContent,
                                size: txtSize
                            }),
                            material: matLocationText,
                            pickable: false,
                            collidable: true,
                            visible: true,
                            transform: new xeogl.Translate(scene, {
                                xyz: hit.worldPos
                            }),
                            billboard: "spherical"
                        });
                        isNew = false;
                    }
                } else {
                    // setCursor("auto", true);
                }
            };

        },

        _props: {

        }
    });
});