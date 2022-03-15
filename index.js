document.addEventListener("DOMContentLoaded", () => {
  populateAnimalList();
});

let animalsArray = [];
const animalSidebar = document.querySelector(".Sidebar");
const mainContainer = document.querySelector(".animal-container");
const videoPlayer = () => document.querySelector("#player");
const animalForm = document.querySelector("#new-animal");

function populateAnimalList() {
  fetch("http://localhost:3000/animals")
    .then((response) => response.json())
    .then((data) => {
      animalsArray = data;
      renderAnimalSidebar(animalsArray);
    });
}

function renderAnimalSidebar(animalsArray) {
  animalSidebar.innerHTML = animalsArray.map(renderEachName).join("");
}

function renderEachName(animal) {
  return `
    <h4 id="${animal.id}" class="animal-clicker">${animal.name}</h4>
    `;
}

document.addEventListener("click", (e) => {
  if (e.target.className === "animal-clicker") {
    const foundAnimal = animalsArray.find(
      (animal) => animal.id === parseInt(e.target.id)
    );
    renderMainContainerDetails(foundAnimal);
  }
});

function renderMainContainerDetails(foundAnimal) {
  mainContainer.innerHTML = `
    <h1 class="name"><strong>${foundAnimal.name}</strong> </h1>
    <img class="image-container" src="${foundAnimal.image}"/>
    <h3 class="fact"><strong>Fun Fact</strong>: ${foundAnimal.fact}</h3>
    <h3 class="activity"><strong>Activity</strong>: ${foundAnimal.activity}</h3>
    <iframe id="player" class="inset-0 w-full h-full" frameborder="0" ></iframe>
    `;

  videoPlayer().src = `https://www.youtube.com/embed/${extractVideoID(
    foundAnimal.video
  )}`;
}

function extractVideoID(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  console.log(match);
  if (match && match[7].length == 11) {
    return match[7];
  } else {
    alert("Could not extract video ID.");
  }
}

animalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const newName = form.querySelector("#new-name").value;
  const newImage = form.querySelector("#new-image").value;
  const funFact = form.querySelector("#new-fact").value;
  const newActivity = form.querySelector("#new-activity").value;
  const newLink = form.querySelector("#new-link").value;

  let newAnimalAdded = {
    name: newName,
    image: newImage,
    fact: funFact,
    activity: newActivity,
    video: newLink,
  };

  fetch("http://localhost:3000/animals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newAnimalAdded),
  })
    .then((resp) => resp.json())
    .then((data) => {
      animalsArray.push(data);
      animalSidebar.innerHTML += renderEachName(data);
    });

  animalForm.reset();
});
