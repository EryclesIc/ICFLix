var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriaSchema = new Schema({
	nome: String,
	exibir: Boolean,
	movies: Array
});

module.exports = mongoose.model('Categoria', CategoriaSchema);