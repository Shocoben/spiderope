define(["canvas", "canvasParams"], function(Canvas, canvasParams){
	function guiLabel(text, x, y, params)
	{
		this.text = text;
		this.x = x;
		this.y = y;
		this.guiType = "label";
		var bufferCanvas = new Canvas(null, {"width": canvasParams.width, "height": canvasParams.height});
		bufferCanvas.associate(this);

		var params = params || {};
		var _family = params.family || "Arial";
		var _size = params.size || 16;
		this.color = params.color || "#000000";

		this.w = this.ctx.measureText(this.text).width;
		this.h = _size/2;
		this.changeFont = function(size, family)
		{
			_family = family || _family;
			_size = size;
			this.font = _size + "px " + _family; 
		}

		this.positionToMiddle = function( o, params, notX, notY )
		{
			this.ctx.font = this.font;
			var width= this.ctx.measureText(this.text).width;
			var params = params || {};
			if (!notY)
			{
				this.y = (o.y + o.h/2) + _size/2;
			}
			if (!notX)
			{
				this.x = (o.x + o.w/2) - width/2;
			}
			this.x += params.offsetX || 0;
			this.y += params.offsetY || 0;
		}

		this.textAlign = "left";

		this.draw = function(ctx)
		{
			ctx.textAlign = this.textAligne;
			ctx.font = this.font;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y)
		}

		this.translate = function(x, y)
		{
			this.x += x;
			this.y += y;
		}

		this.move = function(x, y)
		{
			this.x = x;
			this.y = y;
		}

		this.changeFont(_size, _family);
	}

	return guiLabel;
});