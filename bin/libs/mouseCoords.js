define(["addMouseEvents"], function(addMouseEvents){
	var mouseCoords = {};

	mouseCoords.coords = {
		"x" : 0,
		"y" : 0
	};

	this.mousemoveListeners = [];

	mouseCoords.onMouseMove = function(e)
	{
		mouseCoords.coords.x = e.clientX;
		mouseCoords.coords.y = e.clientY;
	}

	mouseCoords.connectToCanvasResizer= function(canvasResizer, canvas_)
	{
		if (!canvas_)
		{
			console.error("Pas de canvas associé au mouseCoords");
			return ;
		}
		window.removeEventListener(mouseCoords, mouseCoords.onMouseMove, true);

		mouseCoords.onMouseMove=function(e)
		{
			
			mouseCoords.coords = canvasResizer.getGoodMouseCoords({"x": e.clientX, "y": e.clientY}, canvas_);
		}

		addMouseEvents(mouseCoords, {"mouseMove" : null});

		return mouseCoords;
	}
	
	mouseCoords.connectToCanvas = function(canvas_)
	{
		if (!canvas_)
		{
			console.error("Pas de canvas associé au mouseCoords");
			return ;
		}
		window.removeEventListener(mouseCoords, mouseCoords.onMouseMove, true);

		mouseCoords.onMouseMove=function(e)
		{
			
			mouseCoords.coords = {"x" : e.clientX - canvas_.offsetLeft, "y" : e.clientY - canvas_.offsetTop};
		}

		addMouseEvents(mouseCoords, {"mouseMove" : null});

		return mouseCoords;
	}

	mouseCoords.connectToEventBus=function(eventBus)
	{
		if (window.addEventListener)
		{
			window.addEventListener("mousemove", function()
			{
				eventBus.emit("mousemove", mouseCoords.coords);
			});
			window.addEventListener("mousedown", function()
			{
				eventBus.emit("mousedown", mouseCoords.coords);
			});
			window.addEventListener("mouseup", function()
			{
				eventBus.emit("mouseup", mouseCoords.coords);
			});
		}
		else
		{
			window.attachEvent("mousemove", function()
			{
				eventBus.emit("mousemove", mouseCoords.coords);
			});
			window.attachEvent("mousedown", function()
			{
				eventBus.emit("mousedown", mouseCoords.coords);
			});
			window.attachEvent("mouseup", function()
			{
				eventBus.emit("mouseup", mouseCoords.coords);
			}); 
		}
	}

	addMouseEvents(mouseCoords, {"mouseMove" : null});
	return mouseCoords;
});