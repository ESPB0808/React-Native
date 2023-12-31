import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    Linking,
    Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast, Toast, VStack, ToastDescription, ToastTitle, GluestackUIProvider } from '@gluestack-ui/themed';

const About = () => {
    
    // const showToast = () => {
    //     toast.show({
    //         placement: "top",
    //         render: ({ id }) => {
    //             return (
    //                 <Toast
    //                     // nativeID={"toast-" + id}
    //                     action="info"
    //                     variant="accent"
    //                 >
    //                     <VStack space="xs">
    //                         <ToastTitle>Info</ToastTitle>
    //                         <ToastDescription>
    //                             Data berhasil dihapus !
    //                         </ToastDescription>
    //                     </VStack>
    //                 </Toast>
    //             )
    //         },
    //     })
    // }

    const handleClearData = async () => {
        Alert.alert(
            'Konfirmasi',
            'Anda yakin ingin menghapus semua data ?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            console.log('Data Cleared');
                            // showToast();
                        } catch (e) {
                            console.log('Error clear data: in about.js');
                            console.error(e);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>About</Text>
            <Text style={styles.title}>About This Application</Text>
            <Text style={styles.content}>Aplikasi ini dirancang sebagai studi kasus untuk pembelajaran mata kuliah Pemrograman Mobile Program Studi Informatika Institut Teknologi Telkom Surabaya</Text>
            <Text style={{ marginBottom: 5 }} onPress={() =>
                Linking.openURL("https://www.freepik.com/icon/task-list_9329651#fromView=search&term=todo+list&page=1&position=1&track=ais").catch((err) => console.error("Error", err))
            }>Icon by Azland Studio (Freepik)</Text>
            <Text style={{ marginBottom: 15 }} onPress={() =>
                Linking.openURL("https://daudmuhajir.my.id").catch((err) => console.error("Error", err))
            }>Developed by Daud Muhajir</Text>
            <Text style={{ marginBottom: 15 }}>Elang Satria Putra Buana (1203210001)</Text>
            <Button style={{ marginTop: 15 }} 
                    title="Clear Data" 
                    onPress={() => handleClearData()}>
            </Button>
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
        color: "blue",
    },
    content: {
        fontSize: 18,
        marginBottom: 20,
    }
});

export default About;
