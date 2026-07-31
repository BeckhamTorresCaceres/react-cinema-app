

export interface IProps {
    id: string | number ;
    imagen: string;
    puntuacion: number;
    titulo: string;
    anio: number;
    genero: string;
    director: string;
    duracion: number;
    descripcion: string;
}


export interface MovieProps {
    movieP: IProps
}
 
