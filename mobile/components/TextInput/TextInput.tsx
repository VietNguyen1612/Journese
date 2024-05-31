import { Input, InputProps, makeStyles } from "@rneui/themed";
import { FC, useState } from "react";

export const TextInput: FC<InputProps> = (props) => {
  const [focus, setFocus] = useState(false);
  const styles = useStyles({ focus });

  return (
    <Input
      {...props}
      style={styles.input}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      inputContainerStyle={styles.inputContainer}
      labelStyle={styles.label}
    />
  );
};

const useStyles = makeStyles((theme, { focus }: { focus: boolean }) => ({
  inputContainer: {
    borderBottomWidth: 0,
  },
  label: {
    color: theme.colors.brand.neutral["700"],
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    borderColor: focus
      ? theme.colors.brand.neutral["700"]
      : theme.colors.brand.neutral["300"],
    borderWidth: 1.4,
    borderRadius: 21,
    fontWeight: "500",
    color: theme.colors.brand.neutral["700"],
  },
}));
