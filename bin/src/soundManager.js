define(["buzz"],function(buzz){
  
  var sounds = {
    "permanent" : ["mp3"]
    ,"bigcity" : ["mp3"]
  };
  var soundManager = new function()
  {
    this.library = {};
    console.log(window.location);
    for (var i in sounds)
    {
      this.library[i] = new buzz.sound( "sounds/"+ i, {
        formats: sounds[i]
      });
    }
  } 
  
  return soundManager;
});