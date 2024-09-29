import * as React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import IconProfile from "../../images/profileIcon.png";
import IconeHome from "../../images/Home-01-512ICONE.png";
import Axios from 'axios';

interface IState {
    ProfileDropdown: boolean;
    textForExpirationDate: boolean;
}   

class MProfile extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props);
    
        this.state = {
            ProfileDropdown: false,
            textForExpirationDate: false,
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
            
            if(difference <= 0.2){
                this.setState({textForExpirationDate: true});                
            }
        }
        })
        .catch();
    }

    profileClick(){
        this.setState({ProfileDropdown: !this.state.ProfileDropdown})
    }

    logOutCLick(){
        this.setState({ProfileDropdown: false})
        axios.get(`api/identity/logout`, {
        })
        .then((response) => {
            if(response.status === 200){
              window.location.reload();
            }
        })
        .catch(); 
    }

    public render() {
        return (
            <div className="container-fluid">                
                
                <Link  to="/">            
                <img className="m-2 rounded-lg inline-block shadow p-1 mb-2 bg-white rounded btn" alt="icon" src={IconeHome} height="55px" width="55px"></img></Link> 
                
                
                <img className="float-right m-2 rounded-lg shadow p-1 mb-2 bg-white rounded btn" alt="icon" src={IconProfile} height="55px" width="55px" onClick={e => this.profileClick()} ></img>
                {this.state.textForExpirationDate? 
                <span className="text-danger ml-4">Please make the payment, necessarily before the expiration date.</span>
                :""}
                {this.state.ProfileDropdown ? 
                <span>
                    <div className="menu float-right dropdown-menu-right text-center inline-block shadow p-3 mt-2 mb-5 bg-white rounded">
                        <Link to="/Profile" className="dropdown-item rounded-lg text-primary border" onClick={() => (this.setState({ProfileDropdown: false}))}>Profile</Link>
                        <Link to="/Products" className="dropdown-item rounded-lg text-info border mt-1" onClick={() => (this.setState({ProfileDropdown: false}))}>Products</Link>
                        <button className="dropdown-item rounded-lg text-muted border mt-1" onClick={e => this.logOutCLick()} >Log Out</button>
                        
                    </div>
                    <div className="row" style={{height:"127px"}}></div>
                </span>
                :""}

                
                    

               
            </div>
        );
    }
};

export default MProfile;

