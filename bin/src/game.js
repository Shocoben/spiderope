define(["box2D", "MathUtils", "Player", "Elem", "Building", "Blood", "gameOverGUI", "gameGUI", "canvasParams", "audioButton"],
 function(Box2D, MathUtils, Player, Elem, Building, Blood, GameOverGUI, GameGUI, canvasParams, audioButton)
 {
  
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
      var points = [];
      var cJoint = null;
      var onGround = false;
      var pointer = this;
      var startTime;
      var gameDelay = (1.5 * 60) * 1000 ;
      
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
 
      var gameOverGUI = new GameOverGUI();
      var gameGUI = new GameGUI();
      var bgImage;
      
      
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
    var _imagesManager;
  
    
    this.createPoint = function(position, fixed)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 0.3;
        fixDef.friction = 10;
        fixDef.restitution = 1;
        fixDef.filter.maskBits = 0;
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
      if (player.realY - player.offsetY < 0)
      {
        lastPoint = new MathUtils.Vector2(player.offsetX + player.halfRealW, player.offsetY + player.halfRealH);
      }
     
 
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#dddddd';
      
      for(var i = 1; i < cFixedPointsCreated.length; i++)
      {
        
        var cPointPos = new MathUtils.Vector2(cFixedPointsCreated[i].GetBody().GetPosition().x, cFixedPointsCreated[i].GetBody().GetPosition().y) ;
        cPointPos.x = cPointPos.x * SCALE;
        cPointPos.x = cPointPos.x - (player.realX - player.offsetX);

        if (player.realY - player.offsetY < 0)
        {
          cPointPos.y *= SCALE;
          cPointPos.y = cPointPos.y - (player.realY - player.offsetY);
        }
        else
        {
          cPointPos.y *= SCALE; 
        }
        
        ctx.save();
          ctx.beginPath();
          ctx.moveTo(lastPoint.x , lastPoint.y);
          ctx.lineTo(cPointPos.x, cPointPos.y);
          ctx.stroke();
        ctx.restore();
        lastPoint =cPointPos;
      }
    }

    this.generateBuild = function(random)
    {
      var size = (random) ? Building.prototype.randomH() : 1;
      var newBuilding = new Building(lastBuildingPos, floor, size, SCALE, canvas, _imagesManager);
      buildings.push(newBuilding);
      lastBuildingPos+= Building.prototype.w + Building.prototype.offsetX;
    }
    
    this.createFirstBuildings = function()
    {
      for (var i = 0; i < 2; i++)
      {
        this.generateBuild(false);
      }
      buildings[0].tutoMode();
    }
    
    this.createBuildings = function()
    {
      if (buildings.length > 6)
      {
        buildings.splice(0, 3);
      }
      for (var i = 0; i < 3; i++)
      {
        this.generateBuild(true);
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
    
    
    var ratioScreenBg = 0;
    var bgWidth;
    this.setup = function(eventBus, imagesManager) 
    {
      this.deleteRope();
      ctx = this.ctx;
      canvas = this.canvas;
      _eventBus = eventBus;
      _imagesManager = imagesManager;
      gameOverGUI.setup(eventBus, imagesManager); 
      gameGUI.setup(eventBus, imagesManager);
      bgImage = imagesManager.getImage("BG");
      ratioScreenBg = canvas.height / bgImage.height;
      bgWidth = bgImage.width * ratioScreenBg;
      audioButton.prototype.addTo(gameGUI.gui);
      audioButton.prototype.addTo(gameOverGUI.gui);
    }
    
    var tutoState = 0;
    var bgOneX ;
    var bgTwoX ;
    var lastCameraPosX;
    var bgDepth = 0.3;
    this.reset = function()
    {
      bloodList = [];
      nBlood = 0;
      SCALE = 15;
      buildings = [];
      lastBuildingPos = 0;
      isGameOver = false;
      cameraPos = null;
      life = 100;
      damage = 100;
      points = [];
      cJoint = null;
      onGround = false;
      ropeCreated = false;
      gameGUI.stopSayToDeleteRope();
      tutoState = 0;
      bgOneX = 0;
      bgTwoX = bgOneX + bgWidth;
      startTime = new Date().getTime() + gameDelay;
      if (localStorage)
      {
        highscore = localStorage["spideropehighscore"];
      }
      
      audioButton.prototype.moveFor();
      audioButton.prototype.moveFor();
      
    }
    
    this.launch = function()
    {
      this.reset();
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

      floor = new Elem(world,  SCALE, (this.canvas.width * 0.5) / SCALE , this.canvas.height / SCALE - 2, (this.canvas.width * 0.5) / SCALE, 2, "floor")
      
      //create PLAYER
      player = new Player(world, SCALE, 0.5, 0.5, _imagesManager.getImage("player"));
      
      cameraPos = player;
      lastCameraPos = cameraPos;
          // blood = new Blood(world, player, SCALE, 0.3, 0.3);
    
      //CREATE BUILDINGS
      this.createFirstBuildings();
      
      
      _eventBus.on("mouseup", function(mousepos)
      {
        if (isGameOver)
        {
          gameOverGUI.gui.onMouseUp(mousepos);
        }
        else
        {
          if (gameGUI.gui.onMouseUp(mousepos))
            return;
          player.updateRealPos();
          var nMousePos = {"x" : mousepos.x / SCALE, "y" : mousepos.y/SCALE}
          var diffX =  nMousePos.x - (player.offsetX / SCALE);  
          var diffY = nMousePos.y - (player.offsetY / SCALE);
          var y = (player.realY - player.offsetY < 0) ? player.b2Body.GetPosition().y + diffY : nMousePos.y;
          var destination = new MathUtils.Vector2(player.b2Body.GetPosition().x + diffX, y);
          //points.push(new Elem(world,  SCALE, destination.x, destination.y, 1, 1));
          if (!ropeCreated)
          {
            
        
            if (!pointer.isPointInABuilding(destination))
            {
              return;
            }
            if (tutoState == 0)
            {
              buildings[0].normalMode()
              gameGUI.sayToDeleteRope();
              tutoState++;
            }
            pointer.createRope(destination);
            //player.b2Body.ApplyImpulse(new b2Vec2( 0.5, 0), player.b2Body.GetWorldCenter())
          }
          else
          {

            if (tutoState == 1)
            {
              gameGUI.stopSayToDeleteRope();
            }
            pointer.deleteRope();
            player.b2Body.ApplyImpulse(new b2Vec2( 1, 0), player.b2Body.GetWorldCenter())
          }
          ropeCreated = !ropeCreated;
        }

      });
      _eventBus.emit("changeUpdateCtx", "game");
      
      
      
      /*
      var debugDraw = new b2DebugDraw();
      debugDraw.SetSprite(ctx);
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      world.SetDebugDraw(debugDraw);*/
      
    }
    
    function render()
    {
      ctx.fillStyle = "#04111c";
      ctx.fillRect(0, 0, canvas.width , canvas.height )
      ctx.globalAlpha = 1;

      //world.DrawDebugData();
    
      var bgY =  (cameraPos.realY - cameraPos.offsetY < 0)? 0 - (cameraPos.realY - cameraPos.offsetY) * bgDepth * 2 : 0; 
      ctx.drawImage(bgImage, bgOneX, bgY, bgWidth, canvas.height);
      ctx.drawImage(bgImage, bgTwoX, bgY, bgWidth, canvas.height);
      
      for (var i = 0; i < buildings.length; i++)
      {
        var b = buildings[i];
        b.draw(ctx, cameraPos);
      }
      
      for (var i = 0, b = null; b = bloodList[i]; ++i)
      {
        b.draw(ctx, cameraPos);
      }
      
      ctx.lineWidth = 1;
      drawRope(ctx);
      player.draw(ctx, cameraPos);
      floor.draw(ctx, cameraPos);
      
      if (!isGameOver)
      {
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.font = "11pt GROBOLDRegular";
        var seconde = (diffTime / 1000) % 60;
        var minute = (diffTime / 1000) / 60 ;
        ctx.textAlign = "center";
        
        ctx.fillText  ( Math.floor(minute) + ":" + Math.floor(seconde), canvasParams.width - 100, 50);
        ctx.fillText  (Math.floor(player.b2Body.GetPosition().x) + " cm", canvasParams.width - 100, 80);
        if (localStorage)
        {
           ctx.fillText  ( "Best :" + Math.floor(highscore) + "cm", canvasParams.width - 100, 110);
        }
      }
      
      
      ctx.drawImage(_imagesManager.getImage("flou"), 0, 0, canvas.width, canvas.height);
    }
    
    var lastTime = new Date().getTime();
    var lastLostOfLife = new Date().getTime();
    var delayLoseLife = 500;
    this.whenOnGround = function(time)
    {
        
        if (!isGameOver)
        {
          life -= damage;
          for (var i = 0; i < 5; ++i)
            bloodList.push( new Blood(world, player, SCALE) );
        }

    }
    
    
    var diffTime;
    var highscore = 0;
    this.update = function(time) 
    {
      diffTime = startTime - time;
      
      //world.DrawDebugData();
      world.ClearForces();
      if (!isGameOver)
      {
        player.updateRealPos();
        playerX = player.b2Body.GetPosition().x;
        var canvasWidthWorld = canvas.width / SCALE;
        floor.b2Body.SetPosition({"x" : playerX + 5.8 , "y" : floor.b2Body.GetPosition().y});
        if (lastBuildingPos - player.realX < (Building.prototype.w + Building.prototype.offsetX) * 2)
        {
          this.createBuildings();
        }
      }
      
      if ( onGround ){
        this.whenOnGround(time);
      }
      
      
      
      //when you die , called only once
      if ((life <= 0 || diffTime < 0) && !isGameOver)
      {
        cameraPos = {"realX" : player.realX.valueOf(), "realY" : player.realY.valueOf(), "offsetX" : player.offsetX.valueOf()}
        var score = Math.floor(player.b2Body.GetPosition().x);
        if (localStorage)
        {
           highscore = parseInt(localStorage['spideropehighscore']) || 0;
           if (score > highscore)
           {
            console.log("newhigh");
            localStorage["spideropehighscore"] = score;
           } 
        }
        gameOverGUI.updateScore(score);
        this.deleteRope();
        
        player.image = _imagesManager.getImage("playerDead");
        isGameOver = true;
      } 
      
   
      
      
      for( i = 0 ; i < bloodList.length ; ++i){
        bloodList[i].update(time);

        if(bloodList[i].isDead == true)
        {
          world.DestroyBody(bloodList[i].b2Body);
          bloodList.splice(i,1);
        }
      }

      bgOneX += (lastCameraPos.realX - cameraPos.realX) * bgDepth;
      bgTwoX += (lastCameraPos.realX - cameraPos.realX) * bgDepth;
      lastCameraPos = {"realX" : cameraPos.realX.valueOf(), "realY" : cameraPos.realY.valueOf(), "offsetX" : cameraPos.offsetX.valueOf()};
      if (bgOneX + bgWidth < 0)
      {
        bgOneX = bgTwoX + bgWidth;
      }
      if (bgTwoX + bgWidth < 0)
      {
        bgTwoX = bgOneX + bgWidth;
      }
      
      render();
      if (isGameOver)
      {
        gameOverGUI.draw(ctx);
      }
      if (!isGameOver)
      {
        gameGUI.draw(ctx);
      }
      world.Step(1/60,10,10);
      //stats.update();
    } 
  

  }
  
  return Game;
});    
    
    