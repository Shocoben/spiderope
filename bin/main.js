require.config(
{
    baseUrl: "./bin/src/"
    ,paths: {
        'box2D' : '../libs/box2d.min'
        ,'stats' : '../libs/stats' 
        ,"fpsFrame" : '../libs/fpsFrame'
        ,"addUpdateCapabilites" : '../libs/addUpdateCapabilites'
        ,"gameLoop" : "../libs/gameLoop"
        ,"imagesManager" : "../libs/imagesManager"
        ,"canvas" : "../libs/canvas"
        ,"canvasParams" : "../setup/canvasParams"
        ,"canvasResizer" : "../libs/canvasResizer"
        ,"addEventCapabilities" : "../libs/addEventCapabilities"
        ,'eventBus' : "../libs/eventBus"
        ,"mouseCoords" : "../libs/mouseCoords"
        ,"addMouseEvents" : "../libs/addMouseEvents"
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


require(["box2D","stats", "gameLoop", "game", "canvas", "canvasParams", "eventBus", "mouseCoords"], 
function(Box2D, Stats, gameLoop, game, Canvas, canvasParams, eventBus, mouseCoords)
{
    var canvas = new Canvas(document.body, canvasParams);
    canvas.associate(game);


    mouseCoords.connectToCanvas(canvas.getDOM());
    mouseCoords.connectToEventBus(eventBus);
    /*
    var imagesManager = new ImagesManager({"SD" : "images"});
    imagesManager.pushImages(gameimages);
    */

    gameLoop.addUpdate("game", game);

    gameLoop.connectToEventBus(eventBus);
    gameLoop.init();
    
    game.createWorld(eventBus);
    //menu.init(eventBus, imagesManager, gamePad, game);

    
  
});