// set ns 
const ns = "http://www.w3.org/2000/svg";

// get elements from index
const box = document.querySelector("#graph-box");
const startButton = document.querySelector("#startButton");
const stepButton = document.querySelector("#stepButton");
const fullButton = document.querySelector("#fullButton");

// add event listeners
startButton.addEventListener("click", startAnimation);
stepButton.addEventListener("click", stepAnimation);
fullButton.addEventListener("click", fullAnimation);


// class for a visualized point
function VisualPoint (x, y, graph, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.circle = document.createElementNS(ns, "circle");
    this.highlighted = false;

    this.init = function(){
        this.circle.setAttributeNS(null, "cx", this.x);
        this.circle.setAttributeNS(null, "cy", this.y);
        this.circle.setAttributeNS(null, "r", 30);
        this.circle.setAttributeNS(null, "stroke", "black")
        this.circle.setAttributeNS(null, "fill", "white");
        box.appendChild(this.circle);
    }

    this.highlight = function(){
        this.highlighted = true;
        this.circle.setAttributeNS(null, "stroke", "green");
        this.circle.setAttributeNS(null, "stroke-width", "5");
    }
}


// class for visualized edge
function VisualEdge (point1, point2, graph, id){
    this.x1 = point1.x;
    this.y1 = point1.y;
    this.x2 = point2.x;
    this.y2 = point2.y;
    this.id = id;
    this.line = document.createElementNS(ns, "line");

    this.init = function(){
        this.line.setAttributeNS(null, "x1", this.x1);
        this.line.setAttributeNS(null, "y1", this.y1);
        this.line.setAttributeNS(null, "x2", this.x2);
        this.line.setAttributeNS(null, "y2", this.y2);
        this.line.setAttributeNS(null, "stroke", "black");
        this.line.setAttributeNS(null, "stroke-width", "5");
        this.line.setAttributeNS(null, "stroke-dasharray", "10,10"); 
        box.appendChild(this.line);
    }

    this.highlight = function(){
        this.highlighted = true;
        this.line.setAttributeNS(null, "stroke", "green");
    }
}


// class for visualized everything
function ConvexHullViewer (pointList) {
   this.id = document.querySelector("#graph-box");
   this.pointList = pointList;
   this.points = [];
   this.edges = [];
   this.nextPointID = 0;   
   this.nextEdgeID = 0;  
   this.done = false;
   this.stepStage = 0;
   this.a = -1;
   this.b = -1;
   this.c = -1;

   // initialize everything at the beginning so points are displayed on screen
   this.initialize = function(){
        // TODO: Laura organizes points
        // this.pointList = ConvexHull.organize(); -- organize list of points via Laura

        for (let i = 0; i<this.pointList.length; i++){
            createVisualPoint(pointList[i][0], pointList[i][1]);
        }
   }

   this.getPointByID = function(id){
        return points[id];
   }

   // create a visual point
   this.createVisualPoint = function (x, y) {
        const point = new VisualPoint(this.nextPointID, this, x, y);
        this.points.append(point);
        this.nextPointID++;
    }

    // create a visual edge and add to list
    this.createVisualEdge = function (point1, point2){
        const edge = new VisualEdge(this.nextEdgeID, this, point1, point2);
        this.nextEdgeID++;
        this.edges.append(edge);
    }

    // run through entire animation
   this.fullAnimation = function(){
        startAnimation();
        while (!done){
            stepAnimation();
            done = true; //temp
        }
    }

    // start the animation
    this.startAnimation = function(){
        // TODO: may have to edit for more vars if not possible to get circle from coordinates!
        createVisualEdge(this.getPointByID(0), this.getPointByID(1));
        this.getPointByID(0.highlight();
        points[1].highlight();
        this.a = 0;
        this.b = 1;
        this.c = 2;
    }

    // go through step of animation
    this.stepAnimation = function(){
        if (c == pointList.length) this.done = true;

        switch(this.stepStage){
        case this.stepStage == 0:
            //nextC() call to Laura, returns A + B or null
            let nextAB = null; // TODO: replace with Laura's return
            if (nextAB != null){
                this.a = nextAB[0];
                this.b = nextAB[1];
            }
            break;
        case this.stepStage == 1:

            break;

        }
    }
}



