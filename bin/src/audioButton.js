define(["soundManager", "buzz", "gui", "canvasParams"], function(soundManager, buzz, GUI, canvasParams){
  
  var isPlaying = true;
  var audioBtn =  function(guiToAdd, imagesManager, menu)
  {
   
      var visuAudioBtn = new GUI.prototype.Visuel(imagesManager.getImage("sonON"));
      var btnWidth = 388 * 0.1;
      var btnHeight = 490 * 0.1;
      var btnX = (menu)?  canvasParams.width - btnWidth - 10 : 10;
      var btnY = (menu)?  10 : canvasParams.height - btnHeight - 10;
      var button = new GUI.prototype.Button( btnX, btnY, btnWidth, btnHeight, visuAudioBtn, function()
      {
        if (isPlaying)
        {
          soundManager.group.mute();
        }
        else
        {
         soundManager.group.unmute();
        }
        isPlaying = !isPlaying;
      })
      
      guiToAdd.add(button);
  }

  
  return audioBtn;
});