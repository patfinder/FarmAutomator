import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import settings from '../settings';
//import { Button } from '../components/common';
import { Switch } from 'react-native-gesture-handler';
import { Container, Header, Content, Accordion, Button, Segment } from "native-base";

const dataArray = [
    { title: "First Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
    { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
];

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
            quantity: 0,
        };

        this.onQuantityChange = this.onQuantityChange.bind(this);
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

                var { data: { cattles, feedTypes, feeds } } = res;
                this.setState({ cattles, feedTypes, feeds });

                console.log('ActionScreen.componentDidMount', { cattles, feedTypes, feeds });
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
            <Container>
                <Header>
                    <Segment>
                        <Button first><Text>Puppies</Text></Button>
                        <Button last active><Text>Cubs</Text></Button>
                    </Segment>
                </Header>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.captionCol}>Cattle</Text>
                        <Picker style={styles.inputCol}
                            selectedValue={this.state.cattleFeedId}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue) =>
                                //this.setState({ cattleFeedId: itemValue })
                                null
                            }>
                            {cattles.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
                        </Picker>
                        {
                            //<Picker
                            //    selectedValue={this.state.cattleFeedId}
                            //    style={{ height: 50, width: 200 }}
                            //    onValueChange={(itemValue) =>
                            //        this.setState({ cattleFeedId: itemValue })
                            //    }>
                            //    {cattleFeeds.map(cf => <Picker.Item key={cf.cattleFeedId} label={cf.cattleFeedName} value={cf.cattleFeedId} />)}
                            //</Picker>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <View><Text>{this.state.feedType ? this.state.feedTypes[0] : this.state.feedTypes[1]}</Text></View>
                        <View><Switch value={this.state.feedType} onValueChange={() => this.setState({ feedType: !Boolean(this.state.feedType) })} /></View>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder={i18n.t('action.quantity_placeholder')}
                        maxLength={20}
                        keyboardType='numeric'
                        onBlur={Keyboard.dismiss}
                        value={this.state.quantity}
                        onChangeText={this.onQuantityChange}
                    />

                    {
                        //<View style={styles.practiceButtonContainer}>
                        //    <Button onPress={this.onLogin}>Login</Button>
                        //</View>
                    }

                    {/* Loading */}
                    {this.state.loading &&
                        <View style={styles.loading} pointerEvents='none' >
                            <ActivityIndicator size='large' />
                        </View>
                    }
                </View>
            </Container>
        );
    }

    onQuantityChange(val) {
        if (!isNaN(val)) this.setState({ quantity: val.trim() });
    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    captionCol: {
        width: '40%'
    },
    inputCol: {
        width: '55%'
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
