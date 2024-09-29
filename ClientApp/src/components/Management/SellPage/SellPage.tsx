import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../../../store';
import AddOrdersPage from './AddOrdersPage';
import SubmitPage from './SubmitPage';
import * as ProductsStore from '../../../store/FetchProductsForStore';
import BarcodeReader from 'react-barcode-reader';
import {Printer, Model, WebUSB, Style, Align, Drawer} from "escpos-buffer"
import Axios from 'axios';

type ProductsProps =
  ProductsStore.ProductsState // ... state we've requested from the Redux store
  & typeof ProductsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


interface IState {
    submitOrder: boolean;
    productsOrdered: ProductsItem[];
    Totali:number;
    LastProductsItem: ProductsItem;
    
    Kategorite: ItemKategorite[];
    savedOrder: any;
    timeOfSaveOrder: objDN [];
    firmName: string;
    Printer: any;
    printerLoading: boolean;
    vat: number;
    barcodeKey: number;
    cuponQr: string;
    thermalModel: string;
    thermalVendoId: string;
    ScannerThermalFetched: boolean;
    defaultBarcodeWK: boolean;
    
}    
interface objDN {
    totali: number,
    time: string,
}

interface ProductsItem {
    id: number;
    emertimi: string;
    cmimi: number;
    barkodi: string;
    kategoria:number;
    sasiaEShitur:number;
    zbritja:number;
    vlera:number;
}

interface ItemKategorite{
    id: number;
    emriKategorise: string;
}

class SellPage extends React.PureComponent<ProductsProps, IState> {
    constructor(props: any) {
        super(props);
    
        this.state = {
            submitOrder: false,
            productsOrdered:[],
            Totali:0,
            LastProductsItem: {barkodi:"",cmimi:0,emertimi:"",id:0,kategoria:0,sasiaEShitur:0,vlera:0,zbritja:0},            
            Kategorite: [],
            savedOrder: [],
            timeOfSaveOrder:[],
            firmName: "",
            Printer: undefined,
            printerLoading: false,    
        
            barcodeKey:0,
            vat:0,
            thermalModel:"",
            thermalVendoId:"",
            cuponQr:"",
            ScannerThermalFetched: false,
            defaultBarcodeWK: true,
        }
    };
        
    componentDidMount() {    
      this.ensureDataFetched();
      Axios.get(`ProductForStoreForecast/GetCategoriesFS`)
      .then( (response) => {
      if(response.status === 200){
          this.setState({Kategorite: response.data})
      }
      })
      .catch(); 

      this.getNameOfFirm();      
      this.fetchSTData(); 
    }

    getNameOfFirm = () => {
      Axios.get(`ProductForStoreForecast/FirmName`)
      .then( (response) => {
      if(response.status === 200){
          this.setState({firmName: response.data})
      }
      })
      .catch(); 
    }

    finalSubmitOrder = () =>{ 
        let fetchArr = [];
        if(this.state.productsOrdered.length > 0){
            this.state.productsOrdered.map(item =>  (            
                fetchArr.push({
                    id: item.id,
                    sasiaEShitur: item.sasiaEShitur
                })
            ))
        }
        if(this.state.LastProductsItem.id !== 0){
            fetchArr.push({id: this.state.LastProductsItem.id, sasiaEShitur:this.state.LastProductsItem.sasiaEShitur})
        }

        if(fetchArr.length > 0){        
            Axios({
                method: 'post',
                url: `api/Sell/PostOrders`,
                data: fetchArr,            
                params: {totali:this.state.Totali},
            })
            .then()
            .catch();
        }
        
        this.emptyProductOrder();
    }

    private ensureDataFetched() {
      this.props.requestProducts();
    }

    emptyProductOrder = () =>{
        this.setState({productsOrdered: [],Totali:0,
                       LastProductsItem:{barkodi:"",cmimi:0,emertimi:"",id:0,kategoria:0,sasiaEShitur:0,vlera:0,zbritja:0}});
        
    }

    emptyLastProductsItem = () =>{
        var newArray = this.state.productsOrdered;
        var newItem = newArray.pop();

        if(newItem !== undefined){  
        const vlera = this.state.Totali - this.state.LastProductsItem.vlera;        
        this.setState({Totali:vlera,LastProductsItem: newItem, productsOrdered: newArray });
        }else{
            this.setState({Totali: 0, LastProductsItem:{barkodi:"",cmimi:0,emertimi:"",id:0,kategoria:0,sasiaEShitur:0,vlera:0,zbritja:0} })
        }
    }

