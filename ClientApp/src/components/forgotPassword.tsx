import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface IProps{

}
interface IState {
    email: string;
    newPassword: string;
    repeatPassword: string;
    codeConfirm: string;
    showPasRepeatErr: boolean;
    showPasRepeatErr2: boolean;
    showSuccessResetPass: boolean;
    showDivResetPass: boolean;
    loadingSendBtn: boolean;
    loadingSaveBtn: boolean;
    showMsgForSendBtn: boolean;
}   
class forgotPassword extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {
            email:"",
            newPassword: "",
            repeatPassword: "",
            codeConfirm: "",
            showPasRepeatErr: false,
            showPasRepeatErr2: false,
            showSuccessResetPass: false,
            showDivResetPass: false,
            loadingSendBtn: false,
            loadingSaveBtn: false,
            showMsgForSendBtn: false,

        };
      }

      
    componentDidMount(){
    }

    submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault(); 
        this.setState({loadingSendBtn: true})   
        axios({
            method: 'post',
            url: `api/forgotPass/SendMsg`,
            params:{emailToRecover: this.state.email}
        })            
        .then( (response) => {
           if(response.status === 200){               
            this.setState({showDivResetPass: true, loadingSendBtn: false, showMsgForSendBtn: true});
           }     
           else{         
               this.setState({loadingSendBtn: false})          
           }           
        })
        .catch( () => {
            this.setState({loadingSendBtn: false})   
        }); 
    }

    submitResetPassword(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault(); 
        if(this.state.newPassword === this.state.repeatPassword){
            this.setState({showPasRepeatErr: false});

            if(this.state.newPassword.length >= 8){
                this.setState({showPasRepeatErr2: false})
                this.setState({loadingSaveBtn: true});
                axios({
                    method: 'post',
                    url: `api/forgotPass/ResetPassword`,
                    params:{codeConfirm: this.state.codeConfirm, newPassword: this.state.newPassword}
                })            
                .then( (response) => {
                if(response.status === 200){               
                    this.setState({newPassword: "", repeatPassword: "", codeConfirm: "", showSuccessResetPass: true, loadingSaveBtn: false})
                }else{
                    this.setState({loadingSaveBtn: false})
                }        
                })
                .catch( () => {
                    this.setState({loadingSaveBtn: false})
                }); 
            }else{
                this.setState({showPasRepeatErr2: true})
            }
        }
        else{
            this.setState({showPasRepeatErr: true})
        }
    }

    public render() {
        return (
         
            <div className="container">
            <h1 className="card-title font-weight-lighter container">Forgot Password</h1>                
            <hr />
            

            {this.state.showSuccessResetPass? 
            <div className="row mt-5">
                <h3 className="text-success col-md-10">The password was set successfully. You can now return to login page.</h3>
                <Link to="/" className="col-md-1 btn btn-secondary ml-2">Login</Link>
            </div> 
            :
            <div>
                <form onSubmit={e => this.submit(e)}>                    
                <div className="row mt-5 ml-5 mr-5">
                    {this.state.showMsgForSendBtn? 
                    <p className="text-success mt-2 col-md-12">Confirm code sent successfully, please check your inbox or spam folder to see the confirmation code on your email.</p> 
                     : 
                    ""
                    }
                    <div className="col-md-5">
                        <label className="form-check-label">Enter 'Email' or 'User Name'</label>
                        <input autoFocus className="form-control" type="text" name="email" value={this.state.email} onChange={e => this.setState({email:e.target.value})} />
                    </div>
                    <div className="col-md-7">
                        <button className="btn btn-light float-right mt-3 pl-4 pr-4" onClick={() => this.setState({showDivResetPass: !this.state.showDivResetPass})}>I have the code</button>                            
                        {this.state.loadingSendBtn?                            
                        <button className="btn btn-primary float-right mt-3 pl-4 pr-4 mr-4"><span className="spinner-border"></span></button>
                        :
                        <button type="submit" className="btn btn-primary float-right mt-3 pl-4 pr-4 mr-4">Send</button>
                        }
                        
                    </div>
                </div>
                </form>
                {this.state.showDivResetPass?
                <div className="pt-5">                    
                    <hr />
                    <form onSubmit={e => this.submitResetPassword(e)}>                    
                    <div className="row mt-5 ml-5 mr-5">
                        {this.state.showPasRepeatErr2?
                        <p className="text-danger mt-2 col-md-12">Passwords must be at least 8 characters.</p> 
                        :""}
                        {this.state.showPasRepeatErr? 
                        <p className="text-danger mt-2 col-md-12">Repeated password is not the same as new password</p> 
                        :""}
                        <div className="col-md-3">
                            <label className="form-check-label">Confirm Code</label>
                            <input autoFocus className="form-control" type="text" name="codeConfirm" value={this.state.codeConfirm} onChange={e => this.setState({codeConfirm:e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-check-label">New Password</label>
                            <input className="form-control" type="password" placeholder="Password" name="newPassword" value={this.state.newPassword} onChange={e => this.setState({newPassword:e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-check-label">Repeat New Password</label>
                            <input className="form-control" type="password" placeholder="Repeat Password" name="repeatPassword" value={this.state.repeatPassword} onChange={e => this.setState({repeatPassword:e.target.value})} />
                        </div>
                        <div className="col-md-3">
                            {this.state.loadingSaveBtn? 
                            <button className="btn btn-primary float-right mt-3 pl-4 pr-4"><span className="spinner-border"></span></button>
                            :
                            <button type="submit" className="btn btn-primary float-right mt-3 pl-4 pr-4">Save</button>
                            }
                        </div>
                    </div>
                    </form>
                </div>:""}
            </div>}

            </div>
        );
    }
};

export default forgotPassword;
