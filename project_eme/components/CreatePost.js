import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { ref, push } from '@react-native-firebase/database';
import { getStorage, ref as storageRef, uploadFile, getDownloadURL } from '@react-native-firebase/storage';

const TweetForm = () => {
  const [tweetText, setTweetText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const selectImage = () => {
    ImagePicker.showImagePicker({ title: 'Select Image' }, (response) => {
      if (!response.didCancel && !response.error) {
        setSelectedImage({ uri: response.uri });
      }
    });
  };

  const handlePost = async () => {
    const storage = getStorage();
    const db = ref('tweets'); 

    const uploadImage = async () => {
      if (selectedImage) {
        const imageRef = storageRef(storage, `images/${selectedImage.uri}`);

        await uploadFile(imageRef, selectedImage.uri).then(async () => {
          const url = await getDownloadURL(imageRef);
          postTweet(url);
        });
      } else {
        postTweet('');
      }
    };

    const postTweet = (imageUrl) => {
      const tweetData = {
        text: tweetText,
        image: imageUrl,
        timestamp: new Date().getTime(),
      };

      push(db, tweetData)
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


export default TweetForm;
