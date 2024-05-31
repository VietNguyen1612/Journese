import { Text, View } from 'react-native'
import React from 'react'
import { NewGroupChatCardProps } from '../ChatCardComponent'
import { ChatBubbleLeftRightIcon, PhoneIcon } from 'react-native-heroicons/outline';
import { makeStyles, useTheme } from '@rneui/themed';

export const PhoneBookCard = (props: NewGroupChatCardProps) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const iconColor: string = theme.colors.brand.primary[500];
    const iconSize: number = 24;
    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.contentWrapper}>
                    <Text style={styles.contentText}>
                        {props.user}
                    </Text>
                </View>
            </View>
            <View style={styles.iconContainer}>
                <PhoneIcon
                    fill={iconColor}
                    size={iconSize}
                    color={iconColor} />
                <ChatBubbleLeftRightIcon
                    fill={iconColor}
                    size={iconSize}
                    color={iconColor}
                />
            </View>
        </View>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        width: 276,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    contentContainer: {
        width: 204,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12
    },
    contentWrapper: {
        alignItems: 'flex-start',
        alignSelf: 'stretch'
    },
    contentText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.black
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16
    }
}))
