const express = require('express');
// Import express
const app = express();
// Instantiate express as app
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(express.static('public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({ 
          error: `Could not find palette with project id of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').where('project_id', request.params.id).insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/projects/:id/palettes/:id2', (request, response) => {
  const { id2 } = request.params;
  database('palettes').where({id: id2}).del()
    .then(palette => {
      response.sendStatus(204)
    })
    .catch(error => {
      response.status(404).json({message:'Could not find matching id'})
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;