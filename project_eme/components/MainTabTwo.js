import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Pressable} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';

import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function MainTabTwo({ navigation }) {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [comment, setComment] = useState('');

  const toggleCommentModal = () => {
    setCommentModalVisible(!isCommentModalVisible);
  };

  const handleComment = () => {
    if (comment.trim() !== '') {
      console.log('Comment:', comment);
      setComment('');
      toggleCommentModal();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.HeadingText}>Lost & Found</Text>
      <View style={styles.searchcontainer}>
        <TextInput
          style={styles.TextInput}
          placeholder="Let's find your things!"
        />
        <TouchableOpacity>
          <Ionicons name="search" style={styles.SearchIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.NavigationSearch}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
          <Text style={styles.NavigationText}>Claimed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabTwo')}>
          <Text style={styles.NavigationText}>Unclaimed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollcontainer}>
        <View>
          <Text>Olivia Rodrigo</Text>
        </View>
        <View style={styles.kunwari}>
          <Text style={styles.commenttext}>piktur</Text>
        </View>
        <TouchableOpacity onPress={toggleCommentModal}>
          <View style={styles.commentcontainer}>
            <FontAwesome5 name="comment" size={24} style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={styles.commenttext}>Comment</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text>Olivia Rodrigo</Text>
        </View>
        <View style={styles.kunwari}>
          <Text style={styles.commenttext}>piktur 1</Text>
        </View>
        <TouchableOpacity onPress={toggleCommentModal}>
          <View style={styles.commentcontainer}>
            <FontAwesome5 name="comment" size={24} style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={styles.commenttext}>Comment</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text>Rodrigo</Text>
        </View>
        <View style={styles.kunwari}>
          <Text style={styles.commenttext}>piktur 2</Text>
        </View>
        <TouchableOpacity onPress={toggleCommentModal}>
          <View style={styles.commentcontainer}>
            <FontAwesome5 name="comment" size={24} style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={styles.commenttext}>Comment</Text>
          </View>
        </TouchableOpacity>
        <View> 
          <Text>Olivia</Text>
        </View>
        <View style={styles.kunwari}>
          <Text style={styles.commenttext}>piktur 3</Text>
        </View>
        <TouchableOpacity onPress={toggleCommentModal}>
          <View style={styles.commentcontainer}>
            <FontAwesome5 name="comment" size={24} style={{ transform: [{ scaleX: -1 }] }} />
            <Text style={styles.commenttext}>Comment</Text>
          </View>
        </TouchableOpacity>
        
      </ScrollView>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
          <AntDesign name="tagso" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CreatePost.js')}>
          <MaterialIcons name="post-add" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Tab5')}>
          <Feather name="user" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={false} visible={isCommentModalVisible}>
        <View style={styles.commentModalContainer}>
          <View style={styles.commentHeader}>
            <Pressable style={styles.backButton} onPress={toggleCommentModal}>
              <Ionicons name="chevron-back" style={styles.backIcon} />
              <Text>Back</Text>
            </Pressable>
            <Text style={styles.commentHeaderText}>Comments</Text>
          </View>
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
      </Modal>
    </View>
  );
}

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
    fontSize: 30, // Increase the search icon size
    color: '#485E6E', // Change the color to match the theme
  },
  commentcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: 'space-between',
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
    padding: 20,
  },
  commentModalContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Light gray background
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#485E6E', // Match the theme color
    paddingBottom: 20,
    paddingTop: 40,
    backgroundColor: '#485E6E', // Dark header background
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
    color: 'white', // White back icon color
  },
  commentHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // White header text color
  },
  commentInput: {
    padding: 15, // Increased padding
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA', // Slightly lighter border color
    margin: 15, // Increased margin
    paddingBottom: 25, // Increased bottom padding
    backgroundColor: 'white', // White input background
    borderRadius: 5, // Rounded corners
    color: '#333', // Dark gray text color
  },
  commentButton: {
    backgroundColor: '#485E6E', // Facebook's blue theme color
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 15, // Increased margin
    borderRadius: 5, // Rounded corners
  },
});
