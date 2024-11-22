function generateCars(num, bestCar = null, mutate=false) {
    for (let i = 0; i < num; i++) {
        const laneIndex = bestCar != null ? bestCar.x : road.getLaneCenter(1);
        const carY = bestCar != null ? bestCar.y + 40 : 100;
        const newCar = new Car(laneIndex, carY, 30, 50, "AI");
        if (localStorage.getItem("bestBrain")) {
            newCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
        }
        if (mutate && i != 0) {
            NN.mutate(newCar.brain, NN_MUTATION);
        }
        cars.push(newCar);
    }
}

function generateRandomTraffic() {
    const laneIndex = Math.floor(Math.random() * LANE_COUNT);
    const carY = bestCar.y - TRAFFIC_SPAWN_DISTANCE;
    const carSpeed = 2;
    // const controlType = Math.random() < 0.7 ? "DUMMY" : "AI";
    const controlType = "DUMMY";
    const color = getRandomColor();
    const newTrafficCar = new Car(
        road.getLaneCenter(laneIndex),
        carY,
        30,
        50,
        controlType,
        carSpeed,
        color,
    );

    if (controlType === "AI") {
        if (localStorage.getItem("bestBrain")) {
            newTrafficCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
            NN.mutate(newTrafficCar.brain, NN_MUTATION);
        }
    }

    traffic.push(newTrafficCar);
}

function removeOldTraffic() {
    const safeDistance = 500;
    if (bestCar) {
        traffic = traffic.filter((car) => car.y < bestCar.y + safeDistance);
    }
    traffic = traffic.filter((car) => car.damaged !== true);
}

function removeOldCars() {
    const safeDistance = 160;
    if (bestCar) {
        cars = cars.filter((car) => car.y < bestCar.y + safeDistance);
    }
    cars = cars.filter((car) => car.damaged !== true);
}
