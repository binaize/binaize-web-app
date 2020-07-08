import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import Divider from '@material-ui/core/Divider';
import {fade} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {withRouter} from "react-router-dom";

import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {HorizontalBar} from 'react-chartjs-2';

import L from "leaflet"
import {geoJson} from "leaflet"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Choropleth from 'react-leaflet-choropleth'

import {statesData} from "./us-states"

import $ from 'jquery';

import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';

import {
    REACT_APP_BASE_URL,
    REACT_APP_URL_VISITOR_ACTIVITY
} from "../config"

import AppToolbar from "./AppToolbar";
import SideDrawer from "./SideDrawer";
import Button from "@material-ui/core/Button";
import Demo from "./SideDrawer_rsuit";
import {DateRangePicker} from "rsuite";


const {allowedRange} = DateRangePicker;
const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

const leaveStyle = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

const drawerWidth = 280;
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
    button: {
        position: 'absolute',
        right: "0%",
        backgroundColor: "#f1f1f1",
        height: "70px",
        width: "70px",
        margin: "1% 5%",
        '&:hover': {
            backgroundColor: '#ddd !important',
            color: "rgba(32,46,120,0.85)"
        }
    }
})

const tickSizes = [
    1, 2, 5,
    10, 20, 50,
    100, 200, 500,
    1000, 2000, 5000,
    10000, 20000, 50000,
    100000, 200000, 500000,
    1000000, 2000000, 5000000
];

// const bar_colors = ['#89f4ff', '#15a2cd',
//     '#4fc3f7', "#4dd0e1", "#64b5f6"]
const bar_colors = ['#89f4ff', '#4dd0e1',
    '#4fc3f7', "#64b5f6", "#15a2cd"]

const bar_colors_hover = ['#5fced7', '#2bb2c4',
    '#30a3d6', "#3c93d7", "#0480a5"]


class CustomerAnalytics extends React.Component {

    constructor(props) {
        super(props);

        this.device_ref = React.createRef();
        this.browser_ref = React.createRef();
        this.os_ref = React.createRef();

        let startDate = new Date();

        let today_date = startDate.getDate();
        let today_month = startDate.getMonth();
        let today_year = startDate.getFullYear();

        this.state = {
            lat: 38.491897,
            lng: -100.748953,
            zoom: 4,

            choropleth_ref : React.createRef(),

            access_token: localStorage.getItem("access_token"),

            creation_time: localStorage.getItem("creation_time"),
            start_yearMonthDate: '',
            end_yearMonthDate: '',

            startDate: '',
            endDate: '',
            today_yearMonthDate: today_year + '-' + this.pad(today_month + 1) + "-" + this.pad(today_date),

            device_data: '',
            device_session_count : [],
            device_session_count_ref : React.createRef(),
            device_visitor_count : [],
            device_visitor_count_ref : React.createRef(),
            device_total_sales : [],
            device_total_sales_ref : React.createRef(),
            device_sales_conversion : [],
            device_sales_conversion_ref : React.createRef(),
            device_avg_order_value : [],
            device_avg_order_value_ref : React.createRef(),
            device_sales_conversion_count : [],
            device_order_count : [],

            browser_data: '',
            browser_session_count : [],
            browser_session_count_ref : React.createRef(),
            browser_visitor_count : [],
            browser_visitor_count_ref : React.createRef(),
            browser_total_sales : [],
            browser_total_sales_ref : React.createRef(),
            browser_sales_conversion : [],
            browser_sales_conversion_ref : React.createRef(),
            browser_avg_order_value : [],
            browser_avg_order_value_ref : React.createRef(),
            browser_sales_conversion_count : [],
            browser_order_count : [],

            os_data: '',
            os_session_count : [],
            os_session_count_ref : React.createRef(),
            os_visitor_count : [],
            os_visitor_count_ref : React.createRef(),
            os_total_sales : [],
            os_total_sales_ref : React.createRef(),
            os_sales_conversion : [],
            os_sales_conversion_ref : React.createRef(),
            os_avg_order_value : [],
            os_avg_order_value_ref : React.createRef(),
            os_sales_conversion_count : [],
            os_order_count : [],

            step_size_session: '',
            step_size_visitor: '',
            step_size_goal_conversion: '',
            step_size_sales_conversion: '',

            session_max_value: '',
            visitor_max_value: '',
            goal_conversion_max_value: '',
            sales_conversion_max_value: '',

        }


        if (this.state.access_token === "") {
            this.props.history.push("/");
        }


    }

