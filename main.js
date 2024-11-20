const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const nnCanvas = document.getElementById("nnCanvas");
nnCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const nnCtx = nnCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI"); //KEYS
const cars = generateCars(1);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NN.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function writeJsonToFile(data, fileName) {
  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

document.getElementById("selectFileButton").addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const jsonData = JSON.parse(event.target.result);
          localStorage.setItem("bestBrain", JSON.stringify(jsonData));
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("No file selected");
    }
  };

  // Trigger the file input click
  fileInput.click();
});

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  writeJsonToFile(bestCar.brain, "bestCar.json");
}

function discard() {
  localStorage.removeItem("bestBrain", JSON.stringify(bestCar.brain));
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
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => {
    car.draw(carCtx);
  });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  nnCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(nnCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
