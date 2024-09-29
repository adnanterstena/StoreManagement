import Axios from 'axios';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

export interface ProductsState {
    forecasts: ProductsI[];
}

export interface ProductsI {
    id: number;
    emertimi: string;
    barkodi: string;     
    cmimi: number;    
    zbritja: number;
    kategoria: number;
    sasiaeshitur: number;
    otherInformation1: string;
    otherInformation2: string;
    otherInformation3: string;

}

interface RequestProductsAction {
    type: 'REQUEST_WEATHER_FORECASTS';
}

interface ReceiveRequestProductsAction {
    type: 'RECEIVE_PRODUCTS';
    forecasts: ProductsI[];
}

type KnownAction = RequestProductsAction | ReceiveRequestProductsAction;

export const actionCreators = {
    requestProducts: (): AppThunkAction<KnownAction> => (dispatch) => {
    Axios.get(`ProductForStoreForecast`)    
         .then( (response) => {
             if(response.status === 200){   
                dispatch({ type: 'RECEIVE_PRODUCTS', forecasts: response.data});        
            }
            })
        .catch();         
    }
};

const unloadedState: ProductsState = { forecasts: [] };

export const reducer: Reducer<ProductsState> = (state: ProductsState | undefined, incomingAction: Action): ProductsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_PRODUCTS':           
        return {
            forecasts: action.forecasts
        };        
    }

    return state;
};
