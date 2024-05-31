import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ChatCardComponent } from '../../../components/ChatCardComponent'

const Call = () => {
    return (
        <View>
            <ChatCardComponent
                onPress={() => { }}
                size={56}
                type="call"
                user="Sáng Trần"
                time="20:20"
                callType="missedCall"
                avatarURI="https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
            />
        </View>
    )
}

export default Call

const styles = StyleSheet.create({})