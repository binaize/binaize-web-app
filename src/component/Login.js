import React from "react";

import clsx from "clsx";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import {ReactComponent as BinaizeSVG} from "../images/binaize_logo.svg";
import {ReactComponent as LoginImage} from "../images/login.svg";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: "60%"
    },
    margin: {
        margin: theme.spacing(1)
    },
    withoutLabel: {
        marginTop: theme.spacing(3)
    },
    textField: {
        width: "30ch"
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    right_side: {
        margin: "0 0 0 20%",
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-25%, -50%)',
    },
    left_side: {
        margin: "5% 0 0 0"
    }
}));

function InputAdornments() {
    const classes = useStyles();
    let history = useHistory();
    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
        email: "",
        access_token: ""
    });

    const loginUser = () => {

        try {
            const formData = new FormData();
            formData.append("username", values.email);
            formData.append("password", values.password);

            console.log(values.email + values.password)

            fetch("https://test.binaize.com/token", {
                method: "post",
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Success:", result);

                    if (result.detail === "Incorrect email or password") {
                        alert(result.detail);
                        return false;
                    } else {
                        values.access_token = result.access_token
                        localStorage.setItem("access_token", result.access_token);
                        history.push("/experiment");
                    }
                });
        } catch (e) {
            console.error("Error!", e);
        }
    };

    const handleChange = prop => event => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <div className={classes.root}>

            <div className={classes.left_side}>
                <LoginImage style={{width: 500, marginLeft: '10%'}}/>
            </div>


            <Card className={classes.right_side} style={{width: "30%", padding: "2% 5%", backgroundColor: "#F7F9FC"}}>
                <CardContent>
                <div >
                    <div>
                        <BinaizeSVG style={{width: 220, marginLeft: '10%'}}/>
                    </div>
                    <div>
                        <FormControl style={{backgroundColor: "white"}}
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                value={values.email}
                                onChange={handleChange("email")}
                                labelWidth={100}
                            />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl style={{backgroundColor: "white"}}
                            className={clsx(classes.margin, classes.textField)}
                            variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">
                                Password
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={values.showPassword ? "text" : "password"}
                                value={values.password}
                                onChange={handleChange("password")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end">
                                            {values.showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                labelWidth={100}
                            />
                        </FormControl>
                    </div>
                    <center>
                        <Button className={clsx(classes.margin, classes.textField)} style={{marginTop: "15px"}}
                                variant="contained"
                                onClick={loginUser} color="primary">
                            Login
                        </Button>
                    </center>

                </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default withRouter(InputAdornments)