import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import axios from "axios";
import { Link } from 'react-router-dom';

//import DatePicker from "react-datepicker/dist/react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";


type RegisterProps =
    RouteComponentProps<{}>;

  
    
    
    interface IState {
        NameOfStore?:string;
        UserName?:string;
        Email?:string;
        Password?:string;
        ConfirmPassword?:string;
        FirstName?:string;
        LastName?:string;
        NrPersonal?:number;
        Mosha?:number;
        Gjinia?:string;
        DataLindjes?:Date;
        Nacionaliteti?:string;
        Loading?: boolean;
        ShowCredMsg?:boolean;
        ErrorsMsg:[];
        showPassRepeatedMsg: boolean;
        showSuccessRegistration: boolean;
    }
    

class Counter extends React.PureComponent<RegisterProps, IState | any> {

    constructor(props: any) {
        super(props);
    
        this.state = {
            NameOfStore:'',
            UserName:'',
            Email: '',
            Password: '',
            ConfirmPassword: '',
            FirstName: '',
            LastName: '',
            NrPersonal: 0,
            Mosha: 0,
            Gjinia: '',
            DataLindjes: new Date(),
            Nacionaliteti: '',
            Loading: false,
            ShowCredMsg: false,
            ErrorsMsg:[],
            showPassRepeatedMsg: false,
            showSuccessRegistration: false,
            
        };
      }    

