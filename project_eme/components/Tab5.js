import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth, userSignOut, updateUserProfile } from '../src/firebase';
import { getDatabase, ref, get, set } from 'firebase/database';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import YourImage from './pictures/profile.png';

export default function ProfileSetting({ navigation }) {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const db = getDatabase();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userId = user.uid;
          const userRef = ref(db, `users/${userId}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const userData = snapshot.val();
            setEmail(userData.email || '');
            setStudentNumber(userData.studentNumber || '');
            setProfileImage(userData.profileImage || null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      // Re-authenticate the user before making changes
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update Realtime Database
      const userId = user.uid;
      await set(ref(db, `users/${userId}`), {
        email: newEmail || email,
        studentNumber: studentNumber,
        profileImage: profileImage,
      });

      if (newEmail && newEmail !== email) {
        // Update user's email in Authentication
        await updateEmail(user, newEmail);
      }

      // Update Authentication profile
      await updateUserProfile(user, { displayName: studentNumber, photoURL: profileImage });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
      console.error('Error updating profile:', error.message);
    }
  };

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setProfileImage(result.uri);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };
  const handleLogout = async () => {
    try {
      await userSignOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Settings</Text>
      <TouchableOpacity onPress={openImagePicker}>
        <View>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.circularImage} />
          ) : (
            <Image source={YourImage} style={styles.circularImage} />
          )}
          <Text style={styles.profiletext}>Change Profile Picture</Text>
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.profiletext}
        placeholder="Name"
        placeholderTextColor="#E9D735"
        editable={isEditing}
      />
        <View style={styles.inputborder}>
        <TextInput
          style={styles.inputtext}
          placeholder="Email"
          placeholderTextColor="#E9D735"
          value={isEditing ? newEmail : email}
          onChangeText={(text) => setNewEmail(text)} // <-- Set the new email when editing
          editable={isEditing}
        />
      </View>
      <View style={styles.inputborder}>
        <TextInput
          style={styles.inputtext}
          placeholder="Student Number"
          placeholderTextColor="#E9D735"
          value={studentNumber}
          onChangeText={(text) => setStudentNumber(text)}
          editable={isEditing}
        />
      </View>
      {isEditing && (
        <View style={styles.inputborder}>
          <TextInput
            style={styles.inputtext}
            placeholder="Current Password"
            placeholderTextColor="#E9D735"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
          />
        </View>
      )}


      <View style={styles.buttonContainer}>
        {isEditing ? (
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.buttontext}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.buttontext}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.buttontext}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* Navigation Icons */}
      <View style={styles.rectangle}>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                <MaterialIcons name="post-add" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
            <AntDesign name="home" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Tab5')}>
                <Feather name="user" size={40} color="black" />
            </TouchableOpacity>
        </View>
    </View>
  );
}

 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#394B58',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#E9D735',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },
  inputborder: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 25,
  },
  inputtext: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#E9D735',
    paddingBottom: 20,
    paddingTop: 15,
  },
  buttonContainer: {
    backgroundColor: '#E9D735',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttontext: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rectangle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#485E6E',
    height: 70,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  profileimage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  profiletext: {
    marginTop: 5,
    fontSize: 20,
    textAlign: 'center',
    color: '#E9D735',
  },
  circularImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // half of width and height for a circle
    resizeMode: 'cover',
  },
});