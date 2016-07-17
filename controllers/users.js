module.exports = function(router, passport) {
  router.get('/', function(req,res){
    res.render('index.ejs');
  })

  router.get('/:id', function(req,res){
    console.log(req.params.id);
    res.send(req.body);
  });
}


// // get all authors
// router.get('/authors', function(req, res) {
//   Author.findAll({}).then(function(authors) {
//     res.json(authors);
//   });
// });

// // add new author
// router.post('/authors', function(req, res) {
//   Author.create({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName
//   }).then(function(author) {
//     res.json(author);
//     // res.send(true);
//   });
// });

// //show one author
// router.get('/authors/:id', function(req, res) {
//   Author.find({
//     where: {
//       id: req.params.id
//     }
//   }).then(function(author) {
//     res.json(author);
//   });
// });

// // update single author
// router.put('/authors/:id', function(req, res) {
//   Author.find({
//     where: {
//       id: req.params.id
//     }
//   }).then(function(author) {
//     if(author){
//       author.updateAttributes({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName
//       }).then(function(author) {
//         res.send(author);
//       });
//     }
//   });
// });

// // delete a single author
// router.delete('/authors/:id', function(req, res) {
//   Author.destroy({
//     where: {
//       id: req.params.id
//     }
//   }).then(function(author) {
//     res.json(author);
//   });
// });