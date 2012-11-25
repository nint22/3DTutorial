
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
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAAE7W8YKAAAACXBIWXMAABE6AAAROgG2YLIrAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAHLpJREFUeNpi2b59OwM24CEmhlWcBc7y9PTcvn37////GRkZGXADFgYGBkFVKzZ2dgYGhuzuTXdZpqsx5nO9OOAxbx5ODWzs7IZJHOce/wiJL1RjLLi9c8K5xz8YXl3FqcFQhl35d+pdGfZ5k+r5+AUMUyecx++k809+3mWbrebBPbu3goGBgXEHwwUmJnwaXl7ZL3ha+MP7Cfb/JjD8YDj3+MfzS3v18YfS8mVLPIT/M5zazmDm+fLKfnyhJO4BNek8AwODaQIDA4M4VMqIQDwQCQhrgMTjhAkT8vPzidLwP4yBYeV/hnBGBmI0MDIy/v//n4GBgWHlfwibgAaoaiSdNPD0x48f+fn54VYBAAAA//9iIT8/kOCk9+/fa9gGMTAwGCZxMOz6v2HDBg4ODpwaOlaerwg3hPLEZRgcGTnKt+dN2HmrLRa7BmcbE3EdO0MZdgYGBsYlTxgYGMqcb+Bz0tL1e2qTXdU8ChkYGM49/sHAwMDJyuhgvBenhgk5juef/Ly1o3/Hjh3mchy//v0//+QnnnIAmoEYZT3/T8n9tWn6jh07CIQSJD+c+38Wko/FEVKU5YcLFy4YGBiQkB8QSYNg2v4fhsJlIZy2V/5H5tIgeZPsaQiAqGZgYAAAAAD//8KZH269/Kkmzk58PiHKCx4TPBl2/D//5CcDA0N2dyEzKzsDA8PVzV2s3mw7irYzkAWgFojrOObE+BoyMIgzMEByBtQf/yao+TLcYmZ49Ztb19AMfymN04LKWYd3L3Y9fnivuCsDJBsxMDBAqqLzDB0rGRjOhEx48ui+rqEZnnyLzwJ+fp7H7//8+/tXzaPwlsQWhrbtDFWeBxkq4EWj6UmG/yfiIEFHjg8qwg3vHN/EYOl3a0f/+Scd4UkVDAw+twolzs/7EZZcvmpu5/dff+Udc2aW+0wqcCczDnh5eZ31JJctW+YxwfPWjv+mIdVqXwoYUipu75zAwMCwY8eOj/eOMjD4kB/JDAwMy5YtY2Bg2FGwnWHHjuYUW3Edx5dX9sOLmxUz28lMRfD6GQNcFZfBKmVEk6xMEoBUbpRagKi4MQA/Pz/5lTNmRY9fltIgwvQHmgilFmD6o7+/n5qRXFhYOGHCBMx2EdUsgJgOMReZhCsAAAAA///MWE1o02AYfjLcjxBde5DC2FzpsAOZPxELCh6aOtuu05lbECeo5CLC1uGlB72YS/WydAdP9bYd4qkHSdMMXEtBhM11SPVQnexPsQx1eHEtpvGQrnazdZhmsO/0hSTvk+/9e543dfmg3mqIDyqLoqh0Ok2SZOM1UQMgEAhIkkSS5NHTnpWFF2YC2PpoAK9XfgJguRCQeJ8QjvmCBppoDUajOlsza4Xswtx6/jPtGwKQk8eBcad/bHJy8l74qQE6KwN0nLqoqiVZltV2xw3PSeDE+YHLONgHLwFFAzA8PEzdbrvSK9wd7DUCoKolqrNVzqKjqzvzDQCeTD1nuZCzKZjzESCCAApS6eGXohFOHhESYpTWL1guVLkhRsMAdE7OZ2d+lTQAg0OM+uqlwSAfcpybLl3rVr4DcPrHznS1za9u+l098uyirY9ubiIA9HjuGM+i4qdto6yuz+XZRV1SHyH7AXxQIvhfVTER9LW0NGfWCjRNOx/dxJZs2Va9fn9mrcByIUmSjJxgdV4ZERJiNCxGwywX0nMfgNfRpnzcDF73ClMKy4WMVUPZRfrLVGdrrihA02RZzmdn1ova2cPEXL8ls/WAcYDRyHRkFGJggH2j6T55MPFsRBjL/dBcLhefndn1H8guAJHRSwDaH8cxG0d+GcvveMdxnvfiAsHz8cokYkKzk78SOGC3Xb2lJw/uxxttdnV00VsA+1cX7QlAPdY0DUC3WIOTTfn2ahgzVUV5NN4j4fXHEEuUp2mWgKhpmuZ2u5PJpHkx2JrVK5tUKmXCCSp+YBgmFotVb0wOsm5U32xsbFgsFjPrYEdIrVarydp0h7m/xfa+bxV2u31paekf80ijANXWGYbZWxdV0ql6/SbX6kKaCsPwc9ziSC5voh9i0k3bTUQpERQV2Go7pyC66A8ENyS7MNQZFP0rZCVEaZOQssb0orCbMKjvmJlFBaJyxPQiViNKC2d/Zj9sZTtdfPNwOvvJrdxZ9F0c2AeD53nf93u/933eL7H+gOM4QRDod5r6iWn0sYw7UQ6aEZiosW++P3qno8NisagqCgmYpUP5wSPV1dWzdBhfh6QVt2khwJ3l+9zBvPujtP6l31wjOzAysaWgzKdrwFcwj9DS89lkc3pND1Hfs8dS4pvRIDiJZgR4nqdAAQh7yaGtlsgjuWS+HoA5w/ljxhdJugjg/X7e/Hg1uAqfroFpgzjZxyTXzP1B3eu6I5uZYRhCiJj9sG84SOVTlmWDwSAAWXP0dV4EsHBVwQve4M2oN4dKmXYQQmiXCuDk1d4jBStCoVAqCPAbN15o7aW/n775Jg4Fduw64AVkxF2+cZVcSpVbNnuu+RGAUrppzN1AOfcNB8+d2Jd0t5IwAZO13LI2b/xT2N59w8GWSzVMTp1J0c7Ki2rNkfs7d+u+f59gWbb3ZVA3Od9MQoNOMoQedA0sXWymZvYPdur1epPN2R7yLLz9Aa+fYcEiKidQw+flZMon++CewrYb18ShgJec8Q+u53leksKDgaS7rYQJuJy2slp3tiGrse5orpGFkRMEwT/QhsWAVYHAyiDDKUOn69T55lPnmwFIVjA83/syQNFv2llmMMxMUQhRDuX1HTt2HaDKB8dxH19xsDJMO2grHmdRh9DancoA8+fOXjnvbXFxcUrT6LlSC42fxsbGY/UtodAPuAMikJeTScsNURQP3TuMijqaZ+m/Ll+5Lg4FHnQQ2+btx043fHreM2n15dpcZEVFRTe7nwOSf7DT5XKVjhBp2xy4CwFwW8rgOI4nXQA4d2H4ytt7CUbWPy/TXFI0M8uQtWTdyMBdpHCpCbjdbvkOIoTcsgHXRsN5s/kdv2YZ6X7nFWrNXIVXqFU2loSQlF1eU62FCCG0doNCIXLYawRBcDltcjGXqN6dpuKEZgRiz81irVjztJhZ6n/0gPJtgnwbRp2j6dMTfWQ3PzY29m94ICp6ACpBRWMCqhpJiThSjNNYWIllY7WlZY3v1x3VQPTv6yrJqVVR0Ks4ROxERZ82Z6BF+v1OWqVRSZKampocDofSonHCPapWrbEH7Ha73W4H0N/fT59lVVZWVlVVhQsWh0N5FcR5SaFxCMUyrcfj8Xg8VKiP89BEYwLxkcVJnelCQE4s8nBBtfLz82Mln3QJIYqstbX1n/SAMvlEfYk0lTDTpwP6qGl0ikflJzvXHttUFcZ/p7ddKysoqAPC5loeI+JkjFcgPniuuxURJwMMoHY8NBMY3RgOJDAJGB4aqYtmijpKALPNkKIC7bbMF4kgsnaQxbAGabGAMALG8WrXx/GPs167jnbDaHsXOX/de9fbfb/zncf3fb/faXf5gZycHJPJJNzKZDKv19udF8XCD5hMJq1WW1NTMyc3t6q6upvWiyulNJvNGo3mz9ZWkVAbdwfAWHmg/tD+PXv2AEhKn/rbicNRRPaiA8DzPMdxuhefZ7ctTd8sWLCgpKRk/Pjx4gWg1WrZohCgVCJkpQC7UnIoLS296fEP6MUBUD82ctu2bSICwNiacapEq9VqO+9pCKnmChKyAcCo51a1+igh5NSpU62trX369BEFAGZ9Sl9pU4vv9i0PgCP15qemaRlzQYikOTcBi7e0q9M1ZNasWQcOHGC8TpwB9E+fMjpFUV9fv/7VnE07TYAPIWxAsOofSPvCbX/mrISTnfa+AwoDaUjjCymldXV1Dz36NGJIkHUAwCSeVpe74egRrcPMTA+NdSUSCROAAsArQ05ToI6m8YW4DQAajWZbxdfCV8Wa5GPDJnORwlbhXjo3SyqVHu8URQUCAYEpI3XtcxogAHW3XinaUJSZLG+80JZw+YwnaUisPcBYDFuFWyGD2WzmOA7AsTNXJwx9UMiMOI47ce4WAHvAgOlAHYWG2GtpGl/kOroPWGixWFIypjLrCww1MaBn2gEUvF/LiJmMQfLjPx0D4Pf7AcgVStt5DyOUbOc9zHoA4CT8icBZvhASvT3IO7Hm9lEJAYDeib2USuWNGzdi4oHgULG6PA+kTZg3e7lmqOf19CmR3kmjBRgTvA5ary+rr9y5eVSynFI0XvBMenLsos37Y8GRJSYmCjdjH5HXWc/tXDOzsrJy3p04VgTlw2Ete2y1oWBaZopCSMxfmvPMwZofYjGEpmpmqiflCfeaMSqry330ci1wFyR7bYNztm6V1eXu6/v9l0ttMd0Hhkx7LeAL/5fz7e/tHaq3BwxMah4ER9iAGadS+v0+NjeEXWLE/dcAqFQqhCgSYgGg+dB2gUhtvtxGKbVYLBsGYy/QwfqQ5pvqY8soAJrVvqTWmvYtW7IQyTx7Xly6I0YAzGZzgaEmQSZr83qH908I//vFMwAglcH3dwbzy+fU6m7vY1uF2woAeFCK4uLixydOb7nuB/DuxsJIs+g/2QfavF7m+sxkOc/zV7cCio40fUjzuO8wQq4EpBebmhpcHgkBIWTu4pKz3+5EbJj6Mn32vCVrKj/ZQghhAfND3wMwpHXF0Qstc5HC66UAJCGQD365P3YeKNNnv7h0LVsl+/WSUErz8/P/MBka0pcRqSzK+6NTFDQL68a9OdvlUcolrIgwd3FJbLbhDsFcmT67wFCjTJRfu+lJ4Hzl5eW2dQYAL7xS7PzmgwEZM3oPGGa37Gi80EYpHZ2iGKopqP5su9XltgG5wPAkWXOL9yvL928tzY5lXN0hnC7TZ//6k0Wbm4eblwYOHHjouENxn/ztxRP7rZ7BEktoyCiAibNY9wvKleYWL1NVxDgrCE9o+qdPsZ52AshYpJAkywkhNFsKi5flKzyAWmq2WHieJ4TQSXB4L6rVahZLW11ul7UmISEhngA4TuL3By43fVtbZOYBevs6Xh6MuUl0w0xcOwHdJmx4lgdQ8TKd8zAI1K8NZg5h3lj98RGmeokbgNy8N9j8YxE1FEom9tCtLTfOz0/jC+2Wg+vLqqtah4EdO5tOaBYsQbEH9fvinBMLq8eKFSuam5uFnOZHm31c7jq7ZYdubblxS37V4aN/q1XqYC4Kfz3+ZRWDwQAA0wm2HAZgn3IFyn74sMD4xAgc/Mi+fDh+NgMg9eJWq1iKzbgKAMhYCIAmjVz55jvt3Xy1vd7YY2qj7IBh1adbL56s5zhJzyvusohjflb6hMcGiai4e1d6oSr+H6hY/5d6oXsA4trCfkqm5ym2BFvVarXT6QwTnokdQCgn6XA4upSPi30OUEozMzMbGxsjMa09YBLbbDaxeyBsnESftfEHINjndDpVKlUkJVPolIgCKQ4AVq5caTAYCCGpqald9jGl1Gg0sgu9Xi8KDzDrO5i+cTJKvwv/XPChTqfrEOGLZwi1t86SxU4PwxRocQYQbkRqBs6dvPNHUzOEy1BFnchWoe2Nd4p7w3t68uTJIlpGu6mWC21MfnYvGv33pkGYEzrHPJ2Fr+LaiYXtKbq0NdLiI4ohFOWARvejCVGI/jpbKWATtWoxLM6J5KW8vLxdu3b14JzYaDT2bAD3qhL3AETfCqKM7y6l6xCDej0nJ0ev13c+50YIMRqNYt8HAJhMpkgrKTuj0gM2skjPu4wj4gxg9+7dUX74k91GSgNEAUCn0wn5bpTiilqtdjgckb7kL/auPiyqKo3/zszADLQEiCQqI34Am4vGxz6VGxstAsOMrTE+omKZYKZZ1jJguRr5AM+qtZs5Iyq7axRKDyVlC+ITM6KJmpbWowwJaYWJ8aHIGoMWzMDMnP3jDsOdDwZQsHWY96879557L7y/e973Pe857+/wRmKOKCUlZd++fXq9xYwls73BsL9rpOsT7ko3sHfvXr1en5SUpNPpOBwOj8crLy//1WcDR5cfnjd/vk6nu3/GAxUVFWFhYUKhsLKy8g5w9Yx2AL7+4draF5Yy61pUKpViyz8A1NXV1dXVcblcsVhsoDhceXCoCRUXANYikUjYP6VSaWlpaVJKanlJ0V9Xp9o2sI3funqop7v1VP8oNFNDBuDPcyQ3Z8O8YpdSWn7ivHDy1OomXc6WXTlbdlm1T0417f3AFqZyhefh3dOpOdOoW7xiHYBLRwvEWyVT66fk5+e7ALD/1dMEfPWj9gIw4V5uh9bIlNQIJ09lGkQJBXMXLM3duitKKPD19f306yvs27/75E1weZ4cEiiSmeKzmGWh4oxf/ttQ9PcX4+LiuG7/DOXILl1SiLdKipbsue8uD2+GGQAej0cTIPjMQxvInzx5cumJb23bmNde1lzRf1Nzhn3J2K2FxA1adMYDKjnTA7o0Vxt99mIMUD8VcXHTZq+qOfDWpQ55WTxJTU0dJebIPgDjbOpOsjNX3Pu3U9oNs6qbdKUnvo0SCrKysjZt2mTXnRJCeDyeXq83Q8JxF4RCtu664pk6ConHd6quxkeJMCoK+RTA05M8TpcaQUj43DXMHiZmkjq2LJo9My8vz/kBGGev6qf8wyKVSkUOAb2rjDdu3Lhx40YAEBF80AK/8abjsOj+lpW8IZQtJ4QmACIi/IwinmfyB79b1eefE6DKVBJCij/5fPoDFou8So6ca/iqwsPDw2kB4HA4E8LjrYrMwwLc3XmEqd0uLS2V5s+rtuQotKhPYR1btAF+vvZDy9hyPB+F/DMQEUIIfRB4OVZ//iJv+nymTX1l3vthGAMolUqJ5JFvW3UPh/ofqb1mfsjkB+f8Pug3FZ8ccEIATp8+XfyFZl9hrGW8CLP2AbC/PsZEMIGQlf2pbu6mlmMu3c3rLWPLASD/zKQ/PCnwloUkAkYF1Ed/mALcfwqKL0LFGZQan6qFsjcknT7ew2AwaPXG81dZZTutPbEJcwtfX+1UABBCir/QPJc632DoU1xkIL/1pp4QcrZRe11zc1VGzsXDO2mCteO1MtZnG7XUZsTL9/ILhWzpH/22h8V7C2eaglGODBx03Wj2uDCRvXNG2stveQdFlBW9ueXtEgBN7Qb2o7q0Oq9xwQuXZ374zlbnAeAluQrA7EcfZH/7eiMd58VjLMk9AveLh3cqlUpslQypJsyK1fbxtFccNI4SKqZ6YOeWNeNmxGq7dH8SzQUQ7O8Gm4LAgJmJzBIpZwBAIpHYErlGCU2jp9baKk9Pz3nzFyQnJ0skklMPAb4j9deom7vDl7sf4nKZokylUplTcGrxC6+O8+JaJPsK3kh5dt3W/d/lpTsFAJMeWcL88PXht2t0doOiw9U/AnCfJnq65jyAQ4bCIGgcPzqUI7M9efxwRUz8HHvfvuBso3Z2zGN+wbK13f5mB54jFte3dWu6jOxIgcfjmjqpc5igns4bfK+xAG7c7PN1Nc268Il8ALkvLlq1yhQmFp9d2afWSoqWerwqwe7vLR6ZFoLNSqSFWL0pJFVQ0IzHDmutzm97WLA7DLXXaLdOd/hoVZRQsOKgghmFcTgcBIqC/d0BtHfqegEgOwpKnCoKEkf6nWgBALYHNlJ09VAPN1JWVubn51dcXOzl5WV994Rg7P7evKUYWuqRFmK3avqlpdKJ3+DIT0gU8LWWxbt7WvBlB678duyRr5sBxEmkv3xexlwSiUR6AwVw7gq7xJx8evxLANQpkts8AAsXLnw/ZdmkWSmMdzWzFFxo7QZgMOL69evR0dEbNmywuNWsd7PGJwT3V7O+vagMwDrggfFu/SUwGPlUadK+WCwGwONajOY8BPwnlpjipe2ZEueJgsr2FppdsZluvTdCRX1b98mTJ9va2sgh/ByniOTJEjhpAOzuutZrqmV2T395yRGxx7rnl9AEiDmJjPaZjljTbOoxS55/7YN/b2aO73yB44gPxBizm76tklL6xFOy8mKFSZMEjBX29/c3LRVJUAyGAX9owudHLiWVKoBSFXCuRddtsKjGd3Pj9fTok59Za6w/sGPHDqfNBW1LFzGB6aJnBSUFbxw58dWsqBnVTQAg9OWNvYdLKd21axcOPcfuJVFCQeicV6jBDlEez80+fcB7u+QYM/3pZHHvWFl3fP0xqow526ibOdF9eoD7uZY+u7/gmbVcN/ftGWJKKZAIJxL72VCmN7TWVr28WBIsSg8PC83KXN7Yrm9s10cG8leuXPnQ42msJSUISZRRQw+TyOyJB49g9QXs/JFCRPCiAgA5BJoIGDGmCu16hIgzQGlcjEUUHxMTc7ZJx+Wgtlf1i1es7+68kb8+eUemBIMrnnESANhILFy4MOudtt7PVAvwCSGTJk169913jUYjIaSoqOj7g+9RMVBfjWkRByKJ2+vKuczmUr0Bq1KlUjFTOgYDOq4hZTypRJAh/qeH/ZmHyOXyiooKerOdePma3fJHhW81qw/CqWUAAAghx75pM/8UCDxUKpVSqSwoKIiLi2PSRBmbH83Y/LapKK1JF3hA28fFZhkUHalprm7pAXzxjon7BsC9KYJpJ2hCQoJSqVSdOMVur9d3j9BqorsGALHk8RDRS51d2ubj/2IrQq1Wm6xNIN/Obb1sSACYXUWYqIa9w0ifeFr3udbaKj6fX9d+T/RD4dMS/jJ6e8DVq1dBDaaAb30S45zpwUKI0urr6wHwLDI0+OjgqSx5CaNiZtLRVt12MNCjz77/0hE90WfDXqVOpwv21LXWVq2Zd/8T858s//j90QhAQECAVfdXKpUqo2n7GQBiy/YLEmctSJwVKs74z/ZMW733+xou2Ey9G/ZavHHKlClOrH3c5sIslUwJG5bjPFli08U6pt9Ep2T5+3hGp2Sxx03WxMhrRvWSxZFdXfza2tUB9/ndGU45FwDWwvDdMMmlk6qPgwPHuNR9RwHIkyW21lYVV9Y+JZrh0n6/AAx9v7GhSaZ49gj/C1GuHuASFwC/tphXofn4+LS3t7sAGBH95uTk2GXeACtRqNFohsQo4QJgsMLoNDs72xYbdrEts7FhbGxsVVWVC4BhNi/9AUMIWbasj9k9LS3NQf2zC4ChyeXLlzHQVMTtTFS4ALAjy5YtYxi7bH2ArQlyRUFDkNjY2KNHj5aVlSUlJTFnfH19zTwDQUFBDQ0NAAoLCx3bELZRamhoCAoKYo73798vlUqHhNOoAMCWw2dIHIGObQ4T9pjPs2sj1Gp1eHi4CwA7qh/G6WUfHx/macw+WVYw3AV0HXe4K/SrkUWsUMfTG4Uae87BB50dfT8tGe6kUimlNCIiwjUOsB8pOvrwF1kGmmwtOzhvu9U2oFarGbov/N9yoP66GNiXEmqBQX97Zg+u2WCYjlxhqD3lDlOzAcmjRykAOTk5t8D7eZs+3wVAn2RnZ2dnZzuwzmq1OjIyEkBqaqrVQMycY9izZw+A6upqZqt5u9/+kDAedSaIUnr58mW7moqIiDCfkclk27ZtY19NT0/fvXu3XWA0Go2vr++tRbej0QeY+cM7OjqY5CUz+mXzjykUCrus23YNvWMudRcA/Yq3t7dCoWD42RntS6XS/fv3O75LLpezKd1v06mMagDMhsj8OZeVlQ3eo+Tm5g48wnABMKD2bzmmys3NNeN3y/HVKAUgNjYWw5cRGpBG2gXA8MuAjKYuABxJVVUVIUQqlQ7e6FvJsWPHbm3o6wLAwm5EREQwtQ63YMTlcvnt+5JRbYLM/nOoNzKYZWRkZGRkuMLQ28XAbEYG3wkiIyOHy4G7nDBqamrMiZ3BYDB4anQXAIMdCgy+H1jp3Zy/c/mA4RmIUUqZKS3bSw7yd4QQxxz1LgAcWX8rYedEB9P+Ng3R/wYANaCEVyrnw2AAAAAASUVORK5CYII=';
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
        
        // Render the face by looking up our vertex list
        CustomFillTriangle(PointA.x, PointA.y, PointB.x, PointB.y, PointC.x, PointC.y, 2, Color);
    }
}