    fromArrayAddItemToLastObject = (addItem:ProductsItem ) =>{        
        var newArr = this.state.productsOrdered;
        var indexOfItem = newArr.indexOf(addItem);
        var itemForArray = this.state.LastProductsItem;
        newArr[indexOfItem] = itemForArray;
        this.setState({productsOrdered: newArr, LastProductsItem: addItem})
    }

    changeSubOrder = () =>{
        this.setState({submitOrder: !this.state.submitOrder});
    }

    addtoProductOrdered = (item:ProductsItem): any => {
        item.sasiaEShitur = 1;
        item.vlera = (item.cmimi - item.zbritja) * item.sasiaEShitur;
        if(this.state.LastProductsItem.id !== 0){        
            this.setState(previousState => ({
                productsOrdered: [...previousState.productsOrdered, this.state.LastProductsItem]
            }));
        }        
        this.setState({LastProductsItem:item})
        this.setState({Totali: this.state.Totali + item.vlera});
    }

    raisLastItemSasia = (nr:number) => {
        
        let sasiaERe  = nr - this.state.LastProductsItem.sasiaEShitur;   
        let vleraERe = (this.state.LastProductsItem.cmimi - this.state.LastProductsItem.zbritja) * sasiaERe;

        this.setState({Totali: this.state.Totali + vleraERe});

        let jasperCopy = Object.assign({}, this.state.LastProductsItem);
            jasperCopy.sasiaEShitur =  this.state.LastProductsItem.sasiaEShitur + sasiaERe;
            jasperCopy.vlera =  this.state.LastProductsItem.vlera + vleraERe ;

            this.setState({LastProductsItem: jasperCopy});
    }

    // -------------------- for Save Temporarily btn 
    saveTemporarily = () => {
        let fetchArr: ProductsItem[] = [];
        if(this.state.productsOrdered.length > 0){
            fetchArr = this.state.productsOrdered;
        }
        if(this.state.LastProductsItem.id !== 0 ){
            fetchArr.push(this.state.LastProductsItem)
        }
        if(fetchArr.length > 0){
            
            let d = new Date();
            let n = d.toLocaleTimeString(); 
            let objDN = {
                totali: this.state.Totali,
                time: n,
            }
            this.state.timeOfSaveOrder.push(objDN);
            this.state.savedOrder.push(fetchArr);

            this.emptyProductOrder();
        }
    }

    getTemporarilyItem = (index: number) => {
        let savedOrder;
        let timeOfOrder:objDN | any;
       
        if (index > -1) {
            savedOrder = this.state.savedOrder[index];
            timeOfOrder = this.state.timeOfSaveOrder[index];
            this.state.timeOfSaveOrder.splice(index, 1);
            this.state.savedOrder.splice(index, 1);
        }

        this.saveTemporarily();

        var temp = savedOrder.pop();
        this.setState({LastProductsItem: temp, productsOrdered: savedOrder, Totali: timeOfOrder.totali});

        
    }
    //-----------------------------------------------------

