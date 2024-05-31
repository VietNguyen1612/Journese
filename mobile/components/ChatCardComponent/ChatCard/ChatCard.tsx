import { Text, makeStyles, useTheme } from "@rneui/themed";
import { View } from "react-native";
import { ChatCardProps } from "../ChatCardComponent";

type Props = {
    isSeen?: boolean;
};

export const ChatCard = (props: ChatCardProps) => {
    const { isSeen, chatContentAuthor, chatContent, time } = props;
    const { theme } = useTheme();
    const styles = useStyles({ isSeen });
    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Text style={styles.userText}>
                    {props.user}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.chatContentContainer}>
                    <Text style={styles.chatContent} numberOfLines={1} ellipsizeMode='tail'>
                        {chatContentAuthor}
                        {chatContent}
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
};

const useStyles = makeStyles((theme, props: Props) => ({
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
        color: theme.colors.brand.neutral[900],
        fontSize: 16,
        fontWeight: props.isSeen === true ? '600' : '800'
    },
    contentContainer: {
        height: 21,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        maxWidth: 276
    },
    chatContentContainer: {
        alignItems: 'flex-start',
        width: '70%'
    },
    chatContent: {
        color: theme.colors.brand.neutral[900],
        fontSize: 14,
        fontWeight: props.isSeen === true ? '400' : '800',
    },
    timeContentContainer: {
        alignItems: 'flex-end'
    },
    timeContent: {
        fontSize: 14,
        fontWeight: props.isSeen === true ? '400' : '800',
        color: theme.colors.brand.neutral[900]
    }
}))
