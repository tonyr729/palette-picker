const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generateColors = (event) => {
  for (let index = 0; index < 5; index++) {
    let element = ".color" + (index + 1)
    let randomColor = getRandomColor();
    $(element).css("background-color", randomColor);
    $(element + " p").css("color", randomColor);
    let value = $(element + " p").text(randomColor);
  }
}

generateColors();

$(".div__button--generate").on('click', generateColors)
$(".div__img-lockicon").on('click', changeLockedIcon)

function changeLockedIcon() {
  if ($(this).attr('src').includes("unlocked")) {
    $(this).attr("src","../images/locked.svg");
  } else {
    $(this).attr("src","../images/unlocked.svg");
  }
}

const fetchProjects = async () => {
  const response = await fetch('http://localhost:3000/api/v1/projects')
  const projects = await response.json();
  return projects
}

const fetchPalettes = async (projectID) => {
  const response = await fetch(`http://localhost:3000/api/v1/projects/${projectID}/palettes`)
  const palettes = await response.json();
  return palettes;
}

const loadProjects = async () => {
  const projects = await fetchProjects();
  const projectsWithPalettes= projects.map(async project => {
    const projectPalettes = await fetchPalettes(project.id)
    const newProject = {...project, palettes: projectPalettes}
    return newProject;
  });

  appendProjects(await Promise.all(projectsWithPalettes))
}



const postData = async (url, data) => {
  const response = await fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST'
  });
  const result = await response.json()
  return result;
}


const saveProject = (event) => {
  event.preventDefault()
  const $projectName = $('.form__input-project').val()
  // console.log($projectName)
  postData('http://localhost:3000/api/v1/projects', {name: $projectName})
  .then(result=> console.log(result))
  .catch(error => console.error(error))
}

$('.save-projects').on('click', saveProject);


const appendProjects = (projects) => {
  const $cardArea = $(".section__div-projects");
  const $selectDropdown = $(".form__select-projects")
  projects.forEach(project => {
    console.log(project)
    let paletteInfo;
    if (!project.palettes.error) {
      paletteInfo = project.palettes.map(palette => {
        return (
          `<div class="palette-container">
            <p class="palette__name">${palette.name}</p>
            <div class="div__color" style="background-color: ${palette.color1};"></div>
            <div class="div__color" style="background-color: ${palette.color2};"></div>
            <div class="div__color" style="background-color: ${palette.color3};"></div>
            <div class="div__color" style="background-color: ${palette.color4};"></div>
            <div class="div__color" style="background-color: ${palette.color5};"></div>
            <img src="${'../images/white_x.svg'}" alt="delete icon" />
          </div>`
        )
      });
    } else {
      paletteInfo = [(
        `<div class="palette-container">
          <p class="palette__name">No Palettes saved.</p>
        </div>`
      )]
    }

    $selectDropdown.append(
      `<option value=${project.id}>${project.name}</option>`
    )

    $cardArea.append(
      `<div class="project__card">
        <button class="project__button">${project.name}</button>
        ${paletteInfo}
      </div>`
    )
  })
}

loadProjects();