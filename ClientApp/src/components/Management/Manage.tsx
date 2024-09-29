import * as React from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';

interface IState {
    ManageGridLoad:boolean;
    expTextAlert: boolean;
    expDate: string;
}    

class Manage extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props);
    
        this.state = {
            ManageGridLoad: true,
            expTextAlert: false,
            expDate: "",
        };
      }
      componentDidMount(){
        Axios.get(`api/Management/GetExpirationData`)
        .then( (response) => {
        if(response.status === 200){          

            //check if it's one month before expiration date
            let dataMbarimit = new Date(response.data)
            let now = new Date();
            let diff =(dataMbarimit.getTime() - now.getTime()) / 1000;
            diff /= (60 * 60 * 24 * 7 * 4);
            let difference =Number.parseFloat(diff.toFixed(1));
            
            let dateStr = dataMbarimit.toLocaleString()

            if(difference <= 1.1){
                this.setState({expTextAlert: true, expDate: dateStr})            
            }
        }
        })
        .catch();

        this.checkDeadline();
      }

        checkDeadline() {
            Axios.put(`api/Check/SeeDeadline`)
            .then()
            .catch();
        }
        

      sellAndManageButtons () {
        const divStyle: React.CSSProperties = {
            height: "250px",
            textAlign:"center",
            fontFamily:"courier,arial,helvetica, sans-serif",
            paddingTop:"95px",
            marginTop:"5px",
          };
          return(
            <div>
                <div className="flex-fill row-cols-3 row" style={{ height:"130px"}}></div>                           
                <div className="d-flex justify-content-center col-md-12 row">            
                <div className="col-md-1"></div>
                <Link className="col-md-4 text-white btn btn-secondary rounded" style={divStyle} to="/Store">                
                    <h1>Sell Page</h1>
                </Link>                
                <div className="col-md-2"></div>
                <div className="col-md-4 text-white btn btn-secondary rounded" onClick={() => this.manageClick()} style={divStyle}> 
                    <h1>Manage</h1>
                </div>
                <div className="col-md-1"></div>                  
                </div>
            </div>
          );
      }

      otherButtons () {
        const divStyle: React.CSSProperties = {
            height: "130px",
            textAlign:"center",
            fontFamily:"courier,arial,helvetica, sans-serif",
            padding:"5px",
            marginTop:"50px",
          }; 
          return(
            <div>
            <div className="flex-fill row-cols-3 row" style={{ height:"20px"}}></div>                           
            <div className="d-flex justify-content-center col-md-12 row">                    
                <NavLink tag={Link} className="col-md-3 rounded-left bg-secondary text-white shadow p-3" style={divStyle} to="/Products">                
                    <h1>See Products</h1>
                </NavLink>  
                <div className="col-md-1"></div> 
                <NavLink tag={Link} className="col-md-3 bg-secondary text-white shadow p-3" style={divStyle} to="/AddProducts">                
                    <h1>Add Products</h1>
                </NavLink>              
                <div className="col-md-1"></div> 
                <NavLink tag={Link} className="col-md-3 rounded-right bg-secondary text-white shadow p-3" style={divStyle} to="/AddWorkers">                
                    <h1>Add new Workers</h1>
                </NavLink>                                   
            </div>
            <div className="d-flex justify-content-center col-md-12 row mt-2">  
                <NavLink tag={Link} className="col-md-3 rounded-left bg-secondary text-white shadow p-3" style={divStyle} to="/Company">                
                    <h1>Company, others</h1>
                </NavLink> 
                <div className="col-md-1"></div> 
                <NavLink tag={Link} className="col-md-3 bg-secondary text-white shadow p-3" style={divStyle} to="/Statistics">                
                    <br /><h1>Statistics</h1>
                </NavLink>             
                <div className="col-md-1"></div> 
                <NavLink tag={Link} className="col-md-3 rounded-right bg-secondary text-white shadow p-3" style={divStyle} to="/Workers">                
                    <br /><h1>Workers</h1>
                </NavLink>                                   
            </div>
        </div>  
          );
      }

      manageClick () {
          this.setState({ManageGridLoad: !this.state.ManageGridLoad})
      }
    
    public render() {
              
        return (            
            <div className="container">
                {this.state.expTextAlert? 
                <p className="text-info p-2 shadow-sm text-center">
                You are in the last month of being able to use this app, please make the payment to continue for another year.
                <br />Now you can make the payment according to regulation. You must do it before {this.state.expDate}</p>
                :""}
                {this.state.ManageGridLoad ? 
                <div>                            
                 {this.sellAndManageButtons()}
                </div>
                 :
                <div>
                 {this.otherButtons()}
                </div>
                }               
            </div>        
        );
    }
};

export default Manage;

