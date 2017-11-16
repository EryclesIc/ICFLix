//Variaveis a serem utilizadas
const express     = require('express');
const bodyParser  = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app         = express();
var port          = process.env.PORT || 3000;
var router        = express.Router();
var mongoose      = require('mongoose');
var Movie         = require('./app/models/movies');//Módulo do movies
var Categories    = require('./app/models/categories');//Módulo do categories
var db;

//Definições necessaŕias para usar o req.body como meio de armazenar dados para posteriormente enviar no banco de dados.
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
//Método router do express
app.use('/', router);
//Conexão com o banco de dados
mongoose.connect('mongodb://erycles:1234@ds149353.mlab.com:49353/bd1808', {useMongoClient: true}, function(err, database) {
  if (err) return console.log(err)
  db = database;
  app.listen(process.env.PORT || 3000, function(){
    console.log('listening on 3000')
  });
  });
//Servidor aberto na variável port
  router.use(function(req, res, next){
  console.log('something is happening...');
  next();
});

app.get('/', (req, res) => {
      res.render('index.ejs');
})

app.get('/categorias.html', (req, res) => {
      res.sendFile('/apirest/views/'+'categoria.html');
})

app.get('/novoFilme', (req, res) => {
    res.render('novoFilme.ejs');
})


//Definição do localhost:3000/movies
router.route('/movies')//Acessa o caminho /movies
    //Cria um novo movie
  .post(function(req, res){
    var movie = new Movie();
    //A variável movie recebe tudo o que for digitado nos campos
    movie.nome       = req.body.nome;
    movie.descricao  = req.body.descricao;
    movie.avaliacao  = req.body.avaliacao;
    movie.quantidade = req.body.quantidade;
    movie.imagem     = req.body.imagem;
    movie.trailer    = req.body.trailer;
    //Salva na variável
    movie.save(function(error){
      if(error){ res.send(error);}
      res.json(movie);
    });
  })
  .get(function(req, res){
    Movie.find( function(err,movie) {
      if(err)
        console.log(err);
        res.json(movie);
    });
  });
  //Procura o movie especificado pelo id
  router.route('/movies/:movie_id')
    .get(function(req, res){
      Movie.findById(req.params.movie_id, function(error, movie){
        if(error)
          res.send(error);
          res.json(movie);
      });
    })
    //Atualiza o movie especificado pelo id
    .put(function(req, res){
      Movie.findById( req.params.movie_id, function(error, movie){
        if(error)
          res.send(error);
          movie.nome       = req.body.nome;
          movie.descricao  = req.body.descricao;
          movie.avaliacao  = req.body.avaliacao;
          movie.quantidade = req.body.quantidade;
          movie.imagem     = req.body.imagem;
          movie.trailer    = req.body.trailer;

        movie.save(function(error, movie){
          if(error)
          console.log(error);
          res.json(movie);
        })
      })
    })
    //Deleta o movie especificado pelo id
    .delete(function(req, res){
      Movie.remove({_id: req.params.movie_id}, function(error){
        if(error)
        console.log(error);
      Categories.update({movies: {$in: [req.params.movie_id]}}, {$pullAll: {movies: [req.params.movie_id]}}, {multi: true}, function(error) {
        if(error)
        console.log(error);
  })
    })
    })




router.route('/categories')

.post(function(req, res){
    var categories = new Categories();
    //A variável categories recebe tudo o que for digitado nos campos
    categories.nome       = req.body.nome;
    categories.exibir  = req.body.exibir;

    //Salva na variável
    categories.save(function(error){
      if(error){ res.send(error);}
      res.json(categories);
    });
})

 .get(function(req, res){
    Categories.find( function(err,categories) {
      if(err)
        console.log(err);
        res.json(categories);
    });
  });


router.route('/categories/:categorie_id')
    .get(function(req, res){
      Categories.findById(req.params.categorie_id, function(error, categories){
        if(error)
          res.send(error);
          res.json(categories);
      });
    })
    //Atualiza o categories especificado pelo id
  .put(function(req, res){
      Categories.findById( req.params.categorie_id, function(error, categories){
        if(error)
          res.send(error);
          categories.nome       = req.body.nome;
          categories.descricao  = req.body.descricao;
          categories.avaliacao  = req.body.avaliacao;
          categories.quantidade = req.body.quantidade;
          categories.imagem     = req.body.imagem;
          categories.trailer    = req.body.trailer;

        categories.save(function(error, categories){
          if(error)
          console.log(error);
          res.json(categories);
        })
      })
    })
    //Deleta o categories especificado pelo id
  .delete(function(req, res){
      Categories.remove({_id: req.params.categorie_id}, function(error){
        if(error)
        console.log(error);
    })

      Movie.update({categoria: {$in: [req.params.categorie_id]}}, {$pullAll: {categoria: [req.params.categorie_id]}}, {multi: true}, function(error) {
        if(error)
        console.log(error);
  })
      res.json("xablau");
    })

  router.route('categories/:categories/movies')
  .get(function(req, res){
  var collection = db.collection('movies');
    collection.find({"categoria": req.params.categoria_id}).toArray(function(error, movies){
      if(error)
          console.log(error);

          res.json(movies);
    })
  });

  router.route('/movies/:movie_id/addCategoria/:categoria_id')
    .put(function(req, res){
        Categories.update({_id: req.params.categoria_id}, {$push:{movies: req.params.movie_id}}, function(error) {
        if(error)
          console.log(error);
    })

    Movie.update({_id: req.params.movie_id}, {$push: {categoria: req.params.categoria_id}}, function(error) {
      if(error)
        console.log(error);
    });

    Movie.findById(req.params.movie_id, function(error, movie){
      if(error)
        console.log(error);

        res.json(movie);

    });
  });

router.route('/movies/:movie_id/categoria')
    .get(function(req, res){
      db.collection('categorias').find({"movies": req.params.movie_id}).toArray(function(error,categorias){
        if(error)
          console.log(error);

          res.json(categorias);
      })
    })

router.route('/movies/:movie_id/removeCategoria/:categoria_id')
    .put(function(req, res){
        Categories.update({_id: req.params.categoria_id}, {$pullAll:{movies: req.params.movie_id}}, function(error) {
        if(error)
          console.log(error);
    })

    Movie.update({_id: req.params.movie_id}, {$pullAll: {categoria: req.params.categoria_id}}, function(error) {
      if(error)
        console.log(error);
    });

    Movie.findById(req.params.movie_id, function(error, movie){
      if(error)
        console.log(error);

        res.json(movie);

    });
  });