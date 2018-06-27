
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'Project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              name: 'Palette 1', 
              color1: '#75000', 
              color2: '#ffa00', 
              color3: '#fba01', 
              color4: '#fb0a1', 
              color5: '#ba041',
              project_id: project[0]
            },
            { 
              name: 'Palette 2', 
              color1: '#755aa', 
              color2: '#fbaa0', 
              color3: '#fd011', 
              color4: '#ffba1', 
              color5: '#bf441',
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding Complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};