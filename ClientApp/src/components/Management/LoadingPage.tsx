import * as React from 'react';
import { Redirect } from 'react-router';
import axios from "axios";


interface IProps{
}
interface IState {
    LoadingPage: boolean;
    LinkName: string;
}   

class LoagingPage extends React.PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
    
        this.state = {
            LoadingPage: true,
            LinkName: "",
            
        };
      }

    componentDidMount(){
       
        axios.get(`api/Management/Path`, {
        })
        .then((response) => {
            if(response.status === 200){
              this.setState({LinkName: response.data, LoadingPage: false});              
            }else{
                window.location.reload();
            }
        })
        .catch(() => {
            window.location.reload();
        });        
    }  

    public render() {
        return (

            this.state.LoadingPage 
            ?
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
            <Redirect to={this.state.LinkName} push/> 

            
        );
    }
};

export default LoagingPage;


