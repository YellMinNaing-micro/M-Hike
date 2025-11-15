import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { insertUser } from "../lib/database";

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
        Alert.alert("⚠️ Missing Fields", "Please fill out all fields.");
        return;
    }

    // EMAIL VALIDATION (@gmail.com only)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        Alert.alert("❌ Invalid Email", "Email must be a valid @gmail.com address.");
        return;
    }

    // PASSWORD VALIDATION
    const passwordRegex = /^[A-Z][A-Za-z0-9!@#$%^&*()_\-+=<>?/{}~]{7,}$/; 
    const numberRegex = /\d/;

    if (!passwordRegex.test(password) || !numberRegex.test(password)) {
        Alert.alert(
            "❌ Invalid Password",
            "Password must:\n• Start with a capital letter\n• Be at least 8 characters\n• Contain at least one number\n• Special characters allowed (optional)"
        );
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert("❌ Password Mismatch", "Passwords do not match.");
        return;
    }

    try {
        await insertUser(username, email, password);
        Alert.alert("✅ Success", "Account created successfully!", [
            { text: "OK", onPress: () => router.replace("/entry-record") },
        ]);

        // reset form
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    } catch (error) {
        console.error("Signup Error:", error);
        Alert.alert("❌ Error", "Something went wrong while saving your data.");
    }
};


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style="dark" backgroundColor="#E0F0FF"/>

                <View style={styles.card}>
                    <Text style={styles.title}>Sign Up</Text>

                    <View style={styles.subtitleRow}>
                        <Text style={styles.subtitle}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/login")}>
                            <Text style={styles.signup}>Log in</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="User Name"
                            placeholderTextColor="#6B7280"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#6B7280"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off" : "eye"}
                                size={20}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </TouchableOpacity>

                    <Text style={styles.loginWith}>Sign up with:</Text>

                    <View style={styles.socialRow}>
                        <TouchableOpacity>
                            <Ionicons name="logo-google" size={28} color="#EA4335"/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="logo-facebook" size={28} color="#1877F2"/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        By signing up you agree to AllMindy Terms of Use and Privacy Policy
                    </Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F0FF",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        paddingVertical: 30,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        alignItems: "center",
    },
    title: {fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 5},
    subtitleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    subtitle: {fontSize: 14, color: "#6B7280"},
    signup: {color: "#4F46E5", fontWeight: "600"},
    inputBox: {
        width: "100%",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        position: "relative",
    },
    input: {height: 45, color: "#111827"},
    eyeIcon: {position: "absolute", right: 10, top: 12},
    signupBtn: {
        backgroundColor: "#616161",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 15,
    },
    signupText: {color: "#fff", fontWeight: "600", fontSize: 16},
    loginWith: {color: "#6B7280", marginBottom: 10},
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 20,
    },
    footerText: {
        textAlign: "center",
        fontSize: 11,
        color: "#9CA3AF",
        width: "90%",
    },
});
