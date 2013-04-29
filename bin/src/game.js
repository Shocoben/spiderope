define(["box2D", "fpsFrame", "MathUtils", "Player", "Elem"], function(Box2D, stats, MathUtils, Player, Elem){
  
  var Game = new function()
  {
      var world;
      var player;
      var myBodies;
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
      var SCALE = 15;
      listener.BeginContact = function(contact)
      {
        if ((contact.GetFixtureA().GetBody().GetUserData() == "floor")
            && (contact.GetFixtureB().GetBody().GetUserData() == "player")
            || (contact.GetFixtureA().GetBody().GetUserData() == "player")
            && (contact.GetFixtureB().GetBody().GetUserData() == "floor")
        )
        {
     
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
          
        }
      }
  

    var ctx;
    var canvas;
    var _eventBus;
    var cJoint = null;
 
    
    this.createPoint = function(position, fixed)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 3;
        fixDef.friction = 1;
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
      for (var i = 0; i < cFixedPointsCreated.length; i++)
      {
        if (cFixedPointsCreated[i])
          world.DestroyBody(cFixedPointsCreated[i].GetBody());
      }
    }
   
    this.createJoint = function(from, to, length)
    {
        var joint_def = new b2RevoluteJointDef();
        joint_def.bodyA = from;
        joint_def.bodyB = to;
             
        //connect the centers - center in local coordinate - relative to body is 0,0
        joint_def.localAnchorA = length;
        joint_def.localAnchorB = new b2Vec2(0,0);
        joint_def.maxMotorTorque = 0.5;
        joint_def.enableMotor = true;
        return world.CreateJoint(joint_def);
  
    }
    
    var ropeCreated = false;
    this.createRope = function(destination)
    {
      
      this.deleteRope();
      
      //player.body2d.SetAngle(MathUtils.degreeToRad(90));
      var playerPos = player.body2d.GetPosition();
      var vectorSous = new MathUtils.Vector2(destination.x - playerPos.x, destination.y - playerPos.y);
      var vectorToFollow = vectorSous.normalize();
      var cJointPos = new MathUtils.Vector2(playerPos.x, playerPos.y);
      var lastJoinsPos = new MathUtils.Vector2(playerPos.x , playerPos.y);
      var lastPoint = player.body2d;
      
      for (var i =0; cJointPos.distance(destination) >= 1; i++)
      {
        var diff = (i < 0)? 10 * 2 : 1;
        cJointPos.x += vectorToFollow.x;
        cJointPos.y += vectorToFollow.y;
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
    
    
    this.createWorld = function(eventBus) 
    {
          ctx = this.ctx;
          canvas = this.canvas;
          _eventBus = eventBus;
          
          world = new b2World(
              new b2Vec2(0,10) //gravity
          ,true //allow sleep
          );
          
          world.canvas = this.canvas;

          world.SetContactListener(listener);
     

          floor = new Elem(world,  SCALE, 10, canvas.height, 500, 1)

          //create PLAYER
          player = new Player(world,SCALE, 0.5, 0.5);
          
          var debugDraw = new b2DebugDraw();
          debugDraw.SetSprite(ctx);
          debugDraw.SetDrawScale(SCALE);
          debugDraw.SetFillAlpha(0.3);
          debugDraw.SetLineThickness(1.0);
          debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
          world.SetDebugDraw(debugDraw);
          eventBus.on("mouseup", function(mousepos){
            var nMousePos = {"x" : mousepos.x/SCALE, "y" : mousepos.y/SCALE}
           
            if (!ropeCreated)
            {
              pointer.createRope(nMousePos);
            }
            else
            {
              pointer.deleteRope();
            }
            ropeCreated = !ropeCreated;
          });
          eventBus.emit("changeUpdateCtx", "game");
      
    }



    function render()
    {
      player.draw(ctx);
      floor.draw(ctx, player)
    }
    
    var lastTime = new Date().getTime();
    this.update = function(time) {
      world.Step(
        1/60
        ,10
        ,10
      );
      world.DrawDebugData();
      world.ClearForces();
      stats.update();
       player.body2d.ApplyImpulse(new b2Vec2( 0.0001, 0), player.body2d.GetWorldCenter())
      /*
      if (lastTime + 1500 < time )
      {
        world.DestroyJoint(cJoint);
      }
      */
      render();
    }

  }
  
  return Game;
});    
    
    