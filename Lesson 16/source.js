
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

// Define UV-texture coordinates
var CubeUVs =
[
    { u:0, v:0 },
    { u:0, v:1 },
    { u:1, v:1 },
    { u:1, v:0 },
    { u:0, v:0 },
    { u:0, v:1 },
    { u:1, v:1 },
    { u:1, v:0 },
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

// Global texture array (one big TextureWidth * TextureHeight * sizeof(rgba) array)
var TextureWidth = 0;
var TextureHeight = 0;
var TextureBuffer;

/*** Functions ***/

function Init()
{
    // Create a second canvas buffer to load our image into
    TextureHandle = document.createElement("canvas");
    var img = new Image();
    img.onload = function() {
        TextureHandle.width = img.width;
        TextureHandle.height = img.height;
        var TextureContext = TextureHandle.getContext('2d');
        TextureContext.drawImage(img, 0, 0, img.width, img.height);
        
        // Save actual texture info
        TextureWidth = img.width;
        TextureHeight = img.height;
        TextureBuffer = TextureContext.getImageData(0, 0, img.width,img.height);
    }
    
    // This little hack is to get around the security issue with loading local resources
    img.src = 'data:image/png;base64,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';
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
        
        var VertexA = VertexList[CubeFaces[i].a];
        var VertexB = VertexList[CubeFaces[i].b];
        var VertexC = VertexList[CubeFaces[i].c];
        
        // Render the face by looking up our vertex list
        CustomFillTriangle(PointA, PointB, PointC, VertexA, VertexB, VertexC, CubeFaces[i].a, CubeFaces[i].b, CubeFaces[i].c);
    }
}


// Our custom triangle filler function
function CustomFillTriangle(PointA, PointB, PointC, VertexA, VertexB, VertexC, IndexA, IndexB, IndexC)
{
    /*** Pre-Computation ***/
    
    // Create an array of our vertices (as tuples) for easier access
    var Points = new Array({x:PointA.x, y:PointA.y}, {x:PointB.x, y:PointB.y}, {x:PointC.x, y:PointC.y});
    
    // Sort such that (x1, y1) is always the top most point (in height), then (x2, y2), and then (x3, y3)
    Points.sort(function(a,b) { return a.y - b.y; });
    
    // Define our edges: 1 to 2, 1 to 3, 2 to 3
    // Order is important here so that we maintain that the first point in our edge
    // is *always* higher (i.e. closer towards 0)
    var Edges = [{a:1, b:2}, {a:1, b:3}, {a:2, b:3}];
    
    // Find the top and bottom most point
    // Note: since y grows positive top-to-bottom, we want the smallest value here
    // Note: opposite logical implication for obtaining bottom position
    // Final note: the data is already pre-sorted! Look a the first (topmost) and last (bottommost) vertices
    var TopY = Points[0].y;
    var BottomY = Points[2].y;
    
    // Pre-compute the slops and intersections of each edge, so that we can use this data as a look-up
    // during the horizontal scan (and used again in texturing)
    var Slopes = new Array();
    var Intercepts = new Array();
    for(var i = 0; i < 3; i++)
    {
        // Find the edge vertices (-1 because our arrays start at 0)
        var a = Edges[i].a - 1;
        var b = Edges[i].b - 1;
        
        // Compute slope & edge
        Slopes[i] = (Points[b].y - Points[a].y) / (Points[b].x - Points[a].x); // dy / dx
        Intercepts[i] = Points[a].y - Slopes[i] * Points[a].x;
    }
    
    /*** Canvas Overhead ***/
    
    // Shortext context handle
    var ctx = BackContextHandle;
    
    // Save context
    ctx.save();
    
    /*** Scan-Line Filling ***/
    
    // For each horizontal line..
    for(var y = TopY; y <= BottomY; y++)
    {
        // Find our min x and max x (default to out of bounds to begin with)
        var MinX = CanvasWidth + 1;
        var MaxX = -1;
        
        // What are the two edges we are working between?
        var UsedEdges = new Array();
        
        // For each edge
        for(var i = 0; i < 3; i++)
        {
            // Find the edge vertices (-1 because our arrays start at 0)
            var a = Edges[i].a - 1;
            var b = Edges[i].b - 1;
            
            // If we are in the range of this line, find the min/max
            if(y >= Points[a].y && y <= Points[b].y)
            {
                // Compute the horizontal intersection
                var x = (y - Intercepts[i]) / Slopes[i];
                
                // Save this edge as one of the two we are drawing between
                UsedEdges[UsedEdges.length] = {a:a, b:b};
                
                // Save if new min or max values
                MinX = Math.min(MinX, x);
                MaxX = Math.max(MaxX, x);
            }
        }
        
        // Gather some important information for this horizontal scan
        
        
        // Fill each pixel, using a line, for the given color
        for(var x = MinX; x <= MaxX; x++)
        {
            // Get texture index
            if(TextureBuffer != undefined)
            {
                // Define local barycentric funcs!
                var f01 = function(x, y) {
                    return (PointA.y - PointB.y) * x + (PointB.x - PointA.x) * y + PointA.x * PointB.y - PointB.x * PointA.y;
                }
                var f12 = function(x, y) {
                    return (PointB.y - PointC.y) * x + (PointC.x - PointB.x) * y + PointB.x * PointC.y - PointC.x * PointB.y;
                }
                var f20 = function(x, y) {
                    return (PointC.y - PointA.y) * x + (PointA.x - PointC.x) * y + PointC.x * PointA.y - PointA.x * PointC.y;
                }
                
                // New approach, just use on-screen barycentric positions (sans depth?)
                var alpha = f12(x,y) / f12(PointA.x, PointA.y);
                var beta = f20(x,y) / f20(PointB.x, PointB.y);
                var gamma = f01(x,y) / f01(PointC.x, PointC.y);
                
                var Tex1 = CubeUVs[IndexA];
                var Tex2 = CubeUVs[IndexB];
                var Tex3 = CubeUVs[IndexC];
                
                var w = ( 1 / VertexA.z ) * alpha + ( 1 / VertexB.z ) * beta + ( 1 / VertexC.z ) * gamma;
                
                // Perspective corrected:
                var tx = (Tex1.u / VertexA.z) * alpha + (Tex2.u / VertexB.z) * beta + (Tex3.u / VertexC.z) * gamma;
                tx = Math.floor((tx * TextureWidth) / w);
                
                var ty = (Tex1.v / VertexA.z) * alpha + (Tex2.v / VertexB.z) * beta + (Tex3.v / VertexC.z) * gamma;
                ty = Math.floor((ty * TextureHeight) / w);
                
                var i = (ty % TextureHeight) * TextureWidth * 4 + (tx % TextureWidth) * 4;
                
                var R = TextureBuffer.data[i + 0];
                var G = TextureBuffer.data[i + 1];
                var B = TextureBuffer.data[i + 2];
                
                ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        }
    }
    
    // Revert context
    ctx.restore();
    
    // Done rendering triangle
}
