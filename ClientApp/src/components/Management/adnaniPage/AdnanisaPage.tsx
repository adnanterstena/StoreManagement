import * as React from 'react';
import axios from 'axios';


interface IProps{

}
interface IState {
    // for info page
    informations: [];
    showInfoTable: boolean;
    titulli: string;
    pershkrimi: string;
    id: number;
    newtitulli: string;
    newpershkrimi: string;
    showInfoEditForm: boolean;
    showAddNewForm: boolean;
    //--------------
    // for App Statistics
    showAppStatistics: boolean;
    firmsStatistics: firmsStatisticItem []
    pageStatistics: number;
    //--------------
    // for Pays Statistics
    showPaysStDiv: boolean;
    firmPaidStats: firmPaidItem;
    loadingFetchPayInfo: boolean;
    loadingFetchProCatUsrInfo: boolean;
    firmProCatUsrStats: firmProCatUsrItem;
    showdivProCatUsrInfo: boolean;
    //--------------
    filterFirmsLoading: boolean;
    filtertblForgLoading: boolean;
}

interface firmProCatUsrItem {
    usersNumber: number;
    productNumber : number;
    categoriesNumber : number;
    forgotNumNumber : number;
}

interface firmPaidItem{
    nuFirms: number;
    nuFirmPayed: number;
    nuFirmNotPayed: number;
}

interface firmsStatisticItem {
    id: number;
    adminEmail: string;
    emriFirmes: string;
    paguar: boolean;
    dataFillimit: Date;
    dataPageses: Date;
    dataMbarimit: Date;
    ruatjaTotalitPer6Mujorin : boolean;
    ruatjaTotalitPer12Mujorin: boolean;
    nrKategorive: number;
    nrProdukteve: number;
    nrUseraveWorkers: number;
}
class Adnani extends React.PureComponent<IProps, IState | any> {  
    constructor(props: any) {
        super(props);
    
        this.state = {   
         // for info page         
         informations: [],
         showInfoTable: false,
         id: 0,
         titulli: "",
         pershkrimi: "",
         newtitulli: "",
         newpershkrimi: "",
         showInfoEditForm: false,
         showAddNewForm: false,
         //--------------
         // for App Statistics
         showAppStatistics: false,
         firmsStatistics: [],
         pageStatistics: 1,
         //--------------
         // for Pays Statistics
         showPaysStDiv: false,
         firmPaidStats: {nuFirmNotPayed:0,nuFirmPayed:0,nuFirms:0},
         loadingFetchPayInfo: true,
         loadingFetchProCatUsrInfo: true,
         showdivProCatUsrInfo: false,
         //--------------
         filterFirmsLoading: false,
         filtertblForgLoading: false,
        };
      }
   
   
    componentDidMount(){
        this.addAuth();
    }

    addAuth(){
        axios.get(`api/superadmincontroller/getSTS`)
        .then( (response) => {
        if(response.status === 200){
            
        }
        })
        .catch( (e) => { 
        }); 
    }

    change(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({
            [e.target.name]: e.target.value
        });

    }   

    //--------------------------------for info page -----------------------------------------------------------------

    ShowInfoDiv(): void {
        if(this.state.showInfoTable === false){this.fetchInfo()}
        this.setState({showInfoTable: !this.state.showInfoTable})   
    }

