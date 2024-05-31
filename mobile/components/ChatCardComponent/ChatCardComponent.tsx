import { Avatar, makeStyles } from "@rneui/themed";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ChatCard } from "./ChatCard";
import { CallCard } from "./CallCard";
import { PhoneBookCard } from "./PhoneBookCard";

export interface BaseCardProps {
    avatarURI: string;
    size: number;
    user?: string;
    time?: string;
    type: "chat" | "call" | "phoneBook";
    onPress: () => void;
}

export interface ChatCardProps extends BaseCardProps {
    isSeen: boolean;
    chatContentAuthor?: "Bạn: ";
    chatContent: string;
}

export interface CallCardProps extends BaseCardProps {
    callType: "callAway" | "phoneCall" | "missedCall";
}

export interface PhoneBookCardProps extends BaseCardProps { }

type CardProps =
    | ChatCardProps
    | CallCardProps
    | PhoneBookCardProps;

export const ChatCardComponent = (props: CardProps) => {
    const { type, size, avatarURI, onPress } = props;
    const styles = useStyles();
    return (
        //1 card chat sẽ có 1 avatar và 1 content
        <TouchableOpacity onPress={onPress} style={styles.wrapper}>
            <View style={styles.container}>
                <Avatar size={size} source={{ uri: avatarURI }} rounded />
                {/* theo từng type sẽ có content khác nhau */}
                {renderCard[type](props)}
            </View>
        </TouchableOpacity>
    );
};


const renderCard: {
    [key in BaseCardProps["type"]]: (props: any) => React.ReactNode;
} = {
    chat: ChatCard,
    call: CallCard,
    phoneBook: PhoneBookCard,
};

const useStyles = makeStyles(() => ({
    wrapper: {
        width: "100%",
        flexDirection: "column",
    },
    container: {
        flexDirection: "row",
        paddingVertical: 4,
        alignItems: "center",
        gap: 8,
    },
}));