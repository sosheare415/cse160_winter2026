class XClass {
    constructor() {
        this.type = 'XClass';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;

        this.thickness = 0.10;
    }

    render(){
        var [x,y] = this.position;
        var [r,g,b,a] = this.color;

        gl.uniform4f(u_FragColor, r, g, b, a);

        var half = this.size/200.0;
        var thick = half * this.thickness;

        drawTriangle([
        x - half, y - half,
        x + half, y + half,
        x - half - thick, y - half + thick
        ]);

        drawTriangle([
        x - half, y + half,
        x + half, y - half,
        x - half + thick, y + half + thick
        ]);
    }
}