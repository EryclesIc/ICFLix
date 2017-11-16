var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  nome: String,
  avaliacao: Number,
  categoria: [String],
  descricao: String,
  quantidade:Number,
  imagem: String,
  trailer: String
});
module.exports = mongoose.model('Movies', MovieSchema);
