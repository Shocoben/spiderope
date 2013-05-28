define(["collisionPointAABB", "dashedLine"], function(collisionPointAABB, dashedLine){
  var Building = function(x, floor, size, SCALE, canvas, imagesManager)
  {
    this.w = this.w;
    this.h = this.sizes[size].h;
    this.x = x;
    this.image = imagesManager.getImage(this.sizes[size].image);
    this.y = floor.realY - this.h;
    
    this.box2dw = this.w / SCALE;
    this.box2dh = this.h / SCALE;
    
    var tutoRopeImage = imagesManager.getImage("clickTuto");
    this.getRenderPos = function(camera)
    {
      this.renderX = this.x - (camera.realX - camera.offsetX);
      if (camera.realY - camera.offsetY < 0)
      {
         this.renderY = (this.y) - (camera.realY - camera.offsetY);  
      }
      else
      {
       this.renderY = this.y;  
      } 
    }
    
    var normalDraw = function(ctx, camera)
    {
      this.getRenderPos(camera);
      ctx.fillStyle = "#0000FF";
      ctx.drawImage(this.image, this.renderX, this.renderY, this.w, this.h);
    }
    

    
    
    var tutoDraw = function(ctx, camera)
    {
      normalDraw.call(this, ctx, camera);
      
      
      ctx.strokeStyle = "#ffffff";
      var time = new Date().getTime();
      var diff = time * 0.005;
      var m = Math;
      var opacity = m.sin(diff) + m.cos(m.sin(diff)) ;
      ctx.lineWidth = 3 + (5 * opacity);
      
      var maxX = this.renderX + this.w;
      var maxY = this.renderY + this.h;
      
      var imageW = tutoRopeImage.width * 0.35;
      var imageH = tutoRopeImage.height * 0.35;
      ctx.drawImage(tutoRopeImage, (maxX) - (imageW) - 20, this.renderY + 50, imageW, imageH);
      var pTL = {"x" : this.renderX, "y" : this.renderY};
      var pTR = {"x" : maxX, "y" : this.renderY};
      var pLR = {"x" : maxX, "y" : maxY};
      var pLL = {"x" : this.renderX, "y" : maxY};
      var dashWidth = 30;
      var dashOffset = 20;
      
      dashedLine(pTL, pTR, ctx, dashWidth, dashOffset);
      dashedLine(pTR, pLR, ctx, dashWidth, dashOffset);
      dashedLine(pLR, pLL, ctx, dashWidth, dashOffset);
      dashedLine(pLL, pTL, ctx, dashWidth, dashOffset);
    }

    this.draw = normalDraw;
    

    this.tutoMode = function()
    {
      this.draw = tutoDraw;
    }

    this.normalMode = function()
    {
      this.draw = normalDraw;
    }
    this.mouseCollison = function(mouse)
    {
      var nMouse = {"x" : mouse.x * SCALE, "y" : mouse.y * SCALE};
      return collisionPointAABB(nMouse, this);
    }
  }
  
  
  Building.prototype.sizes = [ 
    {"h" : 200, "image" : "cartontall" }
    ,{"h" : 350, "image" : "cartonmiddle"}
    ,{"h" : 500, "image" : "cartonlittle"}
  ]

  Building.prototype.randomH = function()
  {
    return Math.floor(Math.random() * this.sizes.length);
  }
  

  Building.prototype.w = 200;
  Building.prototype.offsetX = 200;
  
  return Building;
});