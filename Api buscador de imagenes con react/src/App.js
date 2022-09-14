import react, { Component } from 'react'
import Buscador from './componentes/Buscador';
import Resultado from './componentes/Resultado';
import Imagen from './componentes/Imagen';
class app extends Component {


state = {
  termino : '',
  imagenes : [],
  pagina: ''
}

paginaAnterior = () => {
 // leer el state de l pagina actual
 let pagina =this.state.pagina;
// leer si la pagina es 1, ya no ir hacia atras
if(pagina === 1) return null;

// Sumar uno a la pagina actual
pagina -= 1;
// agregar el cambio al state
this.setState({
  pagina
}, ()=>{
  this.consultarApi()
});

console.log(pagina);

}
paginaSiguiente = () => {
 // leer el state de l pagina actual
 let pagina =this.state.pagina;
// Sumar uno a la pagina actual
pagina += 1;
// agregar el cambio al state
this.setState({
  pagina
}, ()=>{
  this.consultarApi()
});

console.log(pagina);

}


consultarApi = () => {
  const termino = this.state.termino;
  const pagina = this.state.pagina;
  const url = `https://pixabay.com/api/?key=29931658-4edae4275cd9932541c65bded&q=${termino}&per_page=30&image_type=photo&page=${pagina}`;


  
  //console.log(url);
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => this.setState({ imagenes : resultado.hits})  )
}

datosBusqueda = (termino) => {
 this.setState({
  termino : termino,
  pagina : 1
 },() => {
  this.consultarApi();
 })
}

  render () {
  
     return (
    <div className="app container">
       <div className='jumbotron'>
        <p className="lead text-center"> Buscador de imágenes Por fechu </p>
         <Buscador
           datosBusqueda={this.datosBusqueda}
         />
      </div>
      
      <div className='row justify-content-center'>
      <Resultado

imagenes={this.state.imagenes}
paginaAnterior={this.paginaAnterior}
paginaSiguiente={this.paginaSiguiente}

/>
      </div>
      
    </div>
   );
 }
}

export default app;

