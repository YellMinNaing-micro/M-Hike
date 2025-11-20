// app/profile.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getUserById, updateUser, } from "../lib/database";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Load user from DB
    useEffect(() => {
        const loadUser = async () => {
            const userId = await AsyncStorage.getItem("loggedInUserId");

            if (!userId) return;

            const dbUser = await getUserById(Number(userId));

            if (dbUser) setUser(dbUser);
        };

        loadUser();
    }, []);


    // Save updated user
    const handleSave = async () => {
        if (!user) return;

        const { username, email, password } = user;

        // EMPTY CHECK
        if (!username || !email || !password) {
            Alert.alert("⚠️ Missing Fields", "Please fill in all fields.");
            return;
        }

        // EMAIL VALIDATION (@gmail.com only)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            Alert.alert("❌ Invalid Email", "Email must be a valid @gmail.com address.");
            return;
        }

        // PASSWORD VALIDATION (same as register)
        const passwordRegex = /^[A-Z][A-Za-z0-9!@#$%^&*()_\-+=<>?/{}~]{7,}$/;
        const numberRegex = /\d/;

        if (!passwordRegex.test(password) || !numberRegex.test(password)) {
            Alert.alert(
                "❌ Invalid Password",
                "Password must:\n• Start with a capital letter\n• Be at least 8 characters\n• Contain at least one number\n• Special characters allowed"
            );
            return;
        }

        // UPDATE USER IN DB
        const success = await updateUser(user);

        if (success) {
            Alert.alert("✅ Success", "Profile updated successfully");
            setIsEditing(false);
        } else {
            Alert.alert("❌ Error", "Failed to update profile");
        }
    };


    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUserId");
        router.replace("/login");

    }

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.iconButton}
                >
                    <Ionicons name="arrow-back-outline" size={26} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* CONTENT */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    {user ? (
                        <>
                            {/* Username */}
                            <TextInput
                                style={styles.input}
                                value={user.username?.toString() || ""}
                                editable={isEditing}
                                onChangeText={(text) => setUser({ ...user, username: text })}
                                placeholder="Username"
                            />

                            {/* Email */}
                            <TextInput
                                style={styles.input}
                                value={user.email?.toString() || ""}
                                editable={isEditing}
                                onChangeText={(text) => setUser({ ...user, email: text })}
                                placeholder="Email"
                            />

                            {/* Password with eye icon */}
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    value={user.password?.toString() || ""}
                                    editable={isEditing}
                                    onChangeText={(text) => setUser({ ...user, password: text })}
                                    secureTextEntry={!showPassword}
                                    placeholder="Password"
                                    placeholderTextColor="#9CA3AF"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color="#111827"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Buttons */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    Alert.alert(
                                        "View All Records",
                                        "Do you want to return to the full list of hike records?",
                                        [
                                            { text: "No", style: "cancel" },
                                            {
                                                text: "Yes",
                                                onPress: () => router.push("/home"),
                                            },
                                        ],
                                        { cancelable: true }
                                    );
                                }}
                            >
                                <Text style={styles.buttonText}>Show All Hike Records</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    if (isEditing) {
                                        // Show confirmation before saving
                                        Alert.alert(
                                            "Confirm Update",
                                            "Are you sure you want to save the changes?",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                { text: "Yes", onPress: () => handleSave() },
                                            ]
                                        );
                                    } else {
                                        setIsEditing(true);
                                    }
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    {isEditing ? "Save Profile" : "Edit Profile"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleLogout()}
                            >
                                <Text style={styles.buttonText}>Log Out</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text>No user found</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F0FF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    iconButton: {
        padding: 4,
    },
    scrollContent: {
        alignItems: "center",
        paddingVertical: 20,
    },
    card: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        backgroundColor: "#F9FAFB",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 12,
        backgroundColor: "#F1F5F9",
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: "#111827",
    },
    eyeButton: {
        padding: 8,
    },
    button: {
        backgroundColor: "#616161",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
