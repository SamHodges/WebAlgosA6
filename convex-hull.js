// next steps: update visual based on return of compatible

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.visualPoint = null;

    this.setVisualPoint = function(visualPoint){
        this.visualPoint = visualPoint;
    }

    this.getVisualPoint = function(){
        return this.visualPoint;
    }

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
    if (this.x > p.x) {
        return 1;
    }

    if (this.x < p.x) {
        return -1;
    }

    if (this.y > p.y) {
        return 1;
    }

    if (this.y < p.y) {
        return -1;
    }

    return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
    return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
    this.points.push(new Point(x, y, this.curPointID));
    this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
    this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
    this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
    this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
    let coords = [];
    for (let pt of this.points) {
        coords.push(pt.x);
    }

    return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
    let coords = [];
    for (pt of this.points) {
        coords.push(pt.y);
    }

    return coords;
    }

    // get the number of points 
    this.size = function () {
    return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
    let str = '[';
    for (let pt of this.points) {
        str += pt + ', ';
    }
    str = str.slice(0,-2);  // remove the trailing ', '
    str += ']';

    return str;
    }
}


/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    this.done = false; // variable for whether it's finished or not-- Laura, make sure to update this when finished!!
    this.psHull = [];

    this.isDone = function(){
        return this.done;
    }

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
    
    // COMPLETE THIS METHOD
        this.ps.sort();
        this.psHull[0] = this.ps[0];
        this.psHull[1] = this.ps[1];
        this.ps.reverse();
        for(let i = 0; i<2; i++){
            this.ps.points.pop();
        }
        this.ps.reverse();
        console.log("Start FINISHED");
        return this.psHull;
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
    
        // COMPLETE THIS METHOD
        if(this.psHull.length = 1){
            this.psHull.push(this.ps[this.ps.length]);
        } else {
            for(let i = 0; i < this.psHull.length; i++){
                while((this.isRight(this.psHull[i], this.psHull[i+1], this.psHull[i+2]) = false) && this.psHull.length>1){
                    this.psHull.pop();
                }
            }
        }
    
    }

    this.isRight = function(a, b, c){
        let isTrue = false;
        //slope btwn a n b - if gr8er than slope btwn b and c, abc makes right turn
        //if answer positive right if answer negative left
        let aB = math.cross(a, b);
        let bC = math.cross(b,c);
        if((aB - bC) > 0){
            isTrue = true;
        }
        return isTrue;
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {

    // COMPLETE THIS METHOD
        this.start();
        this.step();
        return this.psHull;
    }
}










//------------------------------------------------------------------------------------------------------------------------//

// TODO: change deleted code to account for the following: selecting and then starting animation, deleting when connected to other nodes
// TODO: something wrong with the line display

