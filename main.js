const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
carCanvas.width = 200;

const nnCanvas = document.getElementById("nnCanvas");
const nnCtx = nnCanvas.getContext("2d");
nnCanvas.width = 300;

const TRAFFIC_SPAWN_DISTANCE = 600;
const TRAFFIC_SPAWN_COUNT = 2;
const LANE_COUNT = 4;
const GENERATE_NEW_TRAFFIC = true;
const GENERATE_NEW_CARS = true;
const NN_MUTATION = 0.6;
let lastSpawnY = 0;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, LANE_COUNT);

let cars = [];
let traffic = [
    new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -650, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(3), -650, 30, 50, "DUMMY", 2, getRandomColor()),
];

// const myCar = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
// cars.push(myCar);
generateCars(1000, null, true);
let bestCar = cars[0];

animate();
function animate(time) {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    cars.forEach((car) => {
        car.update(road.borders, traffic);
    });
    bestCar = cars.find(
        (car) => car.y == Math.min(...cars.map((car) => car.y)),
    );

    removeOldTraffic();
    removeOldCars();

    if (
        GENERATE_NEW_TRAFFIC &&
        bestCar.y < lastSpawnY - TRAFFIC_SPAWN_DISTANCE &&
        traffic.length < 4
    ) {
        for (let i = 0; i < TRAFFIC_SPAWN_COUNT; i++) {
            generateRandomTraffic();
            lastSpawnY = bestCar.y;
        }
    }
    console.log(cars.length);
    if (GENERATE_NEW_CARS && cars.length < 20) {
        generateCars(20, bestCar, true);
    }

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
