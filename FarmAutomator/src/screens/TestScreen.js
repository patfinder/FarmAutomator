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

class TestScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };

        this.onQuantityChange = this.onQuantityChange.bind(this);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Button style={{flex: 1}}>Button 1</Button>
                <Button style={{flex: 2}}>Button 2</Button>
                <Button style={{flex: 3}}>Button 3</Button>
            </View>
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

export default TestScreen;
