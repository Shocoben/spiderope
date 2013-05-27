define(["gui", "canvasParams"], function(GUI, canvasParams){
  
  var GameOverGUI =  function()
  {
    
    var myGUI;
    var _eventBus;
    var _imagesManager;
    
    var scoreText;
    var bestScore;

    this.setup = function(eventBus, imagesManager)
    {
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      
      myGUI = new GUI();
      this.gui = myGUI;
      var visuPlayBtn = new myGUI.Visuel(imagesManager.getImage("GOBtn"));
      
      var btnWidth = 400;

      scoreText = myGUI.add(new myGUI.Label("hello", canvasParams.width / 2,150, {"color" : "#ffffff", "family" : "GROBOLDRegular"}));
      scoreText.textAlign = "center";
      scoreText.x -= scoreText.w * 2;

      if (localStorage)
      {
        bestScore = myGUI.add(new myGUI.Label("hello", canvasParams.width / 2,200, {"color" : "#ffffff", "family" : "GROBOLDRegular"}));
        bestScore.textAlign = "center";
        bestScore.x -= bestScore.w * 2.8;
      }

      myGUI.add(new myGUI.Button( (canvasParams.width * 0.5) - (btnWidth * 0.5) ,250,btnWidth, 270, visuPlayBtn, function()
      {
       _eventBus.emit("launchgame");
      }));
    }

    this.updateScore = function(nScore)
    {
      scoreText.text = "Your score : " + nScore + " cm";
      if (localStorage && bestScore) {
        var hightscore = localStorage['spideropehighscore'] || 0;
        bestScore.text = "Your best score : " + hightscore + " cm";
      }
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