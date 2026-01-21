class OClass{
    constructor(){
        this.type = 'OClass'
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = cir_segment;
    }

    render(){
        var xy = this.position
        var rgba = this.color
        var size = this.size

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var d = this.size/200.0
        var dInner = this.size/200.0 * 0.6

        let angleStep = 360/this.segments
        for(var angle = 0; angle < 360; angle = angle + angleStep){
            let angle1 = angle;
            let angle2 = angle + angleStep;

            let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];

            let vec3 = [Math.cos(angle1*Math.PI/180)*dInner, Math.sin(angle1*Math.PI/180)*dInner];
            let vec4 = [Math.cos(angle2*Math.PI/180)*dInner, Math.sin(angle2*Math.PI/180)*dInner];


            let pt1 = [xy[0] + vec1[0], xy[1] + vec1[1]];
            let pt2 = [xy[0] + vec2[0], xy[1] + vec2[1]];

            let pt3 = [xy[0] + vec3[0], xy[1] + vec3[1]];
            let pt4 = [xy[0] + vec4[0], xy[1] + vec4[1]];

            drawTriangle( [pt1[0], pt1[1], pt2[0], pt2[1], pt4[0], pt4[1]] );
            drawTriangle( [pt1[0], pt1[1], pt3[0], pt3[1], pt4[0], pt4[1]] );

        }
    }
}