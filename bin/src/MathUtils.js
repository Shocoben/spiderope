define(function(){
  var MathUtils = new function()
  {
    this.Vector2 = function(x, y)
    {
      this.x = x;
      this.y = y;
    };
    
    var distance = function(pointA , pointB)
    {
      return (pointA.x- pointB.x)*(pointA.x-pointB.x) + (pointA.y-pointB.y)*(pointA.y-pointB.y);
    }
    
    this.distance = distance;
    
    this.Vector2.prototype.getLength = function()
    {
      return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    
    var pointer = this;
    this.Vector2.prototype.normalize = function()
    {
        var length = this.getLength();
        return new pointer.Vector2(this.x / length, this.y / length);
    }
    
    this.Vector2.prototype.distance = function(otherV2)
    {
      return distance(this, otherV2);
    }
    
    this.degreeToRad = function(deg)
    {
      return Math.PI * deg / 180
    }
    
    this.radToDegree = function(rad)
    {
      return 180 * rad / Math.PI;
    }
    
  }
  
  return MathUtils;
})