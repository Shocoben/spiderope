define(["canvas"],function(Canvas)
{
	var Window = function(x,y,w,h,params, guiClasse)
	{
		this.x = x || 0
		this.y = y || 0;
		this.w = w || 1;
		this.h = h || 1;
		this.guiType = "window";

		var params = params || {};
		this.background = params.background || null;
		var bufferCanvas = new Canvas(null, {"width": w, "height":h});
		bufferCanvas.associate(this);
		this.GUI = new guiClasse();

		this.lastMouse = null;
		var _useTactilScroll = false;
		var _realScrollX = 0;
		var _realScrollY = 0;
		this.scrollX=true;
		this.scrollY=true;
		this.virtualH = 0;
		this.virtualW = 0;
		this.diffW = 0;
		this.diffH = 0;

		//for the scroll
		this.drawGUI= function()
		{
			this.GUI.draw(this.ctx);
		}

		this.add = function(elem, params, toChain)
		{
			this.virtualH += elem.h;
			this.virtualW += elem.w;
			this.diffW = this.w - this.virtualW;
			this.diffH = this.h - this.virtualH;
			return this.GUI.add(elem, params, toChain);
		}

		this.translate = function(x,y)
		{
			this.GUI.translate(x,y);
		}

		this.move = function(x,y)
		{
			this.GUI.move(x,y);
		}

		this.onMouseDown = function(mouseCoords)
		{
			this.lastMouse = this.getCurrentMouseCoords(mouseCoords);
			this.moved = false;	
			this.GUI.onMouseDown(mouseCoords);
		}

		this.onMouseMove = function(mouseCoords)
		{
			if (_useTactilScroll)
			{
				this.tactilScroll(mouseCoords);
			}
			this.GUI.onMouseMove(mouseCoords);
		}

		this.useTactilScroll = function(scrollX, scrollY, scrollBack)
		{
			_useTactilScroll = true;
			this.scrollX = scrollX;
			this.scrollY = scrollY;
			this.scrollBack = scrollBack || function(){};
		}

		this.tactilScroll = function(mouseCoords)
		{
			var mouse = this.getCurrentMouseCoords(mouseCoords);
			if (this.lastMouse)
			{	
				this.moved = true;
				this.scroll(mouse.x - this.lastMouse.x, mouse.y - this.lastMouse.y);
				this.lastMouse = mouse;
			}	
		}

		this.getCurrentMouseCoords = function(mouseCoords)
		{
			return {"x" : mouseCoords.x - this.x, "y" : mouseCoords.y - this.y };
		}

		this.scroll = function(x,y)
		{

			var scrollY =(!this.scrollY)? 0 : y;
			var scrollX =(!this.scrollX)? 0 : x;

			if (this.diffW >= 0)
			{
				scrollX = 0;
			}
			if (this.diffH >= 0)
			{
				scrollY = 0;
			}

			//We try the scroll and see if it dosn't go out of the limits.
			var projectScrollX = _realScrollX;
			var projectScrollY = _realScrollY;

			projectScrollX += scrollX;
			projectScrollY += scrollY;
			
			if (projectScrollY < this.diffH && this.diffH < 0)
			{
				scrollY = (this.h - this.virtualH) - _realScrollY;
				projectScrollY = this.h - this.virtualH; 
			}

			if (projectScrollY > 0)
			{
				scrollY = -(_realScrollY);
				projectScrollY = 0;  
			}

			if (projectScrollX < this.diffW && this.diffW < 0)
			{
				scrollX = this.diffW - _realScrollX;
				projectScrollX = this.diffW;
			}

			if (projectScrollX > 0)
			{
				scrollX = -(_realScrollX);
				projectScrollX = 0;  
			}

			_realScrollY = projectScrollY;
			_realScrollX = projectScrollX;

			if (scrollX != 0 || scrollY != 0 )
			{
				this.translate(scrollX,scrollY);
				this.scrollBack();
			}

		}

		this.hasNext = function(direction)
		{
			return this.GUI.hasNext(direction);
		}

		this.next = function(direction)
		{
			return this.GUI.next(direction)
		}
		
		this.onMouseUp = function(mouseCoords)
		{
			if (!this.moved)
			{
				var mouse = this.getCurrentMouseCoords(mouseCoords);
				this.GUI.onMouseUp(mouse);
			}
			this.lastMouse = null;
			
		}

		this.onSelect = function()
		{
			this.GUI.onSelect();
		}

		this.onClick = function()
		{
			this.GUI.onClick();
		}

		this.draw = function(ctx)
		{
			this.ctx.clearRect(0,0, this.w, this.h);
			if (this.background)
			{
				this.ctx.drawImage(this.background, 0, 0, this.w, this.h);
			}
			this.drawGUI();
			
			ctx.drawImage(this.canvas,this.x, this.y,this.w,this.h);
		}

		this.getSelectedElem = function()
		{
			return this.gui.getSelectedElem();
		}
			
		this.currentDraw = this.normalDraw;		
	}


	return Window;
});