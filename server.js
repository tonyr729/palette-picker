// Import express
const express = require('express');
// Instantiate express as app
const app = express();
// Import bodyParser to be able to parse body from the request object
const bodyParser = require('body-parser');
// Set enviorment port to designated or 3000
app.set('port', process.env.PORT || 3000);
// Tell app to use bodyParser
app.use(bodyParser.json());
// Tell app to use public file for static frontend
app.use(express.static('public'));
// Define dev enviorment for knex
const environment = process.env.NODE_ENV || 'development';
// Import knex using knexfile with defined enviorment
const configuration = require('./knexfile')[environment];
// Import database from knex
const database = require('knex')(configuration);

// Tell express for the get method of the given endpoint do the following
app.get('/api/v1/projects', (request, response) => {
  // Access database through knex and select the 'projects' table
  database('projects').select()
  // Take the returned promise and after consuming it with then 
    .then((projects) => {
      // Return with a succesfull status code and a json parsed version of the project
      response.status(200).json(projects);
    })
    // If there is an error
    .catch((error) => {
      // Return a json'd error
      response.status(500).json({ error });
    });
});

// Same thing as the previous function but now accessing palettes
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  // Use .where() to filter the returned table elements that only have the matching id that comes from the params.
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        // If you cant find a matching return a message
        response.status(404).json({ 
          error: `Could not find palette with project id of ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// Tell express for the post method of the given endpoint do the following
app.post('/api/v1/projects', (request, response) => {
  // Use bodyParser to parse the project object from the request body
  const project = request.body;
  // param validation
  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // Take the project object and insert it into the database 
  database('projects').insert(project, 'id')
    .then(project => {
      // return the generated id
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// Same method as above but for palettes endpoint
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

// Tell express for the delete method of the given endpoint do the following
app.delete('/api/v1/projects/:id/palettes/:id2', (request, response) => {
  // Use bodyParser to parse the id of the palette object from the request body
  const { id2 } = request.params;

  // Use .where() to find the matching palette and .del() it from the database
  database('palettes').where({id: id2}).del()
    .then(palette => {
      response.sendStatus(204)
    })
    .catch(error => {
      response.status(404).json({message:'Could not find matching id'})
    });
});

// Tell app to listen to the given port to run the server
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;