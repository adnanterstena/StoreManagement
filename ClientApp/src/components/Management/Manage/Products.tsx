import * as React from 'react';
import axios from "axios";

import MoneyPNG from "../../../images/MoneyPNG.png";
import SortIcone from "../../../images/sortIcone.png";
import { Link } from 'react-router-dom';

import BarcodeReader from 'react-barcode-reader';

interface IProps{
}
interface IState {
    Products: ProdItem[];
    Loading: boolean;
    showEditContainer: boolean;
    EDbarkodi:string,
    EDcmimi:number,
    EDdataProdhimit: Date,
    EDdataSkadimit: Date,
    EDemriProduktit: string,
    EDid: number,
    EDkategoria: string,
    EDotherInformation1: string,
    EDotherInformation2: string,
    EDotherInformation3: string,
    EDsasia: number,
    EDsasiaEshitur: number,
    EDzbritja: number,
    showCategoriesData: boolean,
    Categories:CategoryItem[],
    defaultBarcodeWK: boolean,
    barcodeKey: number,
}   

interface CategoryItem {
    id: number;
    emriKategorise: string;
}

interface ProdItem {
    barkodi:string;
    cmimi:number;
    dataProdhimit: Date;
    dataSkadimit:Date;
    emriProduktit:string;
    id:number;
    kategoria:string;
    otherInformation1:string;
    otherInformation2:string;
    otherInformation3:string;
    sasia:number;
    sasiaEShitur:number;
    zbritja:number;

}
class Products extends React.PureComponent<IProps, IState | any> {  
    constructor(props: any) {
        super(props);
    
        this.state = {
            Products: [],
            Loading: true,
            showEditContainer:false,
            showCategoriesData: false,
            Categories:[],
            
            EDbarkodi: "",
            EDcmimi:0,
            EDdataProdhimit: new Date(),
            EDdataSkadimit: new Date(),
            EDemriProduktit: "",
            EDid: 0,
            EDkategoria: "",
            EDotherInformation1: "",
            EDotherInformation2: "",
            EDotherInformation3: "",
            EDsasia: 0,
            EDsasiaEshitur: 0,
            EDzbritja: 0,
            defaultBarcodeWK: true,
            barcodeKey: 0,
        };
      }

    componentDidMount(){
        this.fetchProducts();
        this.fetchSTData();
    }

