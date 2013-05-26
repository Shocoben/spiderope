define(["box2D", "Elem"], function(Box2D, Elem){

  var Blood = function(world, player, SCALE)
  {
    this.isDead = false;
  
   var b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
		, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 0.1;
    fixDef.friction = 0;
    fixDef.restitution = 0;
    
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
                 
    // positions the center of the object (not upper left!)
     bodyDef.position.x = player.b2Body.GetPosition().x - (10 / SCALE);
     bodyDef.position.y = player.b2Body.GetPosition().y - (10 / SCALE);

      
			// fixDef.shape = new b2PolygonShape;
			fixDef.shape = new b2CircleShape(
				(Math.random() * (4 - 2) + 2) / SCALE 
			);
      
    this.b2Elem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2Elem.GetBody();
    this.b2Body.SetUserData("blood");
    
    this.created = new Date().getTime();
    this.lifeTime = 3000 + (Math.random() * (2000 - 500) + 500) ;
    
    this.b2radius = fixDef.shape.m_radius;
    this.realRadius = this.b2radius * SCALE;
    
    this.hitBox = 0.3 + Math.random();
    
    var offsetX = this.offsetX = 300;
    
    this.updateRelativePos = function(camera)
    {
        this.updateRealPos();
        this.renderY = this.realY;  
        this.renderX = (this.realX) - (camera.realX - camera.offsetX);
    }
    
    this.updateRealPos = function()
    {
        this.realX = (this.b2Body.GetPosition().x * SCALE);
        this.realY = (this.b2Body.GetPosition().y * SCALE);
    }
    
    this.update = function(time){
      if(this.created + this.lifeTime < time){
        this.isDead = true;
      }
     
    }
    
    this.draw = function(ctx, camera)
    {

        ctx.fillStyle = "#FF0000";
        this.updateRelativePos(camera);
        ctx.beginPath();
        ctx.arc(this.renderX, this.renderY, this.realRadius, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    
    this.updateRealPos();
  }
  
  return Blood;
})