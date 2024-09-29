import * as React from 'react';
import { Route } from 'react-router';
import MLayout from "./MLayout"
import SellPage from "./SellPage/SellPage"
import ManagePage from "./Manage"
import LoadingPage from './LoadingPage';
import AddProducts from './Manage/AddProducts';
import Products from "./Manage/Products";
import AddWorkers from "./Manage/AddWorkers"
import Workers from './Manage/Workers';
import Company from './Company/Company';
import Statistics from './Company/Statistics';
import Profile from './Profile';
import AdnanisaPage from './adnaniPage/AdnanisaPage';
import Payment from './Company/Payment/Payment';



interface IProps{
}
interface IState {
}   

class Management extends React.PureComponent<IProps, IState> {  
    public render() {
        return (    
            <MLayout>
                <Route exact path='/' component={LoadingPage} />
                <Route path='/Store' component={SellPage} />
                <Route path='/Manage' component={ManagePage} />
                <Route path="/AddProducts" component={AddProducts} />
                <Route path="/Products" component={Products} />
                <Route path="/AddWorkers" component={AddWorkers} />
                <Route path="/Workers" component={Workers} />
                <Route path="/Company" component={Company} />
                <Route path="/Statistics" component={Statistics} />                
                <Route path="/Profile" component={Profile} />          
                <Route path="/adnanisapage" component={AdnanisaPage} />
                <Route path="/Payment" component={Payment} />
            </MLayout>  
        );
    }
};

export default Management;