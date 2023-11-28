import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions } from 'react-native';



export default function NewAccount({ navigation }) {
return (
    <View style={styles.container}>
        <Image
        source={require('./pictures/GRADIENT.png')} 
        style={styles.backgroundImage}
        />
        <Image
            source={require('./pictures/profile.png')}
            style={[styles.image, {marginTop: 175, marginBottom: 20}]}
            />
        <Text style={[styles.title, {marginBottom: 100}]}>Welcome TIPIAN!</Text>
        <Text style={[styles.welcometext, {marginBottom: 20}]}>FIND YOUR THINGS!</Text>
        <Text style={[styles.phrase, {marginBottom: 100}]}>Welcome to the Lost and Found community. Begin your search now!</Text>
    <TouchableOpacity
        style={[styles.buttonContainer, { width: 200, borderRadius: 10 }]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttontext}>GET STARTED </Text>
    </TouchableOpacity>
    </View>
);
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#394B58',
    alignItems: 'center',
},
backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
},
image: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    alignItems: 'center',
},
title: {
    fontSize: 23,
    color: 'white',
    paddingBottom: 30,
    fontWeight: 'bold',
},
inputtext: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#E9D735',
    paddingBottom: 20,
    paddingTop: 15,
},
welcometext: {
    color: '#E9D735',
    fontSize: 16,
    fontWeight: 'bold',
},
    phrase: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginRight: 30,
    marginLeft: 30,
    //justifyContent: 'center',
},
buttonContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 7,
    alignItems: 'center',
},
buttontext: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
},
acctext: {
    marginTop: 15,
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
},
signtext: {
    marginTop: 15,
    fontSize: 15,
    color: '#E9D735',
    fontWeight: 'bold',
},
});