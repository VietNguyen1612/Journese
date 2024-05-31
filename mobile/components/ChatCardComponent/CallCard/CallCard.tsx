import { Text, View } from 'react-native'
import React from 'react'
import { CallCardProps } from '../ChatCardComponent'
import { makeStyles, useTheme } from '@rneui/themed'
import { PhoneArrowDownLeftIcon, PhoneArrowUpRightIcon } from 'react-native-heroicons/outline'

export const CallCard = (props: CallCardProps) => {
    const { theme } = useTheme();
    const { callType, time } = props;
    let callText: string, callIconColor: string;
    switch (callType) {
        case 'callAway':
            callText = 'Cuộc gọi đi';
            callIconColor = theme.colors.black;
            break;
        case 'phoneCall':
            callText = 'Cuộc gọi đến';
            callIconColor = theme.colors.black;
            break;
        case 'missedCall':
            callText = 'Cuộc gọi nhỡ';
            callIconColor = theme.colors.brand.red[700];
            break;
        default:
            callText = '';
            callIconColor = theme.colors.black;
    }
    const styles = useStyles({ callIconColor });
    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Text style={styles.userText}>
                    {props.user}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.chatContentContainer}>
                    {callIconColor === theme.colors.brand.red[700] ? (
                        <PhoneArrowDownLeftIcon
                            fill={callIconColor}
                            color={callIconColor}
                            size={12}
                        />
                    ) : (
                        <PhoneArrowUpRightIcon
                            fill={callIconColor}
                            color={callIconColor}
                            size={12}
                        />
                    )}
                    <Text style={styles.chatContent}>
                        {callText}
                    </Text>
                </View>
                <View style={styles.timeContentContainer}>
                    <Text style={styles.timeContent}>
                        {time}
                    </Text>
                </View>
            </View>
        </View>
    );
}

type ColorProps = {
    callIconColor: string
}

const useStyles = makeStyles((theme, props: ColorProps) => ({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        height: 47,
        width: 276,
    },
    userContainer: {
        height: 22,
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    userText: {
        color: theme.colors.black,
        fontSize: 16,
        fontWeight: '600'
    },
    contentContainer: {
        height: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        alignSelf: 'stretch',
    },
    chatContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: 220
    },
    chatContent: {
        fontSize: 14,
        fontWeight: '400',
        color: props.callIconColor
    },
    timeContentContainer: {
        alignItems: 'flex-start'
    },
    timeContent: {
        fontSize: 14,
        fontWeight: '400',
        color: props.callIconColor
    }
}))
