// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    // gl_PointSize = 10.0;
    gl_PointSize = u_Size;
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


function setupWebGL(){
   // Retrieve <canvas> element
   canvas = document.getElementById('webgl');

   // Get the rendering context for WebGL
   gl = getWebGLContext(canvas,{ preserveDrawingBuffer: true});
   if (!gl) {
     console.log('Failed to get the rendering context for WebGL');
     return;
   }
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
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
  gl.clear(gl.COLOR_BUFFER_BIT);
}

/*
class Point{
  constructor(){
    this.type='point';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
  }

  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Draw
    gl.uniform1f(u_Size, size);

    gl.drawArrays(gl.POINTS, 0, 1);

  }
}
*/

/*
var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
*/

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
  }else if(g_selectedType == RECTANGLE){
    point1 = new Rectangle();
  }else if(g_selectedType == O_Shape){
    point1 = new OClass();
  }else if(g_selectedType == X_Shape){
    point1 = new XClass();
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
  document.getElementById('Recreate').onclick = function() { recreatePhoto() };

  document.getElementById('Point').onclick = function(){g_selectedType=POINT};
  document.getElementById('Triangle').onclick = function(){g_selectedType=TRIANGLE};
  document.getElementById('Circle').onclick = function(){g_selectedType=CIRCLE};
  document.getElementById('Rectangle').onclick = function(){g_selectedType=RECTANGLE};
  document.getElementById('OClass').onclick = function(){g_selectedType=O_Shape};
  document.getElementById('XClass').onclick = function(){g_selectedType=X_Shape};

  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {selectedSize = this.value;});
  document.getElementById('segmentSlide').addEventListener('mouseup', function() {cir_segment = this.value;});

  document.getElementById('greenBackground').onclick = function() {shapeList = []; gl.clearColor(0.0, 1.0, 0.0, 1.0); renderAllShapes(); };
  document.getElementById('redBackground').onclick = function() {shapeList = []; gl.clearColor(1.0, 0.0, 0.0, 1.0); renderAllShapes(); };
  document.getElementById('blueBackground').onclick = function() {shapeList = []; gl.clearColor(0.0, 0.0, 1.0, 1.0); renderAllShapes(); };
}

function renderAllShapes(){

  var startTime = performance.now();
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_points.length;
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
    */
  }

  var performanceTests = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + " ms: " + Math.floor(performanceTests) + " fps: " + Math.floor(10000/performanceTests)/10, "numdot" );

}

function sendTextToHTML(text,HTMLID){
  var htmlElemCapture = document.getElementById(HTMLID);
  if(!HTMLID){
    console.log("Failed/Cannot to get " + HTMLID + "from HTML");
    return;
  }
  htmlElemCapture.innerHTML = text;
}



