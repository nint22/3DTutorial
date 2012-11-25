// Custom init function for this demo
function Init()
{
    // Nothing to initialize
}

// Main render scene function; called by the RenderLoop() cycle
function RenderScene()
{
    // Render the background
    // Removed to better show the triangle crease / collision
    //RenderBackground(ContextHandle);
    
    // Draw triangle one: top-left, to top-right, to bottom-left (red)
    RenderTriangle(0, 0, 100, 0, 0, 100, 2, {R:255, G:0, B:0});
    
    // Draw triangle one: top-right, to bottom-right, to bottom-left (green)
    RenderTriangle(100, 0, 100, 100, 0, 100, 2, {R:0, G:255, B:0});
}
