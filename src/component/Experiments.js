import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MailIcon from '@material-ui/icons/Mail';
import {MenuList, MenuItem, fade} from "@material-ui/core";
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {AccountCircle} from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import DnsIcon from '@material-ui/icons/Dns';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Badge from "@material-ui/core/Badge";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import {ReactComponent as BinaizeWhiteLogo} from "../images/binaize-logo-white.svg";
import Typography from "@material-ui/core/Typography";
import "./Experiments.css"

import {REACT_APP_BASE_URL, REACT_APP_URL_EXPERIMENTS} from "../config"

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
    }
})

class Experiments extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            anchorEl: null,
            mobileMoreAnchorEl: null,
        };
    }

    createData(experiment_name, experiment_type, status, page_type, creation_time, last_updation_time) {
        return [experiment_name, experiment_type, status, page_type, creation_time, last_updation_time];
    }

    getExperiments() {

        let localData = [];
        console.log(localStorage.getItem("access_token"));

        let access = "Bearer " + localStorage.getItem("access_token");
        try {
            fetch(REACT_APP_BASE_URL + REACT_APP_URL_EXPERIMENTS, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': access,
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(res => {

                    let result = res;

                    let i = 0;
                    let url = "www.smth.com"

                    for (i; i < result.length; i++) {
                        localData.push(this.createData(<Link url={url}>{result[i].experiment_name}</Link>,
                            result[i].experiment_type,
                            result[i].status,
                            result[i].page_type,
                            result[i].creation_time,
                            result[i].last_updation_time
                        ))
                    }

                    this.setState({rows: localData})
                    console.log(this.state.rows);
                });
        } catch (e) {
            console.error("Error!", e);
        }
    }

    componentDidMount() {
        this.getExperiments();
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <div className={classes.search} style={{color: "#1A2330"}}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{'aria-label': 'search'}}
                            />
                        </div>
                        <div className={classes.grow}/>
                        <div className={classes.sectionDesktop}>
                            <IconButton aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton aria-label="show 17 new notifications" color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                onClick={(e) => {
                                    this.setState({anchorEl: e.currentTarget})
                                }}
                                color="inherit">

                                <AccountCircle/>
                            </IconButton>

                            <div style={{color: "#1A2330", display: "block", marginLeft: "10px"}}>
                                <Typography>
                                    Sarah Elliot
                                </Typography>
                                <Typography style={{fontSize: '12px'}}>
                                    sarah@gmail.com
                                </Typography>
                            </div>

                        </div>

                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show more"
                                aria-haspopup="true"
                                onClick={(e) => {
                                    this.setState({mobileMoreAnchorEl: e.currentTarget})
                                }}
                                color="inherit">
                                <MoreIcon/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                <Drawer
                    className={classes.drawer}
                    variant="permanent"
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
                        <MenuItem component={Link} to={"/dashboard"} style={{minHeight: "50px"}}>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            Dashboard
                        </MenuItem>

                        <MenuItem component={Link} to={"/experiment"} style={{minHeight: "50px"}}>
                            <ListItemIcon>
                                <DnsIcon/>
                            </ListItemIcon>
                            Experiments
                        </MenuItem>

                        <MenuItem component={Link} to={"/expi"} style={{minHeight: "50px"}}>
                            <ListItemIcon>
                                <AddIcon/>
                            </ListItemIcon>
                            Add Experiments
                        </MenuItem>

                        <Divider/>

                        <MenuItem component={Link} to={"/"} style={{minHeight: "50px"}}>
                            <ListItemIcon>
                                <PriorityHighIcon/>
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </MenuList>

                </Drawer>

                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{margin: "0% 0.5%"}}>
                        <h3>Experiments Overview</h3>
                    </div>

                    <Divider style={{margin: "1%"}}/>

                    <TableContainer component={Paper} style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Experiments</TableCell>
                                    <TableCell align="right">Type</TableCell>
                                    <TableCell align="right">Status</TableCell>
                                    <TableCell align="right">Page</TableCell>
                                    <TableCell align="right">Created On</TableCell>
                                    <TableCell align="right">Last Updated On</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell component="th" scope="row">
                                            {row[0]}
                                        </TableCell>
                                        <TableCell align="right">{row[1]}</TableCell>
                                        <TableCell align="right">{row[2]}</TableCell>
                                        <TableCell align="right">{row[3]}</TableCell>
                                        <TableCell align="right">{row[4]}</TableCell>
                                        <TableCell align="right">{row[5]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </main>
            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(Experiments))
