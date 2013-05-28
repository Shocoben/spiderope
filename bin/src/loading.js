define(["gui"], function(GUI){
  
  var loading = new function()
  {
    
    var gui = this.gui;
    var _eventBus;
    var _imagesManager;
    var canvas, ctx;
    this.setup = function(eventBus, imagesManager)
    {
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      canvas = this.canvas;
      ctx = this.ctx;
    }

    this.launch = function()
    {
      _eventBus.emit("changeUpdateCtx", "loading");
    }
    
    this.update = function(time) 
    {
      var m = Math;
      var diff = time * 0.001;
      var opacity = m.sin(diff) + m.cos(m.sin(diff)) ;
      opacity = 0.5  + (0.5 * opacity);
      
      this.draw(opacity);
      
      if(_imagesManager.isLoaded())
      {
        _eventBus.emit("launchmenu");
      }
      
    }
    
    this.draw = function(opacity)
    {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#04111c";
      ctx.fillRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.globalAlpha = opacity;
      ctx.textAlign = "center";
      ctx.font = "16pt GROBOLDRegular";
      ctx.fillText("Loading "+ Math.floor(_imagesManager.getLoadPercentage())+"%" , canvas.width / 2, canvas.height / 2);
    }
  }
  
  return loading;
});