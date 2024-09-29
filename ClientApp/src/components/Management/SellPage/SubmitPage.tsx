import * as React from 'react';
import RemoveIcon from "../../../images/RemoveIcon.png";
import MoneyPNG from "../../../images/MoneyPNG.png";

interface IState {
    HaveValue:number;
    getValueStr: string;
    ValueToReturn: number;
    showOrderedList: boolean;
    cofirmDeleteOrderBtn: boolean;
    showSavedOrders: boolean;
}    

interface ProductsOrdered {
    id: number;
    emertimi: string;
    cmimi: number;
    barkodi: string;
    kategoria:number;
    sasiaEShitur:number;
    zbritja:number;
    vlera:number;
}

class SubmitPage extends React.PureComponent<any, IState> {
 
    constructor(props: any) {
        super(props);
    
        this.state = {
            HaveValue:0,
            getValueStr:"",
            ValueToReturn:0,
            showOrderedList: true,
            cofirmDeleteOrderBtn:false,
            showSavedOrders: false,
        }
    };
    componentDidMount(){
        if(this.props.productsOrdered.length > 0 || this.props.lastProductsItem.id !== 0){
            this.setState({showOrderedList: true})
        }
        else{
            this.setState({showOrderedList: false})
        }
    }

    componentDidUpdate(){
        if(this.props.productsOrdered.length > 0 || this.props.lastProductsItem.id !== 0){
            this.setState({showOrderedList: true})
        }
        else{
            this.setState({showOrderedList: false})
        }
    }
  
    handleButtons (val:number|string): void {        
        this.setState({getValueStr: this.state.getValueStr + val,})

        let x = parseFloat(this.state.getValueStr+val);
        x.toFixed(2);

        this.setState({HaveValue:x})
        this.setState({ValueToReturn: x - this.props.Totali})
    }

