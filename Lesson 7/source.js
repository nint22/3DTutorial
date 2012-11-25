
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

// Camera rotation (Pitch, yaw, roll)
var CameraRot = {x: 0, y: 0, z: 0};

// Camera distortion
var RatioConst = 320;

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
    
    // Slightly grow the rotations
    CameraRot.x += 0.02;
    CameraRot.y += 0.02;
    CameraRot.z += 0.02;
    
    // Create an on-screen point list we will be working with
    var PointList = new Array();
    
    // For each vertex point
    for(var i = 0; i < CubeVertex.length; i++)
    {
        // The resulting vertex point we are working on
        // Note that we are creating a new object, not making a copy-reference
        var WorkingVertex = { x:CubeVertex[i].x, y:CubeVertex[i].y, z:CubeVertex[i].z }
        
        // Apply rotation onto the vertex
        var Temp = WorkingVertex.z;
        WorkingVertex.z = -WorkingVertex.x * Math.sin(CameraRot.y) - WorkingVertex.z * Math.cos(CameraRot.y);
        WorkingVertex.x = -WorkingVertex.x * Math.cos(CameraRot.y) + Temp * Math.sin(CameraRot.y);
        
        Temp = WorkingVertex.z;
        WorkingVertex.z = -WorkingVertex.y * Math.sin(CameraRot.x) + WorkingVertex.z * Math.cos(CameraRot.x);
        WorkingVertex.y = WorkingVertex.y * Math.cos(CameraRot.x) + Temp * Math.sin(CameraRot.x);
        
        Temp = WorkingVertex.x;
        WorkingVertex.x = WorkingVertex.x * Math.cos(CameraRot.z) - WorkingVertex.y * Math.sin(CameraRot.z);
        WorkingVertex.y = WorkingVertex.y * Math.cos(CameraRot.z) + Temp * Math.sin(CameraRot.z);
        
        // Apply camera translation after the rotation, so we are actually just rotating the object
        WorkingVertex.x -= CameraPos.x;
        WorkingVertex.y -= CameraPos.y;
        WorkingVertex.z -= CameraPos.z;
        
        // Convert from x,y,z to x,y
        // This is called a projection transform
        // We are projecting from 3D back to 2D
        var ScreenX = (RatioConst * (WorkingVertex.x)) / WorkingVertex.z;
        var ScreenY = (RatioConst * (WorkingVertex.y)) / WorkingVertex.z;
        
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
