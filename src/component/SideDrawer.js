import * as React from "react";

import {fade, MenuItem, MenuList} from "@material-ui/core";
import 'rsuite/dist/styles/rsuite-default.css'
import {withStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import DnsIcon from "@material-ui/icons/Dns";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Drawer from "@material-ui/core/Drawer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import {ReactComponent as BinaizeWhiteLogo} from "../images/binaize-logo-white.svg";


const drawerWidth = 300;
const exp_style = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: "#1A2330"
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#1A2330", 0.1),
        '&:hover': {
            backgroundColor: fade("#1a2330", 0.1),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    expMenu: {
        color: 'rgba(32,46,120,0.85)',
        backgroundColor: "#fff",
        '&:hover': {
            backgroundColor: '#eee !important',
            color: "rgba(32,46,120,0.85)"
        }
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '30ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
})



class SideDrawer extends React.Component {

    render() {

        const {classes} = this.props;

        return (<Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left">

            <div className={classes.toolbar}>
                <BinaizeWhiteLogo
                    style={{
                        width: "75%",
                        margin: "10%",
                        height: "45%"
                    }}/>
            </div>

            <Divider/>

            <MenuList>
                <MenuItem style={{minHeight: "50px"}}>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    Analytics Dashboard
                </MenuItem>

                <MenuItem component={Link} to={"/conversionDashboard"} style={{minHeight: "50px",paddingLeft: "50px"}}>
                    <ListItemIcon>
                        <DnsIcon/>
                    </ListItemIcon>
                    Conversion
                </MenuItem>

                <MenuItem component={Link} to={"/experiment"} style={{minHeight: "50px", paddingLeft: "50px"}}>
                    <ListItemIcon>
                        <DnsIcon/>
                    </ListItemIcon>
                    A/B Testing
                </MenuItem>

                <MenuItem style={{minHeight: "50px"}}>
                    <ListItemIcon>
                        <DnsIcon/>
                    </ListItemIcon>
                    Experiments
                </MenuItem>

                <MenuItem style={{minHeight: "50px", paddingLeft: "50px"}}>
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    Add Experiments
                </MenuItem>

                <MenuItem style={{minHeight: "50px", paddingLeft: "50px"}}>
                    <ListItemIcon>
                        <EditIcon/>
                    </ListItemIcon>
                    Edit Experiments
                </MenuItem>

                <Divider/>

                <MenuItem component={Link} to={"/"} onClick={() => {localStorage.setItem("access_token", "")}} style={{minHeight: "50px"}}>
                    <ListItemIcon>
                        <PriorityHighIcon/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </MenuList>

        </Drawer>)
    }
}

export default withStyles(exp_style)(SideDrawer);