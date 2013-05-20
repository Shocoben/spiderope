define(["box2D", "Player"], function(Box2D, Player){

  var Blood = function(world, player, SCALE, w, h, x, y)
  {
    this.isDead = false;
  
   var b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
		, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 0.1;
    fixDef.friction = 3;
    fixDef.restitution = 0.1;
    
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
                 
    // positions the center of the object (not upper left!)
    // bodyDef.position.x = x;
    // bodyDef.position.y = y;

      
			// fixDef.shape = new b2PolygonShape;
			fixDef.shape = new b2CircleShape(
				Math.random() + 0.1
			);
      
    this.b2Elem = world.CreateBody(bodyDef).CreateFixture(fixDef);  
    this.b2Body = this.b2Elem.GetBody();
    this.b2Body.SetUserData("blood");
    
    this.time;
    this.lifeTime = 2000;
    
    this.b2w = w;
    this.b2h = h;
    this.halfRealW = w * SCALE;
    this.halfRealH = h * SCALE;
    this.realW = this.halfRealW * 2;
    this.realH = this.halfRealH * 2;
    
    this.realX;
    this.realY;
    
    this.hitBox = 0.3 + Math.random();
    
    var offsetX = this.offsetX = 300;
    
    this.init = function(ctx, camera)
    {
      
      this.renderY = this.realY;  
      this.renderX = (this.realX) - (camera.realX - camera.offsetX);    
      // this.x = x;
      // this.y = y;
      console.log("y :" + this.realY + " x :" + this.realX);
      // bodyDef.position.x = x;
      // bodyDef.position.y = y;
      
      this.time = Date.now();
    }
    
    this.updateRealPos = function()
    {
        this.realX = (this.b2Body.GetPosition().x * SCALE) - this.halfRealW;
        this.realY = (this.b2Body.GetPosition().y * SCALE) - this.halfRealH;
    }
    
    this.update = function(){
      if(Date.now() >=  this.time + this.lifeTime){
        this.isDead = true;
         // console.log("dead");
      }
     
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
        ctx.fillStyle = "rgba(0,0,255,0.9)";
        ctx.arc(this.realX ,this.realY , this.hitBox, 0, Math.PI * 2, true);
        console.log(this.x);
            
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    
    this.updateRealPos();
    this.init();
  }
  
  return Blood;
})