    change(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
          [e.target.name]: e.target.value
        });
      }
    changePASS(e: React.ChangeEvent<HTMLInputElement>) {
        if(this.state.showPassRepeatedMsg === true){            
            this.setState({showPassRepeatedMsg: false})
        }
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
      submit(e: React.FormEvent<HTMLFormElement>): void  {
        e.preventDefault(); 
        if(this.state.Password === this.state.ConfirmPassword){  
            this.setState({Loading: true});

            axios.post(`api/identity/register`, {
                NameOfStore: this.state.NameOfStore,
                UserName: this.state.UserName,
                Email: this.state.Email,
                Password: this.state.Password,
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                Gjinia: this.state.Gjinia,
                Nacionaliteti: this.state.Nacionaliteti,            
            
            },{
                params:{
                    NrPersonal: this.state.NrPersonal,
                    Mosha: this.state.Mosha,
                    DataLindjes: this.state.DataLindjes,
                }
            })
            .then( (response) => {
                if(response.status === 200){
                    this.setState({NameOfStore:'',
                                    UserName:'',
                                    Email: '',
                                    Password: '',
                                    ConfirmPassword: '',
                                    FirstName: '',
                                    LastName: '',
                                    NrPersonal: 0,
                                    Mosha: 0,
                                    Gjinia: '',
                                    DataLindjes: new Date(),
                                    Nacionaliteti: '',
                                    Loading: false,
                                    ShowCredMsg: false,
                                    ErrorsMsg:[],
                                    showPassRepeatedMsg: false,
                                    showSuccessRegistration: true})
                }else{
                    this.setState({Loading: false, ShowCredMsg: true});        
                }
            })
            .catch( (e) => { 
                this.setState({ErrorsMsg: e.response.data, Loading: false, ShowCredMsg: true});
            }); 
            //window.location.reload(false);  
        }else{
            this.setState({showPassRepeatedMsg: true})
        }
        
    
      }

      handleBirthday = (date: Date) => {
        this.setState({
          DataLindjes: date
        });
      };

    public render() {
        return (
            <React.Fragment>
                <h1 className="card-title font-weight-lighter">Register</h1>
                {
                this.state.ShowCredMsg ? 
                <div>
                     {this.state.ErrorsMsg.map((item: any) => (                 
                        <p key={this.state.ErrorsMsg.indexOf(item)} className="text-danger">{item.description}</p>
                    ))}
                </div>
                :
                ""
                }
            <div className="col-md-12" >
                <form onSubmit={e => this.submit(e)} className="form-group">                    
                    <div className="form-group row border rounded-lg p-2 col-md-8">
                        <div className="col-md-6">
                            <label className="form-check-label">User Name <b className="text-danger">*</b></label>
                            <input className="form-control" type="text" name="UserName" value={this.state.UserName} onChange={e => this.change(e)} />                       
                        </div>
                        <div className="col-md-6">
                            <label className="form-check-label">Email <b className="text-danger">*</b></label>
                            <input className="form-control" placeholder="name@example.com" type="text" name="Email" value={this.state.Email} onChange={e => this.change(e)} />
                        </div>                 
                    </div>
                    <div className="form-group row border rounded-lg p-2 col-md-8">
                        {this.state.showPassRepeatedMsg? 
                        <p className="text-danger col-md-12">Repeated password is not the same as Password. And Passwords must be at least 8 characters.</p>  
                        :
                        ""}                
                        <div className="col-md-6">
                            <label className="form-check-label">Password <b className="text-danger">*</b></label>
                            <input className="form-control" type="password" name="Password" value={this.state.Password} onChange={e => this.changePASS(e)} />                       
                        </div>
                        <div className="col-md-6">
                            <label className="form-check-label">Confirm Password <b className="text-danger">*</b></label>
                            <input className="form-control" type="password" name="ConfirmPassword" value={this.state.ConfirmPassword} onChange={e => this.changePASS(e)} />
                        </div>
                    </div>
                    <div className="form-group row border rounded-lg p-2 col-md-8">            
                        <div className="col-md-6">
                            <label className="form-check-label">Name of store</label>
                            <input className="form-control" type="text" name="NameOfStore" value={this.state.NameOfStore} onChange={e => this.change(e)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-check-label">Gender:</label>
                            <div className="form-block-input align-bottom col">
                                <input className="inline-block mx-2" type="radio" value="Male" name="Gjinia" onChange={e => this.change(e)} />Male
                                <input className="inline-block mx-2" type="radio" value="Female" name="Gjinia" onChange={e => this.change(e)} />Female
                                <input className="inline-block mx-2" type="radio" value="Other" name="Gjinia" onChange={e => this.change(e)} />Other
                            </div>
                        </div>
                    </div>
                    <div className="form-group row border rounded-lg p-2 col-md-8">                         
                        <div className="col-md-6">
                            <label className="form-check-label">First Name</label>
                            <input className="form-control" type="text" name="FirstName" value={this.state.FirstName} onChange={e => this.change(e)} />                        
                        </div>                            
                        <div className="col-md-6">
                            <label className="form-check-label">Last Name</label>
                            <input className="form-control" type="text" name="LastName" value={this.state.LastName} onChange={e => this.change(e)} />                      
                        </div>
                    
                    
                        <div className="col-md-6">
                            <label className="form-check-label">Age</label>
                            <input className="form-control" type="Number" name="Mosha" value={this.state.Mosha} onChange={e => this.change(e)} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-check-label">Personal Number</label>
                            <input className="form-control" type="Number" name="NrPersonal" value={this.state.NrPersonal} onChange={e => this.change(e)} />
                        </div>                        
                    </div>
                    <div className="form-group row border rounded-lg p-2 col-md-8">
                        <div className="col-md-6">
                            <label className="form-check-label">Birthday</label>
                            <input className="form-control" type="Date" name="DataLindjes" value={this.state.DataLindjes} onChange={e => this.change(e)} />

                        </div>
                        <div className="col-md-6">
                            <label className="form-check-label">Nacionality</label>
                            <input className="form-control" type="text" name="Nacionaliteti" value={this.state.Nacionaliteti} onChange={e => this.change(e)} /> 
                        </div>                   
                    </div>
                    <div className="row">
                    {
                      this.state.Loading ?
                      <button className="btn btn-primary btn-lg disabled" disabled>
                      <span className="spinner-border"></span>
                       </button>
                      :                
                    <button className="btn btn-primary btn-lg disabled" type="submit">Register</button>     
                    }
                    {this.state.showSuccessRegistration? 
                    <h4 className="text-success ml-5 mt-2">Successfully registered. <span className="text-muted">You can now go <Link to="/login" className="btn-link">to login</Link></span></h4>
                    :""}
                    
                    </div>
                </form>
            </div>
            <br />
            <hr />
            
            </React.Fragment>
        );
    }
};

export default connect()(Counter);