import * as React from 'react';
import axios from 'axios';


interface IProps{

}
interface IState {
    informations: [];
    Loading: boolean;
}   
class Info extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);
    
        this.state = {            
         informations: [],
         Loading: true
        };
      }

    componentDidMount(){
        this.fetchInfo();
    }


    fetchInfo(){
        axios.get(`api/GetInfo`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({informations: response.data, Loading: false})
        }
        })
        .catch(); 
    }

    public render() {
        return (
            <div className="container">
            <h1 className="card-title font-weight-lighter container text-center">Info</h1>                
            <hr />
            {this.state.Loading? 
             <div className="carousel-caption">
                <div className="spinner-grow text-primary" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-secondary" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-success" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-danger">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-warning" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-info" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-dark" >
                    <span className="sr-only">Loading...</span>
                </div>
            </div> 
            :
            this.state.informations.map((item: any)=> (
                <div key={item.id}>
                    <h4 className="text-info font-weight-lighter ml-2 mr-2">{item.titulli}</h4>
                    <p className="text-secondary text-justify ml-2 mr-2">{item.shkrimi}</p>
                    <br />
                    <hr />
                    <br />
                </div>
            ))
            }
               
            </div>
        );
    }
};

export default Info;
