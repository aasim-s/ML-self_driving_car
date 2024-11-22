function discard() {
    localStorage.removeItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log("NN discarded from memory");
}

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
    console.log("NN saved in memory");
}

function saveOffline() {
    writeJsonToFile(bestCar.brain, "bestCar.json");
    console.log("NN saved to file");
}

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
    fileInput.click();
    console.log("NN loaded from file");
});
