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
import RNLocation from 'react-native-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import RNGooglePlaces from 'react-native-google-places';
import { Button } from 'react-native-paper';

var Arr = []

export default function App({ navigation }) {

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
                Arr = JSON.parse(res)
                console.warn('Checking Array', Arr)
            }
        }).catch(err => {
            console.warn(err.message)
        })
    }, [Arr])

    const SelectDestinationLocation = () => {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                setPropAddress(place)
            })
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
                onPress={() => {
                    console.warn('saved address', propAddress.location)
                    if (propAddress) {
                        Arr.push(propAddress.location)
                        console.warn('saved array', Arr)
                        AsyncStorage.setItem('location', JSON.stringify(Arr));
                        navigation.navigate('Maps')
                    }
                    else { alert('Select Address') }
                }}
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
