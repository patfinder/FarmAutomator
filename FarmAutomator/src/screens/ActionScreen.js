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
import {
    Container, Header, Footer, FooterTab, Content,
    Left, Right, Body,
    Form, Item, Label, Input,
    Title, Accordion, Button, Segment,
} from "native-base";

import { Grid, Row, Col } from "react-native-easy-grid";

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

            cattleId: null,
            feedId: null,
            feedType: null,
            quantity: 0,
        };

        this.toggleFeedType = this.toggleFeedType.bind(this);
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
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Feed Cattle</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Form>
                        <Grid style={{height: 200}}>
                            <Row>
                                {/*<Item>*/}
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
                                {/*</Item>*/}
                            </Row>
                            <Row>
                                {/*<Item>*/}
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
                                        {feeds.map(feed => <Picker.Item key={feed.id} label={feed.name} value={feed.id} />)}
                                    </Picker>
                                {/*</Item>*/}
                            </Row>
                            <Row>
                                {/*<Item>*/}
                                    {/* FeedType */}
                                    <Segment>
                                        <Button first active={this.state.feedType === this.state.feedTypes[0]} onPress={this.toggleFeedType}><Text>{feedTypes[0]}</Text></Button>
                                        <Button last active={this.state.feedType === this.state.feedTypes[1]} onPress={this.toggleFeedType}><Text>{feedTypes[1]}</Text></Button>
                                    </Segment>
                                {/*</Item>*/}
                            </Row>
                        </Grid>

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
