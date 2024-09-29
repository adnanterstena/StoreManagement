import * as React from 'react';
import axios from 'axios';


interface IProps{

}
interface IState {
    
    //for Profile Date Area ------
    showProfileData?: boolean;
    showInputForProfileData?: boolean;
    LoagindSaveProfileDataBtn?: boolean;    
    userName?: string;
    email?: string;
    nacionality?: string;
    firstName?: string;
    lastName?:string;
    role?:string;
    personalNumber?: number;
    age?:number;
    birthday?: Date;
    phoneNumber?: string;
    //------------------------
    //for password Area ------
    passwordArea?: boolean;
    LoagindSavePasswordBtn?: boolean;
    password?:string;
    newPassword?: string;
    repeatNewPassword?: string;
    showMsgSucces?: boolean;
    showSamePassMsg?: boolean;
    defaultErrorPasswordMsg?: boolean;
    //------------------------
    showChangeEmailOrUserName?: boolean;
    newUserName?: string;
    newEmail?: string;
    loadingChangeUsername?: boolean;
    loadingChangeEmail?: boolean;
    showMsgForChangeEmail?: boolean;
    showSuccesMsnForChangeEMail?: boolean;    
    showMsgForChangeUserName?: boolean;
    showSuccesMsnForChangeUserName?: boolean;
}   
interface ProfileData {
    userName?: string;
    email?: string;
    nacionality?: string;
    firstName?: string;
    lastName?:string;
    role?:string;
    personalNumber?: number;
    age:number;
    birthday: Date|string;
    nr: number;
    phoneNumber?: string;
}
class Profile extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {
            //for profile Data
            showProfileData: false,
            showInputForProfileData: false,
            LoagindSaveProfileDataBtn: false,            
            userName: "",
            email: "",
            nacionality: "",
            firstName: "",
            lastName: "",
            role:"",
            personalNumber:0,
            age:0,
            birthday: new Date(),
            phoneNumber: "",
            //-------------------------
            //for password Area
            passwordArea: false,
            LoagindSavePasswordBtn: false,
            password:"",
            newPassword:"",
            repeatNewPassword:"",
            showMsgSucces: false,
            showSamePassMsg: false,
            defaultErrorPasswordMsg: false,            
            //-------------------------
            showChangeEmailOrUserName: false,
            newUserName:"",
            newEmail:"",
            loadingChangeUsername: false,
            loadingChangeEmail: false,
            showMsgForChangeEmail: false,
            showSuccesMsnForChangeEMail: false,
            showMsgForChangeUserName:false,
            showSuccesMsnForChangeUserName:false,

        };
      }

      
    componentDidMount(){
        this.fetchProfileData();
    }

    //For Profile Data -------------------------------------------------------
    fetchProfileData(){
    axios.get(`api/Profile/GetProfile`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({
                userName: response.data.userName,
                email: response.data.email,
                nacionality: response.data.nacionality,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                role: response.data.role,
                personalNumber: response.data.personalNumber,
                age: response.data.age,
                birthday: response.data.birthdary,
                phoneNumber: response.data.phoneNumber,
                showProfileData: true,
            })
        }
        })
        .catch();
    }    
    submitProfileData(e: React.FormEvent<HTMLFormElement>): void {
            e.preventDefault(); 
            this.setState({LoagindSaveProfileDataBtn: true})           
           
            let data: ProfileData = {
                age:Number(this.state.age),
                birthday: "",
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                nacionality: this.state.nacionality,
                nr: 0,
                personalNumber:Number(this.state.personalNumber),
                phoneNumber:  this.state.phoneNumber,
                role: this.state.role,
                userName: this.state.userName,
            };     
               

            axios({
                method: 'post',
                url: `api/Profile/PostProfileData`,
                data: data,
                params: {birthday: this.state.birthday},
            })            
            .then( (response) => {
               if(response.status === 200){
                this.setState({showInputForProfileData: false, LoagindSaveProfileDataBtn: false})
               }     
               else{                   
                this.setState({LoagindSaveProfileDataBtn: false})
               }           
            })
            .catch();
        

    }
    change(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    private formForProfileData(): React.ReactNode {
        return <form onSubmit={e => this.submitProfileData(e)} className="ml-5">

            <div className="row">
                <div className="col-md-3 m-2 p-2">
                    <label className="form-check-label">First Name</label>
                    <input className="form-control" type="text" name="firstName" value={this.state.firstName} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-3 m-2 p-2">
                    <label className="form-check-label">Last Name</label>
                    <input className="form-control" type="text" name="lastName" value={this.state.lastName} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-1 m-2 p-2">
                    <label className="form-check-label">Age</label>
                    <input className="form-control" type="Number" name="age" value={this.state.age} onChange={e => this.change(e)} />

                </div>
                <div className="col-md-3 m-2 pl-2 pb-2 pt-2 pr-4">
                    <label className="form-check-label">Birthday</label>
                    <input className="form-control" type="Date" name="birthday" onChange={e => this.change(e)} />
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-md-3 m-2 p-2">
                    <label className="form-check-label">Nacionality</label>
                    <input className="form-control" type="text" name="nacionality" value={this.state.nacionality} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-3 m-2 p-2">
                    <label className="form-check-label">Personal Number</label>
                    <input className="form-control" type="Number" name="personalNumber" value={this.state.personalNumber} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-3 m-2 p-2">
                    <label className="form-check-label">Phone Number</label>
                    <input className="form-control" type="text" name="phoneNumber" value={this.state.phoneNumber} onChange={e => this.change(e)} />
                </div>
            </div>


            <div className="col-md-12 mt-4">
                <button onClick={() => this.setState({ showInputForProfileData: false })} className="col-md-2 btn btn-outline-secondary btn-lg ml-0">Cancel</button>

                {this.state.LoagindSaveProfileDataBtn ?
                    <button className="col-md-2 btn btn-primary btn-lg float-right mr-4"><span className="spinner-border"></span></button>
                    :
                    <button type="submit" className="col-md-2 btn btn-primary btn-lg float-right mr-4">Save</button>}

            </div>

            <br />
        </form>
    }
    

    private showProfileData(): React.ReactNode {
        return <div>
            <div className="row mt-2 ml-5">
                <div className="col-md-2 m-1 p-2 shadow-sm text-truncate">
                    <p>First Name:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.firstName}</b>
                    </p>
                </div>
                <div className="col-md-2 m-1 p-2 shadow-sm text-truncate">
                    <p>Last Name:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.lastName}</b>
                    </p>
                </div>
                <div className="col-md-2 m-1 p-2 shadow-sm text-truncate">
                    <p>Nacionality:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.nacionality}</b>
                    </p>
                </div>
                <div className="col-md-1 m-1 p-2 shadow-sm">
                    <p>Age:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.age}</b>
                    </p>
                </div>
                <div className="col-md-4 m-1 p-2 shadow-sm">                    
                    <p>Email:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.email}</b>
                    </p>
                </div>
            </div>
            <div className="row mt-2 ml-5 mt-5">
                <div className="col-md-3 m-1 p-2 shadow-sm">
                <p>Birthday:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {new Intl.DateTimeFormat('en-GB', {
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                            }).format(new Date(this.state.birthday ? this.state.birthday : ""))}
                        </b>
                    </p>
                </div>
                <div className="col-md-2 m-1 p-2 shadow-sm text-truncate">
                    <p>Personal Number:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.personalNumber}</b>
                    </p>
                </div>
                <div className="col-md-2 m-1 p-2 shadow-sm text-truncate">
                    <p>Phone Number:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.phoneNumber}</b>
                    </p>
                </div>
                <div className="col-md-3 m-1 p-2 shadow-sm">
                    <p>User Name:<br />
                        <b className="text-primary form-control-lg ml-3">
                            {this.state.userName}</b>
                    </p>
                </div>
                <div className="col-md-1 m-1 p-2 shadow-sm text-truncate">
                    <p>Role:<br />
                        <b className="text-primary ml-2">
                            {this.state.role}</b>
                    </p>
                </div>
            </div>
            <div className="col-md-12 mt-5">
                
                <button className="btn btn-light ml-5 mt-2" onClick={() => (this.setState({showChangeEmailOrUserName: !this.state.showChangeEmailOrUserName}))}>Select to change Email or UserName </button>
                <button className="btn btn-outline-primary btn-lg  float-right" onClick={() => (this.setState({ showInputForProfileData: true }))}>Edit Profile</button>
            </div>
        </div>
    }
    
    private ProfileData() {
        return <div>
            {this.state.showInputForProfileData ?
                this.formForProfileData()
                :
                this.state.showProfileData ?
                    this.showProfileData()
                    :
                    <div className="ml-5 mt-5">
                        <div className="spinner-grow text-primary">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-warning">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}

        </div>
    }

    //-----------------------------------------------------------------Profile Data

    //For password Area -----------------------

    submitPassword(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();      
        this.setState({showSamePassMsg: false})    
       
        if(this.state.newPassword === this.state.repeatNewPassword){            
            this.setState({LoagindSavePasswordBtn: true})  
            let data: any = {
                password:  this.state.password,
                newPassword:  this.state.newPassword,
            };
            axios({
                method: 'post',
                url: `api/Profile/ChangePassword`,
                data: data,
                params: {birthday: this.state.birthday},
            })            
            .then( (response) => {
            if(response.status === 200){
                this.setState({
                    showMsgSucces: true, 
                    LoagindSavePasswordBtn: false,
                    password: "",
                    newPassword:"",
                    repeatNewPassword:"",
                })
            }
            })
            .catch( () => {
                this.setState({LoagindSavePasswordBtn: false, defaultErrorPasswordMsg: true});
            }); 
        }

        else{
            this.setState({showSamePassMsg: true})
        }
    }

    changePSSW(e: React.ChangeEvent<HTMLInputElement>) {
        if(this.state.defaultErrorPasswordMsg === true){
            this.setState({
                        defaultErrorPasswordMsg: false,
                        showSamePassMsg: false
                        })
            }
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    private FormPasswordChange(): React.ReactNode {
        return <div>
            <form onSubmit={e => this.submitPassword(e)} className="ml-5">
                <div className="row">
                    {this.state.defaultErrorPasswordMsg? <p className="text-danger mt-2 col-md-12">The old password must be entered correctly, and the new password must be at least 8 characters long.</p> : ""}
                    {this.state.showSamePassMsg ? <p className="text-danger mt-2 col-md-12">Repeated password is not the same as new password. And Passwords must be at least 8 characters.</p> : ""}
                    <div className="col-md-3 m-2 p-2">
                        <label className="form-check-label">Old Password</label>
                        <input className="form-control" type="password" name="password" value={this.state.password} onChange={e => this.changePSSW(e)} />
                    </div>
                    <div className="col-md-3 m-2 p-2">
                        <label className="form-check-label">New Password</label>
                        <input className="form-control" type="password" name="newPassword" value={this.state.newPassword} onChange={e => this.changePSSW(e)} />
                    </div>

                    <div className="col-md-3 m-2 p-2">
                        <label className="form-check-label">Repeat New Password</label>
                        <input className="form-control" type="password" name="repeatNewPassword" value={this.state.repeatNewPassword} onChange={e => this.changePSSW(e)} />
                    </div>
                </div>



                <div className="col-md-12 mt-4">
                    {this.state.showMsgSucces ? <p className="text-success ml-1 mt-2">Password changed successfully</p> :
                        <div>
                            {this.state.LoagindSavePasswordBtn ?
                                <button className="col-md-2 btn btn-primary btn-lg float-right mr-4"><span className="spinner-border"></span></button>
                                :
                                <button type="submit" className="col-md-2 btn btn-primary btn-lg float-right mr-4">Save</button>}
                        </div>}
                </div>

                <br />
            </form>
        </div>
    }

    //--------------------------------------------------------------

    changeUserName(): void {
        this.setState({loadingChangeUsername: true})
        axios({
            method: 'post',
            url: `api/Profile/ChangeUserName`,
            params:{newUserName: this.state.newUserName}
        })            
        .then( (response) => {
           if(response.status === 200){               
            this.setState({loadingChangeUsername: false, showMsgForChangeUserName: true, showSuccesMsnForChangeUserName: true});
            window.location.reload();
           }     
           else{                   
            this.setState({loadingChangeUsername: false, showMsgForChangeUserName: true, showSuccesMsnForChangeUserName: false})
           }           
        })
        .catch( () => {
            this.setState({loadingChangeUsername: false, showMsgForChangeUserName: true, showSuccesMsnForChangeUserName: false})
        }); 
    }

    changeEmail(): void {
        this.setState({loadingChangeEmail: true})
        axios({
            method: 'post',
            url: `api/Profile/ChangeEmail`,
            params:{newEmail: this.state.newEmail}
        })            
        .then( (response) => {
           if(response.status === 200){                            
            this.setState({loadingChangeEmail: false, showMsgForChangeEmail: true, showSuccesMsnForChangeEMail: true});            
            this.fetchProfileData();
           }     
           else{                   
            this.setState({loadingChangeEmail: false, showMsgForChangeEmail: true, showSuccesMsnForChangeEMail: false})
           }           
        })
        .catch( () => {
            this.setState({loadingChangeEmail: false, showMsgForChangeEmail: true, showSuccesMsnForChangeEMail: false})
        }); 
    }



    public render(){
        return(
            <div className="container-fluid">
            <h1 className="card-title font-weight-lighter container">Profile</h1>                
            <hr />
            <div className="row">
                <div className="col-md-2 mt-2">
                    <div className="btn btn-light btn-block btn-lg m-2 font-weight-light"onClick={() => this.setState({passwordArea:false})}>Profile</div>
                    <br />
                    <div className="btn btn-light btn-block btn-lg m-2 mt-3 font-weight-light" onClick={() => this.setState({passwordArea:true,showMsgSucces: false})}>Change Password</div>
                </div>

                <div className="col-md-10">
                    {this.state.passwordArea?
                    this.FormPasswordChange()
                    :
                    this.ProfileData()
                    }
                </div>
                    
            </div>
            <div className="row col-md-12">
                <div className="col-md-2"></div>
                
                {this.state.showChangeEmailOrUserName? 
                <div className="col-md-10 mt-3 pl-5">
                    
                    <hr />
                    <div className="row p-1 mt-3">
                        <p className="text-info col-md-4 mt-2">User Name: <b className="border p-1">{this.state.userName}</b> </p>
                        <input className="form-control col-md-3" type="text" name="newUserName" placeholder="Enter the new User Name" value={this.state.newUserName}  onChange={e => this.change(e)} />
                        {this.state.showMsgForChangeUserName?    
                        this.state.showSuccesMsnForChangeUserName? 
                            <p className="text-success inline-block col-md-3 mt-1">Saved successfully</p>   
                            :                 
                            <p className="text-danger inline-block col-md-3 mt-1">Pleas try another User Name</p>
                        :
                        <div className="col-md-3"></div>
                        }<div className="col-md-2">
                            {this.state.loadingChangeUsername? 
                            <button className="btn btn-secondary float-right"><span className="spinner-border"></span></button>
                            :
                            <button className="btn btn-secondary float-right" onClick={() => this.changeUserName()}>Save UserName</button>
                        }
                        </div>
                    </div>
                    
                    <hr />
                    <div className="row p-1 mt-3">
                        <p className="text-info col-md-4 mt-2">Email Address: <b className="border p-1">{this.state.email}</b> </p>
                        <input className="form-control col-md-3" type="text" name="newEmail" placeholder="Enter the new Email Address" value={this.state.newEmail}  onChange={e => this.change(e)} />
                        {this.state.showMsgForChangeEmail?    
                        this.state.showSuccesMsnForChangeEMail? 
                            <p className="text-success inline-block col-md-3 mt-1">Saved successfully</p>   
                            :                 
                            <p className="text-danger inline-block col-md-3 mt-1">Please try another Email</p>
                        :
                        <div className="col-md-3"></div>
                        }
                        <div className="col-md-2">                            
                        {this.state.loadingChangeEmail? 
                        <button className="btn btn-secondary float-right"><span className="spinner-border"></span></button>
                        : 
                        <button className="btn btn-secondary float-right" onClick={() => this.changeEmail()}>Save Email</button>
                        }
                       </div>
                        
                    </div>
                  
                    <hr />
                    
                </div>
                :""}
            </div>
            </div>
        )
    }



}
export default Profile;
