define(function(){
  function collisionPointAABB(point, box)
  {
     if (point.x >= box.x
      && point.x < box.x + box.w
      && point.y >= box.y
      && point.y < box.y + box.h)
         return true;
     else
         return false;
  }

  return collisionPointAABB;
})