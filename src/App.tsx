import React, {Component, Suspense, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useDispatch} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router";
import Auth from "./auth/Auth";
import {Container} from "react-bootstrap";
import Header from "./app/Header";
import {SignSuccess} from "./virement/SignerVirement";
import * as actions from './auth/AuthAction'


const AjouterVirment = React.lazy(() => import('./virement/AjouterVirement'));
const SignerVirement = React.lazy(() => import('./virement/SignerVirement'));
const VirementList = React.lazy(() => import('./virement/VirementList'));


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
                    <Route path='/ajouter-virement' component={WaitingComponent(AjouterVirment)}/>
                    <Route path='/verification' component={WaitingComponent(SignerVirement)}/>
                    <Route path='/success' component={SignSuccess}/>
                    <Route path='/list-virements' component={WaitingComponent(VirementList)}/>
                    <Redirect to='/list-virements'/>
                </Switch>
            </Container>
        </BrowserRouter>
    )
}

const WaitingComponent = (Component: any) => {
    return (props: any) => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}
export default App;
