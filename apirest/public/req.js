var filmes = Array;
var id= Array;

function puxar(){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:3000/movies', true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			filmes = JSON.parse(this.responseText);
			html();
		}
	}
	req.send();
}
function html()
{
	var aux = "<div id='info'> <table>";
	aux += "<div id= 'movie'><h1>Filmes Cadastrados</h1>"
	+"<a href='/novoFilme'><b> Novo Filme</b></a></div>";
	aux += "<tr><td id = 'nome'class='tab' align='center'><b>Nome</b></td><td id = 'avaliac' class='tab' align='center'><b>Avaliação</b></td><td id = 'ac'class='tab' align='center'><b>Ações</b></td></tr>";

	for(var i = 0; i < filmes.length; i++)
	{
		id[i] = filmes[i]._id;
		aux+="<td class='tab' align='center'><figure><img id='foto' onclick='filmes_i("+i+")' src= '"+filmes[i].imagem+"'><figcaption><b>"+filmes[i].nome+"</b></figcaption></figure></td>";
		aux+="<td id= 'aval' class='tab' align='center'>";

		for(var ii = 0; ii < filmes[i].avaliacao; ++ii)
		{
			aux+= "<img src='estrela.png' title='Avaliação'>";
		}

		aux += '</td><td id="acoes" align="center">\
		<button type = "button" onclick = "busca_id('+i+')">Editar</button>\
		<button type = "button" onclick= "deletar_filme('+i+')">Excluir</button>\</td></tr>\
		';

	}

	aux += "</table></div>";
	document.getElementById("mod").innerHTML = aux;
}

function filmes_i(i){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:3000/movies/'+id[i], true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			filmes = JSON.parse(this.responseText);
			carregar_f(i);
		}
	}
	req.send();
}

function carregar_f(i){

	var trailer = filmes.trailer.replace("watch?v=", "embed/");

	var aux = '';
	aux += '<div id="fundo">\
	<img src="' + filmes.imagem + '" id="foto1">\
	Nome: ' + filmes.nome + '</br>\
	Avaliação: ' + filmes.avaliacao + '</br>\
	Descrição: ' + filmes.descricao + '</br>\
	Categoria:<span id = "categorias"></span></br> \
	<iframe width="560" height="315" src="' + trailer + '" frameborder="0" allowfullscreen></iframe>\
	</div>';
	mostrar_cat();

	document.getElementById("mod").innerHTML = aux;
}

function mostrar_cat(){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:3000/movies/'+filmes._id+'/categoria', true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			filmes = JSON.parse(this.responseText);
			mostrar_cat2(filmes);

		}
	}
	req.send();
}

function mostrar_cat2(categoria) {
	var p = document.getElementById("categorias");
	var aux = '';
	for(var i = 0; i < categoria.length; i++){
		if(i == categoria.length -1){
			aux+= "<i>"+categoria[i].nome+"</i>";
		}
		else {
			aux+= "<i>"+categoria[i].nome+",</i>";
		}
	}

	p.innerHTML = aux;
}

function adc_filme(){
	var aux;
	aux = document.forms.namedItem("form");

	var req = new XMLHttpRequest();
	req.open('POST', 'http://localhost:3000/movies/', true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			puxar();
		}
	}
	req.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
	req.send("nome="+aux.nome.value+"&avaliacao="+aux.avaliacao.value+"&quantidade="+aux.quantidade.value+"&imagem="+aux.imagem.value+"&trailer="+aux.trailer.value+"&descricao="+aux.descricao.value);
}


function busca_id(i){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:3000/movies/'+id[i], true);
		req.onload = function(){
			if(this.status == 200 && this.readyState == 4){
				cria_form_edit(i,JSON.parse(this.responseText));
		}
	}
	req.send();
}

function cria_form_edit(i,req){
	var aux = "<div id='mod1'>\
        <div id='form3'>\
        <center>\
          <form id='form2'></br></br>\
          <input type='text' name='nome' placeholder='Nome' value = '"+req.nome+"'></input></br></br>\
          <input type='text' name='avaliacao' placeholder='Avaliação' value = '"+req.avaliacao+"'></input></br></br>\
          <input type='text' name='quantidade' placeholder='Quantidade de Avaliações' value = '"+req.quantidade+"'></input></br></br>\
          <input type='text' name='imagem' placeholder='Imagem' value = '"+req.imagem+"'></input></br></br>\
          <input type='text' name='trailer' placeholder='Trailer' value = '"+req.trailer+"'></input></br></br>\
          <textarea type='text' name='descricao' placeholder='Descrição' rows='10' cols='40'>"+req.descricao+"</textarea></br></br>\
          <button id='bot' onclick='atualiza_filme("+i+")'>Finalizar Edição</button></br></br>\
          </form>\
          </center>\
        </div>\
      </div>";
      document.getElementById("mod").innerHTML = aux;

}

function atualiza_filme(i){
	var aux = document.forms.namedItem("form2");

	var req = new XMLHttpRequest();
	req.open("PUT", 'http://localhost:3000/movies/'+id[i], true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			puxar();
		}
	}
	req.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
	req.send("nome="+aux.nome.value+"&avaliacao="+aux.avaliacao.value+"&quantidade="+aux.quantidade.value+"&imagem="+aux.imagem.value+"&trailer="+aux.trailer.value+"&descricao="+aux.descricao.value);
}

function deletar_filme(i){
	var req = new XMLHttpRequest();
	req.open("DELETE", 'http://localhost:3000/movies/'+id[i], true);
	req.onload = function(){
		if(this.status == 200 && this.readyState == 4){
			puxar();
		}
		else
		{
			console.log("Xablau");
		}
	}
	req.send();
}