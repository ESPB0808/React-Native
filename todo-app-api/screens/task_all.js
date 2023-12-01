import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { Divider, useToast, Toast, ToastTitle, ToastDescription, VStack } from "@gluestack-ui/themed";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { deleteTask, fetchTasks, storeTask, updateTask } from "../redux/taskSlice";

const TaskScreen = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const dispatch = useDispatch();
    const { nim, nama } = useSelector((state) => state.profile);
    const { data, loading } = useSelector((state) => state.task);
    const [task, setTask] = useState("");
    const [editIndex, setEditIndex] = useState(-1);

    useEffect(() => {
        if (nim === '') {
            navigation.navigate("Profile");
        }
        dispatch(fetchTasks({ nim, isComplete: "0" }));
    }, [nim]);

    const showToast = () => {
        toast.show({
            placement: "top",
            render: ({ id }) => {
                return (
                    <Toast
                        nativeID={"toast-" + id}
                        action="error"
                        variant="accent"
                    >
                        <VStack space="xs">
                            <ToastTitle>Error</ToastTitle>
                            <ToastDescription>
                                Anda belum mengisi Task!
                            </ToastDescription>
                        </VStack>
                    </Toast>
                )
            },
        })
    }

    const handleAddTask = async () => {
        // alert if task empty
        if (task === '') {
            showToast();
            return;
        }

        try {
            if (editIndex !== -1) {
                // Edit existing task 
                dispatch(updateTask({ id: editIndex, title: task, nim, isComplete: false, completed: false }));
            } else {
                // Add new task 
                dispatch(storeTask({ nim, title: task, isComplete: false, completed: false }));
            }
            setTask("");
        } catch (e) {
            console.log('Error add task: in task-all.js');
            console.error(e.message);
        }
    };

    const handleDeleteTask = async (item, index) => {
        dispatch(deleteTask({ nim, id: item.id, completed: false }));
    };

    const handleStatusChange = async (item, index) => {
        dispatch(updateTask({ id: item.id, title: item.title, nim, isComplete: true, completed: false }));
    };

    const handleEditTask = (item, index) => {
        setTask(item.title);
        setEditIndex(item.id);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.task}>
            <Divider my={5} h={4} />
            <Text
                style={styles.itemList}>{item.title}</Text>
            <View
                style={styles.taskButtons}>

                <TouchableOpacity
                    onPress={() => handleEditTask(item, index)}>
                    <Text
                        style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteTask(item, index)}>
                    <Text
                        style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleStatusChange(item, index)}>
                    <Text
                        style={styles.statusButton}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Task</Text>
            <Text style={styles.title}>Selamat Datang {nama}!</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task"
                value={task}
                onChangeText={(text) => setTask(text)}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTask}>
                <Text style={styles.addButtonText}>
                    {editIndex !== -1 ? "Update Task" : "Add Task"}
                </Text>
            </TouchableOpacity>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 7,
        color: "#ED1B24",
    },
    input: {
        borderWidth: 3,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
    task: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        fontSize: 18,
        flexWrap: "wrap"
    },
    itemList: {
        fontSize: 19,
        alignItems: "flex-start"
    },
    itemBorder: {
        borderWidth: 0.5,
        borderColor: "#cccccc",
    },
    taskButtons: {
        flexDirection: "row",
        marginTop: 10
    },
    editButton: {
        marginRight: 10,
        color: "green",
        fontWeight: "bold",
        fontSize: 18,
    },
    deleteButton: {
        color: "red",
        fontWeight: "bold",
        fontSize: 18,
    },
    statusButton: {
        marginLeft: 10,
        color: "blue",
        fontWeight: "bold",
        fontSize: 18,
    },
    loader: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
});

export default TaskScreen;