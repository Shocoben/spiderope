define(["collisionPointAABB"], function(collisionPointAABB){
  var Building = function(x,floor, h, SCALE, canvas)
  {
    this.w = this.w;
    this.h = h;
    this.x = x;
    
    this.y = floor.realY - this.h;
    
    this.box2dw = this.w / SCALE;
    this.box2dh = this.h / SCALE;
    
    this.draw = function(ctx, camera)
    {
      ctx.fillStyle = "#0000FF";
      ctx.fillRect(this.x - (camera.realX - camera.offsetX), this.y , this.w , this.h);
    }
    
    this.mouseCollison = function(mouse)
    {
      var nMouse = {"x" : mouse.x * SCALE, "y" : mouse.y * SCALE};
      return collisionPointAABB(nMouse, this);
    }
  }
  
  Building.prototype.randomH = function()
  {
    var random = Math.floor(Math.random() * 3);
    if (random == 0)
    {
      return 200;
    }
    else if (random == 1)
    {
      return 350;
    }
    else (random == 2)
    {
      return 800;
    }
  }
  

  Building.prototype.w = 200;
  Building.prototype.offsetX = 200;
  
  return Building;
});