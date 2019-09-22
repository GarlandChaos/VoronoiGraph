function Node(x, y){
	this.edges = [];
	this.id = -1;
	this.x = x;
	this.y = y;
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

var n1 = new Node();
var n2 = new Node();
var n3 = new Node();
var n4 = new Node();

var e1 = new Edge(n1, n2);
var e2 = new Edge(n3, n4);

var edgs = new Array();
edgs.push(e1);
edgs.push(e2);

// n1.name = "node1";
n1.edges = edgs;

// n2.name = "node2";

var graph = new Graph();

function teste(){
	
	console.log("edges: " + n1.edges[0].nodeBegin.name);
}

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
var points = [
	[-13, 0.5], 
	[-10.5, -11.5],
	[-10, 9], 
	[-4.5, -2], 
	[-1, 8.5],
	[0.5, 6], 
	[0.5, -12], 
	[2, 12.5],
	[3.5, 11], 
	[5.5, 3], 
	[5.5, -7],
	[5, 11.5], 
	[6.5, 3.2], 
	[7, -10],
	[9, -5], 
	[11.5, -4] 
]; 
var convexHull = new Array();

//Canvas functions
function drawClosestPoint(P, close, c){
	clearCanvas(c);
	drawPoints(P, c);
	c.beginPath();
	c.moveTo(close[1][0] * pixelOffset + canvasWidth/2 + pxWidth/2, close[1][1] * pixelOffset + canvasHeight/2 + pxHeight/2);
	c.lineTo(close[2][0] * pixelOffset + canvasWidth/2 + pxWidth/2, close[2][1] * pixelOffset + canvasHeight/2 + pxHeight/2);
	c.strokeStyle = "#FF0000";
	c.stroke();

	var color = [255, 0, 0, 255];
	drawPixel(close[1][0] * pixelOffset + canvasWidth/2, close[1][1] * pixelOffset + canvasHeight/2, color, c);
	drawPixel(close[2][0] * pixelOffset + canvasWidth/2, close[2][1] * pixelOffset + canvasHeight/2, color, c);
}

function drawPoints(P, c){
	clearCanvas(c);
	var color = [0,0,0,255];
	for(var i = 0; i < P.length; i++){
		drawPixel(P[i][0] * pixelOffset + canvasWidth/2, P[i][1] * pixelOffset + canvasHeight/2, color, c);
	}
}

function drawPixel(x, y, color, c){

    dt[0] = color[0];
    dt[1] = color[1];
    dt[2] = color[2];
    dt[3] = color[0];
    c.putImageData( pixel, x, y ); 
    
    c.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]/255+")";
    c.fillRect( x, y, 5, 5 );    
}

function clearCanvas(c){
    c.clearRect(0, 0, canvasWidth, canvasHeight);
}

var voronoi = new Voronoi();
var bbox = {xl: 0, xr: 500, yt: 0, yb: 500}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
var sites = []; 
// = [ {x: 200, y: 200}, {x: 50, y: 250}, {x: 400, y: 100}, {x: 250, y: 100} /* , ... */ ];

// a 'vertex' is an object exhibiting 'x' and 'y' properties. The
// Voronoi object will add a unique 'voronoiId' property to all
// sites. The 'voronoiId' can be used as a key to lookup the associated cell
// in diagram.cells.

var diagram; 
// = voronoi.compute(sites, bbox);

function drawVoronoiPoints(P, c){
	console.log(P);
	var color = [0,0,0,255];
	for(var i = 0; i < P.length; i++){
		drawPixel(P[i][0], P[i][1], color, c);
	}
}

function drawVoronoiEdges(){

	for(var i = 0; i < diagram.edges.length; i++){
		// console.log(diagram.edges[i].va);
		
		ctx.beginPath();
		
		ctx.moveTo(diagram.edges[i].va.x, diagram.edges[i].va.y);
		ctx.lineTo(diagram.edges[i].vb.x, diagram.edges[i].vb.y);
		
		ctx.strokeStyle = "#FF0000";
		ctx.stroke();
		
		
		
		// if(diagram.edges[i].lSite != null && diagram.edges[i].rSite != null){
		// 	ctx.beginPath();
		// 	ctx.moveTo(diagram.edges[i].lSite.x, diagram.edges[i].lSite.y);
		// 	ctx.lineTo(diagram.edges[i].rSite.x, diagram.edges[i].rSite.y);
			
		// 	ctx.strokeStyle = "#0000FF";
		// 	ctx.stroke();
		// }
		
	}
}

function drawGraphEdges(){
	console.log("GRAPH EDGES: " + graph.edges.length);

	for(var i = 0; i < graph.edges.length; i++){
		ctx.beginPath();
		
		ctx.moveTo(graph.edges[i].nodeBegin.x, graph.edges[i].nodeBegin.y);
		ctx.lineTo(graph.edges[i].nodeEnd.x, graph.edges[i].nodeEnd.y);
		
		ctx.strokeStyle = "#00FF00";
		ctx.stroke();
		
		
		
		// if(diagram.edges[i].lSite != null && diagram.edges[i].rSite != null){
		// 	ctx.beginPath();
		// 	ctx.moveTo(diagram.edges[i].lSite.x, diagram.edges[i].lSite.y);
		// 	ctx.lineTo(diagram.edges[i].rSite.x, diagram.edges[i].rSite.y);
			
		// 	ctx.strokeStyle = "#0000FF";
		// 	ctx.stroke();
		// }
		
	}
}

