define(["gui", "audioButton", "canvasParams"], function(GUI, audioButton, canvasParams){
  
  var Menu = new function()
  {
    
    var menuGUI = this.gui;
    var myGUI;
    var _eventBus;
    var _imagesManager;
    
    this.setup = function(eventBus, imagesManager)
    {
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      
      menuGUI = new GUI();
      var visuPlayBtn = new menuGUI.Visuel(imagesManager.getImage("startBtn"));
      var visuResetBtn = new menuGUI.Visuel(imagesManager.getImage("refresh"));
      menuGUI.add(new menuGUI.Button(320,230,400*0.8, 280*0.8, visuPlayBtn, function()
      {
       _eventBus.emit("launchgame");
      }));
      var btnWidth = 388 * 0.1;
      var btnHeight = 490 * 0.1;
      menuGUI.add(new menuGUI.Button(canvasParams.width - btnWidth - 15,70,btnWidth + 10, btnHeight, visuResetBtn, function()
      {
       if (localStorage)
       {
        console.log("reseted");
        localStorage["spideropehighscore"] = 0;
       }
      }));
      
      // menuGUI.Button.onMouseMove(mouseCoords);
      
       myGUI = new GUI();
        this.gui = myGUI;
      
      menuGUI.add(new myGUI.Visuel(_imagesManager.getImage("credit"), {"x" : 10, "y" : 170, "w" : (400 ), "h":(400)}));
      menuGUI.add(new myGUI.Visuel(_imagesManager.getImage("title"), {"x" : 50, "y" : 0, "w" : (800 * 0.8), "h":(503 * 0.8)}));
      menuGUI.add(new myGUI.Visuel(_imagesManager.getImage("isart"), {"x" : 600, "y" : 500, "w" : (200 ), "h":(72)}));
      audioButton.prototype.create(_imagesManager, true);
      audioButton.prototype.addTo(menuGUI);
    }

    this.launch = function()
    {
      _eventBus.emit("changeUpdateCtx", "menu");
      _eventBus.on("mouseup", function(mousecoords){
        menuGUI.onMouseUp(mousecoords);
      })
      audioButton.prototype.moveFor(true);
    }
    
    this.update = function() {
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      menuGUI.draw(this.ctx);  
    }
  }
  
  return Menu;
});