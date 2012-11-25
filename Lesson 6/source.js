
/*** Data ***/

// Cube vertex data
var CubeVertex =
[
    {x:-1, y:-1, z:1},
    {x:-1, y:1, z:1},
    {x:1, y:1, z:1},
    {x:1, y:-1, z:1},
    {x:-1, y:-1, z:-1},
    {x:-1, y:1, z:-1},
    {x:1, y:1, z:-1},
    {x:1, y:-1, z:-1},
];

// Cube edge cata
var CubeEdges =
[
    {i:0, j:1},
    {i:1, j:2},
    {i:2, j:3},
    {i:3, j:0},
    
    {i:4, j:5},
    {i:5, j:6},
    {i:6, j:7},
    {i:7, j:4},
    
    {i:0, j:4},
    {i:1, j:5},
    {i:2, j:6},
    {i:3, j:7},
];

// Camera position
var CameraPos = {x: 0, y: 0, z: -10};

// Camera distortion
var RatioConst = 32;

/*** Functions ***/

function Init()
{
    // Nothing to initialize
}

function RenderScene()
{
    // Render the background
    RenderBackground(ContextHandle);
    
    // Find the center of the image
    var CenterX = CanvasWidth / 2;
    var CenterY = CanvasHeight / 2;
    
    // Create an on-screen point list we will be working with
    var PointList = new Array();
    
    // For each vertex point
    for(var i = 0; i < CubeVertex.length; i++)
    {
        // Convert from x,y,z to x,y
        // This is called a projection transform
        // We are projecting from 3D back to 2D
        var ScreenX = (RatioConst * (CubeVertex[i].x - CameraPos.x)) / CubeVertex[i].z;
        var ScreenY = (RatioConst * (CubeVertex[i].y - CameraPos.y)) / CubeVertex[i].z;

        // Save this on-screen position to render the line locations
        PointList[i] = {x:CenterX + ScreenX, y:CenterY + ScreenY};
    }
    
    // For each edge
    for(var i = 0; i < CubeEdges.length; i++)
    {
        // Find the two points we are working on
        var Point1 = PointList[CubeEdges[i].i];
        var Point2 = PointList[CubeEdges[i].j];
        
        // Render the edge by looking up our vertex list
        RenderLine(Point1.x, Point1.y, Point2.x, Point2.y, 1);
        RenderPoint(Point1.x, Point1.y, 3, {R:100, G:100, B:100});
        RenderPoint(Point2.x, Point2.y, 3, {R:100, G:100, B:100});
    }
}
