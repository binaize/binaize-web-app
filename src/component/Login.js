import React, {Component} from "react";
import {Button, Card, Page, TextField} from "@shopify/polaris";

import {withRouter} from "react-router-dom";
import {ReactComponent as BinaizeSVG} from "../images/binaize_logo.svg";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            access_token: ''
        }
    }

    loginUser() {

        const {username, password} = this.state

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            console.log(username);
            console.log(password);


            fetch('https://api.dev.binaize.com/token', {
                method: 'post',
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Success:", result);

                    if (result.detail === "Incorrect email or password") {
                        alert(result.detail);
                        return false
                    } else {
                        this.setState({access_token: result.access_token});
                        localStorage.setItem("access_token", result.access_token)

                        this.props.history.push("/exp")

                    }
                });

        } catch (e) {
            console.error("Error!", e);
        }
    }

    render() {

        const {username, password} = this.state

        return (<Page>
            <center style={{width: "100%"}}>
                <BinaizeSVG style={{width: 200}}/>
            </center>
            <Card sectioned>

                <TextField type="email" label="Username" value={username} onChange={(e) => {
                    this.setState({username: e})
                }}/>

                <TextField type="password" label="Password" value={password} onChange={(e) => {
                    this.setState({password: e})
                }}/>

                <hr/>

                {/*get token after click and send to FullDataTable down.. */}
                <Button primary onClick={this.loginUser.bind(this)}>Login</Button>
            </Card>
        </Page>)

    }

}

export default withRouter(Login);