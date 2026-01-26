/*
Sean O'Shea-Reyff
sosheare@ucsc.edu
CSE160
Winter 2026
Professor Davis
ColoredPoints.js (asg1.js)
*/

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float; 
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const RECTANGLE = 3;
const O_Shape = 4;
const X_Shape = 5;

// Global Variables;
let canvas;
let gl;
let a_Position;
let u_FragColor;
let selectedSize=5;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let u_Size;
let cir_segment;
let g_selectedSize=POINT;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_globalAngle = 0;


function setupWebGL(){
   // Retrieve <canvas> element
   canvas = document.getElementById('webgl');

   // Get the rendering context for WebGL
   gl = canvas.getContext("webgl",{ preserveDrawingBuffer: true});
   if (!gl) {
     console.log('Failed to get the rendering context for WebGL');
     return;
   }

   gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
}

var shapeList = [];

function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev);


  let point1;
//  let point1 = new PointerEvent();
  if(g_selectedType == POINT){
    point1 = new Point();
  }else if(g_selectedType == TRIANGLE){
    point1 = new Triangle();
  }else if(g_selectedType == CIRCLE){
    point1 = new Circle();
  }
  point1.position=[x,y];
  point1.color=g_selectedColor.slice();
  point1.size=selectedSize;
  shapeList.push(point1);


  /*
  // Store the coordinates to g_points array
  g_points.push([x, y]);

  g_colors.push(g_selectedColor.slice());

  g_sizes.push(selectedSize);
  */

  /*
  // Store the coordinates to g_points array
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */

  renderAllShapes();

}


function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function addActionsForHTMLUI(){
  document.getElementById('Green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('Red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('Blue').onclick = function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; };
  document.getElementById('Clear').onclick = function() { shapeList = [];  gl.clearColor(0.0, 0.0, 0.0, 1.0); renderAllShapes();};

  document.getElementById('Point').onclick = function(){g_selectedType=POINT};
  document.getElementById('Triangle').onclick = function(){g_selectedType=TRIANGLE};
  document.getElementById('Circle').onclick = function(){g_selectedType=CIRCLE};

  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {selectedSize = this.value;});
  document.getElementById('segmentSlide').addEventListener('mouseup', function() {cir_segment = this.value;});
  //document.getElementById('angleSlide').addEventListener('mouseup', function() {g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); });

}

function renderAllShapes(){

  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length;
  /*
  var len = shapeList.length;

  for(var i = 0; i < len; i++) {

    shapeList[i].render();

    /*
    var xy = shapeList[i].position;
    var rgba = shapeList[i].color;
    var size = shapeList[i].size;

    
    var xy = g_points[i];
    var rgba = g_colors[i];
    var size = g_sizes[i];
    

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.uniform1f(u_Size, size);

    gl.drawArrays(gl.POINTS, 0, 1);
  }
  */

  drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);

  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.matrix.translate(-.25,-0.5,0.0 );
  body.matrix.scale(0.5,1,0.5);
  body.render();

  var leftArm = new Cube();
  leftArm.color = [1.0, 1.0, 0.0, 1.0];
  leftArm.matrix.translate(0.8, 0, 0.0);
  leftArm.matrix.rotate(45, 0, 0, 1);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.render();

  var testBox = new Cube();
  testBox.color = [1.0, 1.0, 0.0, 1.0];
  testBox.matrix.translate(0.0, 0.0, -0.50, 0);
  testBox.matrix.rotate(-30, 1.0, 0.0, 0.0);
  testBox.matrix.scale(0.5, 0.5, 0.5);
  testBox.render();

  var performanceTests = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(performanceTests) + " fps: " + Math.floor(10000/performanceTests)/10, "numdot");

}

function sendTextToHTML(text,HTMLID){
  var htmlElemCapture = document.getElementById(HTMLID);
  if(!htmlElemCapture){
    console.log("Failed/Cannot to get " + HTMLID + "from HTML");
    return;
  }
  htmlElemCapture.innerHTML = text;
}





