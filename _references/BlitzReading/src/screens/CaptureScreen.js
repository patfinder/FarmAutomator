import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import { Button } from '../components/common';

class CaptureScreen extends React.Component {

    constructor(props) {
        super(props);

        //this.state = {
        //    name: '',
        //    password: '',
        //};

        //this.handleNameChange = this.handleNameChange.bind(this);
        //this.handlePasswordChange = this.handlePasswordChange.bind(this);
        //this.onLogin = this.onLogin.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('login.name_placeholder')}
                        maxLength={20}
                        onBlur={Keyboard.dismiss}
                        value={this.state.name}
                        onChangeText={this.handleNameChange}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('login.password_placeholder')}
                        maxLength={20}
                        onBlur={Keyboard.dismiss}
                        value={this.state.password}
                        onChangeText={this.handlePasswordChange}
                    />
                </View>
                <View style={styles.practiceButtonContainer}>
                    <Button onPress={() => this.props.navigation.navigate('Practice')}>Login</Button>
                </View>

            </View>
        );
    }

    handleNameChange(name) {
        this.setState({ name });
    }

    handlePasswordChange(password) {
        this.setState({ password });
    }

    onLogin() {
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
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    practiceButtonContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 30
    }
};

export default CaptureScreen;
