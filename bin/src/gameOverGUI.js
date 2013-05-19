define(["gui"], function(GUI){
  
  var GameOverGUI =  function()
  {
    
    var myGUI;
    var _eventBus;
    var _imagesManager;
    
    this.setup = function(eventBus, imagesManager)
    {
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      
      myGUI = new GUI();
      this.gui = myGUI;
      var visuPlayBtn = new myGUI.Visuel(imagesManager.getImage("startBtn"));
      
      myGUI.add(new myGUI.Button(0,0,100, 100, visuPlayBtn, function()
      {
       _eventBus.emit("launchgame");
      }));
    }
    
    this.update = function() {
      myGUI.draw(this.ctx);  
    }
    
    this.draw = function(ctx)
    {
      myGUI.draw(ctx);
    }
  }
  
  return GameOverGUI;
});