import * as React from 'react';
import MoneyPNG from "../../../images/MoneyPNG.png";
import axios from 'axios';


interface IProps{

}
interface IState {
    dataForMonth: StatisticsItem[];
    showStatistic: boolean;
}   

interface StatisticsItem {    
    month: string;
    sum: string;
    id: number;
}


class Company extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {
            dataForMonth:[],
            showStatistic: false,
        };
      }
      componentDidUpdate(){
      }

    componentDidMount(){
        axios.get(`api/Management/GetCompanyStatistics`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({dataForMonth: response.data, showStatistic: true});
        }
        })
        .catch(); 
    }  
    public render(){
        return(
            <div className="container">
                <h1 className="card-title font-weight-lighter container">Statistics</h1>
                
                <hr />
                <br />
                <p className="text-info">On this page, is the total amount of products sold, collected for each month. You can stop this from appearing on the <u>configuration</u> page. <br />
                Remember sometimes when the internet is not stable and the order is submitted, as a result this total presented here will be less than the real total actually.</p>
                <br />
                <div className="row text-center">
                    {this.state.showStatistic?
                    this.state.dataForMonth.map(item => (
                        <div key={item.id} className="col-md-2 shadow-lg p-3 mb-5 bg-white rounded">
                            <p className="text-secondary">{item.month}<br /> <b className="text-primary">{item.sum} </b> 
                            <img src={MoneyPNG} alt="Valute" width="25px" height="20px" /></p>
                        </div>  
                        ))
                    :
                    <div className="ml-5">
                        <div className="spinner-grow text-primary" >
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-secondary" >
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success" >
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> 
                    }   
                </div>
                
                <hr />
            </div>
        )
    }
}
export default Company;
