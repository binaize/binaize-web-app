import {Icon, Nav, Sidenav} from "rsuite";
import * as React from "react";

import 'rsuite/dist/styles/rsuite-default.css'
import {Link} from "react-router-dom";
import {ReactComponent as BinaizeSVG} from "../images/binaize_logo.svg";

class SideBar extends React.Component {


    render() {
        return (<div style={{width: 300}}>
            <Sidenav activeKey="2">
                <BinaizeSVG style={{width: 200}}/>
                <Sidenav.Body>
                    <Nav>
                        <Nav.Item componentClass={Link} to="/dashboard" eventKey="1" icon={<Icon icon="dashboard"/>}>
                            Dashboard
                        </Nav.Item>
                        <Nav.Item componentClass={Link} to="/exp" eventKey="2" icon={<Icon icon="list"/>}>
                            Experiments
                        </Nav.Item>
                        <Nav.Item eventKey="3" icon={<Icon icon="views-authorize"/>}>
                            Overview
                        </Nav.Item>
                        <Nav.Item eventKey="4" icon={<Icon icon="flask"/>}>
                            Create Experiment
                        </Nav.Item>
                        <hr/>
                        <Nav.Item eventKey="4" componentClass={Link} to="/" icon={<Icon icon="flask"/>}>
                            Logout
                        </Nav.Item>
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>)
    }
}

export default SideBar;