import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { set as setDatabaseData } from 'firebase/database';

const ItemForm = ({ navigation }) => {
  const [itemText, setItemText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const selectImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [6, 6],
      quality: 1,
    });

    if (pickerResult.cancelled) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  const uploadImage = async (uri) => {
    const storage = getStorage();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const imageRef = storageRef(storage, `images/${filename}`);
    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!itemText.trim() || !location.trim() || !color.trim() || !category.trim()) {
        // Show an error message if any of the required fields is blank
        Alert.alert('Error', 'Please fill out all required fields (location, color, category).');
        return;
      }

      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage.localUri);
      }

      const db = getDatabase();
      const itemsRef = ref(db, 'items');

      const newItemRef = push(itemsRef);
      const postId = newItemRef.key;

      const itemData = {
        postId: postId,
        text: itemText,
        image: imageUrl,
        location: location, // New fields
        color: color,
        category: category,
        timestamp: Date.now(),
        userEmail: userEmail,
      };

      await setDatabaseData(newItemRef, itemData);

      Alert.alert('Success', 'Item posted successfully!');
      setItemText('');
      setSelectedImage(null);
      setLocation(''); // Clear input fields
      setColor('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Error posting item: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        value={itemText}
        onChangeText={setItemText}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.localUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Add a Photo</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.button, (isSubmitting || !itemText) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting || !itemText}
      >
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
      {isSubmitting && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({

  
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 100,
    backgroundColor: '#F0F2F5',
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderColor: '#CCD0D5',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: '#E7F3FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#1877F2',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#1877F2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ACC0D8',
  },
});

export default ItemForm;
