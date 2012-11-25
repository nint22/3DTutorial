// Simple growing variable
var Time = 0.0;

// Custom init function for this demo
function Init()
{
    // Nothing to initialize
}

// Main render scene function; called by the RenderLoop() cycle
function RenderScene()
{
    // Render the background
    RenderBackground(ContextHandle);
    
    // Grow time
    Time += 0.1;
    
    // Compute screen centers
    var CenterX = CanvasWidth / 2;
    var CenterY = CanvasHeight / 2;
    
    // Draw a line from the origin (0, 0) to a position on a circle around the center
    RenderLine(0, 0, CenterX + Math.cos(Time) * 20.0, CenterY + Math.sin(Time) * 20.0, 2);
}
