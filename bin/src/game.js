define(["box2D", "fpsFrame", "MathUtils", "Player", "Elem", "Building", "Blood"], function(Box2D, stats, MathUtils, Player, Elem, Building, Blood){
  
  var Game = new function()
  {
      var world;
      var player;
      var myBodies;
      var blood;
      var bloodList = [];
      var nBlood = 0;
      var SCALE = 15;
      var buildings = [];
      var lastBuildingPos = 0;
      var isGameOver = false;
      var cameraPos = null;
      var life = 100;
      var damage = 100;
      var b2Vec2 = Box2D.Common.Math.b2Vec2
          , b2BodyDef = Box2D.Dynamics.b2BodyDef
          , b2Body = Box2D.Dynamics.b2Body
          , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
          , b2Fixture = Box2D.Dynamics.b2Fixture
          , b2World = Box2D.Dynamics.b2World
          , b2MassData = Box2D.Dynamics.b2MassData
          , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
          , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
          , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
          , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
          
      var b2Listener = Box2D.Dynamics.b2ContactListener;

      var circlesShapes = [];
      var boxShapes = [];

      //Add listeners for contact
      var listener = new b2Listener;
      var pointer = this;
      
      
      var onGround = false;
      listener.BeginContact = function(contact)
      {
        if ((contact.GetFixtureA().GetBody().GetUserData() == "floor")
            && (contact.GetFixtureB().GetBody().GetUserData() == "player")
            || (contact.GetFixtureA().GetBody().GetUserData() == "player")
            && (contact.GetFixtureB().GetBody().GetUserData() == "floor")
        )
        {
          //Creer sang
          onGround = true;
        }
      }

      listener.EndContact = function(contact)
      {
         if ((contact.GetFixtureA().GetBody().GetUserData() == "floor")
        && (contact.GetFixtureB().GetBody().GetUserData() == "player")
        || (contact.GetFixtureA().GetBody().GetUserData() == "player")
        && (contact.GetFixtureB().GetBody().GetUserData() == "floor")
        )
        {
    
          onGround = false;
        }
      }
  

    var ctx;
    var canvas;
    var _eventBus;
    var cJoint = null;
 
    this.createPoint = function(position, fixed)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 0.3;
        fixDef.friction = 10;
        fixDef.restitution = 1;
        //create fixedPoint
        
       var bodyDef = new b2BodyDef;
        
 
        bodyDef.type = (fixed)? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

        // positions the center of the object (not upper left!)
        bodyDef.position.x = position.x;
        bodyDef.position.y = position.y;

        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(
              (1 / SCALE),
              (1 / SCALE)
        );

        return world.CreateBody(bodyDef).CreateFixture(fixDef);  
    }
    
    
    var cJointsCreated = [];
    var cFixedPointsCreated = [];
    
    this.deleteRope = function()
    {
      for (var i = 0; i < cJointsCreated.length; i++)
      {
        if (cJointsCreated[i])
          world.DestroyJoint(cJointsCreated[i]);
      }
      for (var i = 0; i < cFixedPointsCreated.length; i++)
      {
        if (cFixedPointsCreated[i])
          world.DestroyBody(cFixedPointsCreated[i].GetBody());
      }
      cFixedPointsCreated = [];
      cJointsCreated = [];
    }
   
    this.createJoint = function(from, to, length)
    {
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = from;
        joint_def.bodyB = to;
             
        //connect the centers - center in local coordinate - relative to body is 0,0
        joint_def.localAnchorA = new b2Vec2( length.x * 0.9, length.y);
        joint_def.localAnchorB =   new b2Vec2(0, 0);
        
        /*
        joint_def.maxMotorTorque = 1;
        joint_def.enableMotor = true;
        
        */
        return world.CreateJoint(joint_def);
  
    }
    
    var ropeCreated = false;
    this.createRope = function(destination)
    {
      
      this.deleteRope();
      
      //player.b2Body.SetAngle(MathUtils.degreeToRad(90));
      var playerPos = player.b2Body.GetPosition();
      var vectorSous = new MathUtils.Vector2(destination.x - playerPos.x, destination.y - playerPos.y);
      var vectorToFollow = vectorSous.normalize();
      var cJointPos = new MathUtils.Vector2(playerPos.x, playerPos.y);
      var lastJoinsPos = new MathUtils.Vector2(playerPos.x , playerPos.y);
      var lastPoint = player.b2Body;
      
      for (var i =0; cJointPos.distance(destination) >= 1; i++)
      {
        cJointPos.x += vectorToFollow.x * 1.8;
        cJointPos.y += vectorToFollow.y * 1.8;
        var length = new b2Vec2(cJointPos.x - lastJoinsPos.x , cJointPos.y - lastJoinsPos.y);
        
        var cPoint = this.createPoint(cJointPos);
        cFixedPointsCreated.push(cPoint);
        
        var cJoint = this.createJoint(lastPoint, cPoint.GetBody(), length)
        cJointsCreated.push(cJoint);
        
        lastJoinsPos = new MathUtils.Vector2(cJointPos.x, cJointPos.y);
        lastPoint = cPoint.GetBody();
        
      }
      
      var length = new b2Vec2(destination.x - lastJoinsPos.x , destination.y - lastJoinsPos.y);
      var cPoint = this.createPoint(destination, true);
      cFixedPointsCreated.push(cPoint);
      
      var cJoint = this.createJoint(lastPoint, cPoint.GetBody(), length)
      cJointsCreated.push(cJoint);
    }
    
    var drawRope = function(ctx)
    {
      if (!cFixedPointsCreated || cFixedPointsCreated.length <= 0)
      {
        return;
      }
      
      
      var lastPoint = new MathUtils.Vector2(player.offsetX + player.halfRealW, player.realY + player.halfRealH);
 
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff0000';
      
      for(var i = 1; i < cFixedPointsCreated.length; i++)
      {
        
        var cPointPos = new MathUtils.Vector2(cFixedPointsCreated[i].GetBody().GetPosition().x, cFixedPointsCreated[i].GetBody().GetPosition().y) ;
        cPointPos.x = cPointPos.x * SCALE;
        cPointPos.x = cPointPos.x - (player.realX - player.offsetX);
        cPointPos.y *= SCALE;
        ctx.save();
          ctx.beginPath();
          ctx.moveTo(lastPoint.x , lastPoint.y);
          ctx.lineTo(cPointPos.x, cPointPos.y);
          ctx.stroke();
        ctx.restore();
        lastPoint =cPointPos;
      }
    }
    
    this.createBuildings = function()
    {
      if (buildings.length > 6)
      {
        buildings.splice(0, 3);
      }
      for (var i = 0; i < 3; i++)
      {
        var newBuilding = new Building(lastBuildingPos, floor, Building.prototype.randomH(), SCALE, canvas);
        buildings.push(newBuilding);
        lastBuildingPos+= Building.prototype.w + Building.prototype.offsetX;
      }
    }
    
    this.isPointInABuilding = function(point)
    {
      for (var i = 0; i < buildings.length; i++)
      {
        var b = buildings[i];
        if (b.mouseCollison(point))
        {
          return true;
        }
      }
      return false;
    }
    
    
    var points = [];
    this.setup = function(eventBus) 
    {
      ctx = this.ctx;
      canvas = this.canvas;
      _eventBus = eventBus;
    }
    
    this.launch = function()
    {
      points = [];
      cJointsCreated = [];
      cFixedPointsCreated = [];
      
      world = new b2World(new b2Vec2(1,9.5) ,true );
      
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(this.canvas.getContext("2d"));
      debugDraw.SetDrawScale(30.0);
      debugDraw.SetFillAlpha(1);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
      
      
          
      world.canvas = this.canvas;

      world.SetContactListener(listener);

      floor = new Elem(world,  SCALE, (this.canvas.width * 0.5) / SCALE, this.canvas.height / SCALE - 2, (this.canvas.width * 0.5) / SCALE, 1, "floor")
      
      //create PLAYER
      player = new Player(world,SCALE, 0.5, 0.5);
      
      cameraPos = player;
          // blood = new Blood(world, player, SCALE, 0.3, 0.3);
    
      //CREATE BUILDINGS
      this.createBuildings();
      
      
      _eventBus.on("mouseup", function(mousepos)
      {
        player.updateRealPos();
        var nMousePos = {"x" : mousepos.x / SCALE, "y" : mousepos.y/SCALE}
        var diffX =  nMousePos.x - (player.offsetX / SCALE);  
        var destination = new MathUtils.Vector2(player.b2Body.GetPosition().x + diffX, nMousePos.y);
        //points.push(new Elem(world,  SCALE, destination.x, destination.y, 1, 1));
        if (!ropeCreated)
        {
          
          if (!pointer.isPointInABuilding(destination))
          {
            return;
          }
          pointer.createRope(destination);
          //player.b2Body.ApplyImpulse(new b2Vec2( 0.5, 0), player.b2Body.GetWorldCenter())
        }
        else
        {
          pointer.deleteRope();
          player.b2Body.ApplyImpulse(new b2Vec2( 1, 0), player.b2Body.GetWorldCenter())
        }
        ropeCreated = !ropeCreated;
      });
      _eventBus.emit("changeUpdateCtx", "game");
      
      
      
      /*
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(ctx);
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);
      */
    }



    function render()
    {
      ctx.clearRect(0, 0, canvas.width , canvas.height )
      ctx.globalAlpha = 0.5;
      
      
          world.DrawDebugData();
          
      for (var i = 0; i < buildings.length; i++)
      {
        var b = buildings[i];
        b.draw(ctx, cameraPos);
      }
      floor.draw(ctx, cameraPos);
      player.draw(ctx, cameraPos);
      if(typeof(blood) !== "undefined"){
        blood.draw(ctx);
      }
      
      drawRope(ctx);
      
      ctx.fillStyle = "#000000";
      ctx.fillText  (Math.floor(player.realX), 40, 100);
    }
    
    var lastTime = new Date().getTime();
    var lastLostOfLife = new Date().getTime();
    var delayLoseLife = 500;
    
    this.whenOnGround = function(time)
    {
        
        life -= damage;
        /*
        // blood = new Blood(world, player, SCALE, 0.3, 0.3);
         console.log(nBlood);
         console.log("y" + player.b2Body.GetPosition().y);
        */
        bloodList.push( new Blood(world, player, SCALE, 3, 3, -player.halfRealW, player.b2Body.GetPosition().y) );
        nBlood++;
    }
    
    this.update = function(time) 
    {
      
      
      //world.DrawDebugData();
      world.ClearForces();
      if (!isGameOver)
      {
        player.updateRealPos();
        floor.b2Body.SetPosition({"x" : player.b2Body.GetPosition().x + ((player.offsetX * 0.5 - player.realW) / SCALE), "y" : floor.b2Body.GetPosition().y});
        if (lastBuildingPos - player.realX < (Building.prototype.w + Building.prototype.offsetX) * 2)
        {
          this.createBuildings();
        }
      
      
      }
      
  
    
  
      if ( onGround ){
        this.whenOnGround(time);
      }
      
      if (life <= 0)
      {
        if (isGameOver == false)
        {
           cameraPos = {"realX" : player.realX.valueOf(), "realY" : player.realY.valueOf(), "offsetX" : player.offsetX.valueOf()}
        }
        isGameOver = true;
     
       
      } 
      
      if (isGameOver)
      {
        console.log("hello");
      }
      
      for( i = 0 ; i < nBlood ; ++i){
        bloodList[i].update();
        
        if(bloodList[i].isDead == true){
          bloodList.splice(i,1);
          nBlood-- ;
        }
      }
   
      
      render();
      world.Step(1/60,10,10);
      stats.update();
    } 
  

  }
  
  return Game;
});    
    
    