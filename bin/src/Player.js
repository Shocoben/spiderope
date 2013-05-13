define(["box2D"],function(box2D)
{
  var Player = function(world, SCALE, w, h)
  {
   var b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 0.1;
    fixDef.friction = 3;
    fixDef.restitution = 0.1;
    
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
                 
    // positions the center of the object (not upper left!)
    bodyDef.position.x = 5 / SCALE;
    bodyDef.position.y = 0;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w,h);
      
    this.b2Elem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2Elem.GetBody();
    this.b2Body.SetUserData("player");
    
    this.b2w = w;
    this.b2h = h;
    this.halfRealW = w * SCALE;
    this.halfRealH = h * SCALE;
    this.realW = this.halfRealW * 2;
    this.realH = this.halfRealH * 2;
    
    var offsetX = this.offsetX = 300;
    
    this.updateRealPos = function()
    {
      this.realX = (this.b2Body.GetPosition().x - w ) * SCALE;
      this.realY = (this.b2Body.GetPosition().y - h) * SCALE;
      
    }
    
    this.draw = function(ctx)
    {
        var renderY = this.realY;
        var renderX = offsetX;
        ctx.save(); 
            ctx.fillStyle = "#FF0000";
            ctx.translate(renderX, renderY);
            ctx.translate(this.halfRealW, this.halfRealH);
            ctx.rotate(this.b2Body.GetAngle());  
            ctx.fillRect(-this.halfRealW, -this.halfRealH , this.realW , this.realH);
        ctx.restore();
        
    }
    
    this.updateRealPos();
    
  }
  
  return Player;
})