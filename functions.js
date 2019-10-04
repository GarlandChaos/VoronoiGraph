/*Graph structures */
function Node(x, y){
	this.edges = [];
	this.id = -1;
	this.x = x;
	this.y = y;
	this.priority = 0;
}

Node.prototype = {
	constructor: Node
}

function Edge(nodeBegin, nodeEnd){
	this.nodeBegin = nodeBegin;
	this.nodeEnd = nodeEnd;
	this.cost = 0;
}

Edge.prototype = {
	constructor: Edge
}

function Graph(){
	this.edges = [];
	this.nodes = [];
}

Graph.prototype = {
	constructor: Graph
}
/* */

var graph = new Graph();
var canvas = document.getElementById("fixedPtsCanvas");
var ctx = canvas.getContext("2d");
var r = 0;
var g = 0;
var b = 0;
var a = 255;
var pxWidth = 1;
var pxHeight = 1;
var canvasWidth = 500;
var canvasHeight = 500;
var pixel = ctx.createImageData(pxWidth, pxHeight);
var dt = pixel.data;
var pixelOffset = 17;
var convexHull = new Array();
var selectingPath = false;
var selectingStart = false;
var selectingGoal = false;
var startNode;
var goalNode;
var aStarBtn = document.getElementById("aStar");
var voronoi = new Voronoi();
var bbox = {xl: 0, xr: 500, yt: 0, yb: 500};
var sites = []; 
var diagram; 

function drawPoint(x, y, color, c){
	
	c.beginPath();
	c.arc(x, y, 10, 0, 2 * Math.PI, false);
	c.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]/255+")";
	c.fill();
}

function drawEdge(xStart, yStart, xEnd, yEnd, style, lineWeight = 1){
	ctx.beginPath();
	
	ctx.moveTo(xStart, yStart);
	ctx.lineTo(xEnd, yEnd);
	
	ctx.lineWidth = lineWeight;
	ctx.strokeStyle = style;
	ctx.stroke();
}