    pad(n) {
        return n < 10 ? '0' + n : n
    }

    zoomToFeature(e) {
        // map.fitBounds(e.target.getBounds());
    }

    highlightFeature(e) {
        let layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        // if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        //     layer.bringToFront();
        // }
    }

    resetHighlight(e) {

        let choropleth_ref = this.choropleth_ref;
        console.log(e.target)
        console.log(choropleth_ref)

    }

    getDeviceSessionData(){
        let labels = []
        let session_count = []
        let visitor_count = []
        let total_sales = []
        let sales_conversion = []
        let avg_order_value = []

        for (let i = 0; i < this.state.device_data.length; i++) {
            labels.push(this.state.device_data[i]["device"])
            session_count.push(this.state.device_data[i]["session_count"])
            visitor_count.push(this.state.device_data[i]["visitor_count"])
            total_sales.push(this.state.device_data[i]["total_sales"])
            sales_conversion.push(this.state.device_data[i]["sales_conversion"])
            avg_order_value.push(this.state.device_data[i]["avg_order_value"])
            // order_count.push(this.state.device_data[i]["order_count"])
            // sales_conversion_count.push(this.state.device_data[i]["sales_conversion_count"])
        }

        let session_data = [
            {
                label: 'Total Sessions',
                backgroundColor: bar_colors[0],
                borderColor: bar_colors[0],
                hoverBackgroundColor: bar_colors_hover[0],
                hoverBorderColor: bar_colors_hover[0],
                data: session_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'rgb(234,234,234)'
                    }
                }
            }
        ]

        let visitor_data = [
            {
                label: 'Unique Sessions',
                backgroundColor: bar_colors[1],
                borderColor: bar_colors[1],
                hoverBackgroundColor: bar_colors_hover[1],
                hoverBorderColor: bar_colors_hover[1],
                data: visitor_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'rgb(234,234,234)'
                    }
                }
            }
        ]

        let total_data = [
            {
                label: 'Total Sales ($)',
                backgroundColor: bar_colors[2],
                borderColor: bar_colors[2],
                hoverBackgroundColor: bar_colors_hover[2],
                hoverBorderColor: bar_colors_hover[2],
                data: total_sales,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'rgb(234,234,234)'
                    }
                }
            }
        ]


        let sales_data = [
            {
                label: 'Sales Conversion (%)',
                backgroundColor: bar_colors[3],
                borderColor: bar_colors[3],
                hoverBackgroundColor: bar_colors_hover[3],
                hoverBorderColor: bar_colors_hover[3],
                data: sales_conversion,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'rgb(234,234,234)'
                    }
                }
            }
        ]

        let avg_order_data = [
            {
                label: 'Average Oder Value ($)',
                backgroundColor: bar_colors[4],
                borderColor: bar_colors[4],
                hoverBackgroundColor: bar_colors_hover[4],
                hoverBorderColor: bar_colors_hover[4],
                data: avg_order_value,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'rgb(234,234,234)'
                    }
                }
            }
        ]


        this.setState({
            device_session_count : {
                labels: labels,
                datasets: session_data
            },
            device_visitor_count : {
                labels: labels,
                datasets: visitor_data
            },
            device_total_sales : {
                labels: labels,
                datasets: total_data
            },
            device_sales_conversion : {
                labels: labels,
                datasets: sales_data
            },
            device_avg_order_value : {
                labels: labels,
                datasets: avg_order_data
            }
        })

        let device_session_count_ref = this.device_session_count_ref.chartInstance
        device_session_count_ref.update()

        let device_visitor_count_ref = this.device_visitor_count_ref.chartInstance
        device_visitor_count_ref.update()

        let device_total_sales_ref = this.device_total_sales_ref.chartInstance
        device_total_sales_ref.update()

        let device_sales_conversion_ref = this.device_sales_conversion_ref.chartInstance
        device_sales_conversion_ref.update()

        let device_avg_order_value_ref = this.device_avg_order_value_ref.chartInstance
        device_avg_order_value_ref.update()

    }

    getBrowserData(){
        let labels = []
        let session_count = []
        let visitor_count = []
        let total_sales = []
        let sales_conversion = []
        let avg_order_value = []

        for (let i = 0; i < this.state.browser_data.length; i++) {
            labels.push(this.state.browser_data[i]["browser"])
            session_count.push(this.state.browser_data[i]["session_count"])
            visitor_count.push(this.state.browser_data[i]["visitor_count"])
            total_sales.push(this.state.browser_data[i]["total_sales"])
            sales_conversion.push(this.state.browser_data[i]["sales_conversion"])
            avg_order_value.push(this.state.browser_data[i]["avg_order_value"])
            // order_count.push(this.state.device_data[i]["order_count"])
            // sales_conversion_count.push(this.state.device_data[i]["sales_conversion_count"])
        }

        let session_data = [
            {
                label: 'Total Sessions',
                backgroundColor: bar_colors[0],
                borderColor: bar_colors[0],
                hoverBackgroundColor: bar_colors_hover[0],
                hoverBorderColor: bar_colors_hover[0],
                data: session_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let visitor_data = [
            {
                label: 'Unique Sessions',
                backgroundColor: bar_colors[1],
                borderColor: bar_colors[1],
                hoverBackgroundColor: bar_colors_hover[1],
                hoverBorderColor: bar_colors_hover[1],
                data: visitor_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let total_data = [
            {
                label: 'Total Sales ($)',
                backgroundColor: bar_colors[2],
                borderColor: bar_colors[2],
                hoverBackgroundColor: bar_colors_hover[2],
                hoverBorderColor: bar_colors_hover[2],
                data: total_sales,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let sales_data = [
            {
                label: 'Sales Conversion (%)',
                backgroundColor: bar_colors[3],
                borderColor: bar_colors[3],
                hoverBackgroundColor: bar_colors_hover[3],
                hoverBorderColor: bar_colors_hover[3],
                data: sales_conversion,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let avg_order_data = [
            {
                label: 'Average Oder Value ($)',
                backgroundColor: bar_colors[4],
                borderColor: bar_colors[4],
                hoverBackgroundColor: bar_colors_hover[4],
                hoverBorderColor: bar_colors_hover[4],
                data: avg_order_value,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]


        this.setState({
            browser_session_count : {
                labels: labels,
                datasets: session_data
            },
            browser_visitor_count : {
                labels: labels,
                datasets: visitor_data
            },
            browser_total_sales : {
                labels: labels,
                datasets: total_data
            },
            browser_sales_conversion : {
                labels: labels,
                datasets: sales_data
            },
            browser_avg_order_value : {
                labels: labels,
                datasets: avg_order_data
            }
        })

        let browser_session_count_ref = this.browser_session_count_ref.chartInstance
        browser_session_count_ref.update()

        let browser_visitor_count_ref = this.browser_visitor_count_ref.chartInstance
        browser_visitor_count_ref.update()

        let browser_total_sales_ref = this.browser_total_sales_ref.chartInstance
        browser_total_sales_ref.update()

        let browser_sales_conversion_ref = this.browser_sales_conversion_ref.chartInstance
        browser_sales_conversion_ref.update()

        let browser_avg_order_value_ref = this.browser_avg_order_value_ref.chartInstance
        browser_avg_order_value_ref.update()

    }

    getOSData(){
        let labels = []
        let session_count = []
        let visitor_count = []
        let total_sales = []
        let sales_conversion = []
        let avg_order_value = []

        for (let i = 0; i < this.state.os_data.length; i++) {
            labels.push(this.state.os_data[i]["os"])
            session_count.push(this.state.os_data[i]["session_count"])
            visitor_count.push(this.state.os_data[i]["visitor_count"])
            total_sales.push(this.state.os_data[i]["total_sales"])
            sales_conversion.push(this.state.os_data[i]["sales_conversion"])
            avg_order_value.push(this.state.os_data[i]["avg_order_value"])
            // order_count.push(this.state.device_data[i]["order_count"])
            // sales_conversion_count.push(this.state.device_data[i]["sales_conversion_count"])
        }

        let session_data = [
            {
                label: 'Total Sessions',
                backgroundColor: bar_colors[0],
                borderColor: bar_colors[0],
                hoverBackgroundColor: bar_colors_hover[0],
                hoverBorderColor: bar_colors_hover[0],
                data: session_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let visitor_data = [
            {
                label: 'Unique Sessions',
                backgroundColor: bar_colors[1],
                borderColor: bar_colors[1],
                hoverBackgroundColor: bar_colors_hover[1],
                hoverBorderColor: bar_colors_hover[1],
                data: visitor_count,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let total_data = [
            {
                label: 'Total Sales ($)',
                backgroundColor: bar_colors[2],
                borderColor: bar_colors[2],
                hoverBackgroundColor: bar_colors_hover[2],
                hoverBorderColor: bar_colors_hover[2],
                data: total_sales,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let sales_data = [
            {
                label: 'Sales Conversion (%)',
                backgroundColor: bar_colors[3],
                borderColor: bar_colors[3],
                hoverBackgroundColor: bar_colors_hover[3],
                hoverBorderColor: bar_colors_hover[3],
                data: sales_conversion,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        let avg_order_data = [
            {
                label: 'Average Oder Value ($)',
                backgroundColor: bar_colors[4],
                borderColor: bar_colors[4],
                hoverBackgroundColor: bar_colors_hover[4],
                hoverBorderColor: bar_colors_hover[4],
                data: avg_order_value,
                datalabels: {
                    display: true,
                    color: '#333',
                    anchor: "start",
                    align: "end",
                    offset: 5,
                    font: {
                        size: "12",
                        weight: "bold"
                    },
                    value: {
                        color: 'white'
                    }
                }
            }
        ]

        this.setState({
            os_session_count : {
                labels: labels,
                datasets: session_data
            },
            os_visitor_count : {
                labels: labels,
                datasets: visitor_data
            },
            os_total_sales : {
                labels: labels,
                datasets: total_data
            },
            os_sales_conversion : {
                labels: labels,
                datasets: sales_data
            },
            os_avg_order_value : {
                labels: labels,
                datasets: avg_order_data
            }
        })

        let os_session_count_ref = this.os_session_count_ref.chartInstance
        os_session_count_ref.update()

        let os_visitor_count_ref = this.os_visitor_count_ref.chartInstance
        os_visitor_count_ref.update()

        let os_total_sales_ref = this.os_total_sales_ref.chartInstance
        os_total_sales_ref.update()

        let os_sales_conversion_ref = this.os_sales_conversion_ref.chartInstance
        os_sales_conversion_ref.update()

        let os_avg_order_value_ref = this.os_avg_order_value_ref.chartInstance
        os_avg_order_value_ref.update()

    }

    getVisitorActivity(start, end) {

        const params = new URLSearchParams({
            start_date: start || this.state.creation_time + 'T00-00-00',
            end_date: end || this.state.today_yearMonthDate + 'T23-59-59'
        })

        console.log(params.toString())

        let access = "Bearer " + this.state.access_token;


        fetch(REACT_APP_BASE_URL + REACT_APP_URL_VISITOR_ACTIVITY + `?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Authorization': access,
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 200) {
                    response.json().then(result => {

                        if ("device" in result && "browser" in result && "os" in result) {
                            this.setState({
                                device_data: result["device"],
                                browser_data: result["browser"],
                                os_data: result["os"]
                            });

                            this.getDeviceSessionData();
                            this.getBrowserData();
                            this.getOSData();

                            // console.log(this.state.device_data_labels)
                            console.log(this.state.device_data);
                            console.log(this.state.browser_data);
                            console.log(this.state.os_data);

                        } else {
                            console.log(result)
                        }



                    });
                } else {
                    console.log("No visitor activity data")
                }
            }).catch(error => {
                console.log(error)
        })

    }


    componentDidMount() {
        this.getVisitorActivity();
    }

    render() {
        const {classes} = this.props;

        const position = [this.state.lat, this.state.lng]

        return (
            <div className={classes.root}>
                <CssBaseline/>

                <AppToolbar/>

                {/*<SideDrawer/>*/}
                <Demo active={localStorage.getItem("activeKey")}/>

                {/* MAIN LAYOUT */}
                <main className={classes.content}>
                    <div className={classes.toolbar}/>

                    <div style={{display: "flex"}}>
                        <h3 style={{margin: "2% 1% 1% 5%"}}> Customer Analytics </h3>

                        <Button
                            color="primary"
                            className={classes.button}
                            onClick={() => {
                                if (this.state.start_yearMonthDate !== "") {
                                    this.getVisitorActivity(this.state.start_yearMonthDate + 'T00-00-00', this.state.end_yearMonthDate + 'T23-59-59');
                                } else {
                                    this.getVisitorActivity(this.state.creation_time + 'T00-00-00', this.state.today_yearMonthDate + 'T23-59-59');
                                }
                            }}
                        ><RefreshRoundedIcon/></Button>

                    </div>

                    <DateRangePicker
                        placeholder="Till Today"
                        size="lg"
                        style={{width: 280, margin: "0% 0% 1% 5%", color: "#111"}}
                        disabledDate={allowedRange(this.state.creation_time, this.state.today_yearMonthDate)}
                        onChange={(selectedStartEndDate) => {

                            function pad(n) {
                                return n < 10 ? '0' + n : n
                            }

                            try {
                                let startDate = selectedStartEndDate[0]
                                let endDate = selectedStartEndDate[1]

                                let s_date = startDate.getDate();
                                let s_month = startDate.getMonth();
                                let s_year = startDate.getFullYear();
                                let s_yearMonthDate = s_year + '-' + pad(s_month + 1) + "-" + pad(s_date);


                                let e_date = endDate.getDate();
                                let e_month = endDate.getMonth();
                                let e_year = endDate.getFullYear();
                                let e_yearMonthDate = e_year + '-' + pad(e_month + 1) + "-" + pad(e_date);

                                // Takes sometime to set the state
                                this.setState({
                                    start_yearMonthDate: s_yearMonthDate,
                                    end_yearMonthDate: e_yearMonthDate,
                                })

                                this.getVisitorActivity(s_yearMonthDate + 'T00-00-00', e_yearMonthDate + 'T23-59-59')

                            } catch (e) {
                                // console.log(e)

                                this.setState({
                                    start_yearMonthDate: ''
                                })

                                this.getVisitorActivity(this.state.creation_time + 'T00-00-00', this.state.today_yearMonthDate + 'T23-59-59');
                            }

                        }}
                    />


                    {/*<Divider style={{margin: "0% 5%"}}/>*/}

                    {/*---------------------- DEVICE ----------------------------------*/}
                    <div>
                        <Card style={{margin: "2% 1% 0 5%"}}>
                            <CardContent>
                                <div style={{margin: "0% 1.5% 1% 1.5%"}}>
                                    <h4>
                                        Sales Analytics By Device
                                    </h4>
                                    <Divider/>
                                    <div style={{display:"flex", width: "20%"}}>
                                        <HorizontalBar
                                            width={50}
                                            height={35}
                                            data={this.state.device_session_count}
                                            ref={(reference) => this.device_session_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales : {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={35}
                                            data={this.state.device_visitor_count}
                                            ref={(reference) => this.device_visitor_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={35}
                                            data={this.state.device_total_sales}
                                            ref={(reference) => this.device_total_sales_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                       ticks: {
                                                           min: 0,
                                                           display: false
                                                       },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={35}
                                            data={this.state.device_sales_conversion}
                                            ref={(reference) => this.device_sales_conversion_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={35}
                                            data={this.state.device_avg_order_value}
                                            ref={(reference) => this.device_avg_order_value_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                    {/*--------------------- END DEVICE-----------------*/}

                    {/*--------------------- BROWSER -------------------*/}
                    <div>
                        <Card style={{margin: "2% 1% 0 5%"}}>
                            <CardContent>
                                <div style={{margin: "0% 1.5% 1% 1.5%"}}>
                                    <h4>
                                        Sales Analytics By Browser
                                    </h4>
                                    <Divider/>
                                    <div style={{display:"flex", width: "20%"}}>
                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.browser_session_count}
                                            ref={(reference) => this.browser_session_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales : {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.browser_visitor_count}
                                            ref={(reference) => this.browser_visitor_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.browser_total_sales}
                                            ref={(reference) => this.browser_total_sales_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.browser_sales_conversion}
                                            ref={(reference) => this.browser_sales_conversion_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.browser_avg_order_value}
                                            ref={(reference) => this.browser_avg_order_value_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    {/*---------------------------- END BROWSER ----------------------*/}

                    {/*---------------------------- OS -------------------------------*/}
                    <div>
                        <Card style={{margin: "2% 1% 0 5%"}}>
                            <CardContent>
                                <div style={{margin: "0% 1.5% 1% 1.5%"}}>
                                    <h4>
                                        Sales Analytics By OS
                                    </h4>
                                    <Divider/>
                                    <div style={{display:"flex", width: "20%"}}>
                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.os_session_count}
                                            ref={(reference) => this.os_session_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales : {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.os_visitor_count}
                                            ref={(reference) => this.os_visitor_count_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.os_total_sales}
                                            ref={(reference) => this.os_total_sales_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.os_sales_conversion}
                                            ref={(reference) => this.os_sales_conversion_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>

                                        <HorizontalBar
                                            width={50}
                                            height={50}
                                            data={this.state.os_avg_order_value}
                                            ref={(reference) => this.os_avg_order_value_ref = reference}
                                            options={{
                                                maintainAspectRatio: true,
                                                scales: {
                                                    xAxes: [{
                                                        ticks: {
                                                            min: 0,
                                                            display: false
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }],
                                                    yAxes: [{
                                                        barPercentage: 1,
                                                        ticks: {
                                                            display: false //this will remove only the label
                                                        },
                                                        gridLines: {
                                                            display: false
                                                        }
                                                    }]
                                                }
                                            }}
                                        >
                                        </HorizontalBar>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>

                    {/*---------------------------- END OS -----------------------------*/}

                    {/*<Card style={{margin: "2% 5%"}}>*/}
                    {/*    <CardContent>*/}
                    {/*        <div style={{padding: "0.5%", margin: "0% 1%", width: "95%", fontSize: "14px"}}>*/}
                    {/*            <Map style={{height: "500px"}} center={position} zoom={this.state.zoom}>*/}
                    {/*                /!*<TileLayer*!/*/}
                    {/*                /!*    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'*!/*/}
                    {/*                /!*    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*!/*/}
                    {/*                /!*<Marker position={position}>*!/*/}
                    {/*                /!*    <Popup>*!/*/}
                    {/*                /!*        A pretty CSS3 popup. <br /> Easily customizable.*!/*/}
                    {/*                /!*    </Popup>*!/*/}
                    {/*                /!*</Marker>*!/*/}

                    {/*                <Choropleth*/}
                    {/*                    data={{type: 'FeatureCollection', features: statesData.features}}*/}
                    {/*                    valueProperty={(feature) => feature.properties.value}*/}
                    {/*                    scale={['#b3cde0', '#011f4b']}*/}
                    {/*                    steps={7}*/}
                    {/*                    mode='e'*/}
                    {/*                    style={style}*/}
                    {/*                    onChange={()=> {}}*/}
                    {/*                    ref={(reference) => {*/}
                    {/*                        this.choropleth_ref = reference*/}
                    {/*                        console.log(reference)*/}
                    {/*                    }}*/}

                    {/*                    onEachFeature={(feature, layer) => {*/}
                    {/*                        layer.bindPopup(feature.properties.name)*/}
                    {/*                        layer.on({*/}
                    {/*                            mouseover: this.highlightFeature,*/}
                    {/*                            mouseout: this.resetHighlight,*/}
                    {/*                            click: this.zoomToFeature*/}
                    {/*                        });*/}
                    {/*                    }}*/}
                    {/*                />*/}

                    {/*            </Map>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                </main>

            </div>
        )
    }
}

export default withRouter(withStyles(exp_style)(CustomerAnalytics))
