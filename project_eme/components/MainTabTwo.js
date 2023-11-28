import { LogBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';

export default function MainTabTwo({ navigation }) {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [items, setItems] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer']); // Ignore the timer warning for now
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Fetch items only once for the authenticated user
        fetchUserItems(user.email);
      } else {
        setUser(null);
        setItems([]); // Clear items when the user logs out
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const fetchUserItems = (userEmail) => {
    const db = getDatabase();
    const itemsRef = ref(db, 'items');

    const unsubscribeItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.values(data).filter((item) => item.userEmail === userEmail);
        setItems(itemsArray.reverse());
      }
    });

    return () => {
      unsubscribeItems();
    };
  };
  

  
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
  

  return (
    <View style={styles.container}>
      <Text style={styles.HeadingText}>Lost & Found</Text>
      <View style={styles.searchcontainer}>
        <TextInput style={styles.TextInput} placeholder="Let's find your things!" />
        <TouchableOpacity>
          <Ionicons name="search" style={styles.SearchIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.NavigationSearch}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
          <Text style={styles.NavigationText}>FOR YOU</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabTwo')}>
          <Text style={styles.NavigationText}>YOUR POSTS</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollcontainer}>
        {items.map((item,index) => (
          <View key={`${item.timestamp}-${item.postId}`}>
            <Text>Posted by: {item.userEmail}</Text>
            <Text>{item.text}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Color: {item.color}</Text>
            <Text>Item: {item.category}</Text>
            <Text>Date Posted: {formatDate(item.timestamp)}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.imagePreview} />}

            <TouchableOpacity onPress={() => handleCommentButton(item)}>
              <FontAwesome5 name="comment" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal animationType="slide" transparent={false} visible={isCommentModalVisible}>
      {isCommentModalVisible && (
  <View style={styles.commentModalContainer}>
    <View style={styles.commentHeader}>
      <Pressable style={styles.backButton} onPress={() => toggleCommentModal(null)}>
        <Ionicons name="chevron-back" style={styles.backIcon} />
        <Text>Back</Text>
      </Pressable>
      <Text style={styles.commentHeaderText}>Comments</Text>
    </View>
    {currentPost && currentPost.postId ? (
      <View>
        <Text style={styles.commentHeaderText}>Previous Comments:</Text>
        {Array.isArray(postComments) && postComments.map((comment, index) => (
         <View key={`${comment.userEmail}-${index}`} style={styles.commentcontainer}>
         <Text style={styles.commenttext}>
           {comment.userEmail}: {comment.text}
         </Text>
       </View>
     ))}
      </View>
    ) : (
      <Text style={styles.commentHeaderText}>No Comments</Text>
          )}
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={comment}
            onChangeText={(text) => setComment(text)}
            multiline
          />
          <Pressable style={styles.commentButton} onPress={handleComment}>
            <Text>Comment</Text>
          </Pressable>
        </View>
      )}
      </Modal>

      {/* ... (existing code) */}
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
  scrollcontainer: {
    backgroundColor: 'white',
  },
  NavigationSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  NavigationText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  HeadingText: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rectangle: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#485E6E',
    height: 70,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchcontainer: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  TextInput: {
    fontSize: 19,
    fontWeight: 'bold',
    width: '80%',
    textAlign: 'center',
  },
  SearchIcon: {
    fontSize: 30, 
    color: '#485E6E', 
  },
  commentcontainer: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: 'space-evenly',
  },
  commenttext: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  kunwari: {
    backgroundColor: '#D9D9D9',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 70,
  },
  commentModalContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#485E6E', 
    paddingBottom: 20,
    paddingTop: 40,
    backgroundColor: '#485E6E', 
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    marginRight: 5,
    color: 'white', 
  },
  commentHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', 
  },
  commentInput: {
    padding: 15, 
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA', 
    margin: 15, 
    paddingBottom: 25, 
    backgroundColor: 'white', 
    borderRadius: 5,
    color: '#333', 
  },
  commentButton: {
    backgroundColor: '#485E6E', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 15, 
    borderRadius: 5, 
  },
    imagePreview: {
      width: 200, // Set the width of the image as needed
      height: 200, // Set the height of the image as needed
      borderRadius: 10,
    },
});
  
