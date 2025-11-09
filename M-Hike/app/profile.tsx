// app/profile.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getAllUsers } from "../lib/database";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const users = await getAllUsers();
            if (users && users.length > 0) setUser(users[0]);
        };
        loadUser();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
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
                                editable={false}
                            />

                            {/* Email */}
                            <TextInput
                                style={styles.input}
                                value={user.email?.toString() || ""}
                                editable={false}
                            />

                            {/* Password with eye icon */}
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                    value={user.password?.toString() || ""}
                                    editable={false}
                                    secureTextEntry={!showPassword}
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
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Show All Hike Records</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Edit Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => router.push("/login")}
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
        padding: 4, // ensures TouchableOpacity has some touch area
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
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#F9FAFB",
        marginBottom: 12,
    },
    eyeButton: {
        paddingLeft: 10,
    },
    button: {
        backgroundColor: "#111827",
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