    private fetchSTData() {
        Axios.get(`api/Management/GetSTData`)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        vat: response.data.vat,
                        barcodeKey: response.data.barcodeKey,
                        cuponQr: response.data.cuponQr,
                        thermalVendoId: response.data.thermalVendoId,
                        thermalModel: response.data.thermalModel,
                        ScannerThermalFetched: true,
                    });
                    if(response.data.barcodeKey !== 0){
                        this.setState({defaultBarcodeWK:false})
                    }
                }
            })
            .catch();            
    }

    handlePrinter = async () => {
        if(this.state.Printer !== undefined){
          this.PrintMeth();
        }
        else{
          const VENDOR_ID = Number('0x'+this.state.thermalVendoId);
          const device = await navigator.usb.requestDevice({
            filters: [{
              vendorId: VENDOR_ID
            }]
          })          
          const model = new Model(this.state.thermalModel)
          const connection = new WebUSB(device)
          await connection.open()
          this.setState({ Printer: new Printer(model, connection) })
          this.PrintMeth();        
        }
      }

      PrintMeth = () => {
        this.setState({printerLoading: true})

        let fetchArr = [];
        if(this.state.productsOrdered.length > 0){
            this.state.productsOrdered.map(item =>  (            
                fetchArr.push({
                    emri: item.emertimi,
                    sasia: item.sasiaEShitur,
                    cmimi: item.cmimi,
                })
            ))
        }
        if(this.state.LastProductsItem.id !== 0){
            fetchArr.push({ emri: this.state.LastProductsItem.emertimi,
                            sasia: this.state.LastProductsItem.sasiaEShitur,
                            cmimi: this.state.LastProductsItem.cmimi })
        }

        if(fetchArr.length > 0){
            const printer = this.state.Printer(); 
            printer.columns = 56

            printer.feed(1)
            printer.withStyle({
            width: 4,
            height: 6,
            bold: true,
            italic: true,
            underline: true,
            align: Align.Center,
            }, () => {
                printer.writeln(this.state.firmName)
            })
            printer.feed(2)
            for (let index = 0; index < fetchArr.length; index++) {
                const element = fetchArr[index];
                printer.writeln(element.emri)            
                let xxxx = element.cmimi.toFixed(2);
                printer.writeln(element.sasia+' x '+xxxx, Align.Right)
            }

            printer.writeln(' - - - - - - - - - - - - -')

            printer.writeln('Costs: '+this.state.Totali, Style.Bold)
            let Vat = this.state.vat;
            let x = (Vat/100) + 1;
            let totaliWithoutVat = this.state.Totali/x;
            let toFix = totaliWithoutVat.toFixed(2);

            printer.feed(1)
            printer.writeln('VAT: '+Vat)
            printer.writeln('Total without VAT: '+toFix, Style.Bold)
            printer.feed(3)
            //Serial number: Get from user----------------------------------------
            let qrCo = this.state.cuponQr;
            
            printer.writeln('Conf. ID', Align.Center)
            printer.qrcode(qrCo)

            printer.feed(4)
            printer.buzzer()
            printer.cutter()
            printer.drawer(Drawer.First)            
        }  
        this.setState({printerLoading: false})        
        this.finalSubmitOrder();    
      }


     handleScan = (data: string) => {
        let arr = this.props.forecasts;
        let item: any = arr.find((element: { barkodi: string; }) => element.barkodi === data); 
        if(item === undefined) {
            return true;
        }
        if(this.state.LastProductsItem.barkodi === data){
            this.raisLastItemSasia(this.state.LastProductsItem.sasiaEShitur + 1);
            return true;
        }
        this.addtoProductOrdered(item);
        
        //if(this.state.LastProductsItem )
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
                    {this.state.submitOrder ?
                    <AddOrdersPage  clickChangeOrder={this.changeSubOrder} 
                                    products ={this.props.forecasts}
                                    addtoProductOrdered={this.addtoProductOrdered}
                                    productsOrdered={this.state.productsOrdered} 
                                    emptyProductOrder={this.emptyProductOrder}
                                    lastProductsItem={this.state.LastProductsItem}
                                    Totali={this.state.Totali}
                                    raisLastItemSasia={this.raisLastItemSasia} 
                                    emptyLastProductsItem={this.emptyLastProductsItem}
                                    fromArrayAddItemToLastObject={this.fromArrayAddItemToLastObject}
                                    Kategorite = {this.state.Kategorite} />
                    :
                    <SubmitPage clickChangeOrder={this.changeSubOrder} 
                                productsOrdered={this.state.productsOrdered} 
                                emptyProductOrder={this.emptyProductOrder} 
                                Totali={this.state.Totali}
                                lastProductsItem={this.state.LastProductsItem} 
                                finalSubmitOrder= {this.finalSubmitOrder}
                                handlePrinter = {this.handlePrinter}
                                saveTemporarily = {this.saveTemporarily}
                                timeOfSaveOrder = {this.state.timeOfSaveOrder}
                                getTemporarilyItem= {this.getTemporarilyItem}
                                printerLoading = {this.state.printerLoading}
                                ScannerThermalFetched = {this.state.ScannerThermalFetched}/>
                    }
                    <h1 className="text-center mt-3 shadow-sm display-3 text-muted text-truncate" style={{fontFamily: "Brush Script MT"}}> <b>{this.state.firmName}</b></h1>
                    <br />
                    
                    
                </div>
        );
    }
    
};

export default connect(
    (state: ApplicationState) => state.products, // Selects which state properties are merged into the component's props
    ProductsStore.actionCreators // Selects which action creators are merged into the component's props
  )(SellPage as any);

//<h1 className="text-center" style={{fontFamily:"Brush Script MT"}}> Adt Metal Construction</h1>