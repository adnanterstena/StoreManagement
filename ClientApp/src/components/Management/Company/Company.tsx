import * as React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


interface IProps{

}
interface IState {
    for12Month: boolean;
    for6Month: boolean;
    showConfigureDiv: boolean;
    editCompanyName: boolean;
    showCompanyDetailsDiv: boolean;
    companyDateItem: CompanyInterface;
    showMsgCheckForConfigPost: boolean;
    editCompanyNameInput: string;
    checkIfAllowedToPay: boolean;
    showMsgBtnPayment: boolean;
    barcodeKey: number | string;
    vat: number | string;
    thermalModel: string;
    thermalVendoId: string;
    cuponQr: string;
    LoadingSTRequest: boolean;
    ShowCredMsgSTRequest: boolean;
    showDivForThermalAndPrinter: boolean;
}


interface CompanyInterface {    
    adminEmail: string;
    emriFirmes: string;
    dataFillimit: Date;
    dataPageses: Date;
    dataMbarimit: Date;
    ruatjaTotalitPer6Mujorin:boolean;
    ruatjaTotalitPer12Mujorin:boolean;
}


class Company extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {     
            for12Month: false,
            for6Month: false,
            showConfigureDiv: false,
            editCompanyName: false,
            showCompanyDetailsDiv: false,
            companyDateItem: {
                adminEmail:"",
                emriFirmes: "",
                dataFillimit: new Date(),
                dataPageses: new Date(),
                dataMbarimit: new Date(),
                ruatjaTotalitPer6Mujorin: false,
                ruatjaTotalitPer12Mujorin:false,
             },
            showMsgCheckForConfigPost:false,
            editCompanyNameInput:"",
            checkIfAllowedToPay: false,
            showMsgBtnPayment: false,
            barcodeKey:0,
            vat:0,
            thermalModel:"",
            thermalVendoId:"",
            cuponQr:"",
            LoadingSTRequest: false,
            ShowCredMsgSTRequest: false,
            showDivForThermalAndPrinter: true,
        };
      }

    componentDidMount(){
        this.fetchCompanyData();
    }

    fetchCompanyData(){
    axios.get(`api/Management/GetCompanyData`)
        .then( (response) => {
        if(response.status === 200){
            this.setState({companyDateItem: response.data,
                for12Month: response.data.ruatjaTotalitPer12Mujorin,
                for6Month: response.data.ruatjaTotalitPer6Mujorin,}) 

            //check if it's one month before expiration date
            let dataMbarimit = new Date(response.data.dataMbarimit)
            let now = new Date();
            let diff =(dataMbarimit.getTime() - now.getTime()) / 1000;
            diff /= (60 * 60 * 24 * 7 * 4);
            let difference =Number.parseFloat(diff.toFixed(1));    
            if(difference <= 3.3){
                this.setState({checkIfAllowedToPay: true})
                
            }
        }
        })
        .catch(); 

        this.fetchSTData(); 
    }
    
    private fetchSTData() {
        axios.get(`api/Management/GetSTData`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        vat: response.data.vat,
                        barcodeKey: response.data.barcodeKey,
                        cuponQr: response.data.cuponQr,
                        thermalVendoId: response.data.thermalVendoId,
                        thermalModel: response.data.thermalModel,
                    });
                }
            })
            .catch();
    }

    sendConfigureState(): void {        
        axios.post(`api/Management/AddCompanyConf`, {            
            },{
                params:{
                    for12Month: this.state.for12Month,
                    for6Month: this.state.for6Month,
                }
            })
            .then( (response) => {
            if(response.status === 200){
                this.setState({showMsgCheckForConfigPost: true});
            }else{
            }
            })
            .catch( () => {
            }); 
    }


    
    changeCompanyNameInput(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({editCompanyNameInput: e.target.value})
    }    

    sendCompanyNameState(): void {        
        axios.post(`api/Management/EditCompanyName`, {            
        },{
            params:{
                newCompanyName: this.state.editCompanyNameInput
            }
        })
        .then( (response) => {
            if(response.status === 200){
                this.setState({editCompanyName: false});                
                this.fetchCompanyData();
            }
        })
        .catch();         
    }

    

    
    private divForCompanyDetails() {
        return <div>
            <button className="btn btn-light col-md-12 mb-4" onClick={() => this.setState({ showCompanyDetailsDiv: !this.state.showCompanyDetailsDiv })}>Select For Company Details</button>
            {this.state.showCompanyDetailsDiv ?

            <div className="row p-3 mt-2">
                <h3 className="col-md-5 border shadow-sm ml-3 mb-3 p-3 text-muted text-center"> {this.state.companyDateItem.emriFirmes}</h3>

                <h3 className="col-md-6 border shadow-sm ml-3 mb-3 p-3 text-muted text-center"> {this.state.companyDateItem.adminEmail}</h3>

                <div className="col-md-12 mt-5"></div>

                <label className="col-md-3"> Start Date
                    <h3 className="border shadow-sm pl-2 mb-3 p-1 text-muted text-center">
                        {new Intl.DateTimeFormat('en-GB', { 
                                                                month: 'short', 
                                                                day: '2-digit',
                                                                year: 'numeric', 
                                                            }).format(new Date(this.state.companyDateItem.dataFillimit))}</h3></label>

                <label className="col-md-3 ml-3"> Through this Date
                    <h3 className="border shadow-sm pl-2 mb-3 p-1 text-muted text-center">
                        {new Intl.DateTimeFormat('en-GB', { 
                                                                month: 'short', 
                                                                day: '2-digit',
                                                                year: 'numeric', 
                                                            }).format(new Date(this.state.companyDateItem.dataPageses))}</h3></label>

                <label className="col-md-3 ml-3"> Payment Expiration Date
                    <h3 className="border shadow-sm pl-2 mb-3 p-1 text-muted text-center">
                        {new Intl.DateTimeFormat('en-GB', { 
                                                                month: 'short', 
                                                                day: '2-digit',
                                                                year: 'numeric', 
                                                            }).format(new Date(this.state.companyDateItem.dataMbarimit))}</h3></label>

                <div className="col-md-12 mt-5"></div>

                {this.state.editCompanyName ?
                    <div className="row col-md-12">
                        <input autoFocus className="form-control col-md-5 form-control-lg" placeholder="Company Name" value={this.state.editCompanyNameInput} onChange={e => this.changeCompanyNameInput(e)} />
                        <div className="col-md-7">

                            <button className="btn btn-primary float-right btn-lg pr-4 pl-4" onClick={() => this.sendCompanyNameState()}>Save</button>
                            <button className="btn btn-outline-secondary float-right btn-lg mr-5" onClick={() => this.setState({ editCompanyName: false })}>Cancel</button>
                        </div>
                    </div>
                    :
                    <div className="col-md-12">


                        <button className="btn btn-outline-dark float-right btn-lg" onClick={() => this.setState({ editCompanyName: true })}>Edit Company Name</button>
                    </div>}
            </div>
             : ""}
        </div>;
    }
    
    private divForConfiguration() {
        return <div>
            <button className="btn btn-light col-md-12 mb-4" onClick={() => this.setState({ showConfigureDiv: !this.state.showConfigureDiv })}>Select For Configurations</button>
            {this.state.showConfigureDiv ?
                <div>
                    <p className="text-info mt-2"> Notes: If it has ever been active and sometimes inactive, the data will be displayed for only as long as the button has been active.
                    This condition makes the sum group and saves it for each month, sum of submit orders. This needed to display in your statistics table.</p>
                    <div className="row text-center mt-5">
                        <h4 className="col-md-8 text-secondary mt-3">Save the total amount of orders only for one year </h4>
                        <div className="col-md-2">
                            {this.state.for12Month ?
                                <button className="col-md-12 p-3 mb-2 bg-success text-white rounded" onClick={() => this.setState({ for12Month: false, showMsgCheckForConfigPost: false })}>Activated</button>
                                :
                                <button className="col-md-12 p-3 mb-2 bg-info text-white rounded" onClick={() => this.setState({ for12Month: true, for6Month: false, showMsgCheckForConfigPost: false })}>Deactivated</button>}

                        </div>

                    </div>

                    {this.state.for12Month ? "" :
                        <div className="row text-center mt-4 mb-2">

                            <h4 className="col-md-8 text-secondary mt-3">Save the total amount of orders only for 6 months </h4>

                            <div className="col-md-2">
                                {this.state.for6Month ?
                                    <button className="col-md-12 p-3 mb-2 bg-success text-white rounded" onClick={() => this.setState({ for6Month: false, showMsgCheckForConfigPost: false })}>Activated</button>
                                    :
                                    <button className="col-md-12 p-3 mb-2 bg-info text-white rounded" onClick={() => this.setState({ for6Month: true, showMsgCheckForConfigPost: false })}>Deactivated</button>}
                            </div>
                        </div>}
                    
                    <button className="btn btn-primary float-right btn-lg disabled" onClick={() => this.sendConfigureState()}>Save</button>
                    {this.state.showMsgCheckForConfigPost? 
                    <p className="text-success float-right mr-4 mt-2">Saved successfully.</p>
                     :
                    ""}
                    
                   

                </div>
                : ""}
        </div>
    }

    sendScannerAndThermalData (): void {
        this.setState({LoadingSTRequest: true, ShowCredMsgSTRequest: false})
        let brk: number;
        if(this.state.barcodeKey === "") {brk = 0}
        else {brk = Number(this.state.barcodeKey)}
        axios.post(`api/Management/addScThData`, {
                thermalModel: this.state.thermalModel,
                thermalVendoId: this.state.thermalVendoId,
                
        },{
            params:{
                barcodeKey: brk,
                vat: this.state.vat,
            }
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({LoadingSTRequest: false});            
            this.fetchSTData(); 
        }
        })
        .catch( () => {
            this.setState({LoadingSTRequest: false, ShowCredMsgSTRequest: true});
        }); 
    }
    
    private divForThermalPrinterAndScanner() {
        return <div>
        <button className="btn btn-light col-md-12 mb-4" onClick={() => this.setState({showDivForThermalAndPrinter: !this.state.showDivForThermalAndPrinter})}>Barcode Scanner and Thermal Printer</button>
            {this.state.showDivForThermalAndPrinter? "":
            <div className="row col-md-12 ml-3">             
                <div className="form-group row border rounded-lg p-2 col-md-8 pb-3 mt-3">
                    <p className="text-secondary col-md-12">Only if the <b>Barcode Scanner</b> does not work properly when you scan the barcodes</p>
                    <div className="col-md-5">
                        <label className="form-check-label">Scanner Key</label>
                        <input className="form-control" type="Number" placeholder="Scanner Key" value={this.state.barcodeKey} onChange={(e) => this.setState({barcodeKey: e.target.value})} />                       
                    </div>
                </div>
                <label className="col-md-4 m-2 text-muted text-center mt-4 ml-3">Your ID of all coupons (Cupon QR Code)
                    <h3 className="border shadow-sm mb-3 p-1 text-muted text-center">
                    {this.state.cuponQr}</h3>
                </label>

                <div className="form-group row border rounded-lg p-2 col-md-12">
                    <p className="text-secondary col-md-12">Configure the <b>Thermal Printer</b> to print coupons</p>
                    <div className="col-md-2">
                        <label className="form-check-label">VAT %</label>
                        <input className="form-control" type="number" step="0.01" placeholder="Vat" value={this.state.vat} onChange={(e) => this.setState({vat: e.target.value})} />                       
                    </div>
                    <div className="col-md-5">
                        <label className="form-check-label">ID <span className="text-muted">- <u>Vendor ID</u> by default is '04B8'</span></label>
                        <input className="form-control" type="text" placeholder="Vendor ID" value={this.state.thermalVendoId} onChange={(e) => this.setState({thermalVendoId: e.target.value})} />                       
                    </div>
                    <div className="col-md-5">
                        <label className="form-check-label">Model<span className="text-muted"> - DeviceName<u>[Model]</u> by default is 'TM-T20' </span></label>
                        <input className="form-control" type="text" placeholder="Model" value={this.state.thermalModel} onChange={(e) => this.setState({thermalModel: e.target.value})} />                       
                    </div>
                </div> 
               

                <div className="col-md-12">
                {this.state.LoadingSTRequest? 
                <button className="btn btn-primary btn-lg float-right pr-4 mt-3 pl-4"><span className="spinner-border"></span></button>
                :
                <span>
                <button className="btn btn-primary btn-lg float-right pr-4 mt-3 pl-4" onClick={() => this.sendScannerAndThermalData()}>Save</button>                
                {this.state.ShowCredMsgSTRequest?<p className="text-danger float-right mt-4 mr-5">Please try again</p>:""}
                </span>
                }
                </div>
            </div>            
            }

            
        </div>
    }


    public render(){
        return(
            <div className="container">
                <h1 className="card-title font-weight-lighter container">Company</h1>
                
                <hr />
                <br />
                <h3 className="text-primary col-md-7 text-center text-capitalize font-weight-light">Payment costs <b>$ 15</b> (USD) per year</h3>
              
                <div className="row">
                    <p className="col-md-7 text-primary mt-3"> Payment can only be made during the period of three month before your expiration date,
                    <br />at that time the right button will be available otherwise it will not be.</p>
                    {this.state.checkIfAllowedToPay? 
                    <Link to="/Payment" className="col-md-4 btn btn-outline-primary btn-lg ml-5 mt-3 mb-3 pt-2">Pay For This App</Link>
                    :
                    <button className="col-md-4 btn btn-outline-primary btn-lg ml-5 mt-3 mb-3 pt-2" onClick={() => this.setState({showMsgBtnPayment: !this.state.showMsgBtnPayment})}>Pay For This App</button>}
                    
                </div>
                
                {this.state.showMsgBtnPayment? 
                <div className="container mb-5"><p className="text-warning float-right mr-4">Is not active at this time</p></div>
                :""}
                
                
  
                <p className="text-primary text-center mt-3">
                        Payment it's with electronic commerce company <u>PayPal</u>. This company allows you to make payments using a variety of methods.
                        <br />We strongly believe that your method is included!</p>
                
                <p className="text-info mt-5">If you do not pay till 5 days after the deadline of 'Payment Expiration Date', everything related to your company will be deleted automatically.</p>
                    
                <br />
                <hr />
                <br />

                {this.divForConfiguration()}

                <br />
                <br />
                <hr />
                <br />

                {this.divForCompanyDetails()}
                
                <br />
                <br />
                <hr />
                <br />

                {this.divForThermalPrinterAndScanner()}
                
                <br />
                <br />
                <hr />
                <br />

            </div>
        )
    }
}
export default Company;
