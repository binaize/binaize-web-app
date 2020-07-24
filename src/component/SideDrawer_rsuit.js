import * as React from "react";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import {ReactComponent as BinaizeWhiteLogo} from "../images/binaize-logo-white.svg";
import 'rsuite/dist/styles/rsuite-default.css'
import {Dropdown, Icon, Nav, Sidenav} from "rsuite";
import "./SideBar.css"


class Demo extends React.Component {
    constructor() {
        super();
        this.state = {
            expanded: true,
            activeKey: '1'
        };
        this.handleSelect = this.handleSelect.bind(this);

        let path_name = window.location.pathname
        console.log(path_name)

        if (path_name === "/experiment") {
            localStorage.setItem("activeKey", "1-2")
        }else if (path_name === "/ABTestingDashboard") {
            localStorage.setItem("activeKey", "1-2")
        }else if (path_name === "/conversionDashboard") {
            localStorage.setItem("activeKey", "1-1")
        }else if (path_name === "/customerAnalytics") {
            localStorage.setItem("activeKey", "1-3")
        }

    }

    handleSelect(eventKey) {
        this.setState({
            activeKey: eventKey
        });
    }

    render() {
        const {expanded} = this.state;

        return (
            <div className={"custom-side-drawer"}>



                <Divider/>

                <Sidenav
                    expanded={expanded}
                    defaultOpenKeys={['1', '2']}
                    activeKey={this.props.active}
                    onSelect={this.handleSelect}>

                    <Sidenav.Body>

                        <div>
                            <BinaizeWhiteLogo
                                style={{
                                    width: "75%",
                                    margin: "10%",
                                    height: "45%"
                                }}/>
                        </div>

                        <Nav>

                            <Dropdown
                                placement="rightStart"
                                eventKey="1"
                                title="Analytics Dashboard"
                                icon={<Icon icon="user-analysis"/>}
                            >
                                <Dropdown.Item
                                    eventKey="1-1"
                                    componentClass={Link}
                                    to={"/conversionDashboard"}
                                    style={{fontSize: "16px"}}
                                    icon={<Icon icon="dashboard" style={{marginRight: "10px"}}/>}>
                                    Conversion
                                </Dropdown.Item>

                                <Dropdown.Item
                                    eventKey="1-2"
                                    componentClass={Link}
                                    to={"/experiment"}
                                    style={{fontSize: "16px"}}
                                    icon={<Icon icon="dashboard" style={{marginRight: "10px"}}/>}>A/B
                                    Testing
                                </Dropdown.Item>

                                <Dropdown.Item
                                    eventKey="1-3"
                                    componentClass={Link}
                                    to={"/customerAnalytics"}
                                    style={{fontSize: "16px"}}
                                    icon={<Icon icon="dashboard" style={{marginRight: "10px"}}/>}>
                                    Customer
                                </Dropdown.Item>
                            </Dropdown>
                            <Dropdown
                                placement="rightStart"
                                eventKey="2"
                                title="Experiments"
                                icon={<Icon icon="expand-o"/>}
                            >

                                <Dropdown.Item
                                    eventKey="2-1"
                                    icon={<Icon icon="plus" style={{marginRight: "10px"}}/>}>Add
                                    Experiment
                                </Dropdown.Item>

                                <Dropdown.Item
                                    eventKey="2-2"
                                    icon={<Icon icon="edit" style={{marginRight: "10px"}}/>}>Edit
                                    Experiment
                                </Dropdown.Item>

                            </Dropdown>

                            <Divider/>

                            <Nav.Item
                                eventKey="3"
                                componentClass={Link}
                                to={"/"}
                                onClick={() => {
                                    localStorage.setItem("access_token", "")
                                }}
                                icon={<Icon icon="sign-out" style={{marginRight: "10px"}}/>}>
                                Logout
                            </Nav.Item>
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </div>
        );
    }
}

export default Demo;