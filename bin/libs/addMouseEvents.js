define(function(){

	var addMouseDownEvent = function(o)
	{
		o.onMouseDown = (o.onMouseDown)? o.onMouseDown : function(){};
		if (window.addEventListener)
		{
			window.addEventListener("mousedown", o.onMouseDown, false);	
		}
		else
		{
			window.attachEvent("mousemove", o.onMouseMove, false);
		}
			
	}

	var addMouseUpEvent = function(o)
	{
		o.onMouseUp = (o.onMouseUp)? o.onMouseUp : function(){};
		if (window.addEventListener)
		{
			window.addEventListener("mouseup", o.onMouseUp, false);
		}
		else
		{
			window.attachEvent("mouseup", o.onMouseUp, false);
		}
	}

	var addMouseMove = function(o)
	{
		o.onMouseMove = (o.onMouseMove)? o.onMouseMove : function(){};
		if (window.addEventListener)
		{
			window.addEventListener("mousemove", o.onMouseMove, false);	
		}
		else
		{
			window.attachEvent("mousemove", o.onMouseMove, false);
		}
	}

	var addMouseEvents = function(o, events)
	{
		if ("mouseDown" in events)
		{
			addMouseDownEvent(o);
		}
		if ("mouseUp" in events)
		{
			addMouseUpEvent(o);
		}
		if ("mouseMove" in events)
		{
			addMouseMove(o);
		}
		if (!events || events.length <1)
		{
			addMouseDownEvent(o);
			addMouseUpEvent(o);
			addMouseMove(o);
		}
	}

	return addMouseEvents;
});