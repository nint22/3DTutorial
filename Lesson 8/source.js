
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

// Cube face data
var CubeFaces =
[
    // Front
    { a:0, b:1, c:2, i:1 },
    { a:2, b:3, c:0, i:1 },
    
    // Top
    { a:1, b:5, c:6, i:2 },
    { a:6, b:2, c:1, i:2 },
    
    // Back
    { a:5, b:4, c:7, i:3 },
    { a:7, b:6, c:5, i:3 },
    
    // Bottom
    { a:4, b:0, c:3, i:4 },
    { a:3, b:7, c:4, i:4 },
    
    // Right
    { a:3, b:2, c:6, i:5 },
    { a:6, b:7, c:3, i:5 },
    
    // Left
    { a:0, b:5, c:1, i:6 },
    { a:0, b:4, c:5, i:6 },
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
    
    // For each face
    for(var i = 0; i < CubeFaces.length; i++)
    {
        // Find the four points we are working on
        var PointA = PointList[CubeFaces[i].a];
        var PointB = PointList[CubeFaces[i].b];
        var PointC = PointList[CubeFaces[i].c];
        
        // Render the face by looking up our vertex list
        RenderTriangle(PointA.x, PointA.y, PointB.x, PointB.y, PointC.x, PointC.y, 2);
    }
}
