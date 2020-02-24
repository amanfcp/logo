import React, { useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { Input, Icon } from 'react-native-elements'
import { useState } from 'react';
import RNGooglePlaces from 'react-native-google-places';
import { Button } from 'react-native-paper';

var pinLocations = []

export default function App({ navigation, route }) {

    const [propAddress, setPropAddress] = useState('')
    const [propAddressPlaceHolder, setPropAddressPlaceHolder] = useState('Canada Street 55')
    const [propAddressChange, setPropAddressChange] = useState(false)

    const [propTitle, setPropTitle] = useState('')
    const [propTitlePlaceHolder, setPropTitlePlaceHolder] = useState('Your property title')
    const [propTitleChange, setPropTitleChange] = useState(false)
    const titleRef = useRef()

    const [propDetail, setPropDetail] = useState('')
    const [propDetailPlaceHolder, setPropDetailPlaceHolder] = useState('Enter any notes here...')
    const [propDetailChange, setPropDetailChange] = useState(false)
    const detailRef = useRef()

    useEffect(() => {
        AsyncStorage.getItem('location').then(res => {
            if (res) {
                pinLocations = JSON.parse(res)
                console.log('Checking Array', pinLocations)
            }
        }).catch(err => {
            console.warn(err.message)
        })
    }, [pinLocations])

    const SelectDestinationLocation = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                setPropAddress(place)
            })
    }

    const addLocation = async () => {
        console.log('saved address', propAddress.location)
        if (propAddress) {
            pinLocations.push(propAddress)
            console.log('saved array', pinLocations)
            await AsyncStorage.setItem('location', JSON.stringify(pinLocations));
            // route.params.refresh();
            navigation.goBack()
        }
        else { alert('Select Address') }

    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <TouchableOpacity
                style={styles.imageView}
            >
                <Icon
                    name="photo"
                    type="font-awesome"
                    size={80}
                    color="#D50320"
                />
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#D50320'
                    }}
                >
                    Add a Photo
                </Text>

            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    width: '100%'
                }}
                onPress={SelectDestinationLocation}
                activeOpacity={1}
            >
                <Input
                    editable={false}
                    value={propAddress.address}
                    onSubmitEditing={() => titleRef.current.focus()}
                    keyboardType='default'
                    onChangeText={text => {
                        setPropAddressChange(true)
                        setPropAddress(text)
                    }}
                    onFocus={() =>
                        setPropAddressPlaceHolder('')}
                    onBlur={() => {
                        if (propAddressChange === false || propAddress === '') {
                            setPropAddressPlaceHolder('Canada Street 55')
                        }
                    }}
                    inputStyle={styles.inputFields}
                    containerStyle={styles.inputContainer}
                    label='Property Address'
                    labelStyle={styles.label}
                    placeholder={propAddressPlaceHolder}
                />
            </TouchableOpacity>
            <Input
                ref={titleRef}
                blurOnSubmit={false}
                onSubmitEditing={() => detailRef.current.focus()}
                keyboardType='default'
                onChangeText={text => {
                    setPropTitleChange(true)
                    setPropTitle(text)
                }}
                onFocus={() => setPropTitlePlaceHolder('')}
                onBlur={() => {
                    if (propTitleChange === false || propTitle === '') {
                        setPropTitlePlaceHolder('Your Property Title')
                    }
                }}
                inputStyle={styles.inputFields}
                containerStyle={styles.inputContainer}
                label='Property Title'
                labelStyle={styles.label}
                placeholder={propTitlePlaceHolder}
            />
            <Input
                ref={detailRef}
                multiline={true}
                keyboardType='default'
                onChangeText={text => {
                    setPropDetailChange(true)
                    setPropDetail(text)
                }}
                onFocus={() => setPropDetailPlaceHolder('')}
                onBlur={() => {
                    if (propDetailChange === false || propDetail === '') {
                        setPropDetailPlaceHolder('Enter any notes here...')
                    }
                }}
                inputStyle={styles.inputFields}
                containerStyle={styles.inputContainer}
                label='Describe more about property'
                labelStyle={styles.label}
                placeholder={propDetailPlaceHolder}
            />
            <Button
                mode="contained"
                onPress={addLocation}
                labelStyle={{ fontSize: 16, textAlignVertical: "center", height: 30, width: '40%', color: "#fff" }}
            style={{
                borderRadius: 7,
                backgroundColor: "#D50320",
            }}
            >
                Post
            </Button>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        padding: 20,
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    imageView: {
        marginBottom: 30,
    },
    inputContainer: {
        marginRight: 20,
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 0
    },
    inputFields: {
        padding: 0,
        paddingLeft: 10,
    },
    label: {
        color: '#2c2c2f',
        fontWeight: '100',
        fontFamily: 'arial',
        marginBottom: 20,
        marginLeft: 10,
    },
});
