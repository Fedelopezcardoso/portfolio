import React from "react";

const Paginacion = props => {
    return(
        <div className='py-3  justify-content-center'>
            <button onClick={props.paginaAnterior} type='button' className='btn btn-outline-dark'>Anterior &larr;</button>
            <button  onClick={props.paginaSiguiente} type='button' className='btn btn-outline-light'>Siguiente &rarr;</button>
      
        </div>
    )
}

export default Paginacion;