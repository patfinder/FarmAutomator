import React from 'react';
import { Keyboard, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import settings from '../settings';
import { Button } from '../components/common';

class ActionScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cattles: null,
            feedTypes: null,
            feeds: null,

            feedType: null,
            cattle: null,
            feed: null,
        };

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        // Retrieve data
        fetch(`${settings.API.API_ROOT}${settings.API.DATA.ACTION_DATA}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(data => data.json())
            .then(data => {
                this.cattles = data.Cattles;
                this.feedTypes = data.FeedTypes;
                this.feeds = data.Feeds;
            })
            .catch(error => {
                Alert.alert('Error', JSON.stringify(error));
            })
    }

    render() {

        var { cattles, feedTypes, feeds } = this.state;

        var cattleFeeds = cattles.map(c => feedTypes.map(f => ({ ...f, cattleId: c.Id })).flat();

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Picker
                        selectedValue={this.state.feedType}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue) =>
                            this.setState({ feedType: itemValue })
                        }>
                        <Picker.Item label="Java" value="java" />
                        <Picker.Item label="JavaScript" value="js" />
                    </Picker>
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

    //handleNameChange(userName) {
    //    this.setState({ userName });
    //}
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
    inputContainer: {
        paddingTop: 15
    },
    practiceButtonContainer: {
        marginTop: 'auto',
        width: '95%',
        marginBottom: 30
    }
};

export default ActionScreen;
