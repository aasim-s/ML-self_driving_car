const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const nnCanvas = document.getElementById("nnCanvas");
nnCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const nnCtx = nnCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); //KEYS
const cars = generateCars(100);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2)
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(num) {
  const cars = [];
  for (let i = 0; i < num; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  cars.forEach((car) => {
    car.update(road.borders, traffic);
  });
  bestCar = cars.find((car) => car.y == Math.min(...cars.map((car) => car.y)));

  carCanvas.height = window.innerHeight;
  nnCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => {
    car.draw(carCtx, "blue");
  });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  nnCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(nnCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
