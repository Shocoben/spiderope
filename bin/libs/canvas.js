define(function()
{

	var Canvas = function(parent, params)
	{
		var _params = params || {};
		var _width = _params.width || 1280;
		var _height = _params.height || 750;
		this.div = document.createElement('canvas');
		var _parent = parent || null;
		this.div.setAttribute("width", _width);
	    this.div.setAttribute("height", _height);
	    this.div.setAttribute("style", "margin:auto; display:block;");
	    if (_params.id)
	    {
	    	this.div.setAttribute("id", _params.id)
	    }
	    if (_params.classe)
	    {
	    	this.div.setAttribute("classe", _params.classe)
	    }
	    if (_parent)
	    {
	    	_parent.appendChild(this.div);
	    }

	    return this;
	};



	Canvas.prototype.getDOM = function()
	{
		return this.div;
	}
	
	Canvas.prototype.associate = function(o)
	{
	    o.ctx = this.div.getContext("2d");
	    o.canvas = this.div;
	}
	
	return Canvas;
});