function clearCanvas(c){
    c.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawVoronoiPoints(P, c){
	// console.log(P);
	var color = [0,0,0,255];
	for(var i = 0; i < P.length; i++){
		drawPoint(P[i][0], P[i][1], color, c);
	}
}

function drawVoronoiEdges(){
	for(var i = 0; i < diagram.edges.length; i++){
		var style = "#cfd1d0";
		drawEdge(
			diagram.edges[i].va.x, 
			diagram.edges[i].va.y, 
			diagram.edges[i].vb.x, 
			diagram.edges[i].vb.y, 
			style);
	}
}

function drawGraphEdges(){
	for(var i = 0; i < graph.edges.length; i++){
		var style = "#00FF00";
		drawEdge(
			graph.edges[i].nodeBegin.x, 
			graph.edges[i].nodeBegin.y, 
			graph.edges[i].nodeEnd.x, 
			graph.edges[i].nodeEnd.y, 
			style);	
	}
}

function drawGraphNodes(){
	for(var i = 0; i < graph.nodes.length; i++){
		drawPoint(graph.nodes[i].x, graph.nodes[i].y, [0, 0, 0, 255], ctx);
	}
}

function getDiagramInfo(){
	graph = new Graph();
	if(diagram.edges.length == 0){
		graph.nodes.push(diagram.cells[0].site);
	}
	for(var i = 0; i < diagram.edges.length; i++){
		if(diagram.edges[i].lSite != null && diagram.edges[i].rSite != null){

			var checkId = checkNodeDuplicates(graph.nodes, diagram.edges[i].lSite.voronoiId); 
			var checkId2 = checkNodeDuplicates(graph.nodes, diagram.edges[i].rSite.voronoiId);

			if(checkId == -1){ //if node 1 doesn't exist on graph
				var n1 = new Node();
				n1.id = diagram.edges[i].lSite.voronoiId;
				n1.x = diagram.edges[i].lSite.x;
				n1.y = diagram.edges[i].lSite.y;
				graph.nodes.push(n1);

				if(checkId2 == -1){ //if node 2 doesn't exist on graph too
					var n2 = new Node();
					n2.id = diagram.edges[i].rSite.voronoiId;
					n2.x = diagram.edges[i].rSite.x;
					n2.y = diagram.edges[i].rSite.y;
					graph.nodes.push(n2);

					var e = new Edge(n1, n2);
					n1.edges.push(e);
					n2.edges.push(e);
					graph.edges.push(e);
				}
				else { //if node 1 doesn't exist on graph but node 2 does exist
					var e = new Edge(n1, graph.nodes[checkId2]);
					n1.edges.push(e);
					graph.nodes[checkId2].edges.push(e);
					graph.edges.push(e);
				}
			}
			else {
				if(checkId2 == -1){ //if node 2 doesn't exist on graph
					var n2 = new Node();
					n2.id = diagram.edges[i].rSite.voronoiId;
					n2.x = diagram.edges[i].rSite.x;
					n2.y = diagram.edges[i].rSite.y;
					graph.nodes.push(n2);

					var e = new Edge(graph.nodes[checkId], n2);
					graph.nodes[checkId].edges.push(e);
					n2.edges.push(e);
					graph.edges.push(e);
				}
				else { //if both nodes doesn't exist on graph
					var e = new Edge(graph.nodes[checkId], graph.nodes[checkId2]);
					graph.nodes[checkId].edges.push(e);
					graph.nodes[checkId2].edges.push(e);
					graph.edges.push(e);
				}
			}	
		}	
	}
	console.log(graph);
}

function checkNodeDuplicates(P, id){
	for(var i = 0; i < P.length; i++){
		if(P[i].id == id){
			return i;
		}
	}
	return -1;
}

function checkDuplicates(P, pos){
	for(var i = 0; i < P.length; i++){
		if(P[i].x == pos.x && P[i].y == pos.y){
			return 1;
		}
	}
	return 0;
}

function calcVoronoi(){
	
	clearCanvas(ctx);
	if(diagram != null){
		voronoi.recycle(diagram);
	}
	diagram = voronoi.compute(sites, bbox);
}

function isIntersect(point, node) {
	return Math.sqrt((point.x-node.x) ** 2 + (point.y - node.y) ** 2) < 10;
}

function setOrUnsetPath(){
	if(!selectingPath){
		alert("Please click on start node:");
		aStarBtn.innerHTML = "Cancel";
		aStarBtn.classList.toggle("btn-dark");		
		aStarBtn.classList.toggle("btn-danger");
		selectingPath = true;
		selectingStart = true;
	}
	else {
		aStarBtn.innerHTML = "A*";
		aStarBtn.classList.toggle("btn-dark");
		aStarBtn.classList.toggle("btn-danger");
		selectingPath = false;
		selectingStart = false;
		selectingGoal = false;		
	}
}

aStarBtn.addEventListener("click", function(){ 
	setOrUnsetPath();
});

canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);

	if(!selectingPath){
		var newPoint = {x: mousePos.x, y: mousePos.y};
		if(checkDuplicates(sites, newPoint) != 1){
			sites.push(newPoint);
			clearCanvas(ctx);
			calcVoronoi();	
			getDiagramInfo();			
			drawVoronoiEdges();
			drawGraphEdges();
			drawGraphNodes();
			grahamScam(graph.nodes);
		}
		else {
			console.log("There is already a point in the given position");
		}
	}
	else {
		for(var i = 0; i < convexHull.length; i++){
			if(isIntersect(mousePos, convexHull[i])){
				if(selectingStart){
					startNode = convexHull[i];
					var color = [255, 0, 0, 255];
					drawPoint(convexHull[i].x, convexHull[i].y, color, ctx);
					selectingStart = false;
					selectingGoal = true;
					alert("Please click on goal node:");
				}
				else if(selectingGoal){
					goalNode = convexHull[i];
					var color = [0, 0, 255, 255];
					drawPoint(convexHull[i].x, convexHull[i].y, color, ctx);
					setOrUnsetPath();
					var path = findPath(startNode, goalNode); //A* code
					console.log(path);
					drawPath(path);
				}
			}
		}
	}
}, false);

function findEdge(nodeToSearch, nodeConnected){
	for(var i = 0; i < nodeToSearch.edges.length; i++){
		if(nodeToSearch.edges[i].nodeBegin == nodeConnected ||
			nodeToSearch.edges[i].nodeEnd == nodeConnected){
				return nodeToSearch.edges[i];
		}
	}
	return -1; //edge not found
}

function drawPath(path){
	var color = [0, 255, 0, 255];
	for(var i = 0; i < path.length; i++){
		
		if(i < path.length - 1){
			var edg = findPath(path[i], path[i+1]);
			if(edg != -1){
				var style = "#FF0000";
				drawEdge(
					edg[0].x,
					edg[0].y,
					edg[1].x,
					edg[1].y,
					style,
					10
				);
			}
		}
		drawPoint(path[i].x, path[i].y, color, ctx);
	}
}