function ConvexHullViewer (svg, ps, startButton, stepButton, fullButton, stopButton, convexHull) {
    this.svg = svg;  // svg object where the visualization is drawn
    this.ps = ps;    // list of points in form of PointSet
    this.points = []; //set of visual points
    this.convexHull = convexHull; 
    this.stepPhase = "nextC";
    this.nextABC = null; 
    this.done = false;
    this.nextStepInterval = null;
    this.highlightedPoints = [];

    document.addEventListener("keydown", (e) => {
        if(e.key == "Backspace"){
            for (let i=0; i<this.highlightedPoints.length; i++){
                this.highlightedPoints[i].setAttributeNS(null, "r", 0);
                // TODO: delete from points list lmaoooo
            }
        }
    });


    // create svg group for displaying edges
    this.edgeGroup = document.createElementNS(SVG_NS, "g");
    this.edgeGroup.id = "graph-edges";
    this.svg.appendChild(this.edgeGroup);

    // create svg group for displaying points
    this.pointGroup = document.createElementNS(SVG_NS, "g");
    this.pointGroup.id = "graph-points";
    this.svg.appendChild(this.pointGroup);

    /*
    draw and update line segments between points to represent portions of the convex hull
    */

    // event listener for adding points
    this.svg.addEventListener("click", (e) => {
        // corrections for coordinates
        const rect = this.svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (e.explicitOriginalTarget.localName == "circle"){
            let curCircle = e.target;
            if (this.highlightedPoints.includes(curCircle)){
                curCircle.setAttributeNS(null, "stroke", "black");
                curCircle.setAttributeNS(null, "stroke-width", "2");
                this.highlightedPoints.splice(this.highlightedPoints.indexOf(curCircle), 1);
            }
            else{
                curCircle.setAttributeNS(null, "stroke", "red");
                curCircle.setAttributeNS(null, "stroke-width", "5");
                this.highlightedPoints.push(curCircle);
            }
            

        }
        else{
            // add new point to point set
            this.ps.addNewPoint(x, y);

            // create corresponding visual
            this.createVisualPoint(ps.points[ps.points.length-1]);
        }
    });

    startButton.addEventListener("click", (e) => {
        this.updateVisual(this.ps.points[0].getVisualPoint(), this.ps.points[1].getVisualPoint(), null);
    });

    stepButton.addEventListener("click", (e) => {
        this.nextStep();
    });

    fullButton.addEventListener("click", (e) =>{
        this.updateVisual(this.ps.points[0].getVisualPoint(), this.ps.points[1].getVisualPoint(), null);
        this.nextStepInterval = setInterval(() => {
        this.nextStep();
        }, 1000);
        while (this.done) clearInterval(this.nextStepInterval);
    });

    stopButton.addEventListener("click", (e) =>{
        if (this.nextStepInterval!=null) clearInterval(this.nextStepInterval);
    });

    this.nextStep = function(){
        console.log(this.stepPhase);
        switch(this.stepPhase){
        case "nextC":
            this.nextC();
            break;
        case "compatible":
            this.checkCompatible();
            break;
        case "remove":
            this.removeBadEdge();
            break;
        case "done":
            break;
        }
    }

    this.removeBadEdge = function(){
        this.nextABC[0].getVisualPoint().getCurrentEdge().remove();
        this.nextABC[1].getVisualPoint().getCurrentEdge().remove();
        this.stepPhase = "nextC";
    }

    this.nextC = function(){
        // TODO: replace this part whwn Laura's done
        this.nextABC =  [this.ps.points[0], this.ps.points[1], this.ps.points[2]] //this.convexHull.nextC() // this will return [A, B, C]
        this.updateVisual(this.nextABC[0].getVisualPoint(), this.nextABC[1].getVisualPoint(), this.nextABC[2].getVisualPoint());
        this.stepPhase = "compatible"; //move on to compatible if stack is full enough
    }

    this.checkCompatible = function(){
        // TODO: replace with Laura's
            let compatible = false; // this.convexHull.compatible(nextOutput[0], nextOutput[1], nextOutput[2]); // checks if they're compatible and returns bool 

            if (compatible){
                // turn line green and solid
                this.nextABC[0].getVisualPoint().getCurrentEdge().compatible();
                this.nextABC[1].getVisualPoint().getCurrentEdge().compatible();
                this.stepPhase = "nextC";
            }
            else{
                // red dotted line with a cross, add to "delete" cycle
                this.nextABC[0].getVisualPoint().getCurrentEdge().incompatible();
                this.nextABC[1].getVisualPoint().getCurrentEdge().incompatible();
                this.stepPhase = "remove";
            }
        this.done = false; // !this.convexHull.pushC(); // TODO: returns whether C pushed successfully @Laura
        if (this.done) this.stepPhase = "done";
    }

    this.updateVisual = function(a,b,c){
        for (let i = 0; i<this.ps.size(); i++){
            this.points[i].unhighlight();
        }

        try{
            a.highlight();
            b.highlight();
            c.highlight();
            a.addEdge(b, this.edgeGroup);
            b.addEdge(c, this.edgeGroup);
        }
        catch{
            // console.log(e);
        }
        
    }


    // initialize everything at the beginning so points are displayed on screen
    this.initialize = function(){
        this.ps.sort();
        for (let i = 0; i<this.ps.size(); i++){
            this.createVisualPoint(this.ps.points[i]);
        }
    }


    // create a visual point
    this.createVisualPoint = function (point) {
        let currPoint = new VisualPoint(point, this.pointGroup);
        currPoint.init();
        this.points.push(currPoint);
    }
    }