// Our custom triangle filler function
function CustomFillTriangle(x1, y1, x2, y2, x3, y3, width, color)
{
    /*** Pre-Computation ***/
    
    // Create an array of our vertices (as tuples) for easier access
    var Vertices = new Array({x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3});
    
    // Sort such that (x1, y1) is always the top most point (in height), then (x2, y2), and then (x3, y3)
    Vertices.sort(function(a,b) { return a.y - b.y; });
    
    // Define our edges: 1 to 2, 1 to 3, 2 to 3
    // Order is important here so that we maintain that the first point in our edge
    // is *always* higher (i.e. closer towards 0)
    var Edges = [{a:1, b:2}, {a:1, b:3}, {a:2, b:3}];
    
    // Find the top and bottom most point
    // Note: since y grows positive top-to-bottom, we want the smallest value here
    // Note: opposite logical implication for obtaining bottom position
    // Final note: the data is already pre-sorted! Look a the first (topmost) and last (bottommost) vertices
    var TopY = Vertices[0].y;
    var BottomY = Vertices[2].y;
    
    // Pre-compute the slops and intersections of each edge, so that we can use this data as a look-up
    // during the horizontal scan
    var Slopes = new Array();
    var Intercepts = new Array();
    for(var i = 0; i < 3; i++)
    {
        // Find the edge vertices (-1 because our arrays start at 0)
        var a = Edges[i].a - 1;
        var b = Edges[i].b - 1;
        
        // Compute slope & edge
        Slopes[i] = (Vertices[b].y - Vertices[a].y) / (Vertices[b].x - Vertices[a].x); // dy / dx
        Intercepts[i] = Vertices[a].y - Slopes[i] * Vertices[a].x;
    }
    
    /*** Canvas Overhead ***/
    
    // Shortext context handle
    var ctx = BackContextHandle;
    
    // Save context
    ctx.save();
    
    // Set width and cap style
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    
    // Set color
    if(color != undefined)
        ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        ctx.fillStyle = "rgb(0, 0, 0)";
    
    /*** Scan-Line Filling ***/
    
    // For each horizontal line..
    for(var y = TopY; y <= BottomY; y++)
    {
        // Find our min x and max x (default to out of bounds to begin with)
        var MinX = CanvasWidth + 1;
        var MaxX = -1;
        
        // For each edge
        for(var i = 0; i < 3; i++)
        {
            // Find the edge vertices (-1 because our arrays start at 0)
            var a = Edges[i].a - 1;
            var b = Edges[i].b - 1;
            
            // If we are in the range of this line, find the min/max
            if(y >= Vertices[a].y && y <= Vertices[b].y)
            {
                // Compute the horizontal intersection
                var x = (y - Intercepts[i]) / Slopes[i];
                
                // Save if new min or max values
                MinX = Math.min(MinX, x);
                MaxX = Math.max(MaxX, x);
            }
        }
        
        // Fill each pixel, using a line, for the given color
        for(var x = MinX; x <= MaxX; x++)
        {
            // Get texture index
            if(TextureBuffer != undefined)
            {
                // Note: flooring (i.e. turning into an integer) is critically important!
                var i = (Math.floor(y) % TextureHeight) * TextureWidth * 4 + (Math.floor(x) % TextureWidth) * 4;
                // Perspective corrected:
                /*
                Ua = output; U and V are interchangable
                U0, U1 = Left texture and right texture limit
                Z0 Z1 = Depth of those points
                a = Where the pixel is, normalized from left to right
                
                Ua = ((1 - a) * (U0 / z0) + (a) * (u1 / z1)) / ((1 - a) * (1 / z0) + (a) * (1 / z1))
                */
                var R = TextureBuffer.data[i + 0];
                var G = TextureBuffer.data[i + 1];
                var B = TextureBuffer.data[i + 2];
                ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
                ctx.fillRect(x - width/2, y - width/2, width, width);
            }
        }
    }
    
    // Revert context
    ctx.restore();
    
    // Done rendering triangle
}
