// ************* Selecting the DOM elements *************

const colorDivs = document.querySelectorAll(".color");
const generate = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll(".color h2");
const popupCopy = document.querySelector(".copy-container");
const controls = document.querySelectorAll(".controls");
const adjust = document.querySelectorAll(".adjust");
const lock = document.querySelectorAll(".lock");
const closeAdjust = document.querySelectorAll(".close-adjustment");
const sliderContainer = document.querySelectorAll(".sliders");
const generateButton = document.querySelector(".generate");
let initialColor;

// ************* Adding event listeners to the DOM *************

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});

popupCopy.addEventListener("transitionend", () => {
  const box = popupCopy.children[0];
  box.classList.remove("active");
  popupCopy.classList.remove("activate");
});

adjust.forEach((buton, index) => {
  buton.addEventListener("click", () => {
    activeAdjPanel(index);
  });
});

closeAdjust.forEach((buton, index) => {
  buton.addEventListener("click", () => {
    closeAdjustPanel(index);
  });
});

currentHex.forEach((hex) => {
  hex.addEventListener("click", copyPaste);
});

adjust.forEach((buton, index) => {
  buton.addEventListener("click", () => {
    activeAdjPanel(index);
  });
});

closeAdjust.forEach((buton, index) => {
  buton.addEventListener("click", () => {
    closeAdjustPanel(index);
  });
});

generateButton.addEventListener("click", randomHex);

//**************** Functions **************** */

function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomHex() {
  initialColor = [];
  colorDivs.forEach((div, index) => {
    let curentColor = div.children[0];
    let randomColor = generateHex();
    //Saving initial colors
    initialColor.push(chroma(randomColor).hex());

    div.style.backgroundColor = randomColor;
    curentColor.innerText = randomColor;

    checkLuminance(randomColor, curentColor);

    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    sliderColor(color, hue, brightness, saturation);
  });
  resetSliders();

  adjust.forEach((button, index) => {
    checkLuminance(initialColor[index], button);
    checkLuminance(initialColor[index], lock[index]);
  });
}

//Modify contrast of lock and adjust button
function checkLuminance(color, text) {
  let contrast = chroma(color).luminance();
  if (contrast > 0.5) text.style.color = "black";
  else text.style.color = "white";
}

//colorize sliders
function sliderColor(color, hue, brightness, saturation) {
  //Scale saturation
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  //Scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //Update saturation
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)}`;
  //Update brightness
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )},${scaleBright(0.5)}, ${scaleBright(1)}`;
  //Update hue
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75)`;
}

//Slider
function hslControls(event) {
  const index =
    event.target.getAttribute("data-hue") ||
    event.target.getAttribute("data-brightness") ||
    event.target.getAttribute("data-saturation");

  const sliders = event.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  const bgColor = initialColor[index];

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;

  sliderColor(color, hue, brightness, saturation);
}

//Modify HEX text dinamicaly
function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");

  textHex.innerText = color.hex();

  //changing the contrast for hex code and icons when the background is too bright or dark
  checkLuminance(color, textHex);
  for (icon of icons) {
    checkLuminance(color, icon);
  }
}

//Modify the sliders value after every change on the initial color
function resetSliders() {
  allSliders = document.querySelectorAll(".sliders input");
  allSliders.forEach((slider) => {
    const color = initialColor[slider.getAttribute(`data-${slider.name}`)],
      hueValue = chroma(color).hsl()[0].toFixed(2),
      saturationValue = chroma(color).hsl()[1].toFixed(2),
      brightnessValue = chroma(color).hsl()[2].toFixed(2);

    switch (slider.name) {
      case "hue":
        slider.value = hueValue;
        break;
      case "brightness":
        slider.value = brightnessValue;
        break;
      case "saturation":
        slider.value = saturationValue;
        break;
    }
  });
}

//Copy to clipboard value of Hex code
function copyPaste(hex) {
  const el = document.createElement("textarea");
  el.value = hex.target.innerText;

  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  popupCopy.classList.add("activate");
  const box = popupCopy.children[0];
  box.classList.add("active");
}

//Activate the adjustment slider panel
const activeAdjPanel = (index) => {
  sliderContainer[index].classList.add("active-sld");
};

//Closing the adjustment slider panel
const closeAdjustPanel = (index) => {
  sliderContainer[index].classList.remove("active-sld");
};

randomHex();
