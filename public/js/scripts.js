const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generateColors = () => {
  for (let index = 0; index < 5; index++) {
    let element = ".color" + (index + 1)
    let randomColor = getRandomColor();
    $(element).css("background-color", randomColor);
    let value = $(element + " p").text(randomColor);
    console.log(value)
  }
}

generateColors();