//this distributes the points based on 'sides' of the shorter path
//this results in a more accurate final shape, but the transition is often not as clean
function shapeTweenSides(shape1, shape2, findStart) {

    var fromShape = [], toShape = [], newShape = [];

    //make sure fromShape is the longer array
    if (shape1.length > shape2.length) {
        fromShape = shape1;
        toShape = shape2;
    } else {
        fromShape = shape2;
        toShape = shape1;            
    }

    //make sure the orientation of the shapes match
    if (d3.polygonArea(fromShape) < 0 != d3.polygonArea(toShape) < 0) toShape.reverse();

    //calculate how many sides on toShape and how many points per side in order to have a matching number of points
    var sides = toShape.length;
    var stepsPerSide = Math.floor(fromShape.length/sides);

    //cycle through each side, adding points along that side's path
    for (i=0; i<sides; i++) {
        var pointA = toShape[i];
        var pointB;

        //if it's the last side, change the step count to use the rest of the points needed to match lengths
        if (toShape[i+1]) {
            pointB = toShape[i+1];
        } else {
            pointB = toShape[0];
            stepsPerSide = fromShape.length - newShape.length;
        }
        
        var stepX = (pointB[0] - pointA[0])/stepsPerSide,
            stepY = (pointB[1] - pointA[1])/stepsPerSide;

        for (n=0; n<stepsPerSide;n++) {
            var newX = toShape[i][0] + (stepX * n),
                newY = toShape[i][1] + (stepY * n);
            newShape.push([newX, newY])
        }
    }
    return findStart ? findStartingPoint(fromShape, newShape) : newShape;
}

//this is often much smoother, but can result in skipped or rounded corners
//it also requires creating a hidden path element in order to use getPointAtLength to plot the points 
function shapeTweenLength(shape1, shape2, findStart){

    var newShape = findStart ? findStartingPoint(shape1, shape2) : shape2;

    var distances = getDistances(shape1),
        totalLength = d3.max(getDistances(newShape)),
        coordsScale = d3.scaleLinear().range([0,1]).domain([0,d3.max(distances)])
    
    var hiddenShape;

    if (!document.getElementById("hiddenShape")) {
        hiddenShape = d3.select('svg').append("path").attr("id", "hiddenShape");
    } else {
        hiddenShape = d3.select('svg').select("#hiddenShape");
    }

    hiddenShape.datum(newShape)
        .attr("d", d3.line())
        .style("visibility", "hidden");
        
    for (i in shape1) { 
        var newPoint = document.getElementById("hiddenShape")
            .getPointAtLength(coordsScale(distances[i]) * totalLength);
        newShape[i] = [newPoint.x, newPoint.y];
    }

    //check the rotational direction by calculating the polygon's area. reverse the array of points if needed.
    return d3.polygonArea(newShape) < 0 ? newShape : newShape.reverse();

    //get distances along the perimeter for plotting the points proportionally
    function getDistances(coordsArray) {
        var distances = [0];
        for (i=1; i<coordsArray.length; i++) {
            distances[i] = distances[i-1] + calcDistance(coordsArray[i-1], coordsArray[i]);
        }
        return distances;
    }  
}

//optional function to match the starting point for both shapes
function findStartingPoint(fromCoords, toCoords) {      

    var closestDist = calcDistance(fromCoords[0], toCoords[0]),
        closestPoints = {},
        tempArrayFrom = [],
        tempArrayTo = [];

    for (n=0; n<toCoords.length; n++) {
        var thisDist = calcDistance(fromCoords[0], toCoords[n]);
        if (thisDist < closestDist) {
            closestDist = thisDist;
            closestPoints = {"from":0, "to":n};
        }
    }

    for (i=0; i<toCoords.length; i++) {
        tempArrayTo.push(toCoords[i]);
    }
        
    return tempArrayTo.splice(closestPoints.to).concat(tempArrayTo)
}

//convenience function for calculating distance between two points
function calcDistance(coord1, coord2) {
    var distX = coord2[0] - coord1[0];
    var distY = coord2[1] - coord1[1];
    return Math.sqrt(distX * distX + distY * distY);
}
