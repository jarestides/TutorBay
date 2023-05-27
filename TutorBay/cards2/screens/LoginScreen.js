import React, { Component, useState } from 'react';
import { ActivityIndicator, Button, View, Text, TextInput, Image } from 'react-native';
import CustomButton from "../Components/CustomButton/CustomButton";
import Logo from "../assets/images/Logo.png";


global.localName = '';
global.password = '';
global.userId = -1;
global.firstName = '';
global.lastName = '';
global.search = '';
global.card = '';

const onSignInFacebook = () => {
    console.warn("Facebook");
};
const onSignInGoogle = () => {
    console.warn("Google");
};
const onSignInApple = () => {
    console.warn("Apple");
};
const onCreateAccount = () => {
    console.warn("Create Account");
};


export default class Homescreen extends Component {

    constructor() {
        super()
        this.state =
        {
            message: ' '
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: '#2bb3d4', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Logo} style={{
                    width: "70%",
                    maxWidth: 300,
                    maxHeight: 200,
                    height: 200,
                }} />
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 30,
                    color: "#000000",
                }}>TutorBay Login</Text>
                <View style={{ alignItems: 'flex-end' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{
                                height: 30,
                                fontSize: 20,
                                backgroundColor: "#fff",
                                width: "50%",
                                borderColor: "#e8e8e8",
                                borderWidth: 2,
                                borderRadius: 5,

                                paddingHorizontal: 10,
                                marginVertical: 5,
                            }}
                            placeholder="Login Name"
                            onChangeText={(val) => { this.changeLoginNameHandler(val) }}
                        />
                    </View>
                    <Text style={{ fontSize: 20 }}> </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <TextInput
                            style={{
                                height: 30,
                                fontSize: 20,
                                backgroundColor: "#fff",
                                width: "50%",
                                borderColor: "#e8e8e8",
                                borderWidth: 2,
                                borderRadius: 5,

                                paddingHorizontal: 10,
                                marginVertical: 5,
                            }}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(val) => { this.changePasswordHandler(val) }}
                        />
                    </View>
                    <Text style={{ fontSize: 20 }}>{this.state.message} </Text>
                </View>
                <Button
                    title="Do Login"
                    onPress={this.handleClick}
                />
                <CustomButton
                    text="Sign In With Facebook"
                    onPress={onSignInFacebook}
                    bgColor="#e7eaf4"
                    fgColor="#4765a9"
                />
                <CustomButton
                    text="Sign In With Google"
                    onPress={onSignInGoogle}
                    bgColor="#fae9ea"
                    fgColor="#dd4d44"
                />
                <CustomButton
                    text="Sign In With Apple"
                    onPress={onSignInApple}
                    bgColor="#e3e3e3"
                    fgColor="#363636"
                />
                <CustomButton
                    text="Don't have an account? Create one"
                    onPress={onCreateAccount}
                    type="TERTIARY"
                />
            </View>
        );
    }

    handleClick = async () => {
        try {
            var obj = { login: global.loginName.trim(), password: global.password.trim() };
            var js = JSON.stringify(obj);

            const response = await fetch('https://tutorbay.herokuapp.com/api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                this.setState({ message: "User/Password combination incorrect" });
            }
            else {
                global.firstName = res.firstName;
                global.lastName = res.lastName;
                global.userId = res.id;
                this.props.navigation.navigate('Card');
            }
        }
        catch (e) {
            this.setState({ message: e.message });
        }
    }

    changeLoginNameHandler = async (val) => {
        global.loginName = val;
    }

    changePasswordHandler = async (val) => {
        global.password = val;
    }

}
