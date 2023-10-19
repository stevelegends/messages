import React, { FC } from "react";

// modules
import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { t } from "@lingui/macro";

// hooks
import { useTheme } from "@react-navigation/native";
import { useLingui } from "@lingui/react";

// theme
import { AppSize, AppStyle } from "@theme/theme";

type Props = {
    onChangeText: (text: string) => void;
};

const SearchInputView: FC<Props> = ({ onChangeText }) => {
    const theme = useTheme();
    const { i18n } = useLingui();
    return (
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.border }]}>
            <Feather name="search" size={20} color={theme.colors.text} />
            <TextInput
                placeholder={t(i18n)`Search`}
                placeholderTextColor={theme.colors.text}
                style={[styles.searchBox, { color: theme.colors.text }]}
                onChangeText={onChangeText}
                maxLength={50}
                numberOfLines={1}
            />
        </View>
    );
};

SearchInputView.defaultProps = {
    onChangeText: () => undefined
};

const styles = StyleSheet.create({
    searchContainer: {
        height: AppSize.box40,
        paddingHorizontal: 8,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    searchBox: {
        marginLeft: 8,
        fontSize: 15,
        flex: 1
    }
});

export default SearchInputView;