    private fetchSTData() {
        axios.get(`api/Management/GetScannerKey`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({barcodeKey: response.data});
                    if(response.data !== 0){
                        this.setState({defaultBarcodeWK:false})
                    }
                }
            })
            .catch();            
    }

    fetchProducts(){
    axios.get(`api/Management/GetProducts`)
    .then( (response) => {
    if(response.status === 200){
        this.setState({Products: response.data})
        this.setState({Loading: false})
    }
    })
    .catch(); 
    }
 
    deleteProduct(id: number): void {
        axios.delete(`api/Management/DeleteProdukt`,{
            params:{                
                id: id
            }
        })
        .then( (response) => {
            if(response.status === 200){
                this.fetchProducts();
            }
        })
        .catch(); 
    }



    fetchCategories() {
        if(this.state.Categories.length === 0){
        axios.get(`api/Management/GetCategories`,{      
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({Categories: response.data, showCategoriesData: true});
        }
        })
        .catch(); 
        }
    }

    editRowMethod(item: ProdItem): void {
        this.setState({ EDbarkodi:item.barkodi,
                        EDcmimi:item.cmimi,
                        EDdataProdhimit: item.dataProdhimit,
                        EDdataSkadimit: item.dataSkadimit,
                        EDemriProduktit: item.emriProduktit,
                        EDid: item.id,
                        EDkategoria: item.kategoria,
                        EDotherInformation1: item.otherInformation1,
                        EDotherInformation2: item.otherInformation2,
                        EDotherInformation3: item.otherInformation3,
                        EDsasia: item.sasia,
                        EDsasiaEshitur: item.sasiaEShitur,
                        EDzbritja: item.zbritja,                        
                        showEditContainer: true
        })
        
        this.fetchCategories();
    }
    
    submit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.setState({Loading: true});  
        
        
        axios.put(`api/Management/EditProducts`, {
                emriProduktit: this.state.EDemriProduktit,
                kategoria: this.state.EDkategoria,
                otherinformation1: this.state.EDotherInformation1,
                otherinformation2 : this.state.EDotherInformation2,
                otherinformation3: this.state.EDotherInformation3,                
        },{
            params:{                
                barkodi: this.state.EDbarkodi,
                cmimi: this.state.EDcmimi,
                zbritja: this.state.EDzbritja,
                id: this.state.EDid,
                sasia: this.state.EDsasia,
                sasiaEshitur: this.state.EDsasiaEshitur,
                dataProdhimit: this.state.EDdataProdhimit,
                dataskadimit: this.state.EDdataSkadimit,
            }
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({showEditContainer: false})
            this.fetchProducts();
        }else{
            this.setState({Loading: false});        
        }
        })
        .catch( () => {
            this.setState({Loading: false});
        }); 
    }
         
    change(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) {
            this.setState({
                [e.target.name]: e.target.value
            });

    }


    private formForEditProducts(): React.ReactNode {
        return <form onSubmit={e => this.submit(e)} className="form-group container">

            <div className="form-group row border rounded-lg p-2 col-md-12">
                <div className="col-md-4">
                    <label className="form-check-label">Product Name</label>
                    <input autoFocus className="form-control" type="text" name="EDemriProduktit" value={this.state.EDemriProduktit} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Barcode</label>
                    <input className="form-control" type="text" name="EDbarkodi" value={this.state.EDbarkodi} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Category (Type)</label>
                    <select className="form-control" name="EDkategoria" onChange={e => this.change(e)}>
                        <option>{this.state.EDkategoria}</option>
                        {this.state.showCategoriesData ?                         
                        this.state.Categories.map((item:CategoryItem) => (
                        <option key={item.id} >{item.emriKategorise}</option> 
                         ))
                         :
                         ""}
                        <option></option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-check-label">Price</label>
                    <input className="form-control" type="number" step="0.01" name="EDcmimi" value={this.state.EDcmimi} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Price Discount</label>
                    <input className="form-control" type="number" step="0.01" name="EDzbritja" value={this.state.EDzbritja} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Quantity</label>
                    <input className="form-control" type="number" name="EDsasia" value={this.state.EDsasia} onChange={e => this.change(e)} />
                </div>
            </div>
            <div className="form-group row border rounded-lg p-2 col-md-12">
                <h4 className="font-weight-light col-md-12">Other informations...</h4>

                <div className="col-md-4">
                    <input className="form-control" type="text" name="EDotherInformation1" value={this.state.EDotherInformation1} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <input className="form-control" type="text" name="EDotherInformation2" value={this.state.EDotherInformation2} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <input className="form-control" type="text" name="EDotherInformation3" value={this.state.EDotherInformation3} onChange={e => this.change(e)} />
                </div>
            </div>

            <div className="form-group row border rounded-lg p-2 col-md-12">
                <div className="col-md-4">
                    <label className="form-check-label">Quantity sold</label>
                    <input className="form-control" type="number" name="EDsasiaEshitur" value={this.state.EDsasiaEshitur} onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Date of manufacture</label>
                    <input className="form-control" type="Date" name="EDdataProdhimit" onChange={e => this.change(e)} />
                </div>
                <div className="col-md-4">
                    <label className="form-check-label">Expiration date</label>
                    <input className="form-control" type="Date" name="EDdataSkadimit" onChange={e => this.change(e)} />
                </div>
            </div>
            <button className="btn btn-outline-secondary mt-1" onClick={() => this.setState({showEditContainer: false})}>Cancel</button>
            {this.state.Loading ?
                <button className="btn btn-primary btn-lg disabled float-right mr-3" disabled>
                    <span className="spinner-border"></span>
                </button>
                :
            <button className="btn btn-primary btn-lg disabled float-right mr-3" type="submit">Save this Product</button>}

            <br />
            <br />
            <br />
            <hr />
        </form>
    }

    async sortMeth(arg0: number): Promise<void> {
        if(arg0 === 1)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { emriProduktit: any; }, b: { emriProduktit: any; }) {
                return a.emriProduktit.localeCompare(b.emriProduktit);
            });
            this.setState({Loading: false})
        }else if(arg0 === 2)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { kategoria: any; }, b: { kategoria: any; }) {
                return a.kategoria.localeCompare(b.kategoria);
            });
            this.setState({Loading: false})

        }else if(arg0 === 3)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { zbritja: number; }, b: { zbritja: number; }) {
                return b.zbritja - a.zbritja;
            });
            this.setState({Loading: false})
            
            
        }else if(arg0 === 4)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { sasia: number; }, b: { sasia: number; }) {
                return a.sasia - b.sasia;
            });
            this.setState({Loading: false})
            
        }else if(arg0 === 5)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { sasiaEShitur: number; }, b: { sasiaEShitur: number; }) {
                return b.sasiaEShitur - a.sasiaEShitur;
            });
            this.setState({Loading: false})
            
        }else if(arg0 === 6)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { dataProdhimit:string ; }, b: { dataProdhimit:string ; }) {
                return Date.parse(a.dataProdhimit) - Date.parse(b.dataProdhimit);
            });
            this.setState({Loading: false})
            
        }else if(arg0 === 7)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { dataSkadimit: string; }, b: { dataSkadimit: string; }) {
                return Date.parse(a.dataSkadimit) - Date.parse(b.dataSkadimit);
            });
            this.setState({Loading: false})
            
        }else if(arg0 === 8)
        {
            this.setState({Loading: true})
            await  this.state.Products.sort(function (a: { cmimi: number; }, b: { cmimi: number; }) {
                return b.cmimi - a.cmimi;
            });
            this.setState({Loading: false})
        }
    }
    
    handleScan = (data: string) => {
        let arr = this.state.Products;
        let item:ProdItem = arr.find((element: { barkodi: string; }) => element.barkodi === data);
        if(item !== undefined){
            this.editRowMethod(item);
        }
        
    }
    handleError(err: any){
    console.log(err)
    }

    public render() { 
        return (
            <div>   
                {this.state.defaultBarcodeWK?
                    <BarcodeReader
                        onError={this.handleError}
                        onScan={this.handleScan}
                    />
                    :
                    <BarcodeReader
                        onError={this.handleError}
                        onScan={this.handleScan}
                        scanButtonKeyCode={this.state.barcodeKey}
                    />
                }               
                     
                <h1 className="font-weight-lighter container">Products
                <Link to="/AddProducts" className="btn btn-secondary mt-3 mr-4 float-right">Add new item</Link></h1>
                <hr />

                {this.state.showEditContainer?                
                this.formForEditProducts()
                :
                ""}
                <p className="text-right text-info">Scan the barcode to find the product and you can change it.</p>
                <table className="table table-hover table-bordered text-center p-5">
                <thead className="thead-dark">
                <tr className="d-table-row">
                    <th className="border border-silver"></th>
                    <th className="border border-silver" style={{cursor:"pointer"}} 
                        onClick={() => this.sortMeth(1)} >Product Name <img src={SortIcone} alt="Sorting" width="10px" height="15px" />
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer"}} 
                        onClick={() => this.sortMeth(2)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> Category
                    </th>
                    <th className="border border-silver">Barcode</th>
                    <th className="border border-silver" colSpan={3}>Other informations</th>
                    <th className="border border-silver text-center"style={{cursor:"pointer"}} 
                     onClick={() => this.sortMeth(8)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /><img src={MoneyPNG} alt="Valute" width="30px" height="25px" /><br/>Price
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer"}} 
                     onClick={() => this.sortMeth(3)}><img src={SortIcone} alt="Sorting" width="10px" height="15px"className="mb-1" /><img src={MoneyPNG} alt="Valute" width="20px" height="20px" className="mb-1" /> Price Discount
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer"}} 
                      onClick={() => this.sortMeth(4)}><img src={SortIcone} alt="Sorting" width="10px" height="15px" /> Quantity
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer"}} 
                     onClick={() => this.sortMeth(5)}>Quantity sold <img src={SortIcone} alt="Sorting" width="10px" height="15px" />
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer", width:"120px"}} 
                        onClick={() => this.sortMeth(6)}>Date of <img src={SortIcone} alt="Sorting" width="10px" height="15px" /> manufacture
                    </th>
                    <th className="border border-silver" style={{cursor:"pointer", width:"120px"}} 
                        onClick={() => this.sortMeth(7)}>Expiration date <img src={SortIcone} alt="Sorting" width="10px" height="15px" />
                    </th>
                    <th  className="border border-silver" colSpan={2}></th>
                </tr>
                </thead>
            
                    {this.state.Loading ? 
                    <tbody className="text-body">
                        <tr>
                            <td><div className="spinner-border text-primary ml-2 p-2"></div></td>
                        </tr>
                    </tbody>
                    
                    :
                    <tbody className="text-body">
                    {this.state.Products.map((item: ProdItem) => (            
                        <tr key={item.id} className="d-table-row">
                            <td><b>{this.state.Products.indexOf(item)+1}.</b></td>
                            <td><b>{item.emriProduktit}</b></td>
                            <td>{item.kategoria}</td>
                            <td>{item.barkodi}</td>
                            <td>{item.otherInformation1}</td>
                            <td>{item.otherInformation2}</td>
                            <td>{item.otherInformation3}</td>
                            <td><b>{item.cmimi.toFixed(2)}</b></td>
                            <td>(-{item.zbritja.toFixed(2)})</td>
                            <td>{item.sasia}</td>
                            <td>{item.sasiaEShitur}</td>
                            <td>{new Intl.DateTimeFormat('en-GB', { 
                                                            month: 'short', 
                                                            day: '2-digit',
                                                            year: 'numeric', 
                                                        }).format(new Date(item.dataProdhimit))}</td>
                            <td><b>{new Intl.DateTimeFormat('en-GB', { 
                                                            month: 'short', 
                                                            day: '2-digit',
                                                            year: 'numeric', 
                                                        }).format(new Date(item.dataSkadimit))}</b></td>
                            <td><button className="btn btn-outline-primary pl-3 pr-3" onClick={() => this.editRowMethod(item)}>Edit</button></td> 
                                                
                            <td><button className="btn btn-outline-danger" onClick={() => {if (window.confirm('Are you sure you want to delete: '+item.emriProduktit+"?")) this.deleteProduct(item.id)}}>Delete</button></td>
                        </tr>
                        ))}               
                    </tbody>
                }               
                </table>                    
            </div>
        );
    }
    
  

 
};

export default Products;