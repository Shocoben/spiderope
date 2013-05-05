define(function(){
	var HorizontalLayout = function(params)
	{
		this.currentX = _createX = params.x || 0;
		this.currentY = _createY = params.y || 0;
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.w = params.w || null;
		this.h = params.h || 0;
		this.maxW = params.w;
		this.guiType = "layout";

		this.selectLine = 0;
		this.selectKey = 0;
		this.selectedElem = null;


		var _currentH =0;
		var _offsetX = params.offsetX || 0;
		var _offsetY = params.offsetY || 0;  
		var _elems = [];
		var _currentLine = 0;
		var _currentKey = 0;
		_elems[_currentLine] = [];

		var _nbrElems = 0;
		var _totalLine = 0;


		this.add = function(elem, elemParams_)
		{
			var elemParams = elemParams_ || {};
			//check
			if (!elem.w ||!elem.h)
			{
				console.error("HorizontalLayout : an elem must have an w (width) and h (height), maybe this elem need a visuel.");
				return;
			}

			_currentKey ++;
			//get the params of the elem
			var elemOffsetX = elemParams.offsetX || 0;
			var elemOffsetY = elemParams.offsetY || 0;


			//check the height of the elem, and replace the current height of the layout 
			if (_currentH < elem.h)
			{
				this.h += elem.h-_currentH;
				_currentH = this.h;
			}

			//increment the x of the layout
			if(_elems[0].length >= 1)
			{
				this.currentX += _offsetX + elemOffsetX;
			}
			else
			{
				this.currentX += elemOffsetX;
			}

			if (this.maxW && this.currentX + elem.w > this.x + this.maxW)
			{
				_currentKey = 0;
				_currentLine++;
				_elems[_currentLine] = [];
				_totalLine++;

				//add the Y
				this.currentY += _offsetY + elem.h;
				this.currentX = _createX;	
				_currentH = elem.h;
				this.h = this.currentY + _currentH;
			}

			//attribute the x and the y to the elem
			var elemX = this.currentX;
			var elemY = this.currentY + elemOffsetY;		
			elem.move(elemX, elemY);

			_elems[_currentLine].push(elem);
			if (!this.selectedElem)
			{
				this.selectedElem = elem;
				this.executeSelectedElem();
			}
			//increment the x for the next elem
			this.currentX += elem.w;
			this.w = this.currentX;

			if (elem.w >= elem.h)
			{

				elem.hoverW = elem.w * 1.1;
				elem.hoverH = elem.h + (elem.hoverW - elem.w);
			}
			else
			{
				elem.hoverH = elem.h * 1.1;
				elem.hoverW = elem.w + (elem.hoverH - elem.h);
			}
			_nbrElems++;

			return elem;
		}

		this.hasVerticalNext = function(diff)
		{
			if (this.selectLine + diff <= _totalLine && this.selectLine + diff >= 0)
			{
				return true;
			}
			return false;
		}


		this.executeSelectedElem = function()
		{
			if (this.selectedElem.onSelect)
			{
				this.selectedElem.onSelect();
			}
		}

		this.onClick = function()
		{
			if(this.selectedElem.onClick)
			{
				this.selectedElem.onClick();
			}
		}
		
		this.onSelect = function()
		{
			if (this.selectedElem.onSelect)
			{
				this.selectedElem.onSelect();
			}
		}

		this.hasNext = function(direction)
		{
			var diff = (direction == 1 || direction == 2)? 1 : -1;
			if (direction == 0 || direction == 2)
			{
				//return this.hasVerticalNext(diff);
				return true;
			}
			var keyDiff = this.selectKey + diff;
			if (keyDiff <= _elems[this.selectLine].length - 1 || keyDiff >= 0)
			{
				return true;
			}
			else
			{
				return hasVerticalNext();
			}
			return false;
		}

		this.resetNext = function()
		{
			this.selectKey = 0;
			this.selectLine = 0;
		}

		this.resolveVerticalNext = function()
		{
			if (this.selectLine < 0)
			{
				this.selectLine = _totalLine;
			}
			if (this.selectLine > _totalLine)
			{
				this.selectLine = 0;
			}
			if (!_elems[this.selectLine][this.selectKey])
			{
				this.selectKey = 0;
			}
		}

		this.resolveHorizontalNext = function()
		{
			if (this.selectKey < 0)
			{
				this.selectLine--;
				this.resolveVerticalNext();
				this.selectKey = _elems[this.selectLine].length - 1;
			}	

			if (this.selectKey > _elems[this.selectLine].length -1)
			{
				this.selectLine++;
				this.resolveVerticalNext();
				this.selectKey = 0;
			}

			
		}
		this.getSelectedElem = function()
		{
			return _elems[this.selectLine][this.selectKey];;
		}

		this.next = function(direction)
		{
			if (this.hasNext(direction))
			{
				switch(direction)
				{
					case 0 :
						this.selectLine --;
						this.resolveVerticalNext();
					break;
					case 1:
						this.selectKey++;
						this.resolveHorizontalNext();
					break;
					case 2 :
						this.selectLine ++;
						this.resolveVerticalNext();
					break;
					case 3 :
						this.selectKey -- ;
						this.resolveHorizontalNext();
					break;
				}
				this.selectedElem = _elems[this.selectLine][this.selectKey];
				this.executeSelectedElem();
				return this.selectedElem;
			}
			else
			{
				this.resetNext();
				this.executeSelectedElem();
				return false;
			}
		}

		this.addOtherLayout = function(elem)
		{

		}

		//need to be -reDryed
		this.onMouseDown = function(mouseCoords)
		{
			for(var i in _elems)
			{
				if (pointAABB(mouseCoords, _elems[i]))
				{
					if(_elems[i].onMouseDown)
					{
						_elems[i].onMouseDown(mouseCoords);
					}
				}
			}
		}

		this.onMouseUp = function(mouseCoords)
		{
			for(var i in _elems)
			{
				if(pointAABB(mouseCoords,_elems[i]))
				{

					if(_elems[i].onClick)
					{
						_elems[i].onClick(mouseCoords);
					}
					if(_elems[i].onMouseUp)
					{
						_elems[i].onMouseUp(mouseCoords);
					}
				}
			}
		}

		this.onMouseMove = function(mouseCoords)
		{
			for(var i in _elems)
			{
				if(pointAABB(mouseCoords,_elems[i]))
				{
					if(_elems[i].onMouseMove)
					{
						_elems[i].onMouseMove(mouseCoords);
					}
				}
			}
		
		}

		var drawElems = function(ctx)
		{
			for (var i=0; i<_totalLine + 1; i++)
			{
				for (var j = 0; j < _elems[i].length; j++)
				{
					_elems[i][j].draw(ctx);
				}
			}
		}

		var drawHoverSelect = function(ctx)
		{
			if (this.selectedElem)
			{
				ctx.globalAlpha = 1;
				ctx.fillStyle = "#3E3C3A";
				var w = this.selectedElem.hoverW;
				var h = this.selectedElem.hoverH;
				var x = this.selectedElem.x - ( (w - this.selectedElem.w ) * 0.5);
				var y = this.selectedElem.y - ( (h - this.selectedElem.h ) * 0.5);
				ctx.fillRect(x, y, w ,h);
			}
			drawElems(ctx);
		}

		this.drawHoverSelect = function()
		{
			this.draw = drawHoverSelect;
		}

		this.normalDraw = function () {
			this.draw = drawElems;
		}

		this.draw = drawElems;
		//find something to redry that
		this.translate = function(x,y)
		{
			this.x +=x;
			this.y +=y;
			this.currentX += x;
			this.currentY += y;
			for(var i in _elems)
			{
				_elems[i].translate(x,y);
			}
		}

		this.move = function(x,y)
		{
			this.x =x;
			this.y =y;
			this.currentX = x;
			this.currentY += y;
			for(var i in _elems)
			{
				_elems[i].move(x,y);
			}
		}

	}

	return HorizontalLayout;
});