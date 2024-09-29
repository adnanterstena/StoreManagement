import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface IProps{

}
interface IState {
    
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
    Role?:string;
    Loading?: boolean;
    ShowCredMsg?:boolean;
    showPassRepeatedMsg?: boolean;
    ErrorsMsg: [];
    showAddedSuccessfully: boolean;
}   


class Products extends React.PureComponent<IProps, IState | any> {  
    constructor(props: any) {
        super(props);
    
       
        this.state = {
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
            Role:'Worker',
            Loading: false,
            ShowCredMsg: false,
            showPassRepeatedMsg: false,
            ErrorsMsg:[],
            showAddedSuccessfully: false,
            
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
    _handleChangeSelect(e:React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ Role: e.currentTarget.value }) 
    }
    
    submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();   
        if(this.state.Password === this.state.ConfirmPassword){            
        this.setState({Loading: true});
        axios.post(`api/Workers/RegisterWorker`, {
            UserName: this.state.UserName,
            Email: this.state.Email,
            Password: this.state.Password,
            FirstName: this.state.FirstName,
            LastName: this.state.LastName,
            Gjinia: this.state.Gjinia,
            Role: this.state.Role,
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
                this.setState({
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
                    Role:'Worker',
                    Loading: false,
                    ShowCredMsg: false,
                    showPassRepeatedMsg: false,
                    ErrorsMsg:[],
                    showAddedSuccessfully: true})
            }else{
                this.setState({Loading: false, ShowCredMsg: true});        
            }
        })
        .catch( (e) => {            
            this.setState({ErrorsMsg: e.response.data, Loading: false, ShowCredMsg: true});
        }); 
        }
        else{
            this.setState({showPassRepeatedMsg: true})
        }

    }


    public render(){
        return(
        <div className="container">
        <h1 className="card-title font-weight-lighter container">Add workers
                <Link to="/Workers" className="btn btn-secondary mt-3 mr-1 float-right">See Workers</Link></h1>
        <hr />

        {this.state.ShowCredMsg ? 
        <div>            
            {this.state.ErrorsMsg.map((item: any) => (                 
                <p key={this.state.ErrorsMsg.indexOf(item)} className="text-danger">{item.description}</p>
            ))}
        </div>
        :
        ""
        }
        <p className="text-info">New user in the <u>worker</u> role can only access the SELL PAGE, ADD PRODUCTS and PRODUCTS. <br />
           While they in the role of <u>manager</u> have the same approach as administrator, just can not change the admin user data.</p>
        <form onSubmit={e => this.submit(e)} className="form-group">                    
                <div className="form-group row border rounded-lg p-2 col-md-12">
                    <div className="col-md-4">
                        <label className="form-check-label">User Name <b className="text-danger">*</b></label>
                        <input className="form-control" type="text" name="UserName" value={this.state.UserName} onChange={e => this.change(e)} />                       
                    </div>
                    <div className="col-md-4">
                        <label className="form-check-label">Email <b className="text-danger">*</b></label>
                        <input className="form-control" placeholder="name@example.com" type="text" name="Email" value={this.state.Email} onChange={e => this.change(e)} />
                    </div>    
                    
                    <div className="col-md-4">
                        <label className="form-check-label">Nacionality</label>
                        <input className="form-control" type="text" name="Nacionaliteti" value={this.state.Nacionaliteti} onChange={e => this.change(e)} /> 
                    </div>               
                </div>
                <div className="form-group row border rounded-lg p-2 col-md-12">              
                    {this.state.showPassRepeatedMsg? 
                    <p className="text-danger col-md-12">Repeated password is not the same as password. And Passwords must be at least 8 characters.</p>  
                    :
                    ""}
                    <div className="col-md-4">
                        <label className="form-check-label">Password <b className="text-danger">*</b></label>
                        <input className="form-control" type="password" name="Password" value={this.state.Password} onChange={e => this.changePASS(e)} />                       
                    </div>
                    <div className="col-md-4">
                        <label className="form-check-label">Confirm Password <b className="text-danger">*</b></label>
                        <input className="form-control" type="password" name="ConfirmPassword" value={this.state.ConfirmPassword} onChange={e => this.changePASS(e)} />
                    </div>
                    
                    <div className="col-md-4">
                        <label className="form-check-label">Gender:</label>
                        <div className="form-block-input align-bottom col">
                            <input className="inline-block mx-2" type="radio" value="Male" name="Gjinia" onChange={e => this.change(e)} />Male
                            <input className="inline-block mx-2" type="radio" value="Female" name="Gjinia" onChange={e => this.change(e)} />Female
                            <input className="inline-block mx-2" type="radio" value="Other" name="Gjinia" onChange={e => this.change(e)} />Other
                        </div>
                    </div>
                </div>
                <div className="form-group row border rounded-lg p-2 col-md-12">                         
                    <div className="col-md-4">
                        <label className="form-check-label">First Name</label>
                        <input className="form-control" type="text" name="FirstName" value={this.state.FirstName} onChange={e => this.change(e)} />                        
                    </div>                            
                    <div className="col-md-4">
                        <label className="form-check-label">Last Name</label>
                        <input className="form-control" type="text" name="LastName" value={this.state.LastName} onChange={e => this.change(e)} />                      
                    </div>
                    <div className="col-md-4">
                        <label className="form-check-label">Role <b className="text-danger">*</b></label>
                        <select className="form-control" name="Role" onChange={ e => this._handleChangeSelect(e)}>
                        <option>Worker</option>
                        <option>Manager</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-check-label">Personal Number</label>
                        <input className="form-control" type="Number" name="NrPersonal" value={this.state.NrPersonal} onChange={e => this.change(e)} />
                    </div>  
                    
                    <div className="col-md-4">
                        <label className="form-check-label">Age</label>
                        <input className="form-control" type="Number" name="Mosha" value={this.state.Mosha} onChange={e => this.change(e)} />
                    </div>   
                    <div className="col-md-4">
                        <label className="form-check-label">Birthday</label>
                        <input className="form-control" type="Date" name="DataLindjes" value={this.state.DataLindjes} onChange={e => this.change(e)} />

                    </div>                 
                </div>   
                {
                    this.state.Loading ?
                    <button className="btn btn-primary btn-lg disabled float-right mr-3" disabled>
                    <span className="spinner-border"></span>
                    </button>
                    :                
                <button className="btn btn-primary btn-lg disabled float-right mr-3" type="submit">Add new Worker</button>     
                }
                {this.state.showAddedSuccessfully? 
                <h4 className="text-success float-right mt-2 mr-5">Added successfully.</h4>
                :""}
            </form>
        </div>
        )
    }
}
export default Products;