    fetchInfo(){
        axios.get(`api/superadmincontroller/GetInfo`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({informations: response.data})
        }
        })
        .catch(); 
    }
    editinfoPage(item: any): void {
        
        this.setState({ id: item.id,
                        titulli: item.titulli,
                        pershkrimi: item.shkrimi,
                        showInfoEditForm: true,
        })
        
    }
    submitEditInfoPage(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        
        
        axios.put(`api/superadmincontroller/EditinfoPage`, {
            titulli: this.state.titulli,
            pershkrimi: this.state.pershkrimi       
        },{
            params:{                
                id: this.state.id,
            }
        })
        .then( (response) => {
        if(response.status === 200){
            //window.location.reload();
            this.setState({showInfoEditForm: false});
            this.fetchInfo();
        }
        })
        .catch(); 
    }

    deleteInfoItem(id: number): void {
        axios.delete(`api/superadmincontroller/DeleteinfoItem`,{
            params:{                
                id: id
            }
        })
        .then( (response) => {
            if(response.status === 200){                
                this.fetchInfo();
            }
        })
        .catch(); 
    }
    
    addNewInfoItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();   
        axios.post(`api/superadmincontroller/AddInfoItem`, {
            titulli: this.state.newtitulli,
            pershkrimi: this.state.newpershkrimi    
            
        })
        .then( (response) => {
            if(response.status === 200){         
                this.fetchInfo();
                this.setState({newtitulli: "", newpershkrimi: "",showAddNewForm: false})
            }
        })
        .catch( () => {
        }); 
    }
    private DivInfoPage() {
        return <div className="container">
            {this.state.showInfoTable ?
                <div>
                    <br />
                    <button className="btn btn-outline-secondary btn-lg" onClick={() => this.setState({ showAddNewForm: !this.state.showAddNewForm })}>Add new item</button>
                    <br />
                    <br />
                    {this.state.showAddNewForm ?
                        <form onSubmit={e => this.addNewInfoItem(e)} className="form-group container">
                            <br />
                            <div className="form-group row border rounded-lg p-2 col-md-12">
                                <div className="col-md-4">
                                    <label className="form-check-label">Titulli </label>
                                    <input autoFocus className="form-control" type="text" name="newtitulli" value={this.state.newtitulli} onChange={e => this.change(e)} />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-check-label">Pershkrimi</label>
                                    <textarea className="form-control" rows={4} name="newpershkrimi" value={this.state.newpershkrimi} onChange={e => this.change(e)}> </textarea>
                                </div>

                            </div>

                            <button className="btn btn-primary btn-lg disabled float-right mr-3" type="submit">Add</button>

                            <br />
                        </form>

                        : ""}

                    <br /> <hr /><br />
                    {this.state.showInfoEditForm ?
                        <form onSubmit={e => this.submitEditInfoPage(e)} className="form-group container">
                            <h3 className="text font-weight-lighter text-center p-2 mb-2"><mark>Edit this item</mark></h3>
                            <div className="form-group row border rounded-lg p-2 col-md-12">
                                <div className="col-md-4">
                                    <label className="form-check-label">Product Name</label>
                                    <input autoFocus className="form-control" type="text" name="titulli" value={this.state.titulli} onChange={e => this.change(e)} />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-check-label">Product Name</label>
                                    <textarea className="form-control" rows={4} name="pershkrimi" value={this.state.pershkrimi} onChange={e => this.change(e)}> </textarea>
                                </div>

                            </div>

                            <button className="btn btn-secondary btn-lg disabled mr-3" onClick={() => this.setState({ showInfoEditForm: false })}>Cancel</button>
                            <button className="btn btn-primary btn-lg disabled float-right mr-3" type="submit">Save</button>

                            <br />
                            <br />
                            <br />
                            <hr />
                        </form> : ""}

                    <table className="table table-striped container-fluid table-bordered text-center">
                        <thead className="thead-dark">
                            <tr>
                                <th>Titulli</th>
                                <th>Pershkrimi</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.informations.map((item: any) => (
                                <tr key={item.id}>
                                    <td><p className="text text-primary">{item.titulli}</p> </td>
                                    <td><p className="text text-info text-justify">{item.shkrimi}</p> </td>
                                    <td><button className="btn btn-outline-warning" onClick={() => this.editinfoPage(item)}>Edit</button> </td>
                                    <td><button className="btn btn-outline-danger" onClick={() => {
                                        if (window.confirm('Are you sure you want to delete: ' + item.titulli + "?"))
                                            this.deleteInfoItem(item.id);
                                    } }>Delete</button> </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
                : ""}
        </div>
    }

    private AppFirmsStatisticDiv() {
        return <div>

            {this.state.showAppStatistics ?
                <div>
                    <table className="table table-striped container-fluid table-bordered text-center">
                        <thead className="thead-dark">
                            <tr>
                                <th></th>
                                <th>Admin Email</th>
                                <th>Firm</th>
                                <th>Pay</th>
                                <th>Start Date</th>
                                <th>Pay Date</th>
                                <th>End date</th>
                                <th>C6Month</th>
                                <th>C12Month</th>
                                <th>NuCat</th>
                                <th>NuPrd</th>
                                <th>NuUsr</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.firmsStatistics.map((item: firmsStatisticItem) => (
                                <tr key={item.id}>
                                    <td><p className="text text-primary">{item.id}.</p> </td>
                                    <td><p className="text text-primary">{item.adminEmail}</p> </td>
                                    <td><p className="text text-primary">{item.emriFirmes}</p> </td>
                                    <td><p className="text text-primary">{item.paguar.toString()}</p> </td>
                                    <td><p className="text text-primary">{new Intl.DateTimeFormat('en-GB', {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(item.dataFillimit))}</p> </td>
                                    <td><p className="text text-primary">{new Intl.DateTimeFormat('en-GB', {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(item.dataPageses))}</p> </td>
                                    <td><p className="text text-primary">{new Intl.DateTimeFormat('en-GB', {
                                        month: 'short',
                                        day: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(item.dataMbarimit))}</p> </td>
                                    <td><p className="text text-primary">{item.ruatjaTotalitPer6Mujorin.toString()}</p> </td>
                                    <td><p className="text text-primary">{item.ruatjaTotalitPer12Mujorin.toString()}</p> </td>
                                    <td><p className="text text-primary">{item.nrKategorive}</p> </td>
                                    <td><p className="text text-primary">{item.nrProdukteve}</p> </td>
                                    <td><p className="text text-primary">{item.nrUseraveWorkers}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row ml-5">
                        <button className="btn btn-outline-success col-md-1" onClick={() => this.fetchPageStatistics(this.state.pageStatistics - 1)}>Previous</button>
                        <p className="col-md-1 mt-3 text-center"><b className="border pl-2 pr-2">{this.state.pageStatistics}</b></p>
                        <button className="btn btn-outline-success pl-4 pr-4 col-md-1" onClick={() => this.fetchPageStatistics(this.state.pageStatistics + 1)}>Next</button>
                    </div>
                    <br />
                </div>

                : ""}

        </div>
    }

    // --------------------------------------------------------------------------------------------------------------

    // -----------------------for App Statistics---------------------------------------------------------------------

    
 

    ShowStatisticsDiv(): void {
        if(this.state.showAppStatistics === false){this.fetchFirmsStatistics()}
        this.setState({showAppStatistics: !this.state.showAppStatistics})
    }

    async fetchPageStatistics(arg0: number): Promise<void> {
        await this.setState({pageStatistics: arg0});        
        this.fetchFirmsStatistics()
    }

    fetchFirmsStatistics(){
        axios.post(`api/superadmincontroller/GetFirmStatistics`, {                
        },{
            params:{
                page: this.state.pageStatistics,
            }
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({firmsStatistics: response.data})
        }
        })
        .catch(); 
    }
    
    // --------------------------------------------------------------------------------------------------------------
    //--------------------------------for Firm Numbers btn ----------------------------------------------------------

    ShowNumbersDiv(): void {
        if(this.state.showPaysStDiv === false){this.fetchPaysInfo()}
        this.setState({showPaysStDiv: !this.state.showPaysStDiv})   
        
    }

    fetchPaysInfo() {
        axios.get(`api/superadmincontroller/GetStatistics`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({firmPaidStats: response.data, loadingFetchPayInfo: false})
        }
        })
        .catch(); 
    }

    fetchProCatUsrInfo() {
        axios.get(`api/superadmincontroller/GetStatisUPC`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({firmProCatUsrStats: response.data, loadingFetchProCatUsrInfo: false})
        }
        })
        .catch(); 
    }    
    showFetchProCatUsrInfo(): void {
        if(this.state.showdivProCatUsrInfo === false){this.fetchProCatUsrInfo()}
        this.setState({showdivProCatUsrInfo: !this.state.showdivProCatUsrInfo})
    }
    

    // --------------------------------------------------------------------------------------------------------------
    public render() {
        return (
            <div className="container-fluid">
            <h1 className="card-title font-weight-lighter container text-center">Super Admin Page</h1> <hr />
            <div className="col-md-12">
            {this.state.filterFirmsLoading?
                <button className="btn-outline-danger btn-lg float-right"><span className="spinner-border"></span></button>
                :
                <button className="btn-outline-danger btn-lg float-right" onClick={() => this.filterCompanies()}>Filter DB</button>
            }
            </div>
            <hr /><hr /><hr /><hr /><hr /><hr />
            <br />
            <button className="btn btn-outline-primary container btn-lg btn-block" onClick={() => this.ShowStatisticsDiv() }>App Firms</button>
            <br />              
            {this.AppFirmsStatisticDiv()}    

            <hr /><hr /><hr /><hr /><hr /><hr />
            <br />
            <button className="btn btn-outline-primary container btn-lg btn-block" onClick={() => this.ShowNumbersDiv()}>Statistics Payment</button>
            <br />
            {this.state.showPaysStDiv?
            <div>
                {this.state.loadingFetchPayInfo?
                    <p className="p-4 m-4 text-info">Loading...!</p>               
                    : 
                    <div>
                        <h4 className="p-4 m-4 shadow text-center text-primary">Total businesses: <b className="border p-1">{this.state.firmPaidStats.nuFirms}</b></h4>
                        <h4 className="p-4 m-4 shadow text-center text-success">total businesses that have paid: <b className="border p-1">{this.state.firmPaidStats.nuFirmPayed}</b></h4>
                        <h4 className="p-4 m-4 shadow text-center text-secondary">total businesses that have not paid: <b className="border p-1">{this.state.firmPaidStats.nuFirmNotPayed}</b></h4>
                    </div>  
                }

                <br />
                <button className="btn btn-outline-secondary btn-lg ml-4" onClick={() => this.showFetchProCatUsrInfo()}>Numbers of users, categories and products?</button>
                {this.state.showdivProCatUsrInfo?
                <div>
                    {this.state.loadingFetchProCatUsrInfo? 
                    <p className="p-4 m-4 text-info">Loading...!</p>
                    :
                    <div>    
                        <br />
                        <h4 className="p-4 m-4 shadow text-center text-secondary">Total Users: <u>{this.state.firmProCatUsrStats.usersNumber}</u></h4>
                        <h4 className="p-4 m-4 shadow text-center text-secondary">Total Products: <u>{this.state.firmProCatUsrStats.productNumber}</u></h4>
                        <h4 className="p-4 m-4 shadow text-center text-secondary">Total Categories: <u>{this.state.firmProCatUsrStats.categoriesNumber}</u></h4>
                        <h4 className="p-4 m-4 shadow text-center text-secondary">Total table Forgot: <u>{this.state.firmProCatUsrStats.forgotNumNumber}</u>
                         {this.state.filtertblForgLoading? 
                         <button className="btn btn-lg btn-outline-info ml-4"><span className="spinner-border"></span></button>
                         :
                         <button className="btn btn-lg btn-outline-info ml-4" onClick={() => this.resetTblForgot()}>Reset tbl Forgot</button>}
                         </h4> 
                   </div>
                    }
                </div>
                :""}
                <br /><br />
            </div>              
                :""}

            <hr /><hr /><hr /><hr /><hr /><hr />
            <br />
            <button className="btn btn-outline-primary container btn-lg btn-block" onClick={() => this.ShowInfoDiv()}>Page Info</button>
            <br />
            {this.DivInfoPage()}
            <hr />
            <br />
            </div>
        );
    }
    resetTblForgot(): void {        
        this.setState({filtertblForgLoading: true});
        axios.put(`api/superadmincontroller/resetTblForgot`)
        .then( (response) => {
            if(response.status === 200){
                this.setState({filtertblForgLoading: false});
            }
        })
        .catch();
    }
    filterCompanies(): void {
        this.setState({filterFirmsLoading: true})
        axios.put(`api/Check/filterDeadlines`)
        .then( (response) => {
            if(response.status === 200){
                this.setState({filterFirmsLoading: false});
            }
        })
        .catch();
        
    }
  




};

export default Adnani;
