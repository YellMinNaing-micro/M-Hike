import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

export default function EntryRecordScreen() {
    const userName = "andy19";
    const [parkingAvailable, setParkingAvailable] = useState(true);
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#E0F0FF" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerBox}>
                    <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
                    <Text style={styles.headerTitle}>Add New Hike Record</Text>
                </View>

                {/* Form */}
                <View style={styles.formBox}>
                    {/* Name of Hike */}
                    <Text style={styles.label}>Name of Hike:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name of the hike"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Location */}
                    <Text style={styles.label}>Location:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Location of the hike"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Length */}
                    <Text style={styles.label}>Length of the Hike (metres):</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Length of the hike"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Date */}
                    <Text style={styles.label}>Date of the Hike:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Select date of the hike"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Parking Availability */}
                    <Text style={styles.label}>Parking Availability:</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setParkingAvailable(true)}
                        >
                            <View style={styles.radioOuter}>
                                {parkingAvailable && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                style={[
                                    styles.radioText,
                                    parkingAvailable && { fontWeight: "600", color: "#2563EB" },
                                ]}
                            >
                                Yes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setParkingAvailable(false)}
                        >
                            <View style={styles.radioOuter}>
                                {!parkingAvailable && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                style={[
                                    styles.radioText,
                                    !parkingAvailable && { fontWeight: "600", color: "#2563EB" },
                                ]}
                            >
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Level of Difficulty */}
                    <Text style={styles.label}>Level of Difficulty:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={difficulty}
                            onValueChange={(itemValue) => setDifficulty(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Easy" value="Easy" />
                            <Picker.Item label="Moderate" value="Moderate" />
                            <Picker.Item label="Hard" value="Hard" />
                        </Picker>
                    </View>

                    {/* Description */}
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter description about the hike..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Total Duration */}
                    <Text style={styles.label}>Total Duration (hours and minutes):</Text>
                    <View style={styles.durationContainer}>
                        <TextInput
                            style={[styles.input, styles.durationInput]}
                            placeholder="Hours"
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            style={[styles.input, styles.durationInput]}
                            placeholder="Minutes"
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    {/* Number of Hikers */}
                    <Text style={styles.label}>Number of Hikers:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of hikers"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitText}>Save Record</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F0FF",
        paddingHorizontal: 15,
    },
    scrollContent: {
        paddingBottom: 30,
        alignItems: "center",
    },
    headerBox: {
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 18,
        marginTop: 15,
        width: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 15,
        color: "#374151",
    },
    formBox: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 18,
        marginTop: 20,
        width: "100%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#111827",
        backgroundColor: "#fff",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginTop: 4,
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    radioOuter: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#2563EB",
    },
    radioText: {
        fontSize: 14,
        color: "#374151",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        overflow: "hidden",
    },
    picker: {
        color: "#111827",
        backgroundColor: "#fff",
    },
    durationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    durationInput: {
        flex: 1,
    },
    submitButton: {
        backgroundColor: "#2563EB",
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 12,
    },
    submitText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});
