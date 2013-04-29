define(['addEventCapabilities'],function(addEvent)
{
	var eventBus = {};
	addEvent(eventBus);

	return eventBus;
});