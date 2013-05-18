define(["box2D"],function(box2D)
{
  var Elem = function(world, SCALE,x, y, w, h, tag)
  {
    var b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.;
    fixDef.friction = 10;
    fixDef.restitution = 0.0;
    
    tag = tag || "";
    var bodyDef = new b2BodyDef;
    
    //create GROUND
    bodyDef.type = b2Body.b2_staticBody;
           
    // positions the center of the object (not upper left!)
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w, h);


    this.b2Elem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2Elem.GetBody();
    this.b2Body.SetUserData(tag);
    
    this.b2w = w;
    this.b2h = h;
    this.halfRealW = w * SCALE;
    this.halfRealH = h * SCALE;
    this.realW = this.halfRealW * 2;
    this.realH = this.halfRealH * 2;
    
    this.updateRelativePos = function(camera)
    {
        this.updateRealPos();
        this.renderY = this.realY;  
        this.renderX = (this.realX) - (camera.realX - camera.offsetX);
    }
    
    this.updateRealPos = function()
    {
        this.realX = (this.b2Body.GetPosition().x * SCALE) - this.halfRealW;
        this.realY = (this.b2Body.GetPosition().y * SCALE) - this.halfRealH;
    }
    
    this.draw = function(ctx, camera)
    {
        ctx.fillStyle = "#FF0000";
        this.updateRelativePos(camera);
        ctx.fillRect(this.renderX, this.renderY , this.realW , this.realH);
    }
    
    this.updateRealPos();
    
  }
  
  return Elem;
})