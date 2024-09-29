import * as React from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import MoneyPNG from "../../../images/MoneyPNG.png";
import BarcodeReader from 'react-barcode-reader';

interface IState {
    ProductName?:string;
    Barcode?:string;
    Lloji?:string;
    Sasia?:number;
    Price?:number;
    Zbritja?:number;
    DataProdhimit?:Date;
    DataSkadimit?:Date;
    OtherInformation1?:string;
    OtherInformation2?:string;
    OtherInformation3?:string;
    Loading?: boolean,
    ShowCredMsg?: boolean,
    LoadingCategory?: boolean,
    CategoryName?:string,
    LoadingtableCategory?: boolean,
    Categories?:CategoryItem[],
    Page?: number,
    AddedCatOnChange?: boolean,
    showAddCategory?: boolean,
    loadingEditCategory?: boolean,
    changeInputNameOfCategory?:string,
    idchangeInputNameOfCategory?:number,
    ProductAddedMsg?:boolean,
    defaultBarcodeWK?: boolean,
    barcodeKey?: number,
}


interface CategoryItem {
    id: number;
    emriKategorise: string;
}





class AddProducts extends React.PureComponent<{}, IState> {
    constructor(props: any) {
        super(props);
    
        this.state = {
            ProductName:"",
            Barcode:"",
            Lloji:"",
            Sasia:0,
            Price:0,
            Zbritja:0,
            DataProdhimit: new Date(),
            DataSkadimit: new Date(),
            OtherInformation1:"",
            OtherInformation2:"",
            OtherInformation3:"",
            Loading: false,
            ShowCredMsg: false,
            LoadingCategory: false,
            CategoryName:"",
            LoadingtableCategory: true ,
            Categories:[],
            AddedCatOnChange: false,
            showAddCategory: true,
            loadingEditCategory: false,
            changeInputNameOfCategory:"",
            idchangeInputNameOfCategory:0,
            ProductAddedMsg:false,
            defaultBarcodeWK: true,
            barcodeKey: 0,
            
        };
      }

