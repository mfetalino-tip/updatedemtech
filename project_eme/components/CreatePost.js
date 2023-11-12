import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, push } from '@react-native-firebase/database';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from '@react-native-firebase/storage';

const TweetForm = () => {
  const [tweetText, setTweetText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permissions to access images were denied');
      return;
    }

    const image = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!image.cancelled) {
      setSelectedImage({ uri: image.uri, base64: image.base64 });
    }
  };

  const handlePost = async () => {
    const storage = getStorage();
    const db = getDatabase();

    const uploadImage = async () => {
      if (selectedImage) {
        const imageRef = storageRef(storage, `images/${selectedImage.uri}`);

        await uploadString(imageRef, selectedImage.base64, 'base64').then(async () => {
          const url = await getDownloadURL(imageRef);
          postTweet(url);
        });
      } else {
        postTweet('');
      }
    };

    const postTweet = (imageUrl) => {
      const tweetsRef = ref(db, 'tweets');

      const tweetData = {
        text: tweetText,
        image: imageUrl,
        timestamp: new Date().getTime(),
      };

      push(tweetsRef, tweetData)
        .then(() => {
          setTweetText('');
          setSelectedImage(null);
          setExpanded(false);
          console.log('Tweet posted successfully!');
        })
        .catch((error) => {
          console.error('Error posting tweet:', error);
        });
    };

    uploadImage();
  };

  return (
    <View style={styles.container}>
      {!expanded ? (
        <TouchableOpacity style={styles.box} onPress={() => setExpanded(true)}>
          <Text style={styles.boxText}>Lost or found something? Share it!</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.expandedBox}>
          <TextInput
            placeholder="What's on your mind?"
            value={tweetText}
            onChangeText={(text) => setTweetText(text)}
            multiline
          />
          {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.image} />}
          <Button title="Select Image" onPress={selectImage} />
          <Button title="Tweet" onPress={handlePost} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 250,
    height: 150,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    textAlign: 'center',
  },
  expandedBox: {
    width: 300,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'lightblue',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 10,
  },
});

export default TweetForm;
