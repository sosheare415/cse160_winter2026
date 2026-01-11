// DrawRectangle.js
let canvas, ctx, scale;
function main() {
// Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

// Get the rendering context for 2DCG <- (2)
ctx = canvas.getContext('2d');
scale = 20;

// Draw a blue rectangle <- (3)
ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

//let v1 = new Vector3([2.25,2.25,0]);
//drawVector(v1, 'red')
}

function drawVector(givenVector, color){
    var vX = givenVector.elements[0] * scale;
    var vY = givenVector.elements[1] * scale;
    var vZ = givenVector.elements[2] * scale;

    ctx.strokeStyle = color;
    ctx.beginPath();
    var vectorXBeginning = canvas.width/2;
    var vectorYBeginning = canvas.height/2;
    ctx.moveTo(vectorXBeginning, vectorYBeginning);
    ctx.lineTo(vectorXBeginning + vX, vectorYBeginning - vY);
    ctx.stroke();


}

function angleBetween(v1, v2){
    var vector1Magnitude = v1.magnitude();
    var vector2Magnitude = v2.magnitude();
    var total = vector1Magnitude + vector2Magnitude;

    var dotProduct = Vector3.dot(v1, v2);

    var angle = Math.acos(dotProduct / total);

    angle = angle * (180 / Math.PI);

    return angle;
}

function areaTriangle(v1, v2){
    var crossProduct = Vector3.cross(v1, v2);
    var cdMagnitude = crossProduct.magnitude();

    var area = 0.5 * cdMagnitude;

    return area;
}

function handleDrawEvent(){
    let v1X = document.getElementById("v1x").value;
    let v1Y = document.getElementById("v1y").value;

    let v2X = document.getElementById("v2x").value;
    let v2Y = document.getElementById("v2y").value;

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let vector1 = new Vector3([v1X, v1Y, 0]);
    let vector2 = new Vector3([v2X, v2Y, 0]);
    drawVector(vector1, 'red');
    drawVector(vector2, 'blue');

    console.log(vector1)
}

function handleDrawOperationEvent(){
    let v1X = document.getElementById("v1x").value;
    let v1Y = document.getElementById("v1y").value;

    let v2X = document.getElementById("v2x").value;
    let v2Y = document.getElementById("v2y").value;

    let scalarValue = document.getElementById("scalarValue").value;
    var operationChoice = document.getElementById("operationselection").value;

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let vector1 = new Vector3([v1X, v1Y, 0]);
    let vector2 = new Vector3([v2X, v2Y, 0]);
    let vector3 = new Vector3([0, 0, 0]);
    let vector4 = new Vector3([0, 0, 0]);

    drawVector(vector1, 'red');
    drawVector(vector2, 'blue');

    switch(operationChoice){
        case 'add':
            vector3 = vector1.add(vector2);
            console.log(vector3);
            drawVector(vector3, 'green');
            break;
        case 'sub':
            vector3 = vector1.sub(vector2);
            console.log(vector3);
            drawVector(vector3, 'green');
            break;
        case 'div':
            vector3 = vector1.div(scalarValue);
            vector4 = vector2.div(scalarValue);
            console.log(vector3);
            drawVector(vector3, 'green');
            drawVector(vector4, 'green');
            break;
        case 'mul':
            vector3 = vector1.mul(scalarValue);
            vector4 = vector2.mul(scalarValue);
            console.log(vector3);
            drawVector(vector3, 'green');
            drawVector(vector4, 'green');
            break;
        case 'mag':
            vector3 = vector1.magnitude();
            vector4 = vector2.magnitude();
            console.log("Magnitude of vector1 is: " + vector3);
            console.log("Magnitude of vector2 is: " + vector4);
            break;
        case 'norm':
            vector3 = vector1.normalize();
            vector4 = vector2.normalize();
            console.log("Normalization of vector1 is: " + vector3);
            console.log("Normalization of vector2 is: " + vector4);
            drawVector(vector3, 'green');
            drawVector(vector4, 'green');
            break;
        case 'angle':
            let angleVectors = angleBetween(vector1, vector2);
            console.log("Angle: " + angleVectors);
            break;
        case 'area':
            let triangleArea = areaTriangle(vector1, vector2);
            console.log("Area of the triangle: " + triangleArea);
            break;
    }


}