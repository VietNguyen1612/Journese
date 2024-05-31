import { makeStyles } from "@rneui/themed";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuOptionCardProps {
    title: string | undefined;
    icon?: React.ReactElement;
    tailIcon?: React.ReactElement;
    onPress?: () => void;
}

export const AccountMenuOptionCard: React.FC<MenuOptionCardProps> = (props) => {
    const styles = useStyles();
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.optionContainer}
            onPress={props.onPress}
        >
            {props.icon}
            <Text style={styles.optionTitle}>{props.title}</Text>
            <View style={styles.optionTailIcon}>{props.tailIcon}</View>
        </TouchableOpacity>
    );
};

const useStyles = makeStyles((_) => ({
    optionContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        shadowOpacity: 0.04,
        shadowColor: "rgba(16, 40, 18)",
        shadowOffset: {
            width: 6,
            height: 6,
        },
    },
    optionTitle: {
        fontSize: 18,
        lineHeight: 28,
        paddingLeft: 12,
    },
    optionTailIcon: {
        position: "absolute",
        right: 16,
    },
}));
