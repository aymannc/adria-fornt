import React, {useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useDispatch} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router";
import Auth from "./auth/Auth";
import {Container} from "react-bootstrap";
import Header from "./app/Header";
import AjouterVirment from "./virement/AjouterVirement";
import SignerVirement, {SignSuccess} from "./virement/SignerVirement";
import VirementList from './virement/VirementList';
import * as actions from './auth/AuthAction'

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.authCheckState())
    }, [])
    return (

        <BrowserRouter>
            <Header/>
            <Container>
                <Switch>
                    <Route path='/auth'
                           activeClassName="active" component={Auth}/>
                    <Route path='/ajouter-virement' component={AjouterVirment}/>
                    <Route path='/verification' component={SignerVirement}/>
                    <Route path='/success' component={SignSuccess}/>
                    <Route path='/list-virements' component={VirementList}/>
                    <Redirect to='/list-virements'/>
                </Switch>
            </Container>
        </BrowserRouter>
    );
}

export default App;