    public render() {
        return (
                <div className="container-fluid">
                    <div className="overflow-auto p-2 border border-light rounded shadow-sm container mb-2" style={{height:"350px"}}>
                        {this.state.showSavedOrders?                         
                        <div className="row m-2">
                            <button className="btn btn-outline-secondary btn-block col-md-12" onClick={() => this.setState({showSavedOrders: false})}>Go Back</button>
                            <p className="text-info row col-md-12 mb-1 mt-1">Notes: If the page is refreshed or the home button and profiles at the top are clicked, then this orders list will be empty.</p>
                            {this.props.timeOfSaveOrder.map((item: any) => (                                
                                <div className="shadow border col-md-3 pt-4 pb-2" style={{cursor:"pointer"}} key={this.props.timeOfSaveOrder.indexOf(item)} onClick={() => {this.props.getTemporarilyItem(this.props.timeOfSaveOrder.indexOf(item)); this.setState({showSavedOrders: false})}}>
                                    <p className="text-info text-center font-weight-bolder">Marked or Modified<br />at <u>{item.time}</u></p>
                                </div>
                            ))
                            }
                        </div>                        
                        :
                        <div>
                        <table className="table table-striped table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price <img src={MoneyPNG} alt="Valute" width="25px" height="17px" /></th>
                                    <th>Price Discount <img src={MoneyPNG} alt="Valute" width="25px" height="17px" /></th>
                                    <th>Total price <img src={MoneyPNG} alt="Valute" width="25px" height="17px" /></th>
                                </tr>
                            </thead>
                            
                                {this.state.showOrderedList? 
                                <tbody>
                                    <tr key={Math.random()} className="table-warning">
                                        <td>{this.props.lastProductsItem.barkodi}</td>
                                        <td>{this.props.lastProductsItem.emertimi}</td>
                                        <td>{this.props.lastProductsItem.sasiaEShitur}</td>
                                        <td>{this.props.lastProductsItem.cmimi.toFixed(2)}</td>  
                                        <td>- {this.props.lastProductsItem.zbritja.toFixed(2)}</td>
                                        <td>{this.props.lastProductsItem.vlera.toFixed(2)}</td>                            
                                    </tr>  
                                {this.props.productsOrdered.map((item: ProductsOrdered) => (
                                    <tr key={Math.random()}>
                                        <td>{item.barkodi}</td>
                                        <td>{item.emertimi}</td>
                                        <td>{item.sasiaEShitur}</td>
                                        <td>{item.cmimi.toFixed(2)} </td>
                                        <td>- {item.zbritja.toFixed(2)}</td>
                                        <td>{item.vlera.toFixed(2)}</td>
                                    </tr>
                                ))}
                                                                                         
                                </tbody>
                                :
                                <tbody></tbody>
                                }     
                        </table> 
                        {this.state.showOrderedList?"":
                            <div className="m-4 col-xs-1 text-center shadow p-3 mb-5 mt-2 bg-white rounded" onClick={() => this.props.clickChangeOrder()} style={{height:"220px"}}>
                                <br />
                                <h1 className="text font-weight-light text-muted"> Start Scanning <br /> Or click here for Selections</h1>
                            </div>
                        }   
                        </div>
                        }
                    </div>
                    <div className="row">
                        <div style={{ height:"300px", width:"25%"}} > 
                        <div className="row mt-3"> 
                            <div className="col-md-7">
                                {this.state.cofirmDeleteOrderBtn? 
                                <div className="ml-3">
                                    <p className="text text-info ml-1 mt-4 mb-1">Are you sure?</p>
                                    <button className="btn btn-outline-dark btn-lg mt-0 shadow" onClick={() =>this.setState({cofirmDeleteOrderBtn:false})}>No</button>
                                    <button className="btn btn-outline-danger btn-lg ml-2 pl-4 pr-4 mt-0 shadow" onClick={() => {this.props.emptyProductOrder();this.setState({cofirmDeleteOrderBtn:false})}}>Yes</button>
                                </div>                            
                                :  
                                <button className="col-md-12 btn btn-outline-danger btn-lg mt-5 p-3 shadow" onClick={() =>this.setState({cofirmDeleteOrderBtn:true})}>Cancel this order</button>
                                }
                            </div>
                            <button className="col-md-4 btn btn-info btn-outline-light btn-lg mt-5 p-3 shadow" onClick={() => this.setState({showSavedOrders: !this.state.showSavedOrders})}>Saved</button>
                        </div>  
                        <div className="col-md-12">
                            <button className="col-md-6 btn btn-outline-primary btn-lg mt-5 shadow" onClick={() => this.props.clickChangeOrder()}>Edit<br />this order</button>
                            <button className="col-md-5 btn btn-outline-dark btn-lg float-right mt-5 shadow" onClick={() => this.props.saveTemporarily()}>Save <br /> temporarily</button>
                        </div>
                        </div>
                        <div className="shadow" style={{ height:"310px", width:"40%", float:"right"}}>
                            <div className="row ml-0 mr-0 mt-1">
                                <div className="inline-block pl-5"></div>
                                <div onClick={() => this.handleButtons(7)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">7</h3></div>
                                <div onClick={() => this.handleButtons(8)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">8</h3></div>
                                <div onClick={() => this.handleButtons(9)} className="btn btn-outline-success col-md-3 ml-1 mr-1 mb-1"><h3 className="mt-3 ml-3">9</h3></div>
                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="inline-block pl-5"></div>
                                <div onClick={() => this.handleButtons(4)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">4</h3></div>
                                <div onClick={() => this.handleButtons(5)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">5</h3></div>
                                <div onClick={() => this.handleButtons(6)} className="btn btn-outline-success col-md-3 ml-1 mr-1 mb-1"><h3 className="mt-3 ml-3">6</h3></div>
                            </div>  
                            <div className="row ml-0 mr-0">
                                <div className="inline-block pl-5"></div>
                                <div onClick={() => this.handleButtons(1)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">1</h3></div>
                                <div onClick={() => this.handleButtons(2)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">2</h3></div>
                                <div onClick={() => this.handleButtons(3)} className="btn btn-outline-success col-md-3 ml-1 mr-1 mb-1"><h3 className="mt-3 ml-3">3</h3></div>
                            </div>  
                            <div className="row ml-0 mr-0">
                                <div className="inline-block pl-5"></div>                                
                                <div onClick={() => this.setState({HaveValue:0, ValueToReturn:0,getValueStr:""})} className="btn btn-light col-md-3 ml-1 mb-1"><img src={RemoveIcon} className="mt-2 ml-4 mr-4" alt="icon" height="45px" ></img></div>
                                <div onClick={() => this.handleButtons(0)} className="btn btn-outline-success col-md-3 ml-1 mb-1"><h3 className="mt-3 ml-3">0</h3></div>
                                <div onClick={() => this.handleButtons(".")} className="btn btn-outline-success col-md-3 ml-1 mr-1 mb-1"><h3 className="mt-3 ml-3">.</h3></div>
                            </div>
                        </div>

                        <div style={{ height:"300px", width:"18%"}}>
                            <div className="row ml-2 mr-0 p-3 mb-2 bg-success text-white shadow" style={{ height:"98px"}}>                               
                                <h4>Total:<br />
                                    <b className="ml-5 mt-2 mr-1 mb-1"><u>{this.props.Totali.toFixed(2)}</u> </b><img src={MoneyPNG} alt="Valute" width="35px" height="30px" /></h4>  
                                                    
                            </div>
                            <div className="row ml-2 mr-0 p-3 mb-2 bg-light text-dark shadow text-black-50" style={{ height:"98px"}}>
                                <h5>Have: <br />
                                    <b className="ml-5 mt-2 mr-1 mb-1">{this.state.HaveValue.toFixed(2)}</b><img src={MoneyPNG} alt="Valute" width="30px" height="25px" /></h5>
                            </div>
                            <div className="row ml-2 mr-0 p-3 mb-2 bg-light text-dark shadow text-black-50" style={{ height:"98px"}}>
                            <h5>Return: <br />
                                    <b className="ml-5 mt-2 mr-1 mb-1">{this.state.ValueToReturn.toFixed(2)}</b><img src={MoneyPNG} alt="Valute" width="30px" height="25px" /></h5>
                            </div>
                        </div>
                        <div style={{ height:"300px", width:"17%"}}>
                            {this.props.ScannerThermalFetched?
                            <button className="btn btn-warning btn-lg ml-5 mr-5 mt-2 mb-2 shadow" style={{height:"120px", width:"180px"}} onClick={() => this.props.handlePrinter()}>Submit with fiscal cupon {this.props.printerLoading? (<span><br /><span className="spinner-grow text-light"></span></span>):""}  </button>
                            :
                            <button className="btn btn-warning btn-lg ml-5 mr-5 mt-2 mb-2 shadow" style={{height:"120px", width:"180px"}}>Submit with fiscal cupon</button>
                            }
                            
                           
                            <button className="btn btn-primary btn-lg ml-5 mr-5  mt-2 mb-2 shadow" style={{height:"150px", width:"180px"}} onClick={() => this.props.finalSubmitOrder()} >Submit<br/>this order</button>
                        </div>

                    </div>
                    
                </div>
        );
    }
};

export default SubmitPage;
