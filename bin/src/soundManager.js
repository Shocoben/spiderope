define(["buzz"],function(buzz){
  
  var sounds = {
    "permanent" : ["mp3"]
    ,"bigcity" : ["mp3"]
  };
  var soundManager = new function()
  {
    this.library = {};
    this.allSongs = [];
    
    for (var i in sounds)
    {
      var sound = new buzz.sound( "sounds/"+ i, {
        formats: sounds[i]
      });
      this.library[i] = sound;
      this.allSongs.push(sound);
    }
    this.group = new buzz.group(this.allSongs);
  } 
  
  return soundManager;
});