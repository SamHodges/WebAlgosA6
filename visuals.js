// NEXT STEPS: connecting line for expanding animation aspect


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

// keep track of coordinate list
let convexList = [];

// TODO: this may change depending on what Laura is doing
// keep track of which "step type" we're on
let stepType = "initial";


// initialization- set some vars, draw initial circles, etc
// TODO- replace convex list with actual list
function initialize(){
	convexList = [[100,100], [100,300], [300,100], [300,300]];
	drawNodes(convexList);
}

// draw circles in convex list
function drawNodes(convexList){
	// go through and draw circles for each point
	for (let i=0; i<convexList.length; i++){
		createCircle(convexList[i][0], convexList[i][1]);
	}
}

// create a single circle visual
function createCircle(x,y){
    let circle = document.createElementNS(ns, "circle");
    circle.setAttributeNS(null, "cx", x);
    circle.setAttributeNS(null, "cy", y);
    circle.setAttributeNS(null, "r", 30);
    circle.setAttributeNS(null, "stroke", "black")
    circle.setAttributeNS(null, "fill", "white");
    circle.setAttributeNS(null, "class", "shapes");
    circle.setAttributeNS(null, "tabindex", "0");
    box.appendChild(circle);
}

function highlightCircle(x,y){
	// TODO: figure out how to get circle by its coordinates-- may have to edit circle code if not possible
	// for now, just drawing over

	let circle = document.createElementNS(ns, "circle");
    circle.setAttributeNS(null, "cx", x);
    circle.setAttributeNS(null, "cy", y);
    circle.setAttributeNS(null, "r", 30);
    circle.setAttributeNS(null, "stroke", "green");
    circle.setAttributeNS(null, "stroke-width", "5");
    circle.setAttributeNS(null, "fill", "white");
    box.appendChild(circle);
}

function createLine(x1,y1,x2,y2){
    let line = document.createElementNS(ns, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y2", y2);
    line.setAttributeNS(null, "stroke", "black");
    line.setAttributeNS(null, "stroke-width", "5");
    line.setAttributeNS(null, "stroke-dasharray", "10,10"); 
    console.log("made line?");
    box.appendChild(line);
 }

// run full animation
function fullAnimation(){
	console.log("full animation!");

	startAnimation();

	// TODO: get a "done" command from Laura + all the other shit
	let done = false;
	while (!done){
		stepAnimation();
		done = true;
	}
}

// set up animation
function startAnimation(){onsole.log("starting animation!");
	//TODO: get list in order from Laura and reset convexList
	convexList = [[100,100], [100,300], [300,100], [300,300]]; //organize()

	// TODO: may have to edit for more vars if not possible to get circle from coordinates!
	createLine(convexList[0][0], convexList[0][1], convexList[1][0], convexList[1][1])
	highlightCircle(convexList[0][0], convexList[0][1]);
	highlightCircle(convexList[1][0], convexList[1][1]);

	// change step type for first expansion
	stepType = "expand";
	c
}

// next step of animation
function stepAnimation(){
	console.log("next step of animation!");

	// TODO: check what these functions are actually returning from Laura
	switch(stepType){
	case stepType == "expand":
		console.log("expanding");
		// call nextC() for Laura-- assuming it returns the next C in [x,y] format here
		let coordinates = [100, 300] //nextC(); -- uncomment when it exists lmao
		expand(coordinates[0], coordinates[1]);
		break;
	case stepType == "checking":
		console.log("checking");
		break;
	}

}

// expanding animation-- highlight next circle and draw line between them
function expand(x, y){
	// highlight next circle
	highlightCircle(x,y);

	// draw line between them

}











