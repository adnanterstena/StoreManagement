import * as React from 'react';
import MoneyPNG from "../../../images/MoneyPNG.png";

interface IState {
    rreshtaTeKategorise: number;
    ProductsForCategory: ProductsByCategory[];
    showProductInCategory: boolean;
    right8Products: ProductsByCategory[];
    show8ProductAtRight: boolean;
    getValueStr:string;
    confirmDeleteOrderBtn: boolean;
    addNewProdMsg: boolean;
    showAddNewItem: boolean;
    newOneItemName: string;
    newOneItemPrice: number;
    divProdHeight: string;
}
interface ProductsByCategory {
    id: number;
    emertimi: string;
    cmimi: number;
    barkodi: string;
    kategoria:number;
    sasiaEShitur:number;
    zbritja:number;
    otherInformation1: string;
    otherInformation2: string;
    otherInformation3: string;
    
}
interface ItemKategorite{
    id: number;
    emriKategorise: string;
}

class AddOrdersPage extends React.PureComponent<any, IState> {
    constructor(props: any) {
        super(props);
    
       
        this.state = {
            rreshtaTeKategorise: 8,
            ProductsForCategory: [],
            showProductInCategory: false,
            right8Products:[],
            show8ProductAtRight: false,
            getValueStr:"",
            confirmDeleteOrderBtn: false,
            addNewProdMsg: false,
            showAddNewItem:false,
            newOneItemName: "",
            newOneItemPrice: 0,
            divProdHeight: '350px'

        };
      }
 
    componentDidMount(){
            this.props.products.sort(function (a: { sasiaEShitur: number; }, b: { sasiaEShitur: number; }) {
                return b.sasiaEShitur - a.sasiaEShitur;
            });
            
            this.setState({right8Products: this.props.products.slice(0, 9), show8ProductAtRight: true});
            if(this.props.Kategorite.length <= 8){
                this.setState({divProdHeight: '392px'});
            }       
    }

    getProductBaseOnCategory(id: number): void {

        this.setState({ProductsForCategory: [], showProductInCategory: false})

        for (let index = 0; index < this.props.products.length; index++) { 
            const element = this.props.products[index];        
            if(element.kategoria === id){
                this.setState(previousState => ({
                    ProductsForCategory: [...previousState.ProductsForCategory, {
                        emertimi: element.emertimi,
                        id:element.id,
                        cmimi: element.cmimi,
                        barkodi: element.barkodi,
                        kategoria: element.kategoria,
                        sasiaEShitur: element.sasiaEShitur,
                        zbritja: element.zbritja,
                        otherInformation1: element.otherInformation1,
                        otherInformation2: element.otherInformation2,
                        otherInformation3: element.otherInformation3,
                    }]
                }));
            }
        }
        this.setState({showProductInCategory: true})
    }

    handleButtons (val:number|string): void {        
        this.setState({getValueStr: this.state.getValueStr + val})
        let x = parseFloat(this.state.getValueStr+val);
        x.toFixed(2);
       
        this.props.raisLastItemSasia(x);

    }
    
    raisLastItemSasia(arg0: number): void {
        if(this.props.lastProductsItem.sasiaEShitur + arg0 > 0){            
        this.props.raisLastItemSasia(this.props.lastProductsItem.sasiaEShitur + arg0);
        }
    }

    
    addtoProductOrdered(item: ProductsByCategory): void {
        this.props.addtoProductOrdered(item)
        this.setState({getValueStr: "", addNewProdMsg: true});
    }


