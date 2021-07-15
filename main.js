var canvas = document.getElementById("petri");
var clone = document.getElementById("clone");
var debugcanvas = document.getElementById("debug");
var c = canvas.getContext("2d");
var cc = clone.getContext("2d");
var debug = debugcanvas.getContext("2d");
var width = window.innerWidth * 2;
var height = window.innerHeight * 2;
var mouse = {
  x: 0,
  y: 0,
};
var Config = {
  size: 1,
  timer: 5,
  agents: 10000,
  speed: 1,
  debug: false,

  bg: "#000",
};
var clock = 0;
var data = [];

var agents = [];

function init() {
  canvas.width = width;
  canvas.height = height;
  debugcanvas.width = width;
  debugcanvas.height = height;

  window.onmousemove = function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  Config.bg = "#fff";
  for (let i=0; i<Config.agents; i++) {
    agents.push(new Agent({
      position: { x: Math.random() * width, y: Math.random() * height },
      speed: 5,
      sensorSize: 2,
      sensorDistance: 100,
      turnSpeed: 10,
      color: "lightgreen"
    }))
  }

  // for (let i=0; i<Config.agents; i++) {
  //   if (Math.random() > 0.5) {
  //     agents.push(new Agent({
  //       position: { x: Math.random() * width, y: Math.random() * height },
  //       speed: 5,
  //       sensorSize: 2,
  //       sensorDistance: 100,
  //       turnSpeed: 10,
  //       color: "lightblue"
  //     }));
  //   } else {
  //     agents.push(new Agent({
  //       position: { x: Math.random() * width, y: Math.random() * height },
  //       speed: 5,
  //       sensorSize: 2,
  //       sensorDistance: 100,
  //       turnSpeed: 10,
  //       color: "pink"
  //     }));
  //   }
  // }

  for (let y=0; y<height; y++) {
    data[y] = [];
    for (let x=0; x<width; x++) {
      data[y][x] = 0;
      if (Math.random() > 0.995) {
        // agents.push(new Agent({
        //   position: { x: Math.random() * width, y: Math.random() * height },
        //   speed: 10,
        //   sensorSize: 2,
        //   sensorDistance: 200,
        //   turnSpeed: 10,
        //   color: randomcolor,
        // }));

        // agents.push(new Agent({
        //   position: { x: Math.random() * width, y: Math.random() * height },
        //   speed: 5,
        //   sensorSize: 3,
        //   sensorDistance: 25,
        //   // color: randomColor(),
        // }))
      }
    }
  }

  c.fillStyle = Config.bg;
  c.fillRect(0, 0, width, height);
  // c.filter = "blur(1px)";

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (Config.debug) debug.clearRect(0, 0, width, height);

  c.globalAlpha = "0.01";
  c.fillStyle = Config.bg;
  c.fillRect(0, 0, width, height);

  for (let y=0; y<height; y++) {
    for (let x=0; x<width; x++) {
      data[y][x] -= 0.001;
      if (data[y][x] < 0) data[y][x] = 0
    }
  }

  c.globalAlpha = "1";
  for (a in agents) {
    agents[a].draw();
  }

  update();
}

function update() {
  for (a in agents) {
    agents[a].update(1);
  }

  clock++;
}

init();