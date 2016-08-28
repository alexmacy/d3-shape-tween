# d3-shape-tween

An add-on for helping with smooth transitions between shapes using d3.js. This is particularly effective when transitioning from a complex shape to one with less detail.

#### *** Requires d3.js version 4 ***

## Reference

There are two options for tweening shapes: 
  
#### shapeTweenSides(shape1, shape2[, findStart])
Plots the number of points in the longer of the two arrays of points, divided by how many sides the new shape has.

#### shapeTweenLength(shape1, shape2[, findStart])
Plots each of the points from the first shape along the second shape, proportionally to where it was along the outside of the first shape. 
Note: this method often provides a smoother transition, but at the cost of some accuracy because it plots the points based on length along a line  and may skip some of the destination shape's original points.


### Both tweening functions take the same arguments: 

#### shape1 & shape2: (<i>arrays of coordinates</i>)
Arrays of points that can be used for rendering SVG polygons.
    
#### findStart: (<i>boolean</i>) 
Default is <i>false</i> if unspecified. If specified <i>true</i>, triggers a function that loops through shape2's points to adjust so that the shape's first point is the one closest to the start of shape1. This is good when transitioning between shapes that are in the same location, but not when the transition moves the shape to another part of the screen.

