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
        // console.log("size: " + this.points);
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
    this.psHull = [];
    this.currentCPosition = 1;

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
    
    // COMPLETE THIS METHOD
        this.ps.sort();
        this.psHull[0] = this.ps.points[0];
        this.psHull[1] = this.ps.points[1];
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () { 
        // COMPLETE THIS METHOD
        if(!this.nextC()) {
                while(this.notCompatible()){
                    this.backtrackC();
                }
            this.pushC();
        }
    }

    this.nextC = function(){
        this.currentCPosition += 1;
        if(this.psHull.length == 1){
            this.pushC(this.currentCPosition);
            return true;
        }
        return false;
    }

    this.returnABC = function(){
        return [this.psHull[this.psHull.length-2], this.psHull[this.psHull.length-1], this.ps.points[this.currentCPosition]];
    }

    this.notCompatible = function(){
        return this.psHull.length>1 && !(this.isRight(this.psHull[this.psHull.length-2], this.psHull[this.psHull.length-1], this.ps.points[this.currentCPosition]));
    }

    this.backtrackC = function(){
        this.psHull.pop();
    }

    this.pushC = function(){
        this.psHull.push(this.ps.points[this.currentCPosition]);
    }

    this.secondSide = function(){
        this.psHull = [];

        this.ps.reverse();
        this.psHull[0] = this.ps.points[0];
        this.psHull[1] = this.ps.points[1];

        this.currentCPosition = 1;
    }

    this.isRight = function(a, b, c){
        // 3 points- a, b, c represented as (117, 924),(922, 877),(962, 852)
        // console.log("A, B, C: " + a + b + c);

        // step 1: make 2 vectors vectorA and vectorB, assume z=0?
        // if(a == undefined) console.log("UNDEFINED A " + this.psHull.length);
        
        let vectorA = [a.x - b.x, a.y - b.y];
        let vectorB = [c.x - b.x, c.y - b.y];
        

        // step 2: calculate dot product
        let dot = vectorA[0]*vectorB[0] + vectorA[1]*vectorB[1];
        let det = vectorA[0]*vectorB[1] - vectorA[1]*vectorB[0]
        
        let angle = Math.atan2(det, dot);

        return (angle > 0 && angle!=Math.PI); // turns right and also A and C aren't on a straight line
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

        for (let i = 2; i<ps.size(); i++){
            this.step();
        }

        let returnSet = new PointSet();
        for(let j = 0; j<this.psHull.length; j++){
            if (this.psHull[j] != undefined) returnSet.addPoint(this.psHull[j]);  
        }

        this.secondSide();

        for (let k = 2; k<ps.size(); k++){
            this.step();
        }


        for(let l = 1; l<this.psHull.length; l++){
            if (this.psHull[l] != undefined) returnSet.addPoint(this.psHull[l]);  
        }
        
        return returnSet;
    }
}










//------------------------------------------------------------------------------------------------------------------------//