// class for a visualized point
function VisualPoint (point, pointGroup) {
    this.point = point;
    this.x = this.point.x;
    this.y = this.point.y;
    this.circle = document.createElementNS(SVG_NS, "circle");
    this.highlighted = false;
    this.connectedPoints = [];
    this.currentEdge = null;
    this.deletable = false;

    this.init = function(){
        this.circle.setAttributeNS(null, "cx", this.x);
        this.circle.setAttributeNS(null, "cy", this.y);
        this.circle.setAttributeNS(null, "r", 10);
        this.circle.setAttributeNS(null, "stroke", "black")
        this.circle.setAttributeNS(null, "stroke-width", "2");
        this.circle.setAttributeNS(null, "fill", "white");
        this.circle.setAttributeNS(null, "z-index", "3"); 
        pointGroup.appendChild(this.circle);
        this.point.setVisualPoint(this);
    }

    this.unhighlight = function(){
        this.highlighted = false;
        this.circle.setAttributeNS(null, "stroke", "black")
        this.circle.setAttributeNS(null, "stroke-width", "2");
    }

    this.highlight = function(){
        this.highlighted = true;
        this.circle.setAttributeNS(null, "stroke", "green");
        this.circle.setAttributeNS(null, "stroke-width", "5");
    } 

    this.addEdge = function(point, edgeGroup){
        if (this.connectedPoints.includes(point)) return;
        this.connectedPoints.push(point);
        point.addConnected(this);
        let edge = new VisualEdge(this, point, edgeGroup);
        edge.init();
        this.currentEdge = edge;
        point.currentEdge = edge; 
    }

    this.addConnected = function(point){
        this.connectedPoints.push(point);
    }

    this.getCurrentEdge = function(){
        return this.currentEdge;
    }

}

function VisualEdge (point1, point2, edgeGroup){
    this.x1 = point1.x;
    this.y1 = point1.y;
    this.x2 = point2.x;
    this.y2 = point2.y;
    this.point1 = point1;
    this.point2 = point2;
    this.line = document.createElementNS(SVG_NS, "line");

    this.init = function(){
        this.line.setAttributeNS(null, "x1", this.x1);
        this.line.setAttributeNS(null, "y1", this.y1);
        this.line.setAttributeNS(null, "x2", this.x2);
        this.line.setAttributeNS(null, "y2", this.y2);
        this.line.setAttributeNS(null, "stroke", "black");
        this.line.setAttributeNS(null, "stroke-width", "5");
        this.line.setAttributeNS(null, "stroke-dasharray", "10,10"); 
        this.line.setAttributeNS(null, "z-index", "1"); 
        edgeGroup.appendChild(this.line);
    }

    this.compatible = function(){
        this.highlighted = true;
        this.line.setAttributeNS(null, "stroke", "green");
        this.line.setAttributeNS(null, "stroke-dasharray", "10,0"); 
    }

    this.incompatible = function(){
        this.highlighted = false;
        this.line.setAttributeNS(null, "stroke", "red");
        this.line.setAttributeNS(null, "stroke-dasharray", "5,15"); 
    }

    this.remove = function(){
        this.line.setAttributeNS(null, "x2", this.x1);
        this.line.setAttributeNS(null, "y2", this.y1);
    }

}


function doVisuals(){
    // get elements from index
    const svg = document.querySelector("#convex-hull-box");
    const startButton = document.querySelector("#startButton");
    const stepButton = document.querySelector("#stepButton");
    const fullButton = document.querySelector("#fullButton");
    const stopButton = document.querySelector("#stopButton");


    // start everything
    const convexHull = new ConvexHull(0);
    const ps = new PointSet();
    ps.addNewPoint(100, 100);
    ps.addNewPoint(100, 300);
    ps.addNewPoint(300, 300);
    ps.addNewPoint(300, 100);
    const cv = new ConvexHullViewer(svg, ps, startButton, stepButton, fullButton, stopButton, convexHull);
    cv.initialize();
}

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }
