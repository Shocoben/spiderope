define(["guiPath/guihorizontallayout","guiPath/guiGroupe", "guiPath/guivisuel", "guiPath/guiwindow", "guiPath/guiButton", "guiPath/guiLabel", "guiPath/guiPointAABB"],
function(HorizontalLayout, VisuMaster, Visuel, Window, Button, Label, pointAABB)
{
	function GUI()
	{
		this.elems = {};
		var _maxZ = 0;
		this.HorizontalLayout = HorizontalLayout;
		this.Visuel = Visuel;
		this.Groupe = VisuMaster;
		this.Window = Window;
		this.Button = Button;
		this.Label = Label;
		
		var nbrElems = 0;
		this.add = function(elem, nName, z_index)
		{
			var name = nName || nbrElems;
			var z_index = z_index || 0;
			if (z_index > _maxZ)
			{
				_maxZ = z_index;
			}

			if (!this.elems[z_index])
			{
				this.elems[z_index]=[];
			}
			elem.name = name;
			elem.z_index = z_index;
			this.elems[z_index][name] = elem;
			nbrElems++;
			return elem;
		}

		this.del = function(elem)
		{
			delete this.elems[elem.z_index][elem.name];
			nbrElems--;
		}

		this.draw = function(ctx)
		{
			ctx.globalAlpha = 1;
			for(var i = 0; i<= _maxZ; i++)
			{
				var currentZ = this.elems[i];
				if (!currentZ)
				{
					continue;
				}
				for (var j in currentZ)
				{
					currentZ[j].draw(ctx);
				}
			}
		}

		this.onMouseDown = function(mouseCoords)
		{
			var used = false;
			for(var i = _maxZ; i>=0 ; i--)
			{
				if (used)
				{
					return true;
					break;
				}
				var currentZ = this.elems[i];
				if (!currentZ)
				{
					continue;
				}
				for (var j in currentZ)
				{

					if (pointAABB(mouseCoords, currentZ[j]))
					{
						if (currentZ[j].onMouseDown)
						{
							currentZ[j].onMouseDown(mouseCoords);
						}
						used = true;
					}
				}
			}
			return false;
		}

		this.onMouseUp = function(mouseCoords)
		{
			var used = false;
			for(var i = _maxZ; i>=0 ; i--)
			{
		
				var currentZ = this.elems[i];
				if (!currentZ)
				{
					continue;
				}
				for (var j in currentZ)
				{
					if (pointAABB(mouseCoords, currentZ[j]))
					{
						if (currentZ[j].onClick)
						{
							currentZ[j].onClick();	
						}
						if (currentZ[j].onMouseUp)
						{
							currentZ[j].onMouseUp(mouseCoords);
						}
						used = true;
					}
				}
				if(used)
				{
					return true;
				}
			}
			return false;
		}
		this.onMouseMove = function(mouseCoords)
		{
			var used = false;
			for(var i = _maxZ; i>=0 ; i--)
			{
				if (used)
				{
					return true;
					break;
				}
				var currentZ = this.elems[i];
				if (!currentZ)
				{
					continue;
				}

				for (var j in currentZ)
				{
					if (pointAABB(mouseCoords, currentZ[j]))
					{
						if (currentZ[j].onMouseMove)
						{
							currentZ[j].onMouseMove(mouseCoords);
						}
						used = true;
					}
				}
			}
			
		}

		this.translate = function(x,y)
		{
			for(var i in this.elems)
			{
				var currentZ = this.elems[i];
				for (var j in currentZ)
				{
					currentZ[j].translate(x,y);
				}
			}
		}

		this.move = function(x,y)
		{
			for(var i in this.elems)
			{
				var currentZ = this.elems[i];
				for (var j in currentZ)
				{
					currentZ[j].move(x,y);
				}
			}
		}

	}

	GUI.prototype.Window = function(x,y,w,h,params)
	{
		return new Window(x,y,w,h,params, GUI);
	}

	return GUI;
});