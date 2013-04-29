define(["addUpdateCapabilites"],function(addUpdate)
{
	var gameLoop = {};
	addUpdate(gameLoop);
	var eventBus={};
	gameLoop.contexts={};
	gameLoop.play=true;
	gameLoop.currentCtx = null;
	gameLoop.ctxBeforePause = null;
	gameLoop.nonStop = {};
	gameLoop.oldNonStop = null;

	gameLoop.lastUpdate = new Date().getTime();
	gameLoop.update = function()
	{
		var cTime = new Date().getTime();
		if (gameLoop + 1000/60 > cTime)
		{
			return;
		}
		var delta = (cTime - gameLoop.lastUpdate) * 0.01;

		gameLoop.lastUpdate = cTime;
		var currentCtx = gameLoop.contexts[gameLoop.currentCtx]; 
		for( var i in currentCtx)
		{
			if ( currentCtx[i].update)
			{
				currentCtx[i].update(cTime, delta);	
			}
		}
		for (var i in gameLoop.nonStop)
		{
			gameLoop.nonStop[i].update(cTime, delta);
		}
	}

	gameLoop.pause = function(ctx)
	{
		gameLoop.oldNonStop = nonStop;
		gameLoop.nonStop = null;
		gameLoop.ctxBeforePause = gameLoop.currentCtx;
		gameLoop.currentCtx = null;
	}

	gameLoop.restart = function()
	{
		gameLoop.currentCtx = gameLoop.ctxBeforePause;
		gameLoop.nonStop = gameLoop.oldNonStop;
	}

	gameLoop.addUpdate = function( ctx, object )
	{
		if (!this.contexts[ctx])
		{
			this.contexts[ctx] = [];
		}
		object.gameLoopId = this.contexts[ctx].length;
		this.contexts[ctx].push( object );
	}

	gameLoop.addNonStop = function(name, o)
	{
		gameLoop.nonStop[name] = o;
	}

	gameLoop.deleteUpdate = function(ctx, o)
	{
		if (o)
		{
			this.contexts[ctx].splice(o.gameLoopId,1);	
		}
		else {
			delete this.contexts[ctx];
		}
		
	}

	gameLoop.deleteNonStop = function(name)
	{
		delete gameLoop.nonStop[name];
	}

	gameLoop.changeCtx = function(ctx)
	{
		gameLoop.currentCtx = ctx || null;
	}

	gameLoop.connectToEventBus = function(_eventBus) 
	{
		eventBus = _eventBus || null;	
		eventBus.on("changeUpdateCtx", gameLoop.changeCtx);
		eventBus.on("gameLoopPause", gameLoop.pause);
		eventBus.on("gameLoopRestart", gameLoop.restart);
	}

	gameLoop.init = function()
	{
		this.launchUpdate();
	}

	return gameLoop;
})