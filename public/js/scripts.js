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