function getNeighbors(node){
	var nodes = [];
	for(var i = 0; i < node.edges.length; i++){
		if(node.edges[i].nodeBegin != node){
			nodes.push(node.edges[i].nodeBegin);
		}
		else {
			nodes.push(node.edges[i].nodeEnd);
		}
	}
	return nodes;
}

function dist(node1, node2){
	return Math.sqrt(((node1.x - node2.x) * (node1.x - node2.x)) + ((node1.y - node2.y) * (node1.y - node2.y)));
}

function getCost(node1, node2){
	return dist(node1, node2);
}

function heuristic(goal, next){
	return dist(goal, next);
}

Array.prototype.insertByPriority = function(value) {
	for(var i = this.length - 2; i >= 0; i--){
		if(this[i].priority > value.priority){
			this.splice(i+1, 0, value);
            return this;
		}
	}
	this.splice(0, 0, value);
	return this;
}

function findPath(start, goal){
	var open = [];
	open.insertByPriority(start);

	var cameFrom = {};
	var costSoFar = {};

	cameFrom[start.id] = null;
	costSoFar[start.id] = 0;

	while(open.length > 0){
		var current = open.pop();

		if(current == goal){ //Ends search, goal found
			var path = [goal];
			while(cameFrom[path[path.length-1].id]) {
				path.push(cameFrom[path[path.length-1].id])
			}
			return path;
		}
			
		var neighbors = getNeighbors(current);
		for(var i = 0; i < neighbors.length; i++){
			var next = neighbors[i];
			var newCost = costSoFar[current.id] + getCost(current, next);
			if(costSoFar[next.id] == null || newCost < costSoFar[next.id]){
				costSoFar[next.id] = newCost;
				priority = newCost + heuristic(goal, next);
				next.priority = priority;
				open.insertByPriority(next);
				cameFrom[next.id] = current;
			}
		}
	}

	return []; //Failed, goal not found
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function dotProduct(v1, v2){
	return (v1[0] * v2[0] + v1[1] * v2[1]);
}

function norm(v){
	return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

function normalize(v){
	var normalized = [v[0]/norm(v), v[1]/norm(v)];
	return normalized;
}

function sortPolarAngle(P){
	var minus = Infinity;
	var lowYidx;
	for(var i = 0; i < P.length; i++){
		if(P[i].y < minus){
			minus = P[i].y;
			lowYidx = i;  
		}
	}

	var temp = P[lowYidx];
	P[lowYidx] = P[0];
	P[0] = temp;

	var X = [1, 0];
	var angleArray = new Array();
	angleArray.push(0);
	for(var j = 1; j < P.length; j++){
		var V = [P[j].x - P[0].x, P[j].y - P[0].y];
		V = normalize(V);
		var magnitude = norm(X) * norm(V);
		var angle = Math.acos(dotProduct(X, V)/magnitude);
		angleArray.push(angle);
	}

	for (var i = 1; i < angleArray.length; i++) { 
		var chosenAngle = angleArray[i]; 
		var chosenPoint = P[i];
		var j = i - 1; 

		while ((j >= 0) && (angleArray[j] > chosenAngle)) {  
			angleArray[j + 1] = angleArray[j]; 
			P[j + 1] = P[j];
			j--; 
		}
		angleArray[j + 1] = chosenAngle; 
		P[j + 1] = chosenPoint;
	}
	return angleArray;
}

function grahamScam(P){

	var angles = sortPolarAngle(P);
	convexHull = Array.from(P);

	for(var i = 2; i < convexHull.length - 1; i++){
		var v = ccw(convexHull[i - 1], convexHull[i], convexHull[i + 1]); // > 0 keep, < 0 discard
		if(v < 0){
			convexHull.splice(i, 1);
			i-=2;
		}
	}
	drawConvexHull(convexHull, ctx);
	console.log(convexHull);
	return convexHull;
}

function drawConvexHull(hull, c){
	var color = [0, 255, 0, 255];

	if(hull.length > 2){
		for(var i = 0; i < hull.length; i++){			
			var idx;
			if(i != hull.length -1){
				idx = i+1;
			}
			else {
				idx = 0;
			}

			var style = "#000000";
			drawEdge(
				hull[i].x, 
				hull[i].y, 
				hull[idx].x, 
				hull[idx].y, 
				style);	

			drawPoint(hull[i].x * pixelOffset + canvasWidth/2, hull[i].y * pixelOffset + canvasHeight/2, color, c);
		}
	}
}

function ccw(p1, p2, p3) {
	// ccw < 0: counter-clockwise; ccw > 0: clockwise; ccw = 0: collinear
   return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}