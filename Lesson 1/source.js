
function Init()
{
    // Left empty on purpose...
}

function RenderScene()
{
    // Render the background
    RenderBackground(ContextHandle);
    
    // Find the center of the image
    var CenterX = CanvasWidth / 2;
    var CenterY = CanvasHeight / 2;
    
    // Render some rotating lines
    var TotalLines = 5;
    for(var i = -TotalLines; i <= TotalLines; i++)
    {
        // Find offset corners
        var OffsetX = Math.cos(TotalTime * i * (0.25 / TotalLines)) * 100;
        var OffsetY = Math.sin(TotalTime * i * (0.25 / TotalLines)) * 100;
        
        // Set a color then draw line
        var Color = {R:16, G:128, B:256};
        RenderLine(CenterX - OffsetX, CenterY - OffsetY, CenterX + OffsetX, CenterY + OffsetY, i, Color);
    }
}
