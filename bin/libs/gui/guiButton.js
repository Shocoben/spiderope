define(function(){

	var Button = function(x,y,w,h,visuel, onClick, onSelect)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.w = w;
		this.h = h;
		this.guiType = "button";

		this.draw = function()
		{

		}
		
		if (visuel)
		{
			this.visuel = visuel;
			this.visuel.giveParent(this);
			this.draw = function(ctx)
			{
				this.visuel.draw(ctx);
			}	
		}


		this.translate = function(x,y)
		{
			this.x += x;
			this.y += y;
			if (this.visuel)
			{
				this.visuel.translate(x,y);
			}
		}


		this.move = function(x,y)
		{
			this.x = x;
			this.y = y;
		}

		this.onClick = onClick;
		this.onSelect = onSelect;
		
	}
	
	return Button;
});