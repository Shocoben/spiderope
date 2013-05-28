define(["MathUtils"], function(MathUtils){
  
  var n = 0;
  function tooAway (xNeg, yNeg, cVectorPos, to)
  {
    var xGood = true;
    if (xNeg && cVectorPos.x < to.x)
    {
      xGood = false;
    }
    if (!xNeg && cVectorPos.x > to.x) 
    {
      xGood = false;
    }
    
    var yGood = true;
    if (yNeg && cVectorPos.y < to.y)
    {
      yGood = false;
    }
    
    if (!yNeg && cVectorPos.y > to.y)
    {
      yGood = false;
    }

    if (yGood && xGood)
      return false
    return true;
  }
  
  var done = false;
  function lineDashedFromTo(from, to, ctx, nWidth, nOffset)
  {
    var width = nWidth || 1;
    var nOffset = nOffset || 1;
    var vectorSous = new MathUtils.Vector2(to.x - from.x, to.y - from.y);
    var vectorToFollow = vectorSous.normalize();
    var directionXNeg = (vectorToFollow.x < 0)? true : false;
    var directionYNeg = (vectorToFollow.y < 0)? true : false;
    
    
    var cVectorPos = new MathUtils.Vector2(from.x, from.y);
    var nVectorPos = new MathUtils.Vector2(cVectorPos.x + (vectorToFollow.x * width), cVectorPos.y + (vectorToFollow.y * width));

    ctx.save();
    //!tooAway(directionXNeg, directionYNeg, nVectorPos, to)
      while (!tooAway(directionXNeg, directionYNeg, nVectorPos, to))
      {
        ctx.beginPath();
        ctx.moveTo(cVectorPos.x, cVectorPos.y);
        ctx.lineTo(nVectorPos.x, nVectorPos.y);
        ctx.stroke();
        cVectorPos = new MathUtils.Vector2(nVectorPos.x.valueOf() + (vectorToFollow.x * 20), nVectorPos.y.valueOf() + (vectorToFollow.y * 20));;
        nVectorPos = new MathUtils.Vector2(cVectorPos.x + (vectorToFollow.x * (width)), cVectorPos.y + (vectorToFollow.y * width));
        i++;
      }

    ctx.restore();
  }
  
  return lineDashedFromTo;
})
