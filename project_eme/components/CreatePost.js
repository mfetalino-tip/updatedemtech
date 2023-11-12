import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push } from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';

const ItemForm = () => {
  const [itemText, setItemText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissions to access images were denied');
      return;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      quality: 0.5, 
      aspect: [4, 3], 
      base64: true, 
    });
    if (!image.cancelled) {
      setSelectedImage({ uri: image.uri, base64: image.base64 });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const storage = getStorage();
    const db = getDatabase();

    const uploadImage = async () => {
      if (selectedImage) {
        const imageRef = storageRef(storage, `images/${selectedImage.uri}`);

        await uploadString(imageRef, selectedImage.base64, 'base64').then(
          async () => {
            const url = await getDownloadURL(imageRef);
            postItem(url);
          }
        );
      } else {
        postItem('');
      }
    };
      
    const postItem = (imageUrl) => {
      const itemsRef = ref(db, 'items');

      const itemData = {
        text: itemText,
        image: imageUrl,
        timestamp: new Date().getTime(),
      };

      push(itemsRef, itemData)
        .then(() => {
          setIsSubmitting(false);
          setItemText('');
          setSelectedImage(null);
          console.log('Item posted successfully!');
        })
        .catch((error) => {
          setIsSubmitting(false);
          console.error('Error posting item:', error);
        });
    };

    uploadImage();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post an Item</Text>

      <TextInput
        style={styles.input}
        placeholder="What did you lose or find?"
        value={itemText}
        onChangeText={(text) => setItemText(text)}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
          />
        ) : (
          <Text style={styles.imageButtonText}>Upload Image</Text>
        )}
      </TouchableOpacity>

      <Button
        title="Post Item"
        onPress={handleSubmit}
        disabled={isSubmitting || !itemText}
      />

      {isSubmitting && <ActivityIndicator size="large" color="#E9D735" />}
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 20,
    borderWidth: 2,
    borderColor: '#394B58', // Outer border color
    borderRadius: 5, // Border radius
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '75%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9D735', // Input container border color
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    width: '100%',
    height: 150,
  },
  imageButtonContainer: {
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#E9D735',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
});
export default ItemForm; 