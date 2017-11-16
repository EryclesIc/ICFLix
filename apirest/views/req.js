var filmes;


function puxar(){
	var req = new XMLHttpRequest();
	req.open('GET', 'http://localhost:3000/movies', true);
	req.onload = function(){
		if(this.state == 4 && this.readyState == 200){
			filmes = JSON.parse(this.responseText);
			html();
		}
	}
	req.send();
}
function html()
{
	var aux = "<table>";
	for(var i = 0; i < filmes.length; i++)
	{
		aux+="<tr><td>"+filmes[i].nome+"</td></tr>";
	}
	document.getElementById("mod").innerHTML = aux;
}