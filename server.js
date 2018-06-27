const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [];
app.locals.projects = [
  { id: '1', name: 'Project 1'},
  { id: '2', name: 'Project 2'}
];
app.locals.palettes = [];
app.locals.palettes = [
  { id: '1', name: 'Palette 1', color1: '#1034d7', color2: '#2034d7', color3: '#3034d7', color4: '#4034d7', color5: '#5034d7', project: '1'},
  { id: '2', name: 'Palette 2', color1: '#5034d7', color2: '#4034d7', color3: '#3034d7', color4: '#2034d7', color5: '#1034d7', project: '2'}
];

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.json(projects);
}
)
app.get('/api/v1/palettes', (request, response) => {
  const { palettes } = app.locals;

  response.json(palettes);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});