    componentDidMount(){
    this.fetchCategories();
    this.setState({LoadingtableCategory: false})
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
    
    change(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ProductAddedMsg:false})
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    _handleChangeSelect(e:React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ Lloji: e.currentTarget.value }) 
    }

    handleDataProdhimit = (date: Date) => {
    this.setState({
        DataProdhimit: date
    });
    };
    handleDataSkadimit = (date: Date) => {
    this.setState({
        DataSkadimit: date
    });
    };


     
    submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();   
        this.setState({Loading: true});
        axios.post(`api/Management/AddProducts`, {
                ProductName: this.state.ProductName,
                OtherInformation1: this.state.OtherInformation1,
                OtherInformation2: this.state.OtherInformation2,
                OtherInformation3: this.state.OtherInformation3,
                Lloji: this.state.Lloji,
                
        },{
            params:{
                Barcode: this.state.Barcode,
                Sasia: this.state.Sasia,
                Price: this.state.Price,
                Zbritja: this.state.Zbritja,
                DataProdhimit: this.state.DataProdhimit,
                DataSkadimit: this.state.DataSkadimit,
            }
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({ProductName:"",Barcode:"", ProductAddedMsg: true, Loading: false});
        }else{
            this.setState({Loading: false, ShowCredMsg: true});        
        }
        })
        .catch( () => {
            this.setState({Loading: false, ShowCredMsg: true});
        }); 

    }

    
    changeCategoryAdded(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({AddedCatOnChange: false, [e.target.name]: e.target.value})
    }
    changeInput(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }

    submitCategory(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.setState({LoadingCategory: true})
        axios.post(`api/Management/AddCategory`, {
            CategoryName: this.state.CategoryName            
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({LoadingCategory: false,AddedCatOnChange: true});            
            this.fetchCategories();
        }else{
            this.setState({LoadingCategory: false});
        }
        })
        .catch( () => {
            this.setState({LoadingCategory: false});
        }); 
    }

    
    seeAllCategories() {
        return(
            <div>
                <table className="table table-hover text-center">
                <thead className="thead-dark">
                <tr className="d-table-row">
                    <th>Category Name</th>
                    <th></th>
                </tr>
                </thead>
                            
                {this.state.LoadingtableCategory ? 
                <tbody className="text-body">
                    <tr>
                        <td>Loading...</td>
                    </tr>
                </tbody>
                :                
                this.state.Categories ?
                <tbody className="text-body">
                {this.state.Categories.map((item) => (
                <tr key={item.id} className="d-table-row">   
                    <td>{item.emriKategorise}</td>                                     
                    <td><button className="btn btn-outline-info" onClick={() => this.setStateForChangeCategory(item.emriKategorise, item.id)}>Edit</button></td>
                </tr>                                 
                ))}                    
                </tbody>
                :
                ""
                }               
                </table>
                {this.state.Categories ? 
                <h3 className="text text-info font-weight-light font-italic text-right">You have <u>{this.state.Categories.length}/15</u> Categories.</h3>
               
                :
                ""
                }               
             

            </div>
        )
    }
    setStateForChangeCategory(emriKategorise: string, id: number): void {
        this.setState({loadingEditCategory: true, changeInputNameOfCategory:emriKategorise, idchangeInputNameOfCategory:id})
    }
    
    submitEditCategory(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        this.setState({LoadingCategory:true})

        axios.put(`api/Management/EditCategory`, {
            CategoryName: this.state.changeInputNameOfCategory,          
        },{
            params:{
                id: this.state.idchangeInputNameOfCategory
            }
        })
        .then( (response) => {
        if(response.status === 200){
            this.fetchCategories();            
            this.setState({loadingEditCategory:false, LoadingtableCategory: true});
        }
        })
        .catch(); 

        this.setState({LoadingCategory: false}); 

        // in status 200 -> 
    }


    fetchCategories() {
        axios.get(`api/Management/GetCategories`,{      
        })
        .then( (response) => {
        if(response.status === 200){
            this.setState({Categories: response.data, LoadingtableCategory: !this.state.LoadingtableCategory});
            if(response.data.length >= 15) this.setState({showAddCategory: false});
        }
        })
        .catch(); 
    }

    handleScan = (data: string) => {
       this.setState({Barcode: data})        
    }
    handleError(err: any){
    console.log(err)
    }    

  
    public render() {
              
        return (   
            <div className="container">
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
                
                <h1 className=" font-weight-lighter col-md-12">Add Products
                <Link to="/Products" className="btn btn-secondary mt-3 mr-4 float-right">See Products</Link></h1>
       
            {
            this.state.ShowCredMsg ? 
            <p className="text-danger">Check if you have filled in the Product Name</p>
            :
            ""
            }
            <div className="col-md-12" >

            <br />
            <form onSubmit={e => this.submit(e)} className="form-group">       
              
               
                <div className="form-group row border rounded-lg p-2 col-md-12">                         
                    <div className="col-md-4">
                        <label className="form-check-label">Product Name  <b className="text-danger">*</b></label>
                        <input className="form-control" type="text" name="ProductName" value={this.state.ProductName} onChange={e => this.change(e)} />                        
                    </div>                            
                    <div className="col-md-4">
                        <label className="form-check-label">Barcode</label>
                        <input className="form-control" type="text" name="Barcode" placeholder="Scan for barcode" value={this.state.Barcode} onChange={e => this.change(e)} />                      
                    </div>                   
                    <div className="col-md-4">
                        <label className="form-check-label">Category (Type)</label>
                        <select className="form-control" name="Lloji" onChange={ e => this._handleChangeSelect(e)}>
                        {this.state.Categories ?  this.state.Categories.map((item) => (
                        <option key={item.id} >{item.emriKategorise}</option> 
                         ))  
                         :
                         ""
                         }
                         <option></option> 
                                          
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-check-label">Price <img src={MoneyPNG} alt="Valute" width="30px" height="20px" /></label>
                        <input className="form-control" type="number" step="0.01" name="Price" onChange={e => this.change(e)} />
                    </div>                        
                    <div className="col-md-4">
                        <label className="form-check-label">Price Discount (-<img src={MoneyPNG} alt="Valute" width="30px" height="20px" />)</label>
                        <input className="form-control" type="number" step="0.01" name="Zbritja" onChange={e => this.change(e)} />
                    </div>
                </div>
                <div className="form-group row border rounded-lg p-2 col-md-12">
                <h4 className="font-weight-light col-md-12">Other informations... <span className="ml-5"></span> <small className="text-muted ml-5 pl-3">example: __pound, __kg, __inches, __mm etc.</small></h4>                    
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="OtherInformation1" onChange={e => this.change(e)} />                        
                    </div> 
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="OtherInformation2" onChange={e => this.change(e)} />                        
                    </div> 
                    <div className="col-md-4">
                        <input className="form-control" type="text" name="OtherInformation3" onChange={e => this.change(e)} />                        
                    </div> 
                </div> 

                <div className="form-group row border rounded-lg p-2 col-md-12">  
                    <div className="col-md-4">
                        <label className="form-check-label">Quantity</label>
                        <input className="form-control" type="number" name="Sasia" onChange={e => this.change(e)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-check-label">Date of manufacture</label>
                        <input className="form-control" type="Date" name="DataProdhimit" onChange={e => this.change(e)} /> 
                    </div>      
                    <div className="col-md-4">
                        <label className="form-check-label">Expiration date</label>
                        <input className="form-control" type="Date" name="DataSkadimit" onChange={e => this.change(e)} /> 
                    </div>                 
                </div>
                <div className="row">
                    {this.state.ProductAddedMsg? 
                    <h3 className="col-md-10 text text-success inline-block pl-5">This product added successfully</h3>                    
                    :
                    <div className="col-md-10 "></div>
                    }
                
                {
                    this.state.Loading ?
                    <button className="btn btn-primary btn-lg disabled float-right mr-3" disabled>
                    <span className="spinner-border"></span>
                    </button>
                    :                
                    <button className="btn btn-primary btn-lg disabled float-right mr-3" type="submit">Save Product</button>     
                }
                </div>
            </form>
            </div>
            <br />
            <br />
            <hr />

            {this.state.showAddCategory? 

                <form onSubmit={e => this.submitCategory(e)} className="form-group container-fluid row"> 
                <h1 className="col-md-4 card-title font-weight-lighter mt-2">New Category</h1>

                <div className="col-md-4">
                    <label className="form-check-label">Category Name  <b className="text-danger">*</b></label>
                    <input className="form-control" type="text" name="CategoryName" onChange={e => this.changeCategoryAdded(e)} />                        
                </div>
                {this.state.AddedCatOnChange ? <p className="col-md-2 mt-3 pt-2 text-success"> {this.state.CategoryName} Added</p>:<div className="col-md-2"></div>}                
                <div  className="col-md-2 mt-3 pt-1">   
                {
                this.state.LoadingCategory ?
                <button className="btn btn-primary float-right" disabled>
                <span className="spinner-border"></span>
                    </button>
                :                
                <button className="btn btn-primary float-right" type="submit">Save Category</button>     
                }
                </div>  
                </form>
            :
            ""}

            {this.state.loadingEditCategory? 
            <div>
                <hr />

                <form onSubmit={e => this.submitEditCategory(e)} className="form-group container-fluid row"> 
                <h1 className="col-md-4 card-title font-weight-lighter mt-2">Edit this Category</h1>
                <div className="col-md-4">
                    <label className="form-check-label">Category</label>
                    <input autoFocus className="form-control" type="text" name="changeInputNameOfCategory" value={this.state.changeInputNameOfCategory} onChange={e => this.changeCategoryAdded(e)} />                        
                </div>
                {this.state.AddedCatOnChange ? <p className="col-md-2 mt-3 pt-2 text-success"> {this.state.changeInputNameOfCategory} Added</p>:<div className="col-md-2"></div>}                
                <div  className="col-md-2 mt-3 pt-1">   
                {
                this.state.LoadingCategory ?
                <button className="btn btn-primary float-right" disabled>
                <span className="spinner-border"></span>
                    </button>
                :
                <div>
                    <button className="btn btn-outline-secondary" onClick={() => this.setState({LoadingCategory: false})}>Cancel</button>           
                    <button className="btn btn-primary float-right ml-1" type="submit">Save</button>
                </div>    
                }
                </div>  
                </form>


                <hr />
            </div>
            
            :            
            ""}
            

            <button className="btn btn-light col-md-12" onClick={() =>this.fetchCategories()}>See all Categories</button> 
            {this.state.LoadingtableCategory?
            ""
            :
            this.seeAllCategories()
            }

            <br />
            <hr />
              
        </div>
        );
    }

};

export default AddProducts;