function recreatePhoto(){

  shapeList = [];
  gl.clearColor(0.55, 0.27, 0.07, 1.0);

  let c1 = new Circle();
  c1.position = [0.55, 0.45];
  c1.color = [0.0,0.0,1.0,1];
  c1.size = 50;
  c1.segments = 24;
  shapeList.push(c1);

  let c2 = new Circle();
  c2.position = [0.55, 0.15];
  c2.color = [0.0,0.0,1.0,1];
  c2.size = 75;
  c2.segments = 24;
  shapeList.push(c2);

  let c3 = new Circle();
  c3.position = [0.55, -0.15];
  c3.color = [0.0,0.0,1.0,1];
  c3.size = 35;
  c3.segments = 24;
  shapeList.push(c3);

  let r1 = new Rectangle();
  r1.position = [0.15, 0.45];
  r1.color = [0.30, 0.18, 0.09, 1.0];
  r1.size = 17;
  shapeList.push(r1);

  let r2 = new Rectangle();
  r2.position = [0.55, 0.75];
  r2.color = [0.30, 0.18, 0.09, 1.0];
  r2.size = 17;
  shapeList.push(r2);

  let r3 = new Rectangle();
  r3.position = [0.55, -0.55];
  r3.color = [0.30, 0.18, 0.09, 1.0];
  r3.size = 17;
  shapeList.push(r3);

  let r4 = new Rectangle();
  r4.position = [0.25, -0.55];
  r4.color = [0.30, 0.18, 0.09, 1.0];
  r4.size = 17;
  shapeList.push(r4);

  let r5 = new Rectangle();
  r5.position = [-0.25, -0.45];
  r5.color = [0.30, 0.18, 0.09, 1.0];
  r5.size = 17;
  shapeList.push(r5);

  let t1 = new Triangle();
  t1.position = [-0.25, -0.37];
  t1.color = [0.13, 0.55, 0.13, 1.0];
  t1.size = 25;
  shapeList.push(t1);

  let t2 = new Triangle();
  t2.position = [-0.25, -0.30];
  t2.color = [0.13, 0.55, 0.13, 1.0];
  t2.size = 25;
  shapeList.push(t2);

  let t3 = new Triangle();
  t3.position = [0.25, -0.37];
  t3.color = [0.13, 0.55, 0.13, 1.0];
  t3.size = 25;
  shapeList.push(t3);

  let t4 = new Triangle();
  t4.position = [0.25, -0.45];
  t4.color = [0.13, 0.55, 0.13, 1.0];
  t4.size = 25;
  shapeList.push(t4);

  let t5 = new Triangle();
  t5.position = [0.55, -0.45];
  t5.color = [0.13, 0.55, 0.13, 1.0];
  t5.size = 25;
  shapeList.push(t5);

  let t6 = new Triangle();
  t6.position = [0.55, -0.37];
  t6.color = [0.13, 0.55, 0.13, 1.0];
  t6.size = 25;
  shapeList.push(t6);

  let t7 = new Triangle();
  t7.position = [0.55, 0.85];
  t7.color = [0.13, 0.55, 0.13, 1.0];
  t7.size = 25;
  shapeList.push(t7);

  let t8 = new Triangle();
  t8.position = [0.55, 0.93];
  t8.color = [0.13, 0.55, 0.13, 1.0];
  t8.size = 25;
  shapeList.push(t8);

  let t9 = new Triangle();
  t9.position = [0.15, 0.55];
  t9.color = [0.13, 0.55, 0.13, 1.0];
  t9.size = 25;
  shapeList.push(t9);

  let t10 = new Triangle();
  t10.position = [0.15, 0.63];
  t10.color = [0.13, 0.55, 0.13, 1.0];
  t10.size = 25;
  shapeList.push(t10);

  let mountain1 = new Triangle();
  mountain1.position = [-0.45, 0.63];
  mountain1.color = [0.22, 0.14, 0.07, 1.0];
  mountain1.size = 100;
  shapeList.push(mountain1);

  let path1 = new Rectangle();
  path1.position = [-0.25, 0.15];
  path1.color = [1.0, 0.0, 0.0, 1.0];
  path1.size = 17;
  shapeList.push(path1);

  let path2 = new Rectangle();
  path2.position = [-0.55, 0.05];
  path2.color = [1.0, 0.0, 0.0, 1.0];
  path2.size = 17;
  shapeList.push(path2);

  let path3 = new Rectangle();
  path3.position = [-0.65, -0.15];
  path3.color = [1.0, 0.0, 0.0, 1.0];
  path3.size = 17;
  shapeList.push(path3);

  let path4 = new Rectangle();
  path4.position = [-0.90, -0.25];
  path4.color = [1.0, 0.0, 0.0, 1.0];
  path4.size = 17;
  shapeList.push(path4);

  let path5 = new Rectangle();
  path5.position = [-0.0, 0.15];
  path5.color = [1.0, 0.0, 0.0, 1.0];
  path5.size = 17;
  shapeList.push(path5);


  let circled = new OClass();
  circled.position = [0.35, 0.15];
  circled.color = [1.0, 0.0, 0.0, 1.0];
  circled.size = 30;
  circled.segments = 30;
  shapeList.push(circled);

  let marker = new XClass();
  marker.position = [0.35, 0.15];
  marker.color = [0.0, 0.0, 0.0, 1.0];
  marker.size = 50;
  shapeList.push(marker);


  renderAllShapes();

}




