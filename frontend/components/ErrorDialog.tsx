import { useState } from "react";
import { StyleSheet } from "react-native";
import { Portal, Dialog, Button, Text } from "react-native-paper";

interface ErrorDialogProps {
  message: string;
  error?: unknown;
  visible: boolean;
}

export default function ErrorDialog({
  message,
  error,
  visible,
}: ErrorDialogProps) {
  const [isVisible, setIsVisible] = useState(visible);

  const hideDialog = () => setIsVisible(false);

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={hideDialog}
        theme={colors}
        style={styles.container}
      >
        <Dialog.Title style={styles.title}>{message}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{error ? `${error}` : ""}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} theme={colors}>
            Dismiss
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const colors = {
  colors: {
    primary: "#0284c7",
    elevation: { level3: "#FFF" },
  },
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
  },
  title: {
    color: "#b91c1c",
  },
});
