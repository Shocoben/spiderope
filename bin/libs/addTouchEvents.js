define(function(){

	var addTouchDownEvent = function(o)
	{
		o.onTouchDown = (o.onTouchDown)? o.onTouchDown : function(){};

		var fonction = function(e)
		{
			for (var i = 0; i<e.touches.length; i++)
			{
				o.onTouchDown(e.touches[i]);
			}
		}
		if (window.addEventListener)
		{
			window.addEventListener("touchstart", fonction, false);
		}
		else
		{
			window.attachEvent("touchstart", fonction, false)
		}		
	}

	var addTouchUpEvent = function(o)
	{
		o.onTouchUp = (o.onTouchUp)? o.onTouchUp : function(){};
		var fonction = function(e)
		{
			for (var i = 0; i<e.changedTouches.length; i++)
			{
				o.onTouchUp(e.changedTouches[i]);
			}
		}
		if (window.addEventListener)
		{
			window.addEventListener("touchend", fonction, false);
		}
		else
		{
			window.attachEvent("touchend", fonction, false)
		}
	}

	var addTouchMove = function(o)
	{
		o.onTouchMove = (o.onTouchMove)? o.onTouchMove : function(){};
		var fonction = function(e)
		{
			for (var i = 0; i<e.touches.length; i++)
			{
				o.onTouchMove(e.touches[i]);
			}
		}
		if (window.addEventListener)
		{
			window.addEventListener("touchmove", fonction, false);
		}
		else
		{
			window.attachEvent("touchmove", fonction, false)
		}
	}

	var addTouchEvents = function(o, events)
	{
		if (!events || events.length <1)
		{
			addTouchDownEvent(o);
			addTouchUpEvent(o);
			addTouchMove(o);
			return;
		}
		if ("touchDown" in events)
		{
			addTouchDownEvent(o);
		}
		if ("touchUp" in events)
		{
			addTouchUpEvent(o);
		}
		if ("touchMove" in events)
		{
			addTouchMove(o);
		}

	}

	return addTouchEvents;
});