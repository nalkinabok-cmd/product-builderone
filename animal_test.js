const URL = "https://teachablemachine.withgoogle.com/models/dhN-QQEW1/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to load your own custom things
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // setup event listeners
    const imageUpload = document.getElementById("image-upload");
    imageUpload.addEventListener("change", handleImageUpload);

    const predictButton = document.getElementById("predict-button");
    predictButton.addEventListener("click", predict);

    labelContainer = document.getElementById("result-text");
    labelContainer.innerHTML = "이미지를 업로드하고 '테스트 시작' 버튼을 누르세요.";
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.getElementById("uploaded-image");
        img.src = e.target.result;
        img.style.display = "block";
        document.getElementById("upload-placeholder").style.display = "none";
        labelContainer.innerHTML = "업로드된 이미지. '테스트 시작'을 누르세요.";
    };
    reader.readAsDataURL(file);
}

async function predict() {
    if (!model) {
        labelContainer.innerHTML = "모델 로딩 중...";
        return;
    }

    const img = document.getElementById("uploaded-image");
    if (img.style.display === "none" || !img.src || img.src === "#") {
        labelContainer.innerHTML = "먼저 이미지를 업로드하세요.";
        return;
    }

    labelContainer.innerHTML = "분석 중...";
    const prediction = await model.predict(img);

    let resultHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        resultHTML += `<div>${classPrediction}</div>`;
    }
    labelContainer.innerHTML = resultHTML;
}

// Initialize the model when the page loads
window.onload = init;