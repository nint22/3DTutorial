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
    
    // For 100 points
    for(var i = 0; i < 100; i++)
    {
        var x = Math.random() * CanvasWidth;
        var y = Math.random() * CanvasHeight;
        
        RenderPoint(x, y, 2);
    }
}
