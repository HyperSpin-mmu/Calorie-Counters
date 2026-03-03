import React from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,   
} from "react-native";
import { useRouter } from "expo-router"; // needed so that we can redirect to the login 

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // Get device screen dimensions for responsive design

type CarouselItem = { // Define the structure of each item in the carousel
  id: string;
  image: any;
  title: string;
  subtitle: string;
};

const carouselData: CarouselItem[] = [  // Sample data for the carousel, each item has an id, image, title, and subtitle
  {
    id: "01",
    image: require("../splash_assets/smile running.jpg"),
    title: "Track Your Calories",
    subtitle: "Stay on top of your daily intake with ease.",
  },
  {
    id: "02",
    image: require("../splash_assets/smile running.jpg"),
    title: "Reach Your Goals",
    subtitle: "Set targets and watch your progress grow.",
  },
  {
    id: "03",
    image: require("../splash_assets/smile running.jpg"),
    title: "Stay Motivated",
    subtitle: "Healthy habits start with small steps.",
  },
];

export default function Splash() {  
  const router = useRouter(); // <-- added
  const [activeIndex, setActiveIndex] = React.useState(0);  // State to track the currently active carousel item index

  const handleScroll = (event: any) => {  // Calculate the active index based on the horizontal scroll position of the FlatList
    const index = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    setActiveIndex(index);  // Update the active index state when the user scrolls through the carousel
  };

  const renderDots = () => {    // Render dots below the carousel, highlighting the active dot based on the activeIndex state
    return carouselData.map((_, index) => (
      <View
        key={index}
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          marginHorizontal: 6,
          backgroundColor: activeIndex === index ? "green" : "lightgray",
        }}
      />
    ));
  };

  const renderItem = ({ item }: { item: CarouselItem }) => {  // Render each item in the carousel, displaying the title, subtitle, and image for the current item
    return (
      <View style={styles.slideWrapper}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  return (  
    <View style={styles.container}> {/* Main container for the splash screen */}

      <View style={{ height: screenHeight * 0.8 }}>
        <FlatList
          data={carouselData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </View>

      <View style={styles.dotContainer}>{renderDots()}</View>

      {/* SIMPLE BUTTON TO GO TO Account creation screen */}
      <TouchableOpacity
        onPress={() => router.replace("/signUp")}   // redirects to signup
        style={{
          backgroundColor: "green",
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 10,
          marginTop: 20,
          width: 200,
          alignSelf: "center",

        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Create Account
        </Text>
      </TouchableOpacity>

      {/* SIMPLE BUTTON TO GO TO LOGIN */}
      <TouchableOpacity
        onPress={() => router.replace("/login")}   // redirects to login
        style={{
          backgroundColor: "gray",
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 10,
          marginTop: 20,
          width: 200,
          alignSelf: "center",

        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({    // Styles for the splash screen, including the main container, slide wrapper, text container, title, subtitle, image, and dot container
  container: { flex: 1 },

  slideWrapper: {
    width: screenWidth,
    height: screenHeight * 0.8, // match FlatList height
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: "center",
  },

  textContainer: {
    marginBottom: 0,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: screenWidth,
    height: screenHeight * 0.5,
    resizeMode: "contain",
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -110, // pull up to be just under the image
  },
});
