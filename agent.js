class Agent {
  constructor(para) {
    this.position = para.position || { x:0, y:0 };
    this.angle = Math.random() * 2 * Math.PI;
    this.size = para.size || Config.size;
    this.speed = para.speed || Config.speed;

    this.sensorSize = para.sensorSize || 25;
    this.sensorAngleOffset = para.sensorAngleOffset || 1;
    this.sensorDistance = para.sensorDistance || 30;
    this.turnSpeed = para.turnSpeed || 1;

    // this.color = randomColor();
    this.color = para.color || "white";
  }

  draw() {
    c.fillStyle = this.color;
    let x = Math.round(this.position.x);
    let y = Math.round(this.position.y);
    c.fillRect(x, y, this.size, this.size);

    if (x < 0) x = width + x;
    if (x >= width) x = x - width;
    if (y < 0) y = height + y;
    if (y >= height) y = y - height;

    data[y][x] = 1;

    // if (x >= 0 && x < width && y >= 0 && y < height) {
    //   data[y][x] = 1;
    //   // if (y+1 < height) data[y+1][x] += 0.1;
    //   // if (y-1 >= 0) data[y-1][x] += 0.1;
    //   // if (x+1 < width) data[y][x+1] += 0.1;
    //   // if (x-1 >= 0) data[y][x-1] += 0.1;
    // }

    // c.beginPath();
    // c.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    // c.fill();
  }

  update(dt) {
    // this.size += (Math.random() - 0.5) * 0.1;
    // this.size = clamp(this.size, 1, 2);

    // follow trails
    let weightForward = this.sense(0);
    let weightLeft = this.sense(this.sensorAngleOffset);
    let weightRight = this.sense(-this.sensorAngleOffset);

    let randomSteerStrength = Math.random();

    if (
      weightForward > weightLeft &&
      weightForward > weightRight
    ) {
      this.angle += 0;
    }

    else if (
      weightForward < weightLeft &&
      weightForward < weightRight
    ) {
      this.angle += (randomSteerStrength - 0.5) * 2 * this.turnSpeed * dt;
    }

    else if (weightRight > weightLeft) {
      this.angle += randomSteerStrength * this.turnSpeed * dt;
    }

    else if (weightLeft > weightRight) {
      this.angle += randomSteerStrength * this.turnSpeed * dt;
    }

    // move

    let direction = {
      x: Math.cos(this.angle),
      y: Math.sin(this.angle)
    };
    let newPos = {
      x: this.position.x + direction.x * this.speed * dt,
      y: this.position.y + direction.y * this.speed * dt
    };

    if (newPos.x < 0) newPos.x = width + newPos.x;
    if (newPos.x >= width) newPos.x = newPos.x - width;
    if (newPos.y < 0) newPos.y = height + newPos.y;
    if (newPos.y >= height) newPos.y = newPos.y - height;

    // if (
    //   newPos.x < 0 || newPos.x >= width ||
    //   newPos.y < 0 || newPos.y >= height
    // ) {
    //   newPos.x = clamp(newPos.x, 0, width-this.size);
    //   newPos.y = clamp(newPos.y, 0, height-this.size);
    //   this.angle = Math.random() * 2 * Math.PI;
    // }

    this.position = newPos;
  }

  sense(sensorAngleOffset) {
    let sensorAngle = this.angle + sensorAngleOffset;
    let sensorDir = {
      x: Math.cos(sensorAngle),
      y: Math.sin(sensorAngle)
    };
    let sensorCenter = {
      x: Math.round(this.position.x + sensorDir.x * this.sensorDistance),
      y: Math.round(this.position.y + sensorDir.y * this.sensorDistance)
    };
    let sum = 0;

    let size = this.sensorSize;

    for (let x=-size; x<=size; x++) {
      for (let y=-size; y<=size; y++) {
        let pos = {
          x: sensorCenter.x + x,
          y: sensorCenter.y + y
        };

        if (pos.x < 0) pos.x = width + pos.x;
        if (pos.x >= width) pos.x = pos.x - width;
        if (pos.y < 0) pos.y = height + pos.y;
        if (pos.y >= height) pos.y = pos.y - height;

        sum += data[pos.y][pos.x];
      }
    }

    return sum
  }
}

function readImageData(data, x, y) {
  let index = ((y * data.width + x)*4);
  let r = data.data[index];
  let g = data.data[index+1];
  let b = data.data[index+2];
  let a = data.data[index+4];

  return [r, g, b, a]
}

function clamp(num, min, max) {
  return num <= min 
    ? min 
    : num >= max 
      ? max 
      : num
}

function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
