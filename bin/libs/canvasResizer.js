define(["canvasParams"],function(params)
{

	var canvasResizer = new function()
	{
		var _baseCanvasW = params.width || document.getElementByID(params.id).width;
		var _baseCanvasH = params.height || document.getElementByID(params.id).height;
		var _screenW =  0;
		var _screenH =  0;
		var _resizeMode= params.resizeMode || "full";	
		var _canvasRatioW =  1;
		var _canvasRatioH =  1;
		var _currentCanvasW = _baseCanvasW;
		var _currentCanvasH = _baseCanvasH;

		//PRIVATE
		this._construct = function()
		{
			this.updateScreenWidth();
			this.changeResizeMode(_resizeMode);
		}

		function applySize(o, size, type)
		{	
			_currentCanvasW = size.w;
			_currentCanvasH = size.h; 
			if (!type)
			{
				o.width = size.w;
				o.height = size.h;
			}
			else 
			{
				o.width = size.w + type;
				o.height = size.h + type;
			}
		}

		function fullMethod (o, type)
		{
			applySize(o, {"w": _screenW, "h": _screenH}, type);
		}

		function ratioMethod (o, type)
		{
			var calcW = _screenW / _baseCanvasW;
			if (calcW * _baseCanvasW <= _screenH)
			{
				applySize(o, {"w": Math.floor(_baseCanvasW * calcW), "h": Math.floor(_baseCanvasH * calcW)}, type);
			}
			else
			{
				var calcH = _screenH / _baseCanvasH;
				applySize(o, {"w": Math.floor(_baseCanvasW * calcH), "h": Math.floor(_baseCanvasH * calcH)},type);
			}
		}

		function scrollPosition()
		{
			return {
				x: document.scrollLeft || window.pageXOffset,
				y: document.scrollTop || window.pageYOffset
			};
		}

		function updateCanvasRatio(o)
		{
			_canvasRatioH =  _currentCanvasH/ _baseCanvasH;
			_canvasRatioW =  _currentCanvasW / _baseCanvasW;
		}

		//PUBLIC
		this.changeResizeMode = function(newMode)
		{

			_resizeMode = newMode;
			switch(newMode)
			{
				default :
					this.resizeMethod = function(canvas)
					{
						fullMethod(canvas, null);
					}
				break;
				case "ratio" : 
					this.resizeMethod = function(canvas)
					{
						ratioMethod(canvas, null);
					}
				break;
				case "fullStretch" : 
					this.resizeMethod = function(canvas)
					{
						fullMethod(canvas.style, "px");
						updateCanvasRatio(canvas.style);
					}
				break;
				case "fullStretchRatio" :
					this.resizeMethod = function(canvas)
					{
						ratioMethod(canvas.style, "px");
						updateCanvasRatio(canvas.style);
					}
				break;
			};
		}

		this.updateScreenWidth = function()
		{
			_screenW =  (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) -20;
			_screenH =  (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) -20;
		}

		this.resizeCanvas = function(canvas)
		{
			canvas.style.marginLeft	= "0px";
			canvas.style.marginTop	= "0px";
			this.updateScreenWidth();
			this.resizeMethod(canvas);
		}

		this.getGoodMouseCoords = function(mouseCoords, canvas )
		{
			
			return {
				'x': (mouseCoords.x - (canvas.offsetLeft) + scrollPosition().x) / _canvasRatioW,
				'y': (mouseCoords.y - (canvas.offsetTop) + scrollPosition().y) / _canvasRatioH
			}
		}

		//setup the variables
		this._construct();
	}

	return canvasResizer;
});

