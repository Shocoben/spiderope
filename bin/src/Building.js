define(["collisionPointAABB"], function(collisionPointAABB){
  var Building = function(x, floor, size, SCALE, canvas, imagesManager)
  {
    this.w = this.w;
    console.log(size);
    this.h = this.sizes[size].h;
    this.x = x;
    this.image = imagesManager.getImage(this.sizes[size].image);
    this.y = floor.realY - this.h;
    
    this.box2dw = this.w / SCALE;
    this.box2dh = this.h / SCALE;
    
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
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 5;
      ctx.strokeRect(this.renderX, this.renderY, this.w, this.h);
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
    ,{"h" : 500, "image" : "cartonmiddle"}
  ]

  Building.prototype.randomH = function()
  {
    return Math.floor(Math.random() * this.sizes.length);
  }
  

  Building.prototype.w = 200;
  Building.prototype.offsetX = 200;
  
  return Building;
});