import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
    getAllUsers,
    insertEntry,
    getEntryById,
    updateEntry,
    deleteEntry,
} from "../lib/database";
import {
    Popover,
    PopoverBackdrop,
    PopoverContent,
    PopoverArrow,
} from "@gluestack-ui/themed";
import { EntryFormData } from "../data/EntryFormData";

export default function EntryRecordScreen() {
    const router = useRouter();
    const {id} = useLocalSearchParams<{ id?: string }>(); // read ?id=xxx

    // UI state
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    // form state
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [timeOfObservation, setTimeOfObservation] = useState("");
    const [additionalComments, setAdditionalComments] = useState("");
    const [dateOfHike, setDateOfHike] = useState(new Date());

    const [formData, setFormData] = useState<EntryFormData>({
        name: "",
        location: "",
        length: "",
        hours: "",
        minutes: "",
        hikers: "",
        animalSightings: "",
        vegetation: "",
        weather: "",
        trail: "",
        parkingAvailable: true,
    });


    const editable = !!(isEditing || !id);

    // Load logged-in user (for header welcome)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const users = await getAllUsers();
                if (users && users.length > 0) setUser(users[0]);
            } catch (err) {
                console.warn("Error loading users", err);
            }
        };
        loadUser();
    }, []);

    // Load record if id provided
    useEffect(() => {
        const loadRecord = async () => {
            try {
                if (id) {
                    const entry: any = await getEntryById(Number(id));
                    if (entry) {
                        setFormData({
                            name: entry.name || "",
                            location: entry.location || "",
                            length: entry.length?.toString() || "",
                            hours: entry.hours?.toString() || "",
                            minutes: entry.minutes?.toString() || "",
                            hikers: entry.hikers?.toString() || "",
                            animalSightings: entry.animalSightings || "",
                            vegetation: entry.vegetation || "",
                            weather: entry.weather || "",
                            trail: entry.trail || "",
                            parkingAvailable:
                                entry.parkingAvailable === 1 || entry.parkingAvailable === true,
                        });
                        setDifficulty(entry.difficulty || "Easy");
                        setDescription(entry.description || "");
                        setAdditionalComments(entry.additionalComments || "");
                        setDateOfHike(entry.dateOfHike ? new Date(entry.dateOfHike) : new Date());
                        setTimeOfObservation(entry.timeOfObservation || new Date().toLocaleString());
                        setIsEditing(false); // start in view mode
                    } else {
                        setIsEditing(true);
                    }
                } else {
                    // New entry: set current observation time
                    const now = new Date();
                    setTimeOfObservation(now.toLocaleString());
                    setIsEditing(false);
                }
            } catch (err) {
                console.error("Error loading entry", err);
            }
        };
        loadRecord();
    }, [id]);

    const handleClearAll = () => {
        // Only allow clear when creating a new record
        if (id) {
            Alert.alert("Not Allowed", "You can only clear fields while creating a new record.");
            return;
        }

        // Instantly reset everything
        setFormData({
            name: "",
            location: "",
            length: "",
            hours: "",
            minutes: "",
            hikers: "",
            animalSightings: "",
            vegetation: "",
            weather: "",
            trail: "",
            parkingAvailable: true,
        });
        setDifficulty("Easy");
        setDescription("");
        setAdditionalComments("");
        setDateOfHike(new Date());
        setTimeOfObservation(new Date().toLocaleString());
        setIsPopoverVisible(false);

    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateOfHike;
        setShowDatePicker(Platform.OS === "ios");
        setDateOfHike(currentDate);
    };

    const validateRequired = () => {
        if (!formData.name.trim() || !formData.location.trim()) {
            Alert.alert("Validation", "Please fill in at least the name and location of the hike.");
            return false;
        }
        const {animalSightings, vegetation, weather, trail} = formData;
        const hasAnyObservation =
            (animalSightings || "").trim() ||
            (vegetation || "").trim() ||
            (weather || "").trim() ||
            (trail || "").trim();

        if (!hasAnyObservation) {
            Alert.alert(
                "Validation",
                "Please fill at least one observation (animal, vegetation, weather, or trail)."
            );
            return false;
        }
        return true;
    };

    const handleSaveRecord = async () => {
        if (!validateRequired()) return;

        Alert.alert(
            "Confirm Create",
            "Are you sure you want to create this record?",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Create",
                    onPress: async () => {
                        const entryData = {
                            ...formData,
                            dateOfHike: dateOfHike.toISOString(),
                            parkingAvailable: formData.parkingAvailable,
                            difficulty,
                            description,
                            timeOfObservation,
                            additionalComments,
                        };

                        try {
                            await insertEntry(entryData);
                            Alert.alert("Success", "✅ Record saved successfully!", [
                                {text: "OK", onPress: () => router.replace("/home")},
                            ]);
                        } catch (err) {
                            console.error("Save error", err);
                            Alert.alert("Error", "Failed to save record.");
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    };

    const handleUpdateRecord = async () => {
        if (!validateRequired()) return;

        Alert.alert(
            "Confirm Update",
            "Are you sure you want to update this record?",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Update",
                    onPress: async () => {
                        const updatedData = {
                            ...formData,
                            dateOfHike: dateOfHike.toISOString(),
                            parkingAvailable: formData.parkingAvailable,
                            difficulty,
                            description,
                            timeOfObservation,
                            additionalComments,
                        };

                        try {
                            await updateEntry(Number(id), updatedData);
                            Alert.alert("Success", "✅ Record updated successfully!", [
                                {text: "OK", onPress: () => router.replace("/home")},
                            ]);
                        } catch (err) {
                            console.error("Update error", err);
                            Alert.alert("Error", "Failed to update record.");
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    };


    const confirmDelete = () => {
        Alert.alert(
            "Delete",
            "Are you sure you want to delete this record?",
            [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteEntry(Number(id));
                            Alert.alert("Deleted", "🗑️ Record deleted successfully!", [
                                {text: "OK", onPress: () => router.replace("/home")},
                            ]);
                        } catch (err) {
                            console.error("Delete error", err);
                            Alert.alert("Error", "Failed to delete record.");
                        }
                    },
                },
            ],
            {cancelable: true}
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" backgroundColor="#E0F0FF"/>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Popover
                    isOpen={isPopoverVisible}
                    onClose={() => setIsPopoverVisible(false)}
                    trigger={(triggerProps) => (
                        <TouchableOpacity
                            {...triggerProps}
                            style={styles.headerBox}
                            onPress={() => setIsPopoverVisible(true)}
                        >
                            <View style={styles.headerRow}>
                                <View>
                                    {/*<Text style={styles.welcomeText}>*/}
                                    {/*    Welcome, {user ? user.username : "Loading..."}!*/}
                                    {/*</Text>*/}
                                    <Text style={styles.headerTitle}>
                                        {id ? "Hike Record Detail" : "Add New Hike Record"}
                                    </Text>
                                </View>
                                <Text style={styles.dropdownIcon}>▼</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                >
                    <PopoverBackdrop/>
                    <PopoverContent
                        style={{alignItems: "center", paddingVertical: 10, width: 90}}
                    >
                        <PopoverArrow/>
                        <TouchableOpacity
                            onPress={!id ? handleClearAll : undefined}
                            disabled={!!id}
                            style={{
                                paddingVertical: 6,
                                paddingHorizontal: 10,
                                opacity: id ? 0.4 : 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: id ? "#9CA3AF" : "#ef1717",
                                    fontWeight: "600",
                                    fontSize: 15,
                                }}
                            >
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    </PopoverContent>
                </Popover>

                {/* Form */}
                <View style={styles.formBox}>
                    {/* Name */}
                    <Text style={styles.label}>Name of Hike:</Text>
                    <TextInput
                        style={styles.input}
                        editable={editable}
                        placeholder="Name of the hike"
                        placeholderTextColor="#9CA3AF"
                        value={formData.name}
                        onChangeText={(text) => setFormData({...formData, name: text})}
                    />

                    {/* Location */}
                    <Text style={styles.label}>Location:</Text>
                    <TextInput
                        style={styles.input}
                        editable={editable}
                        placeholder="Location of the hike"
                        placeholderTextColor="#9CA3AF"
                        value={formData.location}
                        onChangeText={(text) => setFormData({...formData, location: text})}
                    />

                    {/* Length */}
                    <Text style={styles.label}>Length of the Hike (metres):</Text>
                    <TextInput
                        style={styles.input}
                        editable={editable}
                        placeholder="Length of the hike"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                        value={formData.length}
                        onChangeText={(text) => setFormData({...formData, length: text})}
                    />

                    {/* Date */}
                    <Text style={styles.label}>Date of the Hike:</Text>
                    <TouchableOpacity
                        style={styles.input}
                        disabled={!editable}
                        onPress={() => editable && setShowDatePicker(true)}
                    >
                        <Text>
                            {dateOfHike ? dateOfHike.toLocaleDateString() : "Select date"}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={dateOfHike}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    {/* Parking Availability */}
                    <Text style={styles.label}>Parking Availability:</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() =>
                                editable &&
                                setFormData({...formData, parkingAvailable: true})
                            }
                        >
                            <View style={styles.radioOuter}>
                                {formData.parkingAvailable && <View style={styles.radioInner}/>}
                            </View>
                            <Text
                                style={[
                                    styles.radioText,
                                    formData.parkingAvailable && {
                                        fontWeight: "600",
                                        color: "#2563EB",
                                    },
                                ]}
                            >
                                Yes
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() =>
                                editable &&
                                setFormData({...formData, parkingAvailable: false})
                            }
                        >
                            <View style={styles.radioOuter}>
                                {!formData.parkingAvailable && <View style={styles.radioInner}/>}
                            </View>
                            <Text
                                style={[
                                    styles.radioText,
                                    !formData.parkingAvailable && {
                                        fontWeight: "600",
                                        color: "#2563EB",
                                    },
                                ]}
                            >
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Duration */}
                    <Text style={styles.label}>Total Duration (hours and minutes):</Text>
                    <View style={styles.durationContainer}>
                        <TextInput
                            style={[styles.input, styles.durationInput]}
                            placeholder="Hours"
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                            editable={editable}
                            value={formData.hours}
                            onChangeText={(text) => setFormData({...formData, hours: text})}
                        />
                        <TextInput
                            style={[styles.input, styles.durationInput]}
                            placeholder="Minutes"
                            keyboardType="numeric"
                            placeholderTextColor="#9CA3AF"
                            editable={editable}
                            value={formData.minutes}
                            onChangeText={(text) => setFormData({...formData, minutes: text})}
                        />
                    </View>

                    {/* Number of Hikers */}
                    <Text style={styles.label}>Number of Hikers:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of hikers"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                        editable={editable}
                        value={formData.hikers}
                        onChangeText={(text) => setFormData({...formData, hikers: text})}
                    />

                    {/* Difficulty */}
                    <Text style={styles.label}>Level of Difficulty:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={difficulty}
                            onValueChange={(itemValue) => setDifficulty(itemValue)}
                            enabled={editable}
                            style={styles.picker}
                        >
                            <Picker.Item label="Easy" value="Easy"/>
                            <Picker.Item label="Moderate" value="Moderate"/>
                            <Picker.Item label="Hard" value="Hard"/>
                        </Picker>
                    </View>

                    {/* Description */}
                    <Text style={styles.label}>Description (optional):</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter description related to the hike"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={4}
                        editable={editable}
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Observations */}
                    <View style={styles.addObservationBox}>
                        <Text style={[styles.label, {marginTop: 20}]}>Add Observations:</Text>

                        <View style={styles.observationBox}>
                            <Text style={styles.observationLabel}>Animal Sightings:</Text>
                            <TextInput
                                style={styles.observationInput}
                                placeholder="Animal sights during hike"
                                placeholderTextColor="#9CA3AF"
                                editable={editable}
                                value={formData.animalSightings}
                                onChangeText={(text) =>
                                    setFormData({...formData, animalSightings: text})
                                }
                            />

                            <Text style={styles.observationLabel}>Types of Vegetation:</Text>
                            <TextInput
                                style={styles.observationInput}
                                placeholder="Vegetation types encountered during hike"
                                placeholderTextColor="#9CA3AF"
                                editable={editable}
                                value={formData.vegetation}
                                onChangeText={(text) =>
                                    setFormData({...formData, vegetation: text})
                                }
                            />

                            <Text style={styles.observationLabel}>Weather Condition:</Text>
                            <TextInput
                                style={styles.observationInput}
                                placeholder="Weather condition during hike"
                                placeholderTextColor="#9CA3AF"
                                editable={editable}
                                value={formData.weather}
                                onChangeText={(text) =>
                                    setFormData({...formData, weather: text})
                                }
                            />

                            <Text style={styles.observationLabel}>Trail Condition:</Text>
                            <TextInput
                                style={styles.observationInput}
                                placeholder="Trail condition during hike"
                                placeholderTextColor="#9CA3AF"
                                editable={editable}
                                value={formData.trail}
                                onChangeText={(text) =>
                                    setFormData({...formData, trail: text})
                                }
                            />
                        </View>

                        {/* Time of Observation */}
                        <Text style={[styles.label, {marginTop: 20}]}>Time of Observation:</Text>
                        <TextInput
                            style={styles.input}
                            value={timeOfObservation}
                            editable={false} // keep non-editable like original
                            placeholderTextColor="#9CA3AF"
                        />

                        {/* Additional Comments */}
                        <Text style={styles.label}>Additional Comments (optional):</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter any additional comments..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                            editable={editable}
                            value={additionalComments}
                            onChangeText={setAdditionalComments}
                        />
                    </View>

                    {/* Buttons */}
                    {!id && (
                        <TouchableOpacity style={styles.submitButton} onPress={handleSaveRecord}>
                            <Text style={styles.submitText}>Save Record</Text>
                        </TouchableOpacity>
                    )}

                    {id && !isEditing && (
                        <>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => setIsEditing(true)}
                            >
                                <Text style={styles.submitText}>Edit Record</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.showRecordButton}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.submitText}>Delete Record</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {id && isEditing && (
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleUpdateRecord}
                        >
                            <Text style={styles.submitText}>Update Record</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.showRecordButton, {marginTop: 10}]}
                        onPress={() => router.push("/home")}
                    >
                        <Text style={styles.submitText}>Show All Records</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles unchanged (kept from your design)
const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#E0F0FF", paddingHorizontal: 15},
    scrollContent: {paddingBottom: 30, alignItems: "center"},
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
    headerTitle: {fontSize: 15, color: "#374151"},
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownIcon: {fontSize: 18, color: "#374151"},
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
    textArea: {height: 100, textAlignVertical: "top"},
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
    addObservationBox: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    observationBox: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        backgroundColor: "#F9FAFB",
    },
    observationLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#111827",
        marginTop: 10,
        marginBottom: 4,
    },
    observationInput: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 10,
        color: "#111827",
        backgroundColor: "#fff",
    },
    submitButton: {
        backgroundColor: "#616161",
        borderRadius: 100,
        marginTop: 20,
        alignItems: "center",
        paddingVertical: 12,
    },
    showRecordButton: {
        backgroundColor: "#616161",
        borderRadius: 100,
        marginTop: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    submitText: {color: "#fff", fontWeight: "600", fontSize: 15},
});
