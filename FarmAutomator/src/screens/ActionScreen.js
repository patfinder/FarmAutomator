import React from 'react';
import {
    Keyboard, KeyboardType,
    TextInput, View, Text, ActivityIndicator, Alert, Picker,
    ListView, SectionList, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import i18n from '../i18n';
import settings from '../settings';
//import { Button } from '../components/common';
import { Switch } from 'react-native-gesture-handler';


import {
    Container, Header, Footer, FooterTab, Content,
    Left, Right, Body, List,
    Form, Item, Label, Input,
    Title, Accordion, Button, Segment,
    SwipeRow, 
} from "native-base";

import { Grid, Row, Col } from "react-native-easy-grid";

const datas = [
    "Simon Mignolet",
    "Nathaniel Clyne",
    "Dejan Lovren",
];

class ActionScreen extends React.Component {

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            cattles: null,
            feedTypes: null,
            feeds: null,

            cattleId: null,
            feedId: null,
            feedType: null,
            quantity: 0,


            listViewData: datas
        };

        this.toggleFeedType = this.toggleFeedType.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.onScanCage = this.onScanCage.bind(this);
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
                var feedType = feedTypes[0];

                this.setState({ cattles, feedTypes, feeds, feedType });

                console.log('ActionScreen.componentDidMount', { cattles, feedTypes, feeds });
            })
            .catch(error => {
                Alert.alert('Error', JSON.stringify(error));
            })
    }

    render() {

        var { cattles, feeds, feedTypes } = this.state; // feedTypes

        if (!cattles || !feeds) return null;

        feeds = feeds.filter(feed => feed.feedType === this.state.feedType);

        //var cattleFeeds = cattles.map(c => feeds.map(f => ({
        //    ...f,
        //    cattleId: c.id,
        //    cattleFeedId: `${c.id} - ${f.id}`,
        //    cattleFeedName: `${c.name} - ${f.name}`
        //}))).flat();

        return (
            <Container style={styles.container}>
                <Header>
                    <Left />
                    <Body>
                        <Title>Feed Cattle</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        {/* Cattle */}
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            //style={{ width: undefined }}
                            placeholder="Select Cattle"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.cattleId}
                            onValueChange={(val) => this.setState({ cattleId: val })}
                        >
                            {cattles.map(cattle => <Picker.Item key={cattle.id} label={cattle.name} value={cattle.id} />)}
                        </Picker>

                        {/* Feed */}
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            //style={{ width: undefined }}
                            placeholder="Select Cattle"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.feedId}
                            onValueChange={(val) => this.setState({ feedId: val })}
                        >
                            {feeds.map(feed => <Item key={feed.id} label={feed.name} value={feed.id} />)}
                        </Picker>

                        {/* FeedType */}
                        <Segment>
                            <Button first active={this.state.feedType === this.state.feedTypes[0]} onPress={this.toggleFeedType}><Text>{feedTypes[0]}</Text></Button>
                            <Button last active={this.state.feedType === this.state.feedTypes[1]} onPress={this.toggleFeedType}><Text>{feedTypes[1]}</Text></Button>
                        </Segment>

                        {/* Qualtity */}
                        <TextInput
                            style={styles.textInput}
                            placeholder={i18n.t('action.quantity_placeholder')}
                            maxLength={40}
                            onBlur={Keyboard.dismiss}
                            value={this.state.quantity.toString()}
                            onChangeText={this.onQuantityChange}
                        />

                        {/* Scan List */}
                        <SectionList

                            sections={[
                                { title: 'Title1', data: ['item1', 'item2'] },
                                { title: 'Title2', data: ['item3', 'item4'] },
                                { title: 'Title3', data: ['item5', 'item6'] },
                            ]}
                            keyExtractor={(item, index) => item + index}


                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                            )}

                            renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                        />

                        <Item>
                            <Button onPress={this.onScanCage}><Text>Scan Cage</Text></Button>
                        </Item>

                    </Form>
                </Content>

                <Footer>
                    <FooterTab>
                        <Button full>
                            <Text>Footer</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

    toggleFeedType() {
        try {
            var index = 1 - this.state.feedTypes.indexOf(this.state.feedType);
            this.setState({ feedType: this.state.feedTypes[index] });
        }
        catch (error) {
            console.log('toggleFeedType', error);
        }
    }

    onQuantityChange(val) {
        if (!isNaN(val)) this.setState({ quantity: val.trim() });
    }

    deleteRow(secId, rowId, rowMap) {
        // TODO: delete
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
    }

    onScanCage() {
        this.props.navigation.navigate('ActionDetails');
    }
}

const styles = StyleSheet.create({
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
});

export default ActionScreen;
