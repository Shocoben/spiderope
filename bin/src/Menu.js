define(["gui"], function(GUI){
  
  var Menu = new function()
  {
    
    var menuGUI = this.gui;
    var _eventBus;
    var _imagesManager;
    
    this.setup = function(eventBus, imagesManager)
    {
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      
      menuGUI = new GUI();
      var visuPlayBtn = new menuGUI.Visuel(imagesManager.getImage("startBtn"));
      
      menuGUI.add(new menuGUI.Button(0,0,100, 100, visuPlayBtn, function()
      {
       _eventBus.emit("launchgame");
      }));
    }

    this.launch = function()
    {
      _eventBus.emit("changeUpdateCtx", "menu");
      _eventBus.on("mouseup", function(mousecoords){
        menuGUI.onMouseUp(mousecoords);
      })
    }
    
    this.update = function() {
      menuGUI.draw(this.ctx);  
    }
  }
  
  return Menu;
});