function drawGraphNodes(){
	for(var i = 0; i < graph.nodes.length; i++){
		drawPixel(graph.nodes[i].x, graph.nodes[i].y, [0, 0, 0, 255], ctx);
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

			if(checkId == -1){ //se nodo 1 não existe no grafo
				var n1 = new Node();
				n1.id = diagram.edges[i].lSite.voronoiId;
				n1.x = diagram.edges[i].lSite.x;
				n1.y = diagram.edges[i].lSite.y;

				graph.nodes.push(n1);

				if(checkId2 == -1){ //se nodo 2 também não existe no grafo
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
				else { //se nodo 1 não existe no grafo mas o nodo 2 sim
					var e = new Edge(n1, graph.nodes[checkId2]);
					n1.edges.push(e);
					graph.nodes[checkId2].edges.push(e);

					graph.edges.push(e);
				}
			}
			else {
				if(checkId2 == -1){ //se nodo 2 não existe no grafo
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
				else { //se ambos nodos existem no grafo
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

//report the mouse position on click
canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
	// alert(mousePos.x + ',' + mousePos.y);
	var newPoint = {x: mousePos.x, y: mousePos.y};
	if(checkDuplicates(sites, newPoint) != 1){
		sites.push(newPoint);

		clearCanvas(ctx);
		calcVoronoi();
		// console.log(diagram);

		// drawPixel(newPoint.x, newPoint.y, [0, 0, 0, 255], ctx);

		getDiagramInfo();
		
		// console.log(sites);
		
		drawVoronoiEdges();
		drawGraphEdges();
		drawGraphNodes();
		grahamScam(graph.nodes);

	}
	else {
		console.log("CONTÉM PONTO");
	}
	
}, false);

//Get Mouse Position
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
		if(P[i].y < minus){ //attention here
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

	// var convexHull = [];

	var angles = sortPolarAngle(P);
	// console.log(angles);

	// convexHull = P.slice(0);
	var convexHull = Array.from(P);

	// array.push(array[0]);
	// array.push(array[1]);
	// array.push(array[array.length-1]);

	// console.log("hull lenght 0: " + convexHull.length);
	// var d = convexHull.slice(0);
	// console.log(d);

	for(var i = 2; i < convexHull.length - 1; i++){
		// var v = ccw(convexHull[i], convexHull[i - 1], convexHull[i + 1]); // > 0 keep, < 0 discard
		var v = ccw(convexHull[i - 1], convexHull[i], convexHull[i + 1]); // > 0 keep, < 0 discard
		// var v = ccw(convexHull[i], convexHull[i - 1], convexHull[i + 1]); // > 0 keep, < 0 discard

		// console.log("v: " + v);
		// console.log("LENGTH: " + convexHull.length);
		if(v < 0){ //attention here
			convexHull.splice(i, 1); //remove point from array
			// console.log("convexHull lenght before: " + convexHull.length + " and i: " + i);
			// console.log(convexHull[i]);
			// var a = convexHull.slice(0);
			// console.log(a);
			i-=2;
			// console.log("convexHull lenght after: " + convexHull.length + " and i: " + i);
			// var b = convexHull.slice(0);
			// console.log(b);
		}
		// else {
			
		// }
	}
	// console.log("hull lenght 1: " + convexHull.length);
	drawConvexHull(convexHull, ctx);
	return convexHull;
}

function drawConvexHull(hull, c){
	// clearCanvas(c);
	// drawPoints(P, c);
	// console.log("draw convex");
	// console.log("hull lenght 2: " + hull.length);
	var color = [0, 255, 0, 255];

	// sortPolarAngle(hull);

	if(hull.length > 2){
		for(var i = 0; i < hull.length; i++){
			c.beginPath();
			if(i != hull.length -1){
				// console.log("aaaa");
				c.moveTo(hull[i].x, hull[i].y);
				c.lineTo(hull[i+1].x, hull[i+1].y);
			}
			else {
				// console.log("bbbb");
				c.moveTo(hull[i].x, hull[i].y);
				c.lineTo(hull[0].x, hull[0].y);
			}
			c.strokeStyle = "#000000";
			c.stroke();
			
			drawPixel(hull[i].x * pixelOffset + canvasWidth/2, hull[i].y * pixelOffset + canvasHeight/2, color, c);
		}
	}
	
}

function ccw(p1, p2, p3) {
	// ccw < 0: counter-clockwise; ccw > 0: clockwise; ccw = 0: collinear
   return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
//    return (p2.y - p1.y) * (p3.x - p1.x) - (p2.x - p1.x) * (p3.y - p1.y);
//    return (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y); 
} 

// PESQUISAR https://wikimapia.org

// window.onload = drawPoints(points, ctx);
// document.getElementById("convexHull").addEventListener("click", function(){ drawHalfEdges(); });

