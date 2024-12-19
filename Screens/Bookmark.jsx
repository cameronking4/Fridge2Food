import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, FlatList } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const load = require('../assets/taxi-gears.gif');
const empty = require('../assets/taxi-29.gif');

const Bookmark = () => {
  const [loading, setLoading] = useState(true);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const navigation = useNavigation();

  const fetchBookmarkedRecipes = async () => {
    const user = auth.currentUser;
    const userId = user.uid;
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBookmarkedRecipes(userData.favorites || []);
        console.log('Document data:', userData.favorites);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching bookmarks: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedRecipes();
  }, []);

  const renderItem = ({ item }) => { 
    console.log(item);
    return (
    <Pressable
      style={styles.card}
      onPress={() => {
        navigation.navigate('MealDetails', {
          // image: item.image,
          title: item.title,
          instructions: item.instructions,
          ingredients: item.ingredients,
          bookmark: true,
        });
      }}
    >
      {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
      <Text style={styles.cardText}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.ingredients}</Text>
    </Pressable>
  )};

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Bookmarks</Text>
      {loading ? (
        <View style={styles.loadingScreen}>
          <Image source={load} style={styles.loadingImage} />
        </View>
      ) : bookmarkedRecipes.length === 0 ? (
        <View style={styles.loadingScreen}>
          <Text>No bookmarks yet</Text>
          <Image source={empty} style={styles.loadingImage} />
        </View>
      ) : (
        <FlatList
          onScrollEndDrag={fetchBookmarkedRecipes}
          data={bookmarkedRecipes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          contentContainerStyle={styles.resultBox}
        />
      )}
    </SafeAreaView>
  );
};

export default Bookmark;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEAF0E',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  image: {
    width: '100%',
    height: 200,
  },
  card: {
    marginHorizontal: 32,
    marginVertical: 8,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardText: {
    padding: 12,
    marginTop: 0,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#724502',
  },
  subtitle: {
    padding: 16,
    paddingTop: 0,
    fontSize: 14,
    color: '#555555',
  },
  loadingImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
    paddingBottom: 120, // To ensure scrolling past the last item
  },
});
