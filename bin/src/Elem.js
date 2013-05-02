define(["box2D"],function(box2D)
{
  var Elem = function(world, SCALE,x, y, w, h)
  {
       var b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.0;

    var bodyDef = new b2BodyDef;
    
    //create GROUND
    bodyDef.type = b2Body.b2_staticBody;
           
    // positions the center of the object (not upper left!)
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w, h);


    this.b2dElem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2dElem.GetBody();
    
    this.w = w * SCALE;
    this.h = h * SCALE;
    
    this.draw = function(ctx, camera)
    {
        var body = this.b2Body;
        ctx.fillStyle = "#FF0000";
        var x = body.GetPosition().x * SCALE;
        var y = body.GetPosition().y * SCALE;
        ctx.fillRect((x - this.w) - (camera.x - camera.offsetX), (body.GetPosition().y * SCALE) - this.h , this.w * 2 , this.h * 2);
    }
    
  }
  
  return Elem;
})