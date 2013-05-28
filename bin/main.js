require.config(
{
    baseUrl: "./bin/src/"
    ,paths: {
        
        'box2D' : '../libs/box2d.min.ie'
        ,"guiPath" : "../libs/gui"
        ,"gui" : "../libs/gui/gui"
        ,'stats' : '../libs/stats' 
        ,"fpsFrame" : '../libs/fpsFrame'
        ,"addUpdateCapabilites" : '../libs/addUpdateCapabilites'
        ,"gameLoop" : "../libs/gameLoop"
        ,"canvas" : "../libs/canvas"
        ,"canvasParams" : "../setup/canvasParams"
        ,"canvasResizer" : "../libs/canvasResizer"
        ,"addEventCapabilities" : "../libs/addEventCapabilities"
        ,'eventBus' : "../libs/eventBus"
        ,"mouseCoords" : "../libs/mouseCoords"
        ,"touchCoords" : "../libs/touchCoords"
        ,"addMouseEvents" : "../libs/addMouseEvents"
        ,"addTouchEvents" : "../libs/addTouchEvents"
        ,"collisionPointAABB" : "../libs/collisionPointAABB"
        ,"ImagesManager" : "../libs/imagesmanager"
        ,"gameimages" : "../setup/gameimages"
        ,"buzz" : "../libs/buzz"
    }
    ,shim: {
        'box2D': {
            exports: 'Box2D'
        }
        ,'stats': {
            exports : 'Stats'
        }
    }
    , urlArgs: "?r=" + Date.now()
} );


require(["box2D", "gameLoop","game", "Menu", "loading", "canvas", "canvasParams", "eventBus", "mouseCoords", "touchCoords", "ImagesManager", "gameimages", "hub", "soundManager"], 
function(Box2D, gameLoop, game, menu, loading, Canvas, canvasParams, eventBus, mouseCoords,touchCoords, ImagesManager, gameimages, hub, soundManager)
{
    var canvas = new Canvas(document.body, canvasParams);

    mouseCoords.connectToCanvas(canvas.getDOM());
    mouseCoords.connectToEventBus(eventBus);
    
    touchCoords.connectToCanvas(canvas.getDOM()).connectToEventBus(eventBus);
    
    var imagesManager = new ImagesManager({"SD" : "images"});
    imagesManager.pushImages(gameimages);
    
    gameLoop.connectToEventBus(eventBus);
    gameLoop.init();
    
    
    hub.add("menu", menu);
    hub.add("game", game);
    hub.add("loading", loading);
  
    hub.setup(eventBus, imagesManager, gameLoop, canvas);

    hub.launch("loading");
    //menu.init(eventBus, imagesManager, gamePad, game);

    
  
});