import React, { Component } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, IconButton, Snackbar, Portal, Modal, } from "react-native-paper";
import RNLocation from 'react-native-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import RNGooglePlaces from 'react-native-google-places';
import { Icon } from "react-native-elements";

var Arr = [];

class MapNavigation extends Component {
    constructor(props) {
        super(props);
        // AsyncStorage.clear()
    }
    state = {
        markerCount: 0,
        visible: false,
        error: "",
        loading: true,
        MyLocModal: false,
        DestModal: false,
        YourLocation: null,
        Destination: []
    }

    static setOptions = ({ navigation }) => ({
        headerRight: () => <Icon
            type="entypo"
            name="menu"
            color="#D50320"
            size={20}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            iconStyle={{
                marginRight: 10,
                backgroundColor: '#fff'
            }}
            underlayColor="transparent"
            onPress={() => navigation.navigate('Detail'
                // , {
                //     onGoBack: () => {
                //         console.log('inside refresh')
                //         AsyncStorage.getItem('location').then(res => {
                //             if (res) {
                //                 Arr = JSON.parse(res)
                //                 console.log('inside refresh if')
                //                 console.log('inside refresh if response', res)

                //             }
                //         }).catch(err => {
                //             console.warn(err.message)
                //         })
                //     }
                // }
            )}
        />
    })

    // refresh = () => {
    //     AsyncStorage.getItem('location').then(res => {
    //         console.log('inside refresh')
    //         if (res) {
    //             Arr = JSON.parse(res)
    //             this.setState({ markerCount: this.state.markerCount + 1 })
    //             console.log('inside refresh if')
    //             console.log('inside refresh if response', res)

    //         }
    //     }).catch(err => {
    //         console.warn(err.message)
    //     })
    // }

    // componentWillMount() {
    //     AsyncStorage.getItem('location').then(res => {
    //         if (res) {
    //             Arr = JSON.parse(res)
    //             console.log('Previously saved Locations', Arr)
    //         }
    //     }).catch(err => {
    //         console.warn(err.message)
    //     })
    // }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    componentDidMount() {
        console.log('inside component did mount')
        this.willFocusSubscription = this.props.navigation.addListener('focus', () => {
            console.log('inside component did mount')
            AsyncStorage.getItem('location').then(res => {
                if (res) {
                    this.forceUpdate(() => {
                        Arr = JSON.parse(res)
                        console.log('inside component did mount if')
                        console.log('inside component did mount if response', res)
                    })
                }
            }).catch(err => {
                console.warn(err.message)
            })
        })
    }

    setPinLocation = async () => {
        await AsyncStorage.setItem('location', JSON.stringify(Arr));
        // this.setState({ markerCount: this.state.markerCount + 1 })
        console.log('updated Array in setPinLocation', Arr)
    }

    SelectDestinationLocation = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then(async (place) => {
                // await AsyncStorage.setItem('location', JSON.stringify([AsyncStorage.getItem('location'), place.location]), err => console.warn(err))
                // AsyncStorage.getItem('location').then(res => {
                //     console.warn('Locations', res)
                // }).catch(err => { console.warn(err.message) })
                console.log('place ', place)
                Arr.push(place);
                this.setPinLocation();
                // AsyncStorage.setItem('location', JSON.stringify(Arr));
                // AsyncStorage.getItem('location').then(res => {
                //     console.warn('Locations', res)
                // }).catch(err => { console.warn(err.message) })
                this.setState({ Destination: [...this.state.Destination, place] })
                this.MapView.animateToRegion({
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015
                }, 1000)
            })
            .catch(error => {
                this.setState({ error: error.message, visible: true })
            });
    }

    render() {
        // { this.props.navigation.setParams({ refresh: this.refresh }) }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <MapView
                        initialRegion={{
                            latitude: 24.926294,
                            longitude: 67.022095,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        ref={component => this.MapView = component}
                        style={{ flex: 1 }}
                    >
                        {
                            Arr.map(item =>
                                <Marker
                                    identifier={item.placeID}
                                    key={item.placeID}
                                    title={item.name}
                                    coordinate={
                                        {
                                            latitude: item.location.latitude,
                                            longitude: item.location.longitude,
                                            latitudeDelta: 0.015,
                                            longitudeDelta: 0.015
                                        }
                                    }
                                />
                            )}
                    </MapView>

                    <View style={{ position: "absolute", top: 0, left: 0, right: 0, padding: 20 }}>
                        <TouchableOpacity
                            onPress={this.SelectDestinationLocation}
                            activeOpacity={0.6}
                            style={{
                                marginBottom: 12,
                                marginTop: 6,
                                backgroundColor: "#fff",
                                borderRadius: 5,
                                flexDirection: "row"
                            }}
                        >
                            <TextInput
                                value={
                                    this.state.Destination[this.state.Destination.length - 1] ?
                                        this.state.Destination[this.state.Destination.length - 1].address : ""
                                }
                                editable={false}
                                placeholder="Destination"
                                style={{ height: 45, flex: 1, fontSize: 20 }}
                            />
                            <IconButton
                                icon="map-marker"
                            />
                        </TouchableOpacity>
                        <Button
                            style={{
                                backgroundColor: '#ccc',
                                width: 100,
                                alignSelf: 'flex-end'
                            }}
                            onPress={() => {
                                AsyncStorage.clear()
                                Arr = []
                            }}
                        >
                            Remove
                        </Button>
                    </View>
                </View>
                <Snackbar
                    duration={1000}
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                >
                    {this.state.error}
                </Snackbar>
            </View>
        );
    }
}

export default MapNavigation;