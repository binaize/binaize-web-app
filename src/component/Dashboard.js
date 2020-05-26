import Drawer from '@material-ui/core/Drawer';

import React from 'react';
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
import Badge from "@material-ui/core/Badge";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from "@material-ui/core/Typography";
import "./Experiments.css"
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Bar, Line} from "react-chartjs-2";
import {ReactComponent as BinaizeWhiteLogo} from "../images/binaize-logo-white.svg";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DnsIcon from "@material-ui/icons/Dns";
import AddIcon from "@material-ui/icons/Add";

import {
    REACT_APP_BASE_URL,
    REACT_APP_URL_SESSION_COUNT,
    REACT_APP_URL_CONVERSION_RATE,
    REACT_APP_URL_CONVERSION_TABLE,
    REACT_APP_URL_VISITOR_COUNT,
    REACT_APP_URL_EXPERIMENTS,
    REACT_APP_EXPERIMENT_SUMMARY
} from "../config"

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

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        console.log(process)

        this.state = {
            access_token: localStorage.getItem("access_token"),
            select_val: "",
            options: [
                {label: 'exp_2', value: '13e6f65bacbf4d74b8561e940287e604'},
                {label: 'exp_1', value: '66f5d1fc432d47b994250688fd728ff7'}
            ],
            BarDataSession: {},
            BarDataVisitors: {},
            ConversionData: {},
            rows: [],
            SummaryDetails: {
                summary_status: '',
                summary_conclusion: '',
                summary_recommendation: '',
            },
            bar_background_color: ['#5C6AC4', '#43467F', '#9C6ADE'],
            bar_background_hover_color: ['#202E78', '#1C2260', '#50248F'],
            variation_name2: ["Variation Yel", "Original", "Variation Blue"],
            experiment_names: [],
            experiment_ids: []
        }
    }

    createExpList(experiment_name, experiment_id) {
        return [experiment_name, experiment_id];
    }


    getExperimentNames() {

        try {
            let localExp = [];
            console.log(localStorage.getItem("access_token"));

            let access = "Bearer " + this.state.access_token;

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

                    for (i; i < result.length; i++) {
                        localExp.push(this.createExpList(result[i].experiment_name, result[i].experiment_id))
                    }

                    this.setState({experiment_names: localExp})
                    console.log(this.state.experiment_names);
                });
        } catch (e) {
            console.error("Error!", e);
        }
    }


    getSessionData(exp_id) {

        console.log(exp_id)

        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            experiment_id: exp_id
        })

        let access = "Bearer " + this.state.access_token;
        const urlSession = REACT_APP_URL_SESSION_COUNT + `?${params.toString()}`

        console.log(urlSession);
        let mainDatasetSession = [];
        let mainDatasetVisitors = [];
        let mainDatasetConversion = [];

        fetch(REACT_APP_BASE_URL + urlSession, {
            method: 'post',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success:", result);

                let data = []
                let datasets = [];


                Object.keys(result.session_count).forEach(function (key) {
                    // console.log(key)
                    data.push(key)
                    datasets.push(result.session_count[key])
                });
                console.log(data);
                console.log(datasets);

                let localdata = {}

                let i = 0;
                for (i; i < data.length; i++) {

                    localdata = {
                        label: data[i],
                        backgroundColor: this.state.bar_background_color[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 1,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasets[i]
                    }
                    mainDatasetSession.push(localdata);
                    localdata = {}
                }

                console.log(mainDatasetSession)
                this.setState({
                    BarDataSession: {
                        labels: result.date,
                        datasets: mainDatasetSession
                    }
                })
            });


        const urlVisitor = REACT_APP_URL_VISITOR_COUNT + `?${params.toString()}`

        console.log(urlVisitor);

        fetch(REACT_APP_BASE_URL + urlVisitor, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                let datasetsV = [];

                let dataV = [];
                console.log("Success: ", result);

                Object.keys(result.visitor_count).forEach(function (key) {
                    datasetsV.push(result.visitor_count[key])
                    dataV.push(key)
                });

                let localdataV = {}
                let i = 0;
                console.log(datasetsV);
                console.log(dataV);

                for (i; i < dataV.length; i++) {

                    localdataV = {
                        label: dataV[i],
                        backgroundColor: this.state.bar_background_color[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 1,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasetsV[i]
                    }
                    mainDatasetVisitors.push(localdataV);
                    localdataV = {}
                }

                console.log(mainDatasetVisitors)
                this.setState({
                    BarDataVisitors: {
                        labels: result.date,
                        datasets: mainDatasetVisitors
                    }
                })
            });


        const urlConvert = REACT_APP_URL_CONVERSION_RATE + `?${params.toString()}`

        console.log(urlConvert);

        fetch(REACT_APP_BASE_URL + urlConvert, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success : ", result);

                let dataV = [];
                let datasetsV = [];

                Object.keys(result.conversion).forEach(function (key) {
                    // console.log(key)
                    dataV.push(key)
                    datasetsV.push(result.conversion[key])
                });
                console.log(dataV);
                console.log(datasetsV);

                let localdataV = {}

                let i = 0;
                for (i; i < dataV.length; i++) {

                    localdataV = {
                        label: dataV[i],
                        borderColor: this.state.bar_background_color[i],
                        borderWidth: 3,
                        hoverBackgroundColor: this.state.bar_background_hover_color[i],
                        hoverBorderColor: this.state.bar_background_hover_color[i],
                        data: datasetsV[i]
                    }
                    mainDatasetConversion.push(localdataV);
                    localdataV = {}
                }

                console.log(mainDatasetConversion)
                this.setState({
                    ConversionData: {
                        labels: result.date,
                        datasets: mainDatasetConversion
                    }
                })
            });


        const urlConversationTable = REACT_APP_URL_CONVERSION_TABLE + `?${params.toString()}`

        console.log(urlConversationTable);

        try {

            fetch(REACT_APP_BASE_URL + urlConversationTable, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': access,
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(result => {

                    let localData = [];
                    let localRows = [];


                    console.log("Success: TABLE ", result);

                    let i = 0;
                    console.log("Success: TABLE " + result[i].variation_name)

                    let url = "www.smth.com"

                    for (i; i < result.length; i++) {

                        localData.push(<Link url={url}>{result[i].variation_name}</Link>);
                        localData.push(result[i].num_session);
                        localData.push(result[i].num_visitor);
                        localData.push(result[i].visitor_converted);
                        localData.push(result[i].conversion);

                        localRows.push(localData);
                        localData = [];

                    }

                    this.setState({rows: localRows})
                    console.log(this.state.rows);
                });


        } catch (e) {
            console.error("Error!", e);
        }


        const urlSummary = REACT_APP_EXPERIMENT_SUMMARY + `?${params.toString()}`

        console.log(urlSummary);

        fetch(REACT_APP_BASE_URL + urlSummary, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success: ", result);

                this.setState({
                    SummaryDetails: {
                        summary_status: result.status,
                        summary_conclusion: result.conclusion,
                        summary_recommendation: result.recommendation
                    }
                })

            });


    }

    componentDidMount() {
        this.getExperimentNames();
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        {/* Toolbar */}
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

                {/* MAIN LAYOUT */}
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{display: "flex"}}>
                        <h2 style={{marginTop: "2%"}}>Dashboard</h2>

                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Experiment Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={this.state.select_val}
                                onChange={(e) => {
                                    this.setState({select_val: e.target.value})
                                    this.getSessionData(e.target.value);
                                }}
                                label="Experiment Name">

                                {this.state.experiment_names.map((exp_name) => (
                                    <MenuItem className={classes.expMenu} value={exp_name[1]}>{exp_name[0]}</MenuItem>
                                ))}

                                {/*<MenuItem value={"13e6f65bacbf4d74b8561e940287e604"} style={{color: "black"}}>Product*/}
                                {/*    page design</MenuItem>*/}
                                {/*<MenuItem value={"66f5d1fc432d47b994250688fd728ff7"} style={{color: "black"}}>Home page*/}
                                {/*    messaging</MenuItem>*/}
                            </Select>
                        </FormControl>
                    </div>
                    <Card>
                        <CardContent>
                            <div style={{padding: "0.5%", margin: "0% 0% 0% 0.5%", width: "97%"}}>
                                <p>{this.state.SummaryDetails.summary_status}</p>
                                <p>{this.state.SummaryDetails.summary_conclusion}</p>
                                <p>{this.state.SummaryDetails.summary_recommendation}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider style={{margin: "1%"}}/>

                    <TableContainer component={Paper} style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Variant</TableCell>
                                    <TableCell align="left">Sessions</TableCell>
                                    <TableCell align="left">Visitors</TableCell>
                                    <TableCell align="left">Visitors Converted</TableCell>
                                    <TableCell align="left">Conversion Rate (%)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell component="th" scope="row">
                                            {row[0]}
                                        </TableCell>
                                        <TableCell align="left">{row[1]}</TableCell>
                                        <TableCell align="left">{row[2]}</TableCell>
                                        <TableCell align="left">{row[3]}</TableCell>
                                        <TableCell align="left">{row[4]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider/>

                    <Card>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Session Over Time
                                </h3>
                                <hr/>
                                <Bar
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataSession}
                                    options={{maintainAspectRatio: true}}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Visitor Over Time
                                </h3>
                                <hr/>
                                <Bar

                                    yAxisID="% Conversion"
                                    width={100}
                                    height={40}
                                    data={this.state.BarDataVisitors}
                                    options={{maintainAspectRatio: true}}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "97%"}}>
                                <h3>
                                    Conversion Over Time
                                </h3>
                                <hr/>
                                <Line
                                    width={100}
                                    height={40}
                                    data={this.state.ConversionData}
                                    options={{maintainAspectRatio: true}}>
                                </Line>
                            </div>
                        </CardContent>
                    </Card>


                </main>
            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(Dashboard))
