define(["soundManager", "buzz", "gui", "canvasParams"], function(soundManager, buzz, GUI, canvasParams){
  
  var isPlaying = true;
  
  if (localStorage)
  {
    if (localStorage["spideropeaudio"] && localStorage["spideropeaudio"] == "off")
    {
      isPlaying = false;
    }
  }
  var soundBtn;
  
  var btnWidth;
  var btnHeight;
  var audioBtn = function(){};
  
  audioBtn.prototype.getPos = function(menu)
  {
    var btnX = (menu)?  canvasParams.width - btnWidth - 10 : 10;
    var btnY = (menu)?  10 : canvasParams.height - btnHeight - 10;
    return {"x" : btnX, "y" : btnY };
  }
  
  audioBtn.prototype.create = function(imagesManager, menu)
  {
    var visuAudioBtn= new GUI.prototype.Visuel(imagesManager.getImage("sonON"));
    soundManager.library["bigcity"].play().loop();
    if (!isPlaying)
    {
      visuAudioBtn.image = imagesManager.getImage("sonOFF");
      soundManager.group.mute();
    }
    
 
      
      btnWidth = 388 * 0.1;
      btnHeight = 490 * 0.1;
      if (!soundBtn)
      {
        soundBtn = new GUI.prototype.Button( 0, 0, btnWidth, btnHeight, visuAudioBtn, function()
        { 
          if (isPlaying)
          {
            this.visuel.image = imagesManager.getImage("sonOFF");
            localStorage["spideropeaudio"] = "off";
            soundManager.group.mute();
          }
          else
          {
           this.visuel.image = imagesManager.getImage("sonON");
            localStorage["spideropeaudio"] = "on";
           soundManager.group.unmute();
          }
          isPlaying = !isPlaying;
        })
      }
  }
  
  audioBtn.prototype.addTo = function(guiToAdd)
  {
    guiToAdd.add(soundBtn);
  }
  
  audioBtn.prototype.moveFor = function(menu)
  {
    var position = this.getPos(menu);
    soundBtn.move(position.x, position.y);
  }
  
  return audioBtn;
});