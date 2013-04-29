define(["stats"], function (argument) {
  var stats = new Stats();
  document.body.appendChild(stats.domElement);
  
  return stats;
})
