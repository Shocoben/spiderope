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
    
    this.w = w;
    this.h = h;
    this.halfW = this.w * SCALE ;
    this.halfH = this.h * SCALE ;
    
    this.updateCamera = function()
    {
      this.x = this.body2d.GetPosition().x;
    }
    
    this.draw = function(ctx)
    {
        var body = this.box2dElem.GetBody();
        ctx.fillStyle = "#000";
      
        ctx.fillRect((body.GetPosition().x * SCALE) - this.halfW, (body.GetPosition().y * SCALE) - this.halfH, this.w * SCALE * 2, this.h * SCALE * 2);
        ctx.fillRect(world.canvas.width / 2,world.canvas.height/2, 18,18);
        
    }
    
  }
  
  return Player;
})