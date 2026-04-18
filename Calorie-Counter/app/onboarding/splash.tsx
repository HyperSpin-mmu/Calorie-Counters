import React, { useRef, useState, useCallback } from "react";
import {
    View,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    StatusBar, // added to control the status bar appearance
    SafeAreaView, // added to ensure content is within safe area on different devices
    ViewToken,
} from "react-native";
import { useRouter } from "expo-router"; // needed so that we can redirect to the login 

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");  // Get device screen dimensions for responsive design

interface CarouselItem { // Define the structure of each item in the carousel
    id: string;
    image: any;
    title: string;
    subtitle: string;
}

const CAROUSEL_DATA: CarouselItem[] = [  // Sample data for the carousel, each item has an id, image, title, and subtitle
    {
        id: "01",
        image: require("../../splash_assets/smile running.jpg"),
        title: "Track Your Calories",
        subtitle: "Stay on top of your daily intake with ease.",
    },
    {
        id: "02",
        image: require("../../splash_assets/tt.jpg"),
        title: "Reach Your Goals",
        subtitle: "Set targets and watch your progress grow.",
    },
    {
        id: "03",
        image: require("../../splash_assets/k.jpg"),
        title: "Stay Motivated",
        subtitle: "Healthy habits start with small steps.",
    },
];

export default function Splash() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0); // State to track the currently active carousel item index

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0); // Update the active index state when the user scrolls through the carousel, using the index of the first visible item
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleFinish = () => router.replace("/onboarding/motivation");
    const handleLogin = () => router.replace("/onboarding/login");

    const renderItem = useCallback(({ item }: { item: CarouselItem }) => (
        <View style={styles.slideWrapper}>
            <Text style={styles.appTitle}>CALORIE COUNTER</Text>
            {/* add branded heading at the top */}

            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            <View style={styles.imageCard}>
                {/* wrapped image inside a card container for a cleaner modern UI with rounded corners and shadow */}
                <Image source={item.image} style={styles.image} />
            </View>
        </View>
    ), []);

    {/* Main container for the splash screen */ }
    return (
        <SafeAreaView style={styles.container}>
            {/* SafeAreaView replaces normal View to prevent content from overlapping notches/status area */}

            <StatusBar barStyle="dark-content" />
            {/*  status bar text/icons set to dark for better visibility on light background */}
            <View style={styles.carouselSection}>
                <FlatList
                    data={CAROUSEL_DATA}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    decelerationRate="fast"
                />
            </View>

            <View style={styles.bottomPanel}>
                {/* added pagination dots for better UX feedback on carousel position */}
                <View style={styles.dotContainer}>
                    {CAROUSEL_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    onPress={handleFinish}
                    style={styles.primaryButton}
                    activeOpacity={0.85} // smoother button press feel
                >
                    <Text style={styles.primaryButtonText}>Get Started</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.secondaryButton}
                    activeOpacity={0.85} 
                >
                    <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({  // Styles for the splash screen, including the main container, slide wrapper, text container, title, subtitle, image, and dot container
    container: {
        flex: 1,
        backgroundColor: "#F6FBF7",
    },
    carouselSection: {
        flex: 1,
    },
    slideWrapper: {
        width: screenWidth,
        paddingHorizontal: 24, // consistent horizontal padding for all slides
        paddingTop: 40, // adds better top spacing
        alignItems: "center",
        justifyContent: "flex-start", // aligns content more naturally
    },
    appTitle: {
        fontSize: 25, 
        fontWeight: "800",
        letterSpacing: 4,
        color: "#16A34A",
        opacity: 0.5, // less faded so title is clearer
        textAlign: "center",
        marginBottom: 28, // spacing below title
        textTransform: "uppercase",
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 28, // slightly tighter spacing
        minHeight: 110, // better balance for text block
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#111827",
        textAlign: "center",
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: "#4B5563",
        marginTop: 12,
        textAlign: "center",
        paddingHorizontal: 10,
        lineHeight: 24,
    },
    imageCard: {
        width: screenWidth * 0.95,
        height: screenHeight * 0.40,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 }, //  softer shadow
        shadowOpacity: 0.08, // lighter shadow
        shadowRadius: 16, // smoother shadow spread
        elevation: 6, // slightly lighter Android shadow
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    bottomPanel: {
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    dotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5, // a bit more space between dots
    },
    activeDot: {
        backgroundColor: "#22C55E", // brighter green for active state
        width: 32, //  slightly smaller active dot
    },
    inactiveDot: {
        backgroundColor: "#D1D5DB",
        width: 12,
    },
    primaryButton: {
        backgroundColor: "#16A34A",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#16A34A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
    },
    secondaryButton: {
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E5E7EB", // makes Sign In a proper secondary button
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, //  softer shadow
        shadowRadius: 4,
        elevation: 2,
    },
    secondaryButtonText: {
        color: "#111827", // dark text for better contrast on light button
        fontSize: 18,
        fontWeight: "600",
    },
});