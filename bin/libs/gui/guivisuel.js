define(function(){
	var Visuel = function(image, params_)
	{
		var params = params_ || {};
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.w = params.w || image.width;
		this.h = params.h || image.height;
		this.guiType = "visuel";
		
		this.color = params.color || "#000000";
		this.image = image;

		if (!image)
		{	
			throw("A Visuel need an image")	
		}
		this.image = image;

		this.draw = function(ctx)
		{
			ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
		}	

		this.giveParent = function(o)
		{
			this.parent = o;
			this.w = 1;
			this.h = 1;
			this.draw=function(ctx)
			{
				ctx.drawImage(this.image, this.parent.x + this.x, this.parent.y + this.y, this.parent.w * this.w, this.parent.h * this.h);
			}
		}

		this.crop = function(cropW, cropH, fromEdge, conserveSize)
		{
			this.cropW = cropW || this.w;
			this.cropH = cropH || this.h;
			this.cropX = 0;
			this.cropY = 0;

			if (fromEdge)
			{
				if (conserveSize)
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						ctx.drawImage(this.image, (this.image.width - this.cropW) + this.cropX, (this.image.height - this.cropH) + this.cropY ,this.cropW, this.cropH, this.x, this.y, this.h, this.w);
					}
					return true;
				}

				else
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						ctx.drawImage(this.image, (this.image.width - this.cropW) + this.cropX, (this.image.height - this.cropH) + this.cropY ,this.cropW, this.cropH, this.x, this.y, this.cropH, this.cropW);
					}
					return true;
				}
			}

			if (conserveSize)
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					ctx.drawImage(this.image, this.cropX, this.cropY, this.cropW, this.cropH, this.x, this.y, this.h, this.w);
				}
				return true;	
			}
			else 
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					ctx.drawImage(this.image, this.cropX, this.cropY, this.cropW, this.cropH, this.x, this.y, this.cropW, this.cropH);
				}
				return true;	
			}
			
		}

		this.cropByPercent = function(cropW, cropH, fromEdge, conserveSize)
		{
			this.cropW = cropW || 1;
			this.cropH = cropH || 1;
			this.cropX = 0;
			this.cropY = 0;

			if (this.parent)
			{
				cropPercentWithParent.call(this, fromEdge, conserveSize)
			}
			else
			{
				cropPercentWithoutParent.call(this, fromEdge, conserveSize);
			}
		}

		var cropPercentWithoutParent = function(fromEdge, conserveSize)
		{
			if (fromEdge)
			{
				if (conserveSize)
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						var nCropW = this.image.width * this.cropW;
						var nCropH = this.image.height * this.cropH;
						var diffW = this.image.width - nCropW;
						var diffH = this.image.width - nCropH;
						ctx.drawImage(this.image, diffW + this.cropX, diffH + this.cropY ,nCropW, nCropH, this.x + diffW, this.y + diffH, this.w, this.h);
					}
					return true;
				}

				else
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						var nCropW = this.image.width * this.cropW;
						var nCropH = this.image.height * this.cropH;
						var diffW = this.image.width - nCropW;
						var diffH = this.image.width - nCropH;
						ctx.drawImage(this.image, diffW + this.cropX, diffH + this.cropY ,nCropW, nCropH, diffW + this.x, diffH + this.y, nCropW, nCropH);
					}
					return true;
				}
			}
		
			if (conserveSize)
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					var nCropW = this.image.width * this.cropW;
					var nCropH = this.image.height * this.cropH;
					ctx.drawImage(this.image, this.cropX, this.cropY, nCropW, nCropH, this.x, this.y, this.w, this.h);
				}
				return true;	
			}
			else 
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					var nCropW = this.image.width * this.cropW;
					var nCropH = this.image.height * this.cropH;					
					ctx.drawImage(this.image, this.cropX, this.cropY, nCropW, nCropH, this.x, this.y, nCropW, nCropH);

				}
				return true;	
			}
		}

		this.imageWidth = this.image.width;
		this.imageHeight = this.image.height;
		var cropPercentWithParent= function(fromEdge, conserveSize)
		{
			if (fromEdge)
			{
				if (conserveSize)
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						var nCropW = this.image.width * this.cropW;
						var nCropH = this.image.height * this.cropH;
						var diffW = this.image.width - nCropW;
						var diffH = this.image.width - nCropH;
						ctx.drawImage(this.image, diffW + this.cropX, diffH + this.cropY ,nCropW, nCropH, this.parent.x + this.x + diffW, this.parent.y + this.y + diffH, this.parent.w * this.w, this.parent.h * this.h);
					}
					return true;
				}

				else
				{
					this.draw = function(ctx)
					{
						if (this.cropH < 0.1 || this.cropW < 0.1)
						{
							return;
						}
						var nCropW = this.image.width * this.cropW;
						var nCropH = this.image.height * this.cropH;
						var diffW = this.imageWidth - nCropW;
						var diffH = this.imageWidth - nCropH;

						ctx.drawImage(this.image, diffW + this.cropX, diffH + this.cropY ,nCropW, nCropH, this.parent.x , this.parent.y,  this.parent.w * (this.w * this.cropW), this.parent.h * (this.h * this.cropH ));
					}
					return true;
				}
			}
		
			if (conserveSize)
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					var nCropW = this.image.width * this.cropW;
					var nCropH = this.image.height * this.cropH;
					ctx.drawImage(this.image, this.cropX, this.cropY, nCropW, nCropH, this.parent.x + this.x, this.parent.y + this.y, this.parent.w * this.w, this.parent.h * this.h);
				}
				return true;	
			}
			else 
			{
				this.draw = function(ctx)
				{
					if (this.cropH < 0.1 || this.cropW < 0.1)
					{
						return;
					}
					var nCropW = this.image.width * this.cropW;
					var nCropH = this.image.height * this.cropH;
					ctx.drawImage(this.image, this.cropX, this.cropY, nCropW, nCropH, this.parent.x + this.x, this.y, this.parent.w * (this.w * this.cropW), this.parent.h * (this.w * this.cropH));

				}
				return true;	
			}
		}

		this.translate=function(x,y)
		{
			this.x+=x;
			this.y+=y;
		}

		this.move = function(x, y)
		{
			this.x = x;
			this.y = y;
		}
	};

	return Visuel;
});