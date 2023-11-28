import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';

export default function MainTab({ navigation }) {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [items, setItems] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [user, setUser] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]); // Added state for filtered items
  const [searchText, setSearchText] = useState(''); // Added state for search text


  useEffect(() => {
    const db = getDatabase();
    const itemsRef = ref(db, 'items');

    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.values(data);
        setItems(itemsArray.reverse());
      }
    });

    return () => unsubscribe();
  }, []);
    // Add the following useEffect block to handle postComments
    useEffect(() => {
      if (currentPost && currentPost.comments) {
        const commentsArray = Array.isArray(currentPost.comments)
          ? currentPost.comments
          : Object.values(currentPost.comments);
        setPostComments(commentsArray);
      } else {
        setPostComments([]);
      }
    }, [currentPost]);

  const toggleCommentModal = (post) => {
    console.log('Toggle Comment Modal:', post);
    setCurrentPost(post);
    // Initialize postComments to an empty array if it's undefined
    setPostComments(post && post.comments ? post.comments : []);
    setCommentModalVisible(!isCommentModalVisible);
  };

const handleCommentButton = (post) => {
  console.log('Handle Comment Button:', post);
  toggleCommentModal(post);
};

  const handleComment = async () => {
    if (comment.trim() !== '' && currentPost && currentPost.postId) {
      try {
        const db = getDatabase();
        const commentsRef = ref(db, `items/${currentPost.postId}/comments`);
        const newCommentRef = push(commentsRef);
  
        await set(newCommentRef, {
          userEmail: user ? user.email : 'Anonymous',
          text: comment,
        });
  
        setComment('');
  
        // You might want to update the post's comments locally
        // before closing the comment modal
        const updatedComments = [...postComments, { userEmail: user ? user.email : 'Anonymous', text: comment }];
        setPostComments(updatedComments);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  useEffect(() => {
    // Filter items based on search text
    const filtered = items.filter((item) =>
      item.category && item.category.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchText]);
  
  const handleSearch = () => {
    // Perform the search operation
    const filteredItems = items.filter((item) =>
      item.category && item.category.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredItems(filteredItems);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Lost & Found</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Let's find your things!"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.navigationSearch}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
          <Text style={styles.navigationText}>FOR YOU</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabTwo')}>
          <Text style={styles.navigationText}>YOUR POSTS</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollcontainer}>
        {filteredItems.map((item) => (
          <View key={`${item.timestamp}-${item.postId}`}>
            <Text>Posted by: {item.userEmail}</Text>
            <Text>{item.text}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Color: {item.color}</Text>
            <Text>Item: {item.category}</Text>
            <Text>Date Posted: {formatDate(item.timestamp)}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.imagePreview} />}
          
          </View>
        ))}
      </ScrollView>
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
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#394B58',
    padding: 10,
  },
  scrollContainer: {
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textInput: {
    fontSize: 19,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
  },
  searchIcon: {
    fontSize: 30, // Increase the search icon size
    color: '#485E6E', // Change the color to match the theme
  },
  navigationSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  navigationText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headingText: {
    marginTop: 20, 
    fontSize: 30, 
    fontWeight: 'bold',
    textAlign: 'center',
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

  imagePreview: {
    width: '100%', // Set the width to 100% to make it fill the container
    height: 200, // Set the desired height
    borderRadius: 10,
    marginVertical: 10,
  },
});
