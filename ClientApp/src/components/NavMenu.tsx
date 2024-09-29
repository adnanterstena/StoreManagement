import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, {isOpen: boolean }> {
    public state = {
        isOpen:false
    }; 

    public render() {
        return (
            <header>                 
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
                <Container>
                    <NavbarBrand className="btn-outline-light rounded-lg font-weight-light pl-2 pr-2" tag={Link} to="/">Business Management</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} className="mr-2"/>
                    <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                        <ul className="navbar-nav flex-grow">
                            <NavItem className="btn-outline-light rounded-lg">
                                <NavLink tag={Link} className="font-weight-light pl-2 pr-2" to="/info">Info</NavLink>
                            </NavItem>
                            <NavItem className="btn-outline-light rounded-lg">
                                <NavLink tag={Link} className="font-weight-light pl-2 pr-2" to="/register">Register</NavLink>
                            </NavItem>
                        </ul>
                    </Collapse>                   
                </Container>
                </Navbar>                    
            </header>           
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
