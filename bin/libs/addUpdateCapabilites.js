define(function()
{  
	var requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

	addUpdate=function(o)
	{
		o.updateCurrentCtx="game";

	    o.onEachFrame = function(cb) 
	    {
	        var _cb = function() { cb(); requestAnimationFrame(_cb); };
    		_cb();
	    };

	    o.launchUpdate=function()
	    {
	    	if (o.update)
	    	{
	    		o.onEachFrame(o.update)	
	    	}
	    	else 
	    	{
	    		console.error("update de l'objet "+ o + "inexistant");
	    	}
	    }
	}

	return addUpdate;
});
	