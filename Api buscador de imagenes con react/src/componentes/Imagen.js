import react from 'react';
const Imagen = (props) => {

        const {largeImageURL, likes, previewURL, tags, views} = props.imagen;

        return (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 row justify-content-center">
                        <div className="card: height: 100px width: 100px">
                            <img src={previewURL} alt={tags} className="card-img-top  "/>
                            <div className='card-body '>
                                <p className='card-text row justify-content-center img-block'>{likes} Me gusta</p>
                                <p className='card-text row justify-content-center'>{views} Vistas</p>

                                <a href={largeImageURL} target="_blank"
                                 className='btn btn-primary btn-block '> Ver imagen </a>
                            </div>
                        </div>
                    </div>

          );
}

export default Imagen;