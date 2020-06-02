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
    REACT_APP_BASE_URL
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

class DashboardAnother extends React.Component {

    constructor(props) {
        super(props);

        // console.log(process)

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
            bar_background_color: ['#2196f3', '#4caf50', '#ef6c00'],
            bar_background_hover_color: ['#006FBB', '#50B83C', '#DE3618'],
            variation_name2: ["Variation Yel", "Original", "Variation Blue"],
            experiment_names: [],
            experiment_ids: [],

            shop_funnels: {},
            product_conversion: {},
            landing_page_conversion: {}
        }
    }


    getAllData(exp_id) {

        console.log(exp_id)

        this.setState({selected: this.state.selected})
        const params = new URLSearchParams({
            experiment_id: exp_id
        })

        let access = "Bearer " + this.state.access_token;
        // const urlSession = REACT_APP_URL_SESSION_COUNT + `?${params.toString()}`
        //
        // console.log(urlSession);

        let mainDataFunnel = [];

        let mainDataProduct = [];
        let mainDataLanding = [];

        fetch(REACT_APP_BASE_URL + "/get_shop_funnel_analytics_for_dashboard", {
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


                Object.keys(result.shop_funnel).forEach(function (key) {
                    data.push(key)
                    datasets.push(result.shop_funnel[key])
                });
                // console.log(data);
                // console.log(datasets);

                let localdata = {}

                let i = 0;
                for (i; i < data.length; i++) {

                    if (data[i] === "percentage") {
                        localdata = {
                            label: data[i],
                            type: 'line',
                            fill: false,
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: datasets[i],
                            yAxisID: "y-axis-1",
                        };
                    } else {
                        localdata = {
                            label: data[i],
                            backgroundColor: this.state.bar_background_color[i],
                            borderColor: this.state.bar_background_color[i],
                            borderWidth: 1,
                            hoverBackgroundColor: this.state.bar_background_hover_color[i],
                            hoverBorderColor: this.state.bar_background_hover_color[i],
                            data: datasets[i],
                            yAxisID: "y-axis-2"
                        }
                    }
                    mainDataFunnel.push(localdata);
                    localdata = {}
                }

                console.log(mainDataFunnel)
                this.setState({
                    shop_funnels: {
                        labels: result.pages,
                        datasets: mainDataFunnel
                    }
                })



            });


        // const urlVisitor = REACT_APP_URL_VISITOR_COUNT + `?${params.toString()}`
        // console.log(urlVisitor);

        fetch(REACT_APP_BASE_URL + "/get_product_conversion_analytics_for_dashboard", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(result => {

                let data = []
                let datasets = [];


                Object.keys(result.product_conversion).forEach(function (key) {
                    data.push(key)
                    datasets.push(result.product_conversion[key])
                });
                // console.log(data);
                // console.log(datasets);

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
                    mainDataProduct.push(localdata);
                    localdata = {}
                }

                console.log(mainDataProduct)
                this.setState({
                    product_conversion: {
                        labels: result.products,
                        datasets: mainDataProduct
                    }
                })


            });

        //
        // const urlConvert = REACT_APP_URL_CONVERSION_RATE + `?${params.toString()}`
        //
        // console.log(urlConvert);

        fetch(REACT_APP_BASE_URL + "/get_landing_page_analytics_for_dashboard", {
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


                let data3 = {
                    pages: [
                        "Home Page",
                        "Product Page",
                        "Blog Page"
                    ],
                    landing_conversion: {
                        conversion_percentage: [
                            10.3,
                            14.3,
                            6.2
                        ]
                    }
                }

                let data = []
                let datasets = [];


                Object.keys(data3.landing_conversion).forEach(function (key) {
                    data.push(key)
                    datasets.push(data3.landing_conversion[key])
                });
                // console.log(data);
                // console.log(datasets);

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
                    mainDataLanding.push(localdata);
                    localdata = {}
                }

                console.log(mainDataLanding)
                this.setState({
                    landing_page_conversion: {
                        labels: data3.pages,
                        datasets: mainDataLanding
                    }
                })


            });

    }

    componentDidMount() {
        this.getAllData();
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

                        <MenuItem component={Link} to={"/ABTestingDashboard"} style={{minHeight: "50px", paddingLeft: "50px"}}>
                            <ListItemIcon>
                                <DnsIcon/>
                            </ListItemIcon>
                            A/B Testing
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
                        <h2 style={{margin: "2% 2%"}}>Conversion Dashboard</h2>

                        {/*<FormControl variant="outlined" className={classes.formControl}>*/}
                        {/*    <InputLabel id="demo-simple-select-outlined-label">Experiment Name</InputLabel>*/}
                        {/*    <Select*/}
                        {/*        labelId="demo-simple-select-outlined-label"*/}
                        {/*        id="demo-simple-select-outlined"*/}
                        {/*        value={this.state.select_val}*/}
                        {/*        onChange={(e) => {*/}
                        {/*            this.setState({select_val: e.target.value})*/}
                        {/*            this.getSessionData(e.target.value);*/}
                        {/*        }}*/}
                        {/*        label="Experiment Name">*/}

                        {/*        {this.state.experiment_names.map((exp_name) => (*/}
                        {/*            <MenuItem className={classes.expMenu} value={exp_name[1]}>{exp_name[0]}</MenuItem>*/}
                        {/*        ))}*/}

                        {/*        /!*<MenuItem value={"13e6f65bacbf4d74b8561e940287e604"} style={{color: "black"}}>Product*!/*/}
                        {/*        /!*    page design</MenuItem>*!/*/}
                        {/*        /!*<MenuItem value={"66f5d1fc432d47b994250688fd728ff7"} style={{color: "black"}}>Home page*!/*/}
                        {/*        /!*    messaging</MenuItem>*!/*/}
                        {/*    </Select>*/}
                        {/*</FormControl>*/}
                    </div>

                    <Divider/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>

                            <h2>
                                SHOP FUNNEL ANALYSIS
                            </h2>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "0% 0% 0% 0.5%", width: "97%"}}>
                                <p>Home Page to Product Page CTR is the lowest.</p>
                                <p>RECOMMENDATION: Improve Home Page by changing creatives of copy.</p>
                            </div>


                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "80%"}}>

                                <hr/>
                                <Bar
                                    width={45}
                                    height={20}
                                    type={'bar'}
                                    data={this.state.shop_funnels}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                barPercentage: 0.3
                                            }],
                                            yAxes: [{
                                                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: false,
                                                position: "left",
                                                id: "y-axis-1",
                                            }, {
                                                type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                                display: true,
                                                position: "left",
                                                id: "y-axis-2",

                                                // grid line settings
                                                gridLines: {
                                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                },
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>

                            <h2>
                                PRODUCT CONVERSION ANALYSIS
                            </h2>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "0% 0% 0% 0.5%", width: "97%"}}>
                                <p>Conversion for product B is significantly lower than others.</p>
                                <p>RECOMMENDATION: Improve Product Page B by changing creatives or copy or price.</p>
                            </div>

                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "80%"}}>

                                <hr/>
                                <Bar

                                    yAxisID="% Conversion"
                                    width={45}
                                    height={20}
                                    data={this.state.product_conversion}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                stacked: true,
                                                barPercentage: 0.3
                                            }],
                                            yAxes: [{
                                                stacked: true,
                                                // ticks: {
                                                //
                                                //     min: 0,
                                                //     max: 100,
                                                //     callback: function(value){return value+ "%"}
                                                // },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "Unique Visitors"
                                                }
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>

                    <Divider/>

                    <Card style={{margin: "2% 5%"}}>
                        <CardContent>
                            <h2>
                                LANDING PAGE ANALYSIS
                            </h2>
                            <Divider/>
                            <div style={{padding: "0.5%", margin: "0% 0% 0% 0.5%", width: "97%"}}>
                                <p>Conversion for product B is significantly lower than others.</p>
                                <p>RECOMMENDATION: Improve Product Page B by changing creatives or copy or price.</p>
                            </div>

                            <div style={{margin: "0% 0.5% 1% 1.5%", width: "80%"}}>
                                <hr/>
                                <Bar
                                    width={45}
                                    height={20}
                                    data={this.state.landing_page_conversion}
                                    options={{
                                        maintainAspectRatio: true,
                                        scales: {
                                            xAxes: [{
                                                stacked: true,
                                                barPercentage: 0.3
                                            }],
                                            yAxes: [{
                                                ticks: {
                                                    min: 0,
                                                    max: 20,
                                                    callback: function(value){return value + "%"}
                                                },
                                                scaleLabel: {
                                                    display: true,
                                                    labelString: "% Conversion"
                                                }
                                            }]
                                        }
                                    }}>
                                </Bar>
                            </div>
                        </CardContent>
                    </Card>


                </main>
            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(DashboardAnother))
