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
    bodyDef.position.x = x / SCALE;
    bodyDef.position.y = y / SCALE;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
          (w/SCALE),
          (h/SCALE)
    );


    this.b2dElem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2dElem.GetBody();
    
    this.w = w;
    this.h = h;
    this.halfW = this.w * SCALE ;
    this.halfH = this.h * SCALE ;
    
    this.draw = function(ctx, camera)
    {
        var body = this.b2Body;
        ctx.fillStyle = "#000";
        ctx.fillRect((body.GetPosition().x * SCALE) - this.halfW, (body.GetPosition().y * SCALE) - this.halfH, this.w * SCALE * 2, this.h * SCALE * 2);
    }
    
  }
  
  return Elem;
})