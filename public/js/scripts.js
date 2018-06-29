$(document).ready(() => {
  generateColors();
  loadProjects();
})

const generateColors = (event) => {
  for (let index = 0; index < 5; index++) {
    let element = ".color" + (index + 1)
    let randomColor = getRandomColor();

    if ($(element).children('img')[0].classList.length === 1) {
      $(element).css("background-color", randomColor);
      $(element + " p").css("color", randomColor);
      let value = $(element + " p").text(randomColor);
    }
  }
}

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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

function changeLockedIcon() {
  if ($(this).attr('src').includes("unlocked")) {
    $(this).attr("src","../images/locked.svg");
    $(this).addClass("locked");
  } else {
    $(this).attr("src","../images/unlocked.svg");
    $(this).removeClass("locked");
  }
}

const validateFields = () => {
  const projectInput = $('.form__input-project')
  const paletteInput = $('.form__input-palette')
  const projectButton = $('.save-project')
  const paletteButton = $('.save-palette')
  console.log(projectInput.val())  

  projectInput.val() === '' ? 
    projectButton.prop('disabled', true) : 
    projectButton.prop('disabled', false)
    
  paletteInput.val() === '' ? 
    paletteButton.prop('disabled', true) : 
    paletteButton.prop('disabled', false)
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


const postData = async (url, data) => {
  const response = await fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
  const result = await response.json()
  return result;
}

const saveProject = () => {
  event.preventDefault()
  const $cardArea = $(".section__div-projects");
  const $selectDropdown = $(".form__select-projects");
  const $projectName = $('.form__input-project').val();
  const $previousProjects = Object.values($('.project__title')).filter(element => element.innerHTML === $projectName)
  
  if (!$previousProjects.length) {
    postData('http://localhost:3000/api/v1/projects', {name: $projectName})
      .then(result=> {
        $selectDropdown.append(
          `<option value=${result.id}>${$projectName}</option>`
        )
  
        $cardArea.append(
          `<div class="project__card id__${result.id}">
            <h3 class="project__title">${$projectName}</h3>
            <div class="palette-container">
              <p class="palette__name message">No Palettes saved.</p>
            </div>
          </div>`
        )
      })
      .catch(error => console.log(error))
      $('.form__input-project').val('');
  } else {
    $('#project__warning').text('Please use a Project Name that doesn\'t already exist.')
  }
}
  
const savePalette = (event) => {
  event.preventDefault()
  const $paletteName = $('.form__input-palette').val();
  const colors = captureColors();
  const $currProject = $('.form__select-projects').val()
  const $projectCard = $(`.id__${$currProject}`)
  const finalPalette = generatePalette($paletteName, colors, $currProject);
  const url = `http://localhost:3000/api/v1/projects/${$currProject}/palettes`;
  
  postData(url, finalPalette)
    .then(result=> {
      const $palette = $(`.id__${$currProject}`).children('div')
      
      if ($palette.children('p').text() === "No Palettes saved.") {
        $palette.remove();
      }

      $projectCard.append(
        `<div class="palette-container" data-projectid="${$currProject}" data-paletteid="${result.id}">
          <p class="palette__name">${$paletteName}</p>
          <div class="div__color" style="background-color: ${colors[0]};"></div>
          <div class="div__color" style="background-color: ${colors[1]};"></div>
          <div class="div__color" style="background-color: ${colors[2]};"></div>
          <div class="div__color" style="background-color: ${colors[3]};"></div>
          <div class="div__color" style="background-color: ${colors[4]};"></div>
          <img src="${'../images/white_x.svg'}" id="delete" alt="delete icon" />
        </div>`
      )
    })
    .catch(error => console.error(error))
}


const captureColors = () => {
  const colorElements = $('.div__p-colorhex')
  const colors = Object.values(colorElements).map(colorElement => colorElement.innerHTML).slice(0, 5)
  return colors;
}

const generatePalette = (name, colors, pID) => {
  const palette = {
    name,
    color1: colors[0],
    color2: colors[1],
    color3: colors[2],
    color4: colors[3],
    color5: colors[4],
    project_id: pID,
  }
  return palette;
}

const deleteData = async (projectID, paletteID) => {
  fetch(`http://localhost:3000/api/v1/projects/${projectID}/palettes/${paletteID}`, {
    method: 'DELETE'
  });
}

function deletePalette(event) {
  if (event.target.id === 'delete') {
    const paletteContainer = event.target.closest('.palette-container');
    const projectID = paletteContainer.dataset.projectid
    const paletteID = paletteContainer.dataset.paletteid;

    deleteData(projectID, paletteID)
    paletteContainer.remove();
  }
}
 

const appendProjects = (projects) => {
  const $cardArea = $(".section__div-projects");
  const $selectDropdown = $(".form__select-projects")
  projects.forEach(project => {
    let paletteInfo;
    if (!project.palettes.error) {
      paletteInfo = project.palettes.map(palette => {
        return (
          `<div class="palette-container" data-projectid="${project.id}" data-paletteid="${palette.id}">
          <p class="palette__name">${palette.name}</p>
          <div class="div__color" style="background-color: ${palette.color1};"></div>
          <div class="div__color" style="background-color: ${palette.color2};"></div>
          <div class="div__color" style="background-color: ${palette.color3};"></div>
          <div class="div__color" style="background-color: ${palette.color4};"></div>
          <div class="div__color" style="background-color: ${palette.color5};"></div>
          <img src="${'../images/white_x.svg'}" id="delete" alt="delete icon" />
          </div>`
        )
      });
    } else {
      paletteInfo = [(
        `<div class="palette-container">
        <p class="palette__name message">No Palettes saved.</p>
        </div>`
      )]
    }
    
    $cardArea.append(
      `<div class="project__card id__${project.id}">
      <h3 class="project__title">${project.name}</h3>
      ${paletteInfo}
      </div>`
    )

    $selectDropdown.append(
      `<option value=${project.id}>${project.name}</option>`
    )
  })
}


$('.form__input-project').on('keyup', validateFields)
$('.form__input-palette').on('keyup', validateFields)
$(".div__button--generate").on('click', generateColors)
$(".div__img-lockicon").on('click', changeLockedIcon)
$('.save-palette').on('click', savePalette)
$('.save-project').on('click', saveProject);
$(".main__section-bottom").on('click', deletePalette)