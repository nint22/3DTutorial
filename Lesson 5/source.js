
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
    
    // For each vertex point
    for(var i = 0; i < CubeVertex.length; i++)
    {
        // Convert from x,y,z to x,y
        // This is called a projection transform
        // We are projecting from 3D back to 2D
        var ScreenX = (RatioConst * (CubeVertex[i].x - CameraPos.x)) / CubeVertex[i].z;
        var ScreenY = (RatioConst * (CubeVertex[i].y - CameraPos.y)) / CubeVertex[i].z;

        // Draw this point on-screen
        RenderPoint(ScreenX + CenterX, ScreenY + CenterY, 3);
    }
}
