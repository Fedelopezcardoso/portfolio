import React from 'react';
import react, { Component } from 'react';
import Imagen from './Imagen'
import Paginacion from './Paginacion'

class resultado extends Component {
       mostrarImagenes = () => {

        const imagenes = this.props.imagenes;

        if(imagenes.length === 0) return null;

        return (
            <react.Fragment>
                <div className="col-12 p-5 row">    

                {imagenes.map(imagen =>(
                    <Imagen
                        key={imagen.id}
                        imagen={imagen}

                    />
                ))}

                </div>

                <Paginacion
                paginaAnterior={this.props.paginaAnterior}
                paginaSiguiente={this.props.paginaSiguiente}
                />

            </react.Fragment>
        )
        console.log(imagenes);

       }
        render(){
            return (
                <React.Fragment>
                {this.mostrarImagenes() }
                </React.Fragment>
            );
        }


}

export default resultado;