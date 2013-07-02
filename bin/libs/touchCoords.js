define(["addTouchEvents"], function(addTouch)
{
	var touchCoords = {};

	touches = {};
	
	touchCoords.isTouchDevice= function() 
	{
  		return !!('ontouchstart' in window) // works on most browsers 
      	|| !!('onmsgesturechange' in window); // works on ie10
	};

	touchCoords.onTouchMove = function(e)
	{
		touches[e.identifier].coords.x = e.pageX;
		touches[e.identifier].coords.y = e.pageY;
	}

	touchCoords.onTouchDown = function(e)
	{
		touches[e.identifier] = {};
		touches[e.identifier].id = e.identifier;
		touches[e.identifier].coords.x = e.pageX;
		touches[e.identifier].coords.y = e.pageY;
	}

	touchCoords.onUp = function(e)
	{
		delete touches[e.identifier];
	}
	addTouch(touchCoords, {"touchMove" : true, "touchDown" : true});

	touchCoords.connectToCanvasResizer= function(canvasResizer, canvas_)
	{
		if (!canvas_)
		{
			console.error("Pas de canvas associé au touchCoords");
			return ;
		}

		window.removeEventListener("touchmove", touchCoords.onTouchMove, true);
		window.removeEventListener("touchstart", touchCoords.onTouchUp, true);

		touchCoords.onTouchMove = function(e)
		{
			touches[e.identifier].coords = canvasResizer.getGoodMouseCoords({"x": e.pageX, "y": e.pageY}, canvas_);
		}

		touchCoords.onTouchDown = function(e)
		{
			touches[e.identifier] = {};
			touches[e.identifier].id = e.identifier;
			touches[e.identifier].coords = canvasResizer.getGoodMouseCoords({"x": e.pageX, "y": e.pageY}, canvas_);
		}

		addTouch(touchCoords, {"touchMove" : true, "touchDown" : true});
		return this;
	}
	
	touchCoords.connectToCanvas = function(canvas_)
	{
			if (!canvas_)
		{
			console.error("Pas de canvas associé au touchCoords");
			return ;
		}

		window.removeEventListener("touchmove", touchCoords.onTouchMove, true);
		window.removeEventListener("touchstart", touchCoords.onTouchUp, true);

		touchCoords.onTouchMove=function(e)
		{
			var body = document.body;
			touches[e.identifier].coords = {"x": e.pageX - canvas_.offsetLeft + body.scrollLeft, "y": e.pageY - canvas_.offsetTop + body.scrollTop};
		}
		
		touchCoords.onTouchDown = function(e)
		{
			var body = document.body;
			touches[e.identifier] = {};
			touches[e.identifier].id = e.identifier;
			touches[e.identifier].coords = {"x": e.pageX - canvas_.offsetLeft + body.scrollLeft, "y": e.pageY - canvas_.offsetTop + body.scrollTop};
		}

		addTouch(touchCoords, {"touchMove" : true, "touchDown" : true});
		return this;
	}

	touchCoords.connectToEventBus=function(eventBus)
	{

		eventBus.on("isTouchDevice", this.isTouchDevice);
		if (window.addEventListener)
		{
			window.addEventListener("touchstart", function(e)
			{
				for(var i = 0; i< e.touches.length; i++)
				{
					eventBus.emit("touchstart", touches[e.touches[i].identifier]);
				}
			}, false);

			window.addEventListener("touchmove", function(e)
			{
				for(var i = 0; i< e.touches.length; i++)
				{
					eventBus.emit("touchmove", touches[e.touches[i].identifier]);
				}
			}, false);

			window.removeEventListener("touchend", touchCoords.onTouchUp, false);
			window.addEventListener("touchend", function(e)
			{
				for(var i = 0; i< e.changedTouches.length; i++)
				{
					eventBus.emit("touchend", touches[e.changedTouches[i].identifier]);
					delete touches[e.identifier];
				}
			}, false);
		}
		else
		{
			window.attachEvent("touchstart", function(e)
			{
				for(var i = 0; i< e.touches.length; i++)
				{
					eventBus.emit("touchstart", touches[e.touches[i].identifier]);
				}
			}, false);

			window.attachEvent("touchmove", function(e)
			{
				for(var i = 0; i< e.touches.length; i++)
				{
					eventBus.emit("touchmove", touches[e.touches[i].identifier]);
				}
			}, false);

			window.removeEventListener("touchend", touchCoords.onTouchUp, false);
			window.attachEvent("touchend", function(e)
			{
				for(var i = 0; i< e.changedTouches.length; i++)
				{
					eventBus.emit("touchend", touches[e.changedTouches[i].identifier]);
					delete touches[e.identifier];
				}
			}, false);
		}
		return this;
	}
	return touchCoords;
});