import React from 'react';
import { Keyboard, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import { Button } from '../components/common';

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            userName: '',
            password: '',
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('login.name_placeholder')}
                        maxLength={40}
                        onBlur={Keyboard.dismiss}
                        value={this.state.userName}
                        onChangeText={this.handleNameChange}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('login.password_placeholder')}
                        maxLength={40}
                        onBlur={Keyboard.dismiss}
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                    />
                </View>
                <View style={styles.practiceButtonContainer}>
                    <Button onPress={this.onLogin}>Login</Button>
                </View>

                {/* Loading */}
                {this.state.loading &&
                    <View style={styles.loading} pointerEvents='none' >
                        <ActivityIndicator size='large' />
                    </View>
                }
            </View>
        );
    }

    handleNameChange(userName) {
        this.setState({ userName });
    }

    handlePasswordChange(password) {
        this.setState({ password });
    }

    onLogin() {

        var login = {
            email: this.state.userName,
            password: this.state.password,
        }

        console.log('onLogin');

        this.setState({ loading: true });

        fetch('http://10.9.21.199:84/auth/login', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(login)
        })
            .then(resp => Promise.all([resp, resp.json()]))
            .then(([ resp, json ]) => {

                setTimeout(() => null, 0);

                //resp.json(json => {
                this.setState({ loading: false });

                let cookies = resp.headers.get('set-cookie');
                // Get .AspNet.auth-cookie value
                let aspCookie = cookies.split(';').map(c => c.trim()).filter(c => c.indexOf('.AspNet.auth-cookie') === 0);

                if (!aspCookie) throw '.AspNet.auth-cookie not found!';

                // Get cookie value
                let authCookie = aspCookie[0].split('=')[1];

                //Alert.alert('DEBUG. json', JSON.stringify({ authCookie, json }));

                // Success
                if (json.ResultCode !== 0) {
                    Alert.alert('Login unsuccess!');
                    return;
                }

                // Store session token
                let { UserName: userName, Role: role } = json;
                global.loginInfo = { userName, role, authCookie };
                Alert.alert('Login success!');
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log('Cautch error', error);
            });
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        width: '80%',
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    practiceButtonContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 30
    }
};

export default LoginScreen;