function ConvexHullViewer (svg, ps, startButton, stepButton, fullButton, stopButton, text, convexHull) {
    this.svg = svg;  // svg object where the visualization is drawn
    this.ps = ps;    // list of points in form of PointSet
    this.points = []; //set of visual points
    this.convexHull = convexHull; 
    this.stepPhase = "nextC";
    this.nextABC = null; 
    this.sidesCompleted = 0;
    this.nextStepInterval = null;
    this.highlightedPoints = [];
    this.startedAlgo = false;
    this.text = text;
    this.visualsToPoints = {}; // dict of points to visual points
    this.polygonPoints = "";

    document.addEventListener("keydown", (e) => {
        if(e.key == "Backspace" && this.startedAlgo == false){
            for (let i=0; i<this.highlightedPoints.length; i++){
                this.highlightedPoints[i].setAttributeNS(null, "r", 0);
                let x = this.highlightedPoints[i].getAttributeNS(null, "cx");
                let y = this.highlightedPoints[i].getAttributeNS(null, "cy");
                let newSet = new PointSet(); 

                for (let k = 0; k<this.ps.size(); k++){
                    if (x != this.ps.points[k].x || y != this.ps.points[k].y){
                        newSet.addNewPoint(this.ps.points[k].x, this.ps.points[k].y);
                    }
                    else{
                    }
                }

                console.log(this.ps.points);
                this.ps = newSet;
                this.convexHull.ps = newSet;
                console.log(this.ps.points);
                // TODO: delete from points list lmaoooo-- highlightedPoints is just a list of circles
                // find corresponding x and y, check against all points, delete from point lists?
            }
        }
        else if (e.key == "Backspace"){
            this.updateTextBox("The algorithm has already started, so you cannot delete a node");
        }
    });

    this.hiddenShape = document.createElementNS(SVG_NS, "g");
    this.hiddenShape.id = "graph-hidden";
    this.svg.appendChild(this.hiddenShape);

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
        // console.log(x,y);


        if (e.explicitOriginalTarget.localName == "circle"){
            let curCircle = e.target;
            if (this.highlightedPoints.includes(curCircle)){
                curCircle.setAttributeNS(null, "stroke", "#5E376D");
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
            if (!this.startedAlgo){
                // add new point to point set
                this.ps.addNewPoint(x, y);

                // create corresponding visual
                this.createVisualPoint(ps.points[ps.points.length-1]);

                this.ps.sort();
            }
            else{
                let newPoint = new Point(x, y, this.curPointID);
                this.createVisualPoint(newPoint);
            
                if (e.explicitOriginalTarget.localName == "polygon" && this.stepPhase=="done"){
                    this.updateTextBox("The algorithm has already started, so the point at (" + x + ", " + y + ") will not be included.\
                        \n But we do see it's INSIDE the convex hull line.");

                }
                else if (this.stepPhase == "done"){
                    this.updateTextBox("The algorithm has already started, so the point at (" + x + ", " + y + ") will not be included.\
                        \n But we do see it's OUTSIDE the convex hull line.");
                }
                else{
                    this.updateTextBox("The algorithm has already started, so the point at (" + x + ", " + y + ") will not be included.\
                        \n Click again when the algorithm finishes to see if it's in the hull line");
                }

            }
        }
    });

    this.updateTextBox = function (str) {
        this.text.innerHTML = str;
    }

    startButton.addEventListener("click", (e) => {
        if (this.startedAlgo){
            this.updateVisual(this.getVisualPoint(this.ps.points[0]), this.getVisualPoint(this.ps.points[1]), null);
            this.convexHull.start();
            this.startedAlgo = true;
        }
    });

    stepButton.addEventListener("click", (e) => {
        this.nextStep();
    });

    fullButton.addEventListener("click", (e) =>{
        if (this.startedAlgo == false){
            this.startedAlgo = true;
            this.updateVisual(this.getVisualPoint(this.ps.points[0]), this.getVisualPoint(this.ps.points[1]), null);
            this.convexHull.start();
            this.nextStepInterval = setInterval(() => {
            this.nextStep();
            }, 1000);
        }
    });

      this.stopAnimation = function () {
        if (this.nextStepInterval!=null) clearInterval(this.nextStepInterval);
        this.nextStepInterval = null;
        }

    stopButton.addEventListener("click", (e) =>{
        this.stopAnimation();
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
            this.stopAnimation();
            this.updateVisual(null,null,null);
            this.makeHiddenPolygon();
            break;
        }
    }

    this.makeHiddenPolygon = function(){
        this.polygon = document.createElementNS(SVG_NS, "polygon");
        
        this.polygon.setAttribute("points", this.polygonPoints);
        this.polygon.setAttribute("fill", "blue");
        this.hiddenShape.appendChild(this.polygon);
        console.log("hidden complete");


    }


    this.setVisualPoint = function(visualPoint, point){
        this.visualsToPoints[point] = visualPoint;
    }

    this.getVisualPoint = function(point){
        return this.visualsToPoints[point];
    }

    this.checkSides = function(){
        console.log(this.convexHull.currentCPosition + " == " + this.ps.size()-1)
        if(this.convexHull.currentCPosition == this.ps.size()-1){
            for(let j = 0; j<this.convexHull.psHull.length; j++){
                this.polygonPoints += this.convexHull.psHull[j].x + ", " + this.convexHull.psHull[j].y + " "
            }

            console.log("SWITCH");
            this.convexHull.secondSide();
            this.sidesCompleted += 1;
            console.log("completed? " + this.sidesCompleted)
        }
        if (this.sidesCompleted == 2){
            this.stepPhase = "done";
        }
        else{
            this.stepPhase = "nextC";
        }
    }

    this.removeBadEdge = function(){
        this.getVisualPoint(this.nextABC[0]).getCurrentEdge().remove();
        this.getVisualPoint(this.nextABC[1]).getCurrentEdge().remove();
        this.getVisualPoint(this.nextABC[1]).unhighlight();
        this.getVisualPoint(this.nextABC[2]).getCurrentEdge().remove();

        this.getVisualPoint(this.nextABC[0]).addEdge(this.getVisualPoint(this.nextABC[2]), this.edgeGroup);

        this.convexHull.backtrackC();

        try{
            this.nextABC =  this.convexHull.returnABC(); // this will return [A, B, C]
            this.updateVisual(this.getVisualPoint(this.nextABC[0]), this.getVisualPoint(this.nextABC[1]), this.getVisualPoint(this.nextABC[2]));
        }
        catch{
            console.log("removed down to 1");
        }
        this.stepPhase = "compatible";
        
    }

    this.nextC = function(){
        // TODO: replace this part when Laura's done
        let moveOnToNextC = this.convexHull.nextC()
        try{
            this.nextABC =  this.convexHull.returnABC(); // this will return [A, B, C]
            this.updateVisual(this.getVisualPoint(this.nextABC[0]), this.getVisualPoint(this.nextABC[1]), this.getVisualPoint(this.nextABC[2]));
        }
        catch{
            console.log("unsure");
        }
        
        // check to see if moving on to comptible
        if(!moveOnToNextC) {
            this.stepPhase = "compatible"; //move on to compatible if stack is full enough
        }
    }

    this.checkCompatible = function(){
        // TODO: replace with Laura's
            let notCompatible = this.convexHull.notCompatible(); // checks if they're compatible and returns bool 
            console.log("compatible? " + !notCompatible);
            console.log(this.convexHull.psHull);
            console.log(this.convexHull.ps.points);
            console.log(this.convexHull.returnABC());

            if (notCompatible){
                // red dotted line with a cross, add to "delete" cycle
                this.getVisualPoint(this.nextABC[0]).getCurrentEdge().incompatible();
                this.getVisualPoint(this.nextABC[1]).getCurrentEdge().incompatible();
                this.getVisualPoint(this.nextABC[2]).getCurrentEdge().incompatible();
                this.stepPhase = "remove";
            }
            else if (this.convexHull.psHull.length <= 1){
                this.getVisualPoint(this.nextABC[1]).getCurrentEdge().compatible();
                this.convexHull.pushC();
                this.checkSides();
            }
            else{
                // turn line green and solid
                this.getVisualPoint(this.nextABC[0]).getCurrentEdge().compatible();
                this.getVisualPoint(this.nextABC[1]).getCurrentEdge().compatible();
                this.convexHull.pushC();
                this.checkSides();
            }
    }

    this.updateVisual = function(a,b,c){
        // console.log("size in vis: " + this.ps + ", " + this.convexHull.ps);
        for (let i = 0; i<this.ps.size(); i++){
            // console.log(this.ps.size());
            this.points[i].unhighlight();
        }

        try{
            a.highlight();
            b.highlight();
            c.highlight();
            a.addEdge(b, this.edgeGroup);
            b.addEdge(c, this.edgeGroup);
            a.getCurrentEdge().dottedEdge();
            b.getCurrentEdge().dottedEdge();
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
        let currPoint = new VisualPoint(point, this.pointGroup, this);
        currPoint.init();
        this.points.push(currPoint);
    }
    }





