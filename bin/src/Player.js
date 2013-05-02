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
    fixDef.friction = 1;
    fixDef.restitution = 0.1;
    
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
                 
    // positions the center of the object (not upper left!)
    bodyDef.position.x = world.canvas.width / 2 / SCALE;
    bodyDef.position.y = 0;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
          w,
          h
    );
      
    this.box2dElem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.box2dElem.GetBody().SetUserData("player");
    this.body2d = this.box2dElem.GetBody();
    
    this.w = w * SCALE;
    this.h = h * SCALE;
    var offsetX = this.offsetX = 100;
    this.updateCamera = function()
    {
      this.x = (this.body2d.GetPosition().x - w ) * SCALE; //multiplicated by 4 for the position AND the offsetX
    }
    
    this.draw = function(ctx)
    {
        var body = this.box2dElem.GetBody();
        ctx.fillStyle = "#000";
         ctx.fillStyle = "#FF0000";
        ctx.fillRect(offsetX, (body.GetPosition().y * SCALE) - this.h , this.w * 2 , this.h * 2);
    }
    
  }
  
  return Player;
})