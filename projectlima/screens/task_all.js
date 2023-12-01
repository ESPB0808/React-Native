import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TaskScreen = () => {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);

    const getStorageData = async () => {
        const value = await AsyncStorage.getItem('@task-list');
        if (value !== null) {
            const allData = JSON.parse(value);
            return allData;
        } else {
            return [];
        }
    }
    
    const handleAddTask = async () => {
        if (task === '') {
            Alert.alert('Fill Task Please!');
            return;
        }
    
        // check if any task exist
        const allList = await getStorageData();
        const foundDuplicateTask = allList.some(el => el.title === task);
        if (foundDuplicateTask) {
            Alert.alert('Task Already Exist!');
            return;
        }
    
        try {
            if (editIndex !== -1) {
                // Edit existing task 
                const updatedTasks = [...allList];
                const tempIndex = updatedTasks.findIndex(el => el.title === tasks[editIndex].title);
                updatedTasks[tempIndex].title = task;

                try {
                    AsyncStorage.setItem('@task-list', JSON.stringify(updatedTasks));
                    setTasks(updatedTasks.filter((item) => !item.isCompleted));
                    setEditIndex(-1);
                    setTask("");
                } catch (e) {
                    console.log('Error edit task: in task-all.js');
                    console.error(e.message);
                }
            } else {
                // Add new task 
                const tempList = [...allList, { title: task, isCompleted: false }];
                AsyncStorage.setItem('@task-list', JSON.stringify(tempList));
                setTasks(tempList.filter((item) => !item.isCompleted)); 
            }
            setTask("");
        } catch (e) {
            console.log('Error add task: in task-all.js');
            console.error(e.message);
        }
    };
    

    const getTaskList = async () => {
        try {
            const allData = await getStorageData();
            console.log(allData);
            if (allData.length !== 0) {
                const uncompletedData = allData.filter((item) => !item.isCompleted)
                setTasks(uncompletedData);
            } else {
                console.log('No Tasks');
            }
        } catch (e) {
            console.log('Error get task: in task-all.js');
            console.error(e);
        }
    };
    
    const handleDeleteTask = async (item, index) => {
        Alert.alert(
            'Konfirmasi',
            `Apakah anda yakin untuk menghapus task "${item.title}" ini ?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const allList = await getStorageData();
                        const deletedList = allList.filter(
                            (list, listIndex) => list.title !== item.title
                        );
    
                        try {
                            AsyncStorage.setItem('@task-list', JSON.stringify(deletedList));
                            setTasks(deletedList.filter((item) => !item.isCompleted));
                        } catch (e) {
                            console.log('Error delete task: in task-all.js');
                            console.error(e.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };
    
    const handleStatusChange = async (item, index) => {
        const allList = await getStorageData();
        var tempIndex = allList.findIndex(el => el.title == item.title);
        allList[tempIndex].isCompleted = !allList[tempIndex].isCompleted;
        try {
            AsyncStorage.setItem('@task-list', JSON.stringify(allList));
            getTaskList();
        } catch (e) {
            console.log('Error update status task: in task-all.js');
            console.error(e.message);
        }
    };

    useEffect(() => {
        getTaskList();
    }, [])

    const handleEditTask = (index) => {
        const taskToEdit = tasks[index];
        setTask(taskToEdit.title);
        setEditIndex(index);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.task}>
            <Text
                style={styles.itemList}>{item.title}</Text>
            <View
                style={styles.taskButtons}>
                <TouchableOpacity
                    onPress={() => handleEditTask(index)}>
                    <Text style={styles.editButton}>
                        <Icon
                            name="edit"
                            size={25}
                            
                        />
                        Edit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteTask(item, index)}>
                    <Text style={styles.deleteButton}>
                        <Icon
                            name="trash"
                            size={25}
                        />
                        Delete
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleStatusChange(item, index)}>
                    <Text style={styles.statusButton}>
                        <Icon
                            name="check-square"
                            size={25}
                        />
                        Done
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemBorder}></View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Task</Text>
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
                data={tasks}
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
    },
    itemList: {
        fontSize: 19,
    },
    itemBorder: {
        borderWidth: 0.5,
        borderColor: "#cccccc",
    },
    taskButtons: {
        flexDirection: "row",
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
    taskIcon: {
        alignItems: "center",
        color: "blue"
    }
});

export default TaskScreen;