// class for a visualized point
function VisualPoint (point, pointGroup, convexHull) {
    this.point = point;
    this.x = this.point.x;
    this.y = this.point.y;
    this.circle = document.createElementNS(SVG_NS, "circle");
    this.highlighted = false;
    this.connectedPoints = [];
    this.currentEdge = null;
    this.deletable = false;
    this.convexHull = convexHull;

    this.init = function(){
        this.circle.setAttributeNS(null, "cx", this.x);
        this.circle.setAttributeNS(null, "cy", this.y);
        this.circle.setAttributeNS(null, "r", 10);
        this.circle.setAttributeNS(null, "stroke", "#5E376D")
        this.circle.setAttributeNS(null, "stroke-width", "2");
        this.circle.setAttributeNS(null, "fill", "white");
        this.circle.setAttributeNS(null, "z-index", "3"); 
        pointGroup.appendChild(this.circle);
        this.convexHull.setVisualPoint(this, this.point);
    }

    this.unhighlight = function(){
        this.highlighted = false;
        this.circle.setAttributeNS(null, "stroke", "#5E376D")
        this.circle.setAttributeNS(null, "stroke-width", "2");
    }

    this.highlight = function(){
        this.highlighted = true;
        this.circle.setAttributeNS(null, "stroke", "green");
        this.circle.setAttributeNS(null, "stroke-width", "5");
    } 

    this.addEdge = function(point, edgeGroup){
        if (this.connectedPoints.includes(point) || (point.x == this.x && point.y == this.y)) return;
        this.connectedPoints.push(point);
        // console.log("calling in (" + this.x + ", " + this.y + ")")
        point.addConnected(this.point);
        let edge = new VisualEdge(this, point, edgeGroup);
        edge.init();
        this.currentEdge = edge;
        point.currentEdge = edge; 
        // console.log("(" + this.x + ", " + this.y + ") connecting to " + "(" + point.x + ", " + point.y + ")")
        // console.log(point.x == this.x && point.y == this.y);
    }

    this.addConnected = function(point){
        if (this.connectedPoints.includes(point) || (point.x == this.x && point.y == this.y)) return;
        // console.log("(" + this.x + ", " + this.y + ") connecting to " + "(" + point.x + ", " + point.y + ")")
        this.connectedPoints.push(point);
    }

    this.getCurrentEdge = function(){
        // console.log("FOR (" + this.x + ", " + this.y + "): " + "(" + this.connectedPoints[length-1].x + ", " + this.connectedPoints[length-1].y+ ")");
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

    this.dottedEdge = function(){
        this.line.setAttributeNS(null, "stroke", "black");
        this.line.setAttributeNS(null, "stroke-dasharray", "10,10");
    }

    this.compatible = function(){
        this.highlighted = true;
        this.line.setAttributeNS(null, "stroke", "#76b947");
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
    const text = document.querySelector("#convex-text-box");



    // start everything
    const ps = new PointSet();
    const convexHull = new ConvexHull(ps);
    const cv = new ConvexHullViewer(svg, ps, startButton, stepButton, fullButton, stopButton, text, convexHull);
    cv.initialize();
}

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }