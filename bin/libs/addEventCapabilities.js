define(function() {
	var addEventCapabilities = function (object) {
    
	    object.listenersFor = {};
	    
	    object.on = function (eventName, callback) {
	        if (!object.listenersFor[eventName]) {
	            object.listenersFor[eventName] = [];
	        }
	        object.listenersFor[eventName].push(callback);
	    };
	    
	    object.emit = function () {
	        var args = Array.prototype.slice.call(arguments);
	        var eventName = args.shift();
	        var listeners = object.listenersFor[eventName] || [];
	        
	        for (var i=0; i < listeners.length; i++) {
	            try {
	                listeners[i].apply(object, args);
	            } catch (e) {
	               console.error('Error on event '+eventName);
	               throw(e);
	            }
	        };
	    };

	    object.del = function(eventName, f)
	    {
	    	if (!f)
	    	{
	    		delete object.listenersFor[eventName];
	    		return;
	    	}
	    	else
	    	{
	    		for (var i in object.listenersFor[eventName])
	    		{
	    			if (object.listenersFor[eventName][i] == f)
	    			{
	    				object.listenersFor[eventName].splice(i,1);
	    				return true;
	    			}
	    		}
	    	}
	    	return;
	    }

	};

	return addEventCapabilities;
	
});

