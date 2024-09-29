import Axios from 'axios';
import * as React from 'react';
import PayPal from './PayPal'


interface IProps{

}
interface IState {
    checkout: boolean;
    payment: boolean;
    loadingPayment: boolean;
    tryAgain: boolean;
    checkIfAllowedToPay: boolean;
    showMsgBtnPayment: boolean;
}   


class Payment extends React.PureComponent<IProps, IState> {  
    constructor(props: any) {
        super(props);    
       
        this.state = {
            checkout: false,
            payment: false,
            loadingPayment: false,
            tryAgain: false,
            checkIfAllowedToPay: false,
            showMsgBtnPayment: false,
        };
    }
    componentDidMount(){
       
        Axios.get(`api/Management/GetExpirationData`)
        .then( (response) => {
        if(response.status === 200){          

            //check if it's three month before expiration date
            let dataMbarimit = new Date(response.data)
            let now = new Date();
            let diff =(dataMbarimit.getTime() - now.getTime()) / 1000;
            diff /= (60 * 60 * 24 * 7 * 4);
            let difference =Number.parseFloat(diff.toFixed(1));    
            if(difference <= 3.3){
                this.setState({checkIfAllowedToPay: true});                
            }
        }
        })
        .catch();
    }

    cPStatusToTrue = async () => {
        this.setState({loadingPayment: true, payment: true, checkout:false})
        
        Axios.get(`api/Payment/AddPayment`)
            .then( (response) => {
            if(response.status === 200){
                this.setState({loadingPayment: false});
            }
            else{
               this.tryAgaionCOnfiguration();
            }
            })     
            .catch( (e) => { 
                this.tryAgaionCOnfiguration();
            });
    }
    private tryAgaionCOnfiguration(){
        this.setState({tryAgain: true});
    }

    private paypalComponent(): React.ReactNode {
        return <div className="row">
            <div className="col-md-3"></div>
            <div className="text-center mt-5 col-md-6">
                <h4 className="mb-4 font-weight-light text-muted">Choose which way you want to make the payment</h4>
                <PayPal changePaymentToTrue={this.cPStatusToTrue}/>
            </div>
            <div className="col-md-3"></div>
        </div>
    }

    public render(){
        return(
            <div className="container">
            {this.state.tryAgain?
                <button className="btn-block btn-lg btn-outline-danger mb-4 mt-2" onClick={() => this.cPStatusToTrue()}>Please try again by clicking here to activate your business configuration</button>
            :""}
            {this.state.checkout? 
                this.paypalComponent()
                :
                <div>
                {this.state.payment? 
                    <div className="mt-5">
                        <h3 className="text-success bold text-center pb-4"><u>Payment completed successfully.</u></h3>
                        <h4 className="text-info font-weight-lighter">
                            - With this payment you can use this app <u>for 1 year</u>. You can see the dates on the page 'company/others'. <br />
                            - You can only make the next payment in the last three month before the expiration date.<br />
                            <br />
                            - Thank you and your company for using this web app.<br />
                            - We hope you feel comfortable with this web application, have a good time.</h4>
                    </div>
                    :
                    <div> 
                        <h4 className="text-info font-weight-light text-capitalize mt-5 text-center mb-4">Payment for this App costs <b>$ 15 per year</b>.
                        </h4>
                        <h5 className="text-info font-weight-light">As you will see after pressing the button, payment is made through the electronic commerce company PayPal.
                        </h5>
                        <h5 className="text-info font-weight-light">In the PayPal Checkout you will be able to make the payment using a variety of methods including:
                        </h5>
                        <h5 className="text-info font-weight-light">
                        PayPal Cash or PayPal Cash Plus account balance, a bank account, PayPal Credit, debit or credit cards, and rewards balance.
                        </h5>
                        <div className="row mt-5 pt-5">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                            {this.state.checkIfAllowedToPay?
                            <button className="btn btn-lg btn-block btn-primary" onClick={() => this.setState({checkout: true})}>Click to go to PayPal CHECKOUT</button>
                            :
                            <button className="btn btn-lg btn-block btn-primary" onClick={() => this.setState({showMsgBtnPayment: true})}>Click to go to PayPal CHECKOUT</button>
                            }
                            </div>
                            <div className="col-md-4"></div>
                        </div>
                        {this.state.showMsgBtnPayment? 
                        <p className="text-warning text-center mt-2">Is not active at this time</p>
                        :""}
                        <h4 className="text-info font-weight-light mt-5 pt-5 text-center">it is also very easy to use this payment method</h4>
                    </div>
                }
                </div>
            }


            {this.state.loadingPayment? 
             <div className="carousel-caption">
                 <p className="text-primary">Please Wait ...</p>
                <div className="spinner-grow text-primary" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-secondary" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-success" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-danger">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-warning" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-info" >
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-dark" >
                    <span className="sr-only">Loading...</span>
                </div>
             </div> 
             :""}
            </div>
        )
    }

  
}
export default Payment;
