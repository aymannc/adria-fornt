import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router";
import Auth from "./auth/Auth";
import {Container} from "react-bootstrap";
import Header from "./header/Header";
import AjouterVirment from "./virment/AjouterVirement";
import SignerVirement, {SignSuccess} from "./virment/SignerVirement";
import virementList from "./virment/virementList";
import thunk from "redux-thunk";
import authReducer from './auth/AuthReducer'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({auth: authReducer}), composeEnhancers(applyMiddleware(thunk)));

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Header/>
                <Container>
                    <Switch>
                        <Route path='/auth'
                               activeClassName="active" component={Auth}/>
                        <Route path='/ajouter-virement' component={AjouterVirment}/>
                        <Route path='/verification' component={SignerVirement}/>
                        <Route path='/success' component={SignSuccess}/>
                        <Route path='/list-virements' component={virementList}/>
                        <Redirect to='/auth'/>
                    </Switch>
                </Container>
            </BrowserRouter>

        </Provider>
    );
}

export default App;
