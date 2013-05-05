define(["game", "Menu"], function(game, menu){
  var hub = new function()
  {
    
    
    var toSetup = {};
    
    this.add = function(name, elm)
    {
      toSetup[name] = elm;
    }
    
    var formatLaunchName = function(name){
      return "launch"+ name;
    }
    
    var setupLaunch = function(eventBus, name, elem)
    {
        eventBus.on(formatLaunchName(name), function(){
          eventBus.del("mouseup");
          elem.launch();
        });
    }
    this.setup = function(eventBus, imagesManager, gameLoop, canvas)
    {
      for (var i in toSetup)
      {
        var cElem = toSetup[i];
        canvas.associate(cElem);
        cElem.setup(eventBus, imagesManager);
        gameLoop.addUpdate(i, cElem);
        console.log(formatLaunchName(i));
        setupLaunch(eventBus, i, cElem);
      }
    };
    
    this.launch = function(name)
    {
      toSetup[name].launch();
    }
  }
  
  return hub;
});