define(function(){
	var Groupe = function(x, y, w, h, params, onClick)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.w = w;
		this.h = h;
		this.parent=this;
		this.visuels=[];
		this.guiType = "groupe";

		this.draw= function(ctx)
		{
			for (var i in this.visuels)
			{
				this.visuels[i].draw(ctx);
			}
		}

		this.translate = function(x,y)
		{
			this.x +=x;
			this.y +=y;
			for (var i in this.visuels)
			{
				this.visuels[i].translate(x,y);
			}
		}


		this.move = function(x,y)
		{
			this.x =x;
			this.y =y;
		}
		
		this.giveParent = function(o)
		{
			this.parent = o;
			for(var i in this.visuels)
			{
				this.visuels[i].giveParent(o);
			}
		}

		this.add = function(visu)
		{
			visu.giveParent(this.parent);
			this.visuels.push(visu);
			return visu;
		}

		this.onClick=onClick;
	}

	return Groupe;

});