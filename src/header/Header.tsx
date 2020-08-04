import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {useHistory} from "react-router-dom";

const iconPath = process.env.PUBLIC_URL + '/logo192.png';
const Header = (props: any) => {
    const history = useHistory();
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href=""><img width="100px" src={iconPath} alt="Logo"/></Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={() => {
                        history.push('/ajouter-virement-multiple')
                    }}>Ajouter Virement</Nav.Link>
                    <Nav.Link onClick={() => {
                        history.push('/list-virements')
                    }}>List Virements</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={() => {
                        history.push('/auth')
                    }}>Login</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
