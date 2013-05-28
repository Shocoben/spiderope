define(["soundManager", "buzz", "gui", "canvasParams"], function(soundManager, buzz, GUI, canvasParams){
  
  var isPlaying = true;
  var soundBtn;
  var audioBtn =  function(guiToAdd, imagesManager, menu)
  {
      
      var visuAudioBtn= new GUI.prototype.Visuel(imagesManager.getImage("sonON"));
      var btnWidth = 388 * 0.1;
      var btnHeight = 490 * 0.1;
      var btnX = (menu)?  canvasParams.width - btnWidth - 10 : 10;
      var btnY = (menu)?  10 : canvasParams.height - btnHeight - 10;
     
      var button = new GUI.prototype.Button( btnX, btnY, btnWidth, btnHeight, visuAudioBtn, function()
      {
        if (isPlaying)
        {
          this.visuel.image = imagesManager.getImage("sonOFF");
          soundManager.group.mute();
        }
        else
        {
         this.visuel.image = imagesManager.getImage("sonON");
         soundManager.group.unmute();
        }
        isPlaying = !isPlaying;
      })
      
      console.log(btnY);
       
      if(soundBtn == null)
      {
        soundBtn = button;
      }
      
      soundBtn.move( btnX, btnY);
      
      guiToAdd.add(soundBtn);
      
      
  }

  
  return audioBtn;
});