import React from 'react';
import { Keyboard, TextInput, View, ActivityIndicator, Alert, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import settings from '../settings';
import { Button } from '../components/common';
import { Switch } from 'react-native-gesture-handler';

class ActionScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cattles: null,
            feedTypes: null,
            feeds: null,

            feedType: null,
            //cattle: null,
            cattleFeedId: null,
        };
    }

    componentDidMount() {
        // Retrieve data
        fetch(`${settings.API.API_ROOT}${settings.API.DATA.ACTION_DATA}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                return res.json();
            })
            .then(res => {

                var data = res.data;

                var { cattles, feedTypes, feeds } = data;

                console.log('ActionScreen.componentDidMount', { cattles, feedTypes, feeds });

                this.setState({ cattles, feedTypes, feeds });
            })
            .catch(error => {
                Alert.alert('Error', JSON.stringify(error));
            })
    }

    render() {

        var { cattles, feeds } = this.state; // feedTypes

        if (!cattles || !feeds) return null;

        var cattleFeeds = cattles.map(c => feeds.map(f => ({
            ...f,
            cattleId: c.id,
            cattleFeedId: `${c.id} - ${f.id}`,
            cattleFeedName: `${c.name} - ${f.name}`
        }))).flat();

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Picker
                        selectedValue={this.state.cattleFeedId}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue) =>
                            this.setState({ cattleFeedId: itemValue })
                        }>
                        {cattleFeeds.map(cf => <Picker.Item key={cf.cattleFeedId} label={cf.cattleFeedName} value={cf.cattleFeedId} />)}
                    </Picker>
                </View>
                <View style={styles.practiceButtonContainer}>
                    <Switch value={this.state.feedType} onValueChange={() => this.setState({ feedType: !Boolean(this.state.feedType) })} />
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
