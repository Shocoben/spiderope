define(["addMouseEvents"], function(addMouseEvents){
	var mouseCoords = {};

	mouseCoords.coords = {
		"x" : 0,
		"y" : 0
	};

	this.mousemoveListeners = [];

	mouseCoords.desactive = function(eventBus)
	{
		window.removeEventListener(this, this.onMouseMove, true);
  		if (eventBus)
  		{
  			eventBus.del("mouseup");
  			eventBus.del("mousedown");
  			eventBus.del("mousemove");
  			if (window.removeEventListener)
  			{
	  			window.removeEventListener(this, this.onMouseMoveEmiter);
  				window.removeEventListener(this. this.onMouseUpEmiter);
  				window.removeEventListener(this, this.onMouseDownEmiter);
  			}
  			else
  			{
  				window.detachEvent(this, this.onMouseDownEmiter);
  				window.detachEvent(this, this.onMouseUpEmiter);
  				window.detachEvent(this, this.onMouseMoveEmiter);
  			}
  		}
	}

	mouseCoords.desactiveIfTouchDevice = function(eventBus) 
	{
  		if (('ontouchstart' in window) || !!('onmsgesturechange' in window))
  			return;
  		desactive();
	};

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
			var body = document.body;
			mouseCoords.coords = {"x" : e.clientX - canvas_.offsetLeft + body.scrollLeft, "y" : e.clientY - canvas_.offsetTop + body.scrollTop};
		}

		addMouseEvents(mouseCoords, {"mouseMove" : null});

		return mouseCoords;
	}

	mouseCoords.connectToEventBus=function(eventBus)
	{
		this.onMouseMoveEmiter = function()
		{
			eventBus.emit("mousemove", mouseCoords.coords);
		}
		this.onMouseUpEmiter = function()
		{
			eventBus.emit("mouseup", mouseCoords.coords);
		}
		this.onMouseDownEmiter = function()
		{
			eventBus.emit("mousedown", mouseCoords.coords);
		}

		if (window.addEventListener)
		{
			window.addEventListener("mousemove", this.onMouseMoveEmiter);
			window.addEventListener("mousedown", this.onMouseDownEmiter);
			window.addEventListener("mouseup", this.onMouseUpEmiter);
		}
		else
		{
			window.attachEvent("mousemove", this.onMouseMoveEmiter);
			window.attachEvent("mousedown", this.onMouseDownEmiter);
			window.attachEvent("mouseup", this.onMouseUpEmiter); 
		}
	}

	addMouseEvents(mouseCoords, {"mouseMove" : null});
	return mouseCoords;
});