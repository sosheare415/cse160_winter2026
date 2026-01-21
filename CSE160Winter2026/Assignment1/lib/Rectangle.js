class Rectangle {
    constructor() {
        this.type = 'rectangle';
        this.position = [0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render() {
        var [x, y] = this.position;
        var size = this.size;
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        var recWidth = size / 200.0;
        var recHeight = size / 300.0;

        // Four corners of the rectangle
        const p1 = [x - recWidth, y - recHeight];
        const p2 = [x + recWidth, y - recHeight];
        const p3 = [x + recWidth, y + recHeight];
        const p4 = [x - recWidth, y + recHeight];

        // Two triangles
        drawTriangle([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]]);
        drawTriangle([p1[0], p1[1], p3[0], p3[1], p4[0], p4[1]]);
    }
}
