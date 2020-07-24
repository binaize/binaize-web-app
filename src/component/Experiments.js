import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import {fade} from "@material-ui/core";
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
import "./Experiments.css"

import {REACT_APP_BASE_URL, REACT_APP_CLIENT_DETAILS, REACT_APP_URL_EXPERIMENTS} from "../config"
import AppToolbar from "./AppToolbar";
import Demo from "./SideDrawer_rsuit";

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
        marginLeft: "300px"
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
            access_token: localStorage.getItem("access_token"),
            rows: [],
            anchorEl: null,
            mobileMoreAnchorEl: null,
        }
    }

    createData(experiment_name, experiment_type, status, page_type, creation_time, last_updation_time) {
        return [experiment_name, experiment_type, status, page_type, creation_time, last_updation_time];
    }

    getExperiments(access) {

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

                    console.log(res)

                    let result = res;
                    let i = 0;
                    let localData = [];

                    for (i; i < result.length; i++) {
                        let jj = i
                        localData.push(this.createData(
                            <Link to={"ABTestingDashboard"} onClick={() => {
                                localStorage.setItem("experiment_id", result[jj]["experiment_id"])
                                localStorage.setItem("experiment_name", result[jj]["experiment_name"])
                                // console.log(result[jj]);
                            }}>{result[i]["experiment_name"]}</Link>,
                            result[i]["experiment_type"],
                            result[i]["status"],
                            result[i]["page_type"],
                            result[i]["creation_time"],
                            result[i]["last_updation_time"]
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

        let field = 'access_token';
        let url = window.location.href;
        if(url.indexOf('?' + field + '=') !== -1){

            console.log(this.props.location.search)
            const access_token = new URLSearchParams(window.location.search)
            localStorage.setItem("access_token", access_token.get("access_token").toString())

            console.log(access_token.get("access_token").toString());
            fetch(REACT_APP_BASE_URL + REACT_APP_CLIENT_DETAILS, {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': "Bearer " + access_token.get("access_token"),
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {
                    localStorage.setItem("creation_time", result["creation_time"])
                })
                .catch(err => {
                    console.log(err)
                })

            this.getExperiments("Bearer " + access_token.get("access_token"));

        }
        else {
            console.log(localStorage.getItem("access_token"));
            let access = "Bearer " + localStorage.getItem("access_token");
            this.getExperiments(access);
        }


    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>

                <AppToolbar/>

                {/*<SideDrawer/>*/}
                <Demo active={localStorage.getItem("activeKey")}/>
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{margin: "1% 5%"}}>
                        <h3>Experiments Overview</h3>
                    </div>

                    <Divider style={{margin: "0% 5%"}}/>

                    <TableContainer component={Paper} style={{margin: "1% 5%", width: "90%"}}>
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
