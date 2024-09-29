import * as React from 'react';
import axios from 'axios';
import SortIcone from "../../../images/sortIcone.png";
import { Link } from 'react-router-dom';

interface IProps{

}
interface IState {
    ListOfWorkers: WorkersItem [];
    LoadingTableOfWorkers: boolean;
    Role: string;    
    anotherRole: string;
    FirstName: string;
    LastName:string;
    UserName: string;
    Email: string;
    PersonalNumber: number;
    showEditRole: boolean;
    LoagindEditRoleBtn: boolean;
}   

interface WorkersItem {
    userName: string;
    email: string;
    nacionality: string;
    firstName: string;
    lastName:string;
    role:string;
    personalNumber: number;
    age:number;
    birthdary: Date;
    nr: number;
    phoneNumber: string;
}


class Workers extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {     
            ListOfWorkers:[],
            LoadingTableOfWorkers:true,   
            Role:"",
            anotherRole:"",
            FirstName:"",
            LastName:"",
            UserName:"",
            Email:"",
            PersonalNumber: 0,
            showEditRole: false,
            LoagindEditRoleBtn:false,

        };
      }

    componentDidMount(){
        this.fetchWorkers();
    }

    fetchWorkers(){
    axios.get(`api/Workers/GetWorkers`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({ListOfWorkers: response.data, LoadingTableOfWorkers: false})
        }
        })
        .catch(); 
    }

    
    submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.setState({LoagindEditRoleBtn:true})
        axios.put(`api/Workers/EditRoleWorker`, {
                  email: this.state.Email,
                  role: this.state.Role,          
                })
                .then( (response) => {
                if(response.status === 200){
                    this.setState({showEditRole: false})                    
                    this.fetchWorkers();
                }
                })
                .catch( () => {                   
                }); 
        this.setState({LoagindEditRoleBtn:false})

    }
    
    changeStateRole(e: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({Role: e.target.value})
    }
    editRole(firstName: string, lastName: string, userName: string, email: string, personalNumber: number, role: string): void {
        let setAnotherRole: string;
        if(role === "Worker"){
            setAnotherRole="Manager";
        }
        else{
            setAnotherRole="Worker"
        }
        this.setState({FirstName: firstName,
                       LastName: lastName,
                       UserName:userName,
                       Email:email,
                       PersonalNumber: personalNumber,
                       Role: role,
                       anotherRole: setAnotherRole,
                       showEditRole: true,});
    }

    deleteWorker(email: string) {        
        axios({
            method: 'post',
            url: `api/Workers/DeleteWorkers`,
            params:{workerEmail: email}
        })            
        .then( (response) => {
           if(response.status === 200){
            this.fetchWorkers();  
           }           
        })
        .catch( () => {
        }); 
    }

    async sortMeth(arg0: number): Promise<void> {
        if(arg0 === 1)
        {   
            this.setState({LoadingTableOfWorkers: true})
            await  this.state.ListOfWorkers.sort(function (a: { firstName: any; }, b: { firstName: any; }) {
                return a.firstName.localeCompare(b.firstName);
            });
            this.setState({LoadingTableOfWorkers: false})
        }else if(arg0 === 2)
        {
            this.setState({LoadingTableOfWorkers: true})
            await  this.state.ListOfWorkers.sort(function (a: { userName: any; }, b: { userName: any; }) {
                return a.userName.localeCompare(b.userName);
            });
            this.setState({LoadingTableOfWorkers: false})

        }else if(arg0 === 3)
        {
            this.setState({LoadingTableOfWorkers: true})
            await  this.state.ListOfWorkers.sort(function (a: { role: any; }, b: { role: any; }) {
                return a.role.localeCompare(b.role);
            });
            this.setState({LoadingTableOfWorkers: false})       
            
        }
        else if(arg0 === 4)
        {
            this.setState({LoadingTableOfWorkers: true})
            await  this.state.ListOfWorkers.sort(function (a: { lastName: any; }, b: { lastName: any; }) {
                return a.lastName.localeCompare(b.lastName);
            });
            this.setState({LoadingTableOfWorkers: false})

        }
    }


    public render(){
        return(
            <div className="container-fluid">
                
                <h1 className="font-weight-lighter container">Workers
                <Link to="/AddWorkers" className="btn btn-secondary mt-3 mr-4 float-right">Add new worker</Link></h1>
                <hr />
                <br />

                {this.state.showEditRole?
                <div> 
                <form onSubmit={e => this.submit(e)} className="form-group container">
                    <div className="form-group row border rounded-lg p-2 col-md-12">
                        <div className="col-md-4">
                            <label className="form-check-label">First Name</label>
                            <input disabled className="form-control" type="text" value={this.state.FirstName} />
                        </div>  
                        <div className="col-md-4">
                            <label className="form-check-label">Last Name</label>
                            <input disabled className="form-control" type="text" value={this.state.LastName} />
                        </div> 
                        <div className="col-md-4">
                            <label className="form-check-label">UserName</label>
                            <input disabled className="form-control" type="text" value={this.state.UserName} />
                        </div> 
                        <div className="col-md-4">
                            <label className="form-check-label">Email</label>
                            <input disabled className="form-control" type="text" value={this.state.Email} />
                        </div> 
                        <div className="col-md-4">
                            <label className="form-check-label">Personal Number</label>
                            <input disabled className="form-control" type="text" value={this.state.PersonalNumber} />
                        </div> 
                        <div className="col-md-4">
                        <label className="form-check-label">Role</label>
                            <select autoFocus className="form-control" name="EDkategoria" onChange={e => this.changeStateRole(e)}>
                                <option>{this.state.Role}</option>
                                <option>{this.state.anotherRole}</option>
                            </select>
                        </div>

                    </div> 
                    
                        <div className="row form-group col-md-12">
                            <button onClick={() =>this.setState({showEditRole: false})} className="col-md-2 btn btn-outline-secondary pl-2">Cancel</button> 
                            <div className="col-md-8"></div> 
                            {this.state.LoagindEditRoleBtn ? 
                            <button type="submit" className="col-md-2 btn btn-primary float-right"><span className="spinner-border"></span></button> 
                             :
                             <button type="submit" className="col-md-2 btn btn-primary float-right">Save</button>} 
                            
                            
                        </div>
                        <br />
                </form>
                
                <hr />
                </div>
                :
                ""}


                <table className="table table-striped table-dark text-center table-bordered">
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{cursor:"pointer"}}  onClick={() => this.sortMeth(1)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> First Name</th>
                            <th style={{cursor:"pointer"}}  onClick={() => this.sortMeth(4)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> Last Name</th>
                            <th>Phone Number</th>
                            <th>Nacionality</th>
                            <th>Personal Number</th>
                            <th>Age</th>
                            <th>Birthdary</th>
                            <th style={{cursor:"pointer"}}  onClick={() => this.sortMeth(2)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> UserName</th>
                            <th>Email</th>
                            <th style={{cursor:"pointer"}}  onClick={() => this.sortMeth(3)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.LoadingTableOfWorkers?
                        <tr>
                            <td><div className="spinner-border text-primary ml-2 p-2"></div></td>
                        </tr>
                        :
                        this.state.ListOfWorkers.map(item => (
                        <tr key={item.nr}>
                            <td>{item.nr}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td><b>{item.phoneNumber}</b></td>
                            <td>{item.nacionality}</td>
                            <td>{item.personalNumber}</td>
                            <td>{item.age}</td>
                            <td>{new Intl.DateTimeFormat('en-GB', { 
                                                            month: 'short', 
                                                            day: '2-digit',
                                                            year: 'numeric', 
                                                        }).format(new Date(item.birthdary))}</td>
                            <td>{item.userName}</td>
                            <td>{item.email}</td>
                            <td><b>{item.role}</b></td>
                            <td><button style={{width:"88px"}} onClick={() => this.editRole(item.firstName,
                                                                    item.lastName,
                                                                    item.userName,
                                                                    item.email,
                                                                    item.personalNumber,
                                                                    item.role)} className="btn btn-secondary">Edit Role</button></td>
                            <td><button className="btn btn-danger" onClick={() => {if (window.confirm('Are you sure you want to delete? '+item.firstName+' '+item.lastName+': '+item.userName+' ('+item.email+')?')) this.deleteWorker(item.email)}}>Delete</button></td>
                                                       
                        </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
 
   
}
export default Workers;
