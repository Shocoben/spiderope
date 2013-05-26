define(["collisionPointAABB"], function(collisionPointAABB){
  var Building = function(x,floor, h, SCALE, canvas)
  {
    this.w = this.w;
    this.h = h;
    this.x = x;
    
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
      ctx.fillRect(this.renderX, this.renderY , this.w , this.h);
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
  
  Building.prototype.tall = 200;
  Building.prototype.middle = 350;
  Building.prototype.big = 500


  Building.prototype.randomH = function()
  {
    var random = Math.floor(Math.random() * 3);
    if (random == 0)
    {
      return this.tall;
    }
    else if (random == 1)
    {
      return this.middle;
    }
    else (random == 2)
    {
      return this.big;
    }
  }
  

  Building.prototype.w = 200;
  Building.prototype.offsetX = 200;
  
  return Building;
});