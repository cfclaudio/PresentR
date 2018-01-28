 var socket = io();
 socket.on('canvas', function(canvasobj){
 console.log('HTML: ', canvas);
  canvas.clear();
  canvas.loadFromJSON(canvasobj, canvas.renderAll.bind(canvas));
 });
 // console.log(canvas);
 // setInterval(() => {
 //   var canvasStr = JSON.stringify(canvas);
 //   socket.emit('canvas', canvasStr);
 //   console.log(canvasStr);
 // }, 500);
canvas.on('mouse:up', function(event){
  console.log(canvas)
   // event.preventDefault();
   var canvasStr = JSON.stringify(canvas);
  socket.emit('canvasEmit', canvasStr);
 });