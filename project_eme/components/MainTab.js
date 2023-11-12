import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
 
export default function MainTab({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Lost & Found</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Let's find your things!"
        />
        <TouchableOpacity>
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
      <ScrollView style={styles.scrollContainer}>
        {/*
          Add your scrollable content here, e.g., list of items.
          Make sure to wrap each item in a container with appropriate styles.
        */}
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
}); 