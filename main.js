var canvas = document.getElementById("petri");
var clone = document.getElementById("clone");
var debugcanvas = document.getElementById("debug");
var c = canvas.getContext("2d");
var cc = clone.getContext("2d");
var debug = debugcanvas.getContext("2d");
var width = window.innerWidth*2;
var height = window.innerHeight*2;
var mouse = {
  x: 0,
  y: 0,
};
var Config = {
  size: 1,
  timer: 5,
  agents: 20000,
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

  // crayon
  // Config.bg = "#fff";
  // for (let i=0; i<Config.agents; i++) {
  //   agents.push(new Agent({
  //     position: { x: Math.random() * width, y: Math.random() * height },
  //     speed: 5,
  //     sensorSize: 2,
  //     sensorDistance: 100,
  //     turnSpeed: 10,
  //     color: "lightgreen"
  //   }))
  // }

  // plasma
  // for (let i=0; i<Config.agents; i++) {
  //   if (Math.random() > 0.5) {
  //     agents.push(new Agent({
  //       position: { x: width/2, y: height/2 },
  //       speed: 1,
  //       sensorSize: 2,
  //       sensorDistance: 100,
  //       turnSpeed: 10,
  //       color: "lightblue"
  //     }));
  //   } else {
  //     agents.push(new Agent({
  //       position: { x: width/2, y: height/2 },
  //       speed: 1,
  //       sensorSize: 5,
  //       sensorDistance: 10,
  //       turnSpeed: 1,
  //       color: "pink"
  //     }));
  //   }
  // }

  // xray mosaic
  // Config.agents = 10000;
  // for (let i=0; i<Config.agents; i++) {
  //   agents.push(new Agent({
  //     position: { x: Math.random() * width, y: Math.random() * height },
  //     speed: 35,
  //     sensorSize: 5,
  //     sensorDistance: 300,
  //     turnSpeed: 25,
  //     color: "lightblue"
  //   }));
  // }

  // blood vessels
  // Config.bg = "#000";
  // sunflower(
  //   new Agent({
  //     speed: 10,
  //     sensorSize: 10,
  //     sensorDistance: width/80 + 1,
  //     turnSpeed: width/100,
  //     color: "#dff3f5",
  //   }),
  //   height/3,
  //   width * 1/3
  // );
  // sunflower(
  //   new Agent({
  //     speed: 10,
  //     sensorSize: 10,
  //     sensorDistance: width/80 + 1,
  //     turnSpeed: width/100,
  //     color: "#57918b",
  //   }),
  //   height/3,
  //   width * 2/3
  // );

  // sea foam
  Config.bg = "#2c5566";
  for (let i=0; i<width * 4/5; i++) {
    agents.push(new Agent({
      position: { x: Math.random() * width, y: Math.random() * height },
      speed: 10,
      sensorSize: 10,
      sensorDistance: width/80 + 1,
      turnSpeed: width/100,
      color: "#dff3f5",
    }))
  }

  for (let i=0; i<width; i++) {
    agents.push(new Agent({
      position: { x: Math.random() * width, y: Math.random() * height },
      speed: 10,
      sensorSize: 10,
      sensorDistance: width/50 + 1,
      turnSpeed: width/50,
      color: "#57918b",
    }))
  }

  for (let y=0; y<height; y++) {
    data[y] = [];
    for (let x=0; x<width; x++) {
      data[y][x] = 0;
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
      data[y][x] -= 0.05;
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

// https://stackoverflow.com/a/28572551/9375514
function sunflower(agent, circleSize, points, xOffset, yOffset, alpha) {
  xOffset = xOffset || width/2;
  yOffset = yOffset || height/2;
  alpha = alpha || 2;
  points = points || Config.agents;
  points += 1;
  let boundaryPoints = Math.round(alpha*Math.sqrt(points));
  let phi = (Math.sqrt(5)+1)/2;
  for (let k=1; k<points; k++) {
    let r;
    if (k>points-boundaryPoints) {
      r = 1
    } else {
      r = Math.sqrt(k-1/2)/Math.sqrt(points-(boundaryPoints+1)/2);
    }

    let theta = 2*Math.PI*k/phi^2;
    agents.push(new Agent({
      position: { x:r*Math.cos(theta) * circleSize + xOffset, y:r*Math.sin(theta) * circleSize + yOffset },
      size: agent.size,
      speed: agent.speed,
      sensorSize: agent.sensorSize,
      sensorDistance: agent.sensorDistance,
      turnSpeed: agent.turnSpeed,
      color: agent.color
    }))
  }
}

init();