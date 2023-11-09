import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Import the user picture
import OliviaPicture from '../components/pictures/olivia.png';

export default function Tab5({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState('qjmrodrigo@tip.edu.ph');
  const [editedStudentID, setEditedStudentID] = useState('2012123');

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleEnter = () => {
    // Save the edited values here, and exit edit mode
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scrollcontainer}>
        {/* User Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={OliviaPicture}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Olivia Rodrigo</Text>
          <View style={styles.editButtonContainer}>
            {isEditing ? (
              // "Back" button for canceling the edit operation
              <TouchableOpacity onPress={handleEditProfile}>
                <Text style={styles.backButton}>Back</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleEditProfile}>
                <Feather name="edit" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>

          {/* Email and Student ID Section with Icons */}
          <View style={styles.userInfoContainer}>
            {isEditing ? (
              <>
                <View style={styles.userInfoItem}>
                  <MaterialIcons name="email" size={24} color="black" />
                  <TextInput
                    style={[styles.userInfoTextInput, styles.emailInput]}
                    value={editedEmail}
                    onChangeText={(text) => setEditedEmail(text)}
                  />
                </View>
                <View style={styles.userInfoItem}>
                  <AntDesign name="idcard" size={24} color="black" />
                  <TextInput
                    style={[styles.userInfoTextInput, styles.studentIDInput]}
                    value={editedStudentID}
                    onChangeText={(text) => setEditedStudentID(text)}
                  />
                </View>
                <TouchableOpacity onPress={handleEnter} style={styles.enterButton}>
                  <Text style={styles.enterButtonText}>Enter</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={[styles.userInfoItem, styles.emailSection]}>
                  <MaterialIcons name="email" size={24} color="black" />
                  <Text style={styles.userInfoText}>Email: {editedEmail}</Text>
                </View>
                <View style={[styles.userInfoItem, styles.studentIDSection]}>
                  <AntDesign name="idcard" size={24} color="black" />
                  <Text style={styles.userInfoText}>Student ID: {editedStudentID}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutcontainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.logoutext}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rectangle}>
            <TouchableOpacity onPress={() => navigation.navigate('MainTab')}>
                <AntDesign name="tagso" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Tab2')}>
                <MaterialIcons name="post-add" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Tab3')}>
            <AntDesign name="home" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Tab4')}>
                <Feather name="bell" size={40} color="black" />
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
    backgroundColor: 'white',
  },
  scrollcontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  rectangle: {
    width: 'auto',
    height: 55,
    backgroundColor: '#485E6E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButtonContainer: {
    marginTop: 10,
  },
  logoutcontainer: {
    backgroundColor: '#EAD83B',
    padding: 5,
    marginLeft: 130,
    marginRight: 130,
    marginTop: 20,
  },
  logoutext: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  userInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  userInfoTextInput: {
    fontSize: 16,
    marginLeft: 10,
    width: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  enterButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
  enterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emailInput: {
    backgroundColor: '#EFEFEF',
  },
  studentIDInput: {
    backgroundColor: '#EFEFEF',
  },
  emailSection: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 5,
  },
  studentIDSection: {
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 5,
  },
  backButton: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