    //To change state for Put a new one (button)
    changeAtrPrice(e: React.ChangeEvent<HTMLInputElement>) {
        let x = parseFloat(e.target.value)
        this.setState({newOneItemPrice: x})
    }
    changeAtrName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({newOneItemName: e.target.value})
    }
    submitNewOne(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();  
        console.log(this.state.newOneItemPrice)
        var item:ProductsByCategory = {
            id: -1,
            emertimi: this.state.newOneItemName,
            cmimi: this.state.newOneItemPrice,
            barkodi: "1111111111111",
            kategoria: 0,
            sasiaEShitur: 0,
            zbritja: 0,
            otherInformation1: "",
            otherInformation2: "",
            otherInformation3: "",
            
        }
        this.addtoProductOrdered(item);

        this.setState({showAddNewItem:false, newOneItemName: "", newOneItemPrice:0})
        
    }
    //-------------------------------------------



    public render() {
        return (
            <React.Fragment> 

                <div className="row">
                    <div className="col-md-3">
                    <div className="overflow-auto rounded shadow-sm" style={{height:"434px"}}>
                    <table className="table table-striped table-bordered table-sm mt-2" >
                            <thead className="thead-dark">
                                <tr>
                                    <th>Barcode</th>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th className="text-center"><img src={MoneyPNG} alt="Valute" width="25px" height="20px" /> Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.lastProductsItem.barkodi === ""? 
                                <tr>
                                    <td className="font-weight-light h2 text-muted text-center p-3" colSpan={4}>Start Scanning</td>
                                    </tr>:
                                <tr style={{cursor:"pointer"}} key={Math.random()} className="table-warning">
                                    <td>{this.props.lastProductsItem.barkodi.substring(0,6)}...</td>
                                    <td>{this.props.lastProductsItem.emertimi}</td>
                                    <td><b>{this.props.lastProductsItem.sasiaEShitur}</b></td>
                                    <td>{this.props.lastProductsItem.cmimi.toFixed(2)}</td>                                  
                                </tr>}                            
                                {this.props.productsOrdered.map((item: ProductsByCategory) => (                                   
                                    <tr style={{cursor:"pointer"}} key={Math.random()} onClick={() => {this.props.fromArrayAddItemToLastObject(item); this.setState({getValueStr: ""})}}>
                                        <td>{item.barkodi.substring(0,6)}...</td>
                                        <td>{item.emertimi}</td>
                                        <td>{item.sasiaEShitur}</td>
                                        <td>{item.cmimi.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> 
                        </div>
                    </div>

                    <div className="col-md-8">                      
                            <div className="row shadow-sm">
                                {this.props.Kategorite.map((item:ItemKategorite) => (
                                    
                                   
                                    <button key={item.id} 
                                            className="btn btn-light btn-secondary border border-black mb-1 text-truncate" 
                                            style={{width:"12.5%"}} 
                                            onClick={() => this.getProductBaseOnCategory(item.id)}
                                            >
                                        {item.emriKategorise}
                                    </button>
                                    
                                    ))
                                }
                                
                            </div>
                            <div className="row">
                                <div className="overflow-auto p-2 border border-light rounded shadow-sm container mb-2" style={{height:this.state.divProdHeight}}>
                                    {this.state.showAddNewItem?                                     
                                    <div className="p-3">
                                        <form onSubmit={e => this.submitNewOne(e)}>
                                            <div className="form-group row ml-5 p-2 col-md-10">
                                            <h4 className="font-weight-light col-md-12 mb-3">Add a new item to the list on the left</h4>                    
                                                <div className="col-md-4">
                                                    <label className="form-check-label">Product Name</label>
                                                    <input className="form-control" type="text" value={this.state.newOneItemName} onChange={(e) => this.changeAtrName(e)} />                        
                                                </div> 
                                                <div className="col-md-4">
                                                    <label className="form-check-label">Price</label>
                                                    <input autoFocus className="form-control" type="number" step="0.01" value={this.state.newOneItemPrice} onChange={(e) => this.changeAtrPrice(e)}  />                        
                                                </div> 
                                                <div className="col-md-4">
                                                    <button className="btn btn-primary ml-3 mt-4 pl-5 pr-5" type="submit">Add</button>
                                                    <button className="btn btn-outline-secondary ml-3 mt-4 pl-4 pr-4" onClick={() => this.setState({showAddNewItem:false})}>X</button>
                                                </div>
                                            </div> 

                                        </form>
                                    </div>
                                    :
                                    this.state.showProductInCategory?
                                    this.state.ProductsForCategory.map(item => (                                        
                                        <div style={{height:"56px"}} key={item.id} onClick={() => this.addtoProductOrdered(item)} className="col-md-3 btn btn-light btn-outline-primary shadow-sm text-truncate">
                                            <p>{item.emertimi} <br />
                                            <i style={{color:"#A9A9A9"}}>{item.cmimi.toFixed(2)} <img src={MoneyPNG} alt="Valute" width="25px" height="17px" /> {item.otherInformation1? "| "+ item.otherInformation1:""} {item.otherInformation2? " | "+item.otherInformation2:""} {item.otherInformation3? " | "+item.otherInformation3:""}</i> </p>
                                        </div> 
                                    ))                                    
                                    : ""}     
                                </div>
                            </div>                      
                        </div>

                        <div className="col-md-1 overflow-hidden rounded shadow-sm container pt-3" style={{height:"434px"}}>
                            
                            {
                                this.state.show8ProductAtRight? 
                                this.state.right8Products.map(item => (
                                    <button key={item.id} onClick={() => this.addtoProductOrdered(item)} className="btn btn-outline-primary btn-block shadow text-truncate">{item.emertimi}</button>
                                ))
                                :
                                ""
                            }
                            
                        
                        </div>

                        
                </div>
                <div className="row">
                   
                    <div className="col-md-3">
                    {this.props.lastProductsItem.barkodi === ""?<span className="mt-4 row"></span>:
                    <p className="text text-muted"><b>{this.props.productsOrdered.length + 1}</b> rows <span className="ml-5"> Total price:</span> <b>{this.props.Totali.toFixed(2)}</b> <img src={MoneyPNG} alt="Valute" width="22px" height="17px" /></p>
                     
                    }
                       


                    <button className="col-md-9 btn btn-warning btn-lg ml-5 mr-5 mt-4 mb-2 shadow" style={{height:"150px"}} onClick={() => this.props.clickChangeOrder()}>Add this order<br /><span className="text-muted">also go back</span></button>



                    </div>
                  
                    <div className="col-md-3">
                        {this.state.addNewProdMsg? 
                        <p className="text-success"><u>{this.props.lastProductsItem.emertimi}</u> added</p>
                        :
                        <p className="text-success pt-3"></p>
                        }
                        <div onClick={() => this.raisLastItemSasia(-1)} className="btn btn-outline-dark col-md-5 ml-4 mt-1 mb-2 shadow"><h1 className="m-3">-</h1></div>
                        <div onClick={() => this.raisLastItemSasia(1)} className="btn btn-outline-dark col-md-5 ml-2 mt-1 mb-2 shadow"><h1 className="m-3">+</h1></div>
                        <div className="btn btn-outline-danger col-md-5 ml-4 mb-1 shadow" onClick={() =>this.props.emptyLastProductsItem()}><h3 className="m-3">Delete</h3></div>
                        <div className="btn btn-light btn-outline-dark col-md-5 ml-2 mb-1 shadow disabled"><h3 className="m-3 border rounded">{this.props.lastProductsItem.sasiaEShitur}</h3></div>
                    </div>
                    <div className="col-md-4">
                        <div className="row ml-0 mr-0 mt-1">
                            <div onClick={() => this.handleButtons(7)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">7</h3></div>
                            <div onClick={() => this.handleButtons(8)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">8</h3></div>
                            <div onClick={() => this.handleButtons(9)} className="btn btn-light btn-outline-success col-md-3 ml-1 mr-1 mb-1 shadow"><h3 className="mt-3 ml-3">9</h3></div>
                        </div>
                        <div className="row ml-0 mr-0">
                            <div onClick={() => this.handleButtons(4)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">4</h3></div>
                            <div onClick={() => this.handleButtons(5)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">5</h3></div>
                            <div onClick={() => this.handleButtons(6)} className="btn btn-light btn-outline-success col-md-3 ml-1 mr-1 mb-1 shadow"><h3 className="mt-3 ml-3">6</h3></div>
                        </div>  
                        <div className="row ml-0 mr-0">
                            <div onClick={() => this.handleButtons(1)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">1</h3></div>
                            <div onClick={() => this.handleButtons(2)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">2</h3></div>
                            <div onClick={() => this.handleButtons(3)} className="btn btn-light btn-outline-success col-md-3 ml-1 mr-1 mb-1 shadow"><h3 className="mt-3 ml-3">3</h3></div>
                        </div>  
                        <div className="row ml-0 mr-0">
                            <div className="col-md-3 ml-1 mb-1 shadow"></div>
                            <div onClick={() => this.handleButtons(0)} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="mt-3 ml-3">0</h3></div>
                            <div onClick={() => this.setState({getValueStr: ""})} className="btn btn-light btn-outline-success col-md-3 ml-1 mb-1 shadow"><h3 className="m-3">...</h3></div>
                        </div> 
                    </div>
                   
                    <div className="col-md-2">
                            <br />
                            {this.state.confirmDeleteOrderBtn?
                            <div>
                                <p className="text text-info ml-1 mt-2 mb-1">Are you sure?</p>
                            <button className="btn btn-outline-dark btn-lg mt-0 mr-2 shadow" onClick={() => this.setState({confirmDeleteOrderBtn: false})}>No</button>
                            <button className="btn btn-outline-danger btn-lg mt-0 mr-5 pl-4 pr-4 shadow" onClick={() => {this.props.emptyProductOrder();this.setState({confirmDeleteOrderBtn: false, addNewProdMsg: false})}}>Yes</button>
                            </div>
                            :                            
                            <button className="btn btn-outline-danger btn-lg mt-5 mr-5 shadow" onClick={() => this.setState({confirmDeleteOrderBtn: true})}>Cancel this orders</button>
                            }
                            <button className="btn btn-outline-secondary btn-lg mt-4 pl-4 pr-4 mr-4 shadow" onClick={() => this.setState({showAddNewItem: !this.state.showAddNewItem})}>Put a new one</button>


                    </div>                     
                </div>
                    
            </React.Fragment> 
        );
    }
   
   
};

export default AddOrdersPage;
