
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
    { a:0, b:1, c:2, i:1 },
    { a:2, b:3, c:0, i:1 },
    
    { a:1, b:5, c:6, i:2 },
    { a:6, b:2, c:1, i:2 },
    
    { a:5, b:4, c:7, i:3 },
    { a:7, b:6, c:5, i:3 },
    
    { a:4, b:0, c:3, i:4 },
    { a:3, b:7, c:4, i:4 },
    
    { a:3, b:2, c:6, i:5 },
    { a:6, b:7, c:3, i:5 },
    
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
    // Also save each point's depth to be used for in the
    // face-sorting algorithm
    var PointList = new Array();
    var VertexList = new Array();
    var DepthList = new Array();
    
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
        
        // Retain these translated positions for texture usage
        VertexList[i] = WorkingVertex;
        
        // Convert from x,y,z to x,y
        // This is called a projection transform
        // We are projecting from 3D back to 2D
        var ScreenX = (RatioConst * (WorkingVertex.x)) / WorkingVertex.z;
        var ScreenY = (RatioConst * (WorkingVertex.y)) / WorkingVertex.z;
        
        // Save this on-screen position to render the line locations
        PointList[i] = {x:CenterX + ScreenX, y:CenterY + ScreenY};
        
        // Save depth of point
        DepthList[i] = WorkingVertex.z;
    }
    
    // Painter's algorithm
    // 1. Find the average depth of each face
    // 2. Sort all faces based on average depths
    // 3. Draw the furthest surfaces away
    
    // 1. Calculate the average depth of each face
    var AverageFaceDepth = new Array();
    for(var i = 0; i < CubeFaces.length; i++)
    {
        // Sum and average
        AverageFaceDepth[i] = DepthList[CubeFaces[i].a];
        AverageFaceDepth[i] += DepthList[CubeFaces[i].b];
        AverageFaceDepth[i] += DepthList[CubeFaces[i].c];
        AverageFaceDepth[i] /= 4;
    }
    
    // 2. Sort all faces by average face depth
    // For clearity: AverageFaceDepth is our comparison variable,
    // but CubeFaces is our list we are changing
    // We are going to implement a bubble sort algorithm
    // This is very slow but is a nice proof of concept
    var IsSorted = false;
    while(!IsSorted)
    {
        // Default us back to a sorted state
        IsSorted = true;
        
        // Make sure each element[n] is < element[n+1]
        for(var i = 0; i < AverageFaceDepth.length - 1; i++)
        {
            // Is element[n] < element[n+1]?
            // This checks the opposite case: when things are inverted
            if(AverageFaceDepth[i] > AverageFaceDepth[i+1])
            {
                // Not sorted
                IsSorted = false;
                
                // Flip elements (both face depth and )
                var temp = AverageFaceDepth[i];
                AverageFaceDepth[i] = AverageFaceDepth[i+1];
                AverageFaceDepth[i+1] = temp;
                
                var temp = CubeFaces[i];
                CubeFaces[i] = CubeFaces[i+1];
                CubeFaces[i+1] = temp;
                
                // Break out of for loop
                break;
            }
        }
    }
    
    // Reverse array
    CubeFaces.reverse();
    
    // 3. Render the cube-face list, which is now ordered by furthest to closest
    for(var i = 0; i < CubeFaces.length; i++)
    {
        // Find the four points we are working on
        var PointA = PointList[CubeFaces[i].a];
        var PointB = PointList[CubeFaces[i].b];
        var PointC = PointList[CubeFaces[i].c];
        var Color = {R:(CubeFaces[i].i * 50) % 255, G:(CubeFaces[i].i * 128) % 255, B:(CubeFaces[i].i * 200) % 255};
        
        var VertexA = VertexList[CubeFaces[i].a];
        var VertexB = VertexList[CubeFaces[i].b];
        var VertexC = VertexList[CubeFaces[i].c];
        
        // Find the first vector and second vector
        var VectorAB = {x:VertexB.x - VertexA.x, y:VertexB.y - VertexA.y, z:VertexB.z - VertexA.z};
        var VectorAC = {x:VertexC.x - VertexA.x, y:VertexC.y - VertexA.y, z:VertexC.z - VertexA.z};
        
        // Normalize the lines
        var LengthAB = Math.sqrt(VectorAB.x * VectorAB.x + VectorAB.y * VectorAB.y + VectorAB.z * VectorAB.z);
        VectorAB = {x:VectorAB.x / LengthAB, y:VectorAB.y / LengthAB, z:VectorAB.z / LengthAB};
        
        var LengthAC = Math.sqrt(VectorAC.x * VectorAC.x + VectorAC.y * VectorAC.y + VectorAC.z * VectorAC.z);
        VectorAC = {x:VectorAC.x / LengthAC, y:VectorAC.y / LengthAC, z:VectorAC.z / LengthAC};
        
        // Compute the surface normal (through cross-product)
        var OutVector = {x:0, y:0, z:0};
        OutVector.x = (VectorAB.y * VectorAC.z - VectorAB.z * VectorAC.y);
        OutVector.y = (VectorAB.z * VectorAC.x - VectorAB.x * VectorAC.z);
        OutVector.z = (VectorAB.x * VectorAC.y - VectorAB.y * VectorAC.x);
        
        // Render the face by looking up our vertex list
        if(OutVector.z > 0)
        {
            RenderFillTriangle(PointA.x, PointA.y, PointB.x, PointB.y, PointC.x, PointC.y, 2, Color);
            RenderTriangle(PointA.x, PointA.y, PointB.x, PointB.y, PointC.x, PointC.y, 1);
        }
    }
}
