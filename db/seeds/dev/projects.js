
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
              color1: '#750000', 
              color2: '#ffa000', 
              color3: '#fba010', 
              color4: '#fb0a10', 
              color5: '#ba0410',
              project_id: project[0]
            },
            { 
              name: 'Palette 2', 
              color1: '#755aa0', 
              color2: '#fbaa00', 
              color3: '#fd0110', 
              color4: '#ffba10', 
              color5: '#bf4410',
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