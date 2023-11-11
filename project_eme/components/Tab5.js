import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, userSignOut, updateUserProfile } from '../src/firebase';
import { getDatabase, ref, get, set } from 'firebase/database';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';

export default function ProfileSetting({ navigation }) {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

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

      // Prompt user to re-enter their password for reauthentication
      const currentPassword = prompt('Please enter your password for verification:');

      // Re-authenticate the user before making changes
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update Realtime Database
      const userId = user.uid;
      await set(ref(db, `users/${userId}`), {
        email: newEmail || email,
        studentNumber: studentNumber,
      });

      if (newEmail && newEmail !== email) {
        // Update user's email in Authentication
        await updateEmail(user, newEmail);
      }

      // Update Authentication profile
      await updateUserProfile(user, { displayName: studentNumber });

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
      console.error('Error updating profile:', error.message);
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
        {/* The current screen is already 'Tab5', so no need to navigate */}
        <Feather name="user" size={40} color="black" />
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
  // Styles for the navigation icons
  rectangle: {
    width: 'auto',
    height: 55,
    backgroundColor: '#485E6E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
