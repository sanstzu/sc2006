import { useState } from "react";
import { FAB, PaperProvider, Portal } from "react-native-paper";

function FloatingActionButton({
  visible,
  onMapSearchPress,
  onFilterPress,
}: {
  visible: boolean;
  onMapSearchPress: () => void;
  onFilterPress: () => void;
}) {
  const [state, setState] = useState<{ open: boolean }>({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  return (
    <Portal>
      <FAB.Group
        open={open}
        visible={visible}
        icon={open ? "chevron-down" : "magnify"}
        actions={[
          {
            icon: "map-search",
            label: "Search",
            onPress: onMapSearchPress,
          },
          {
            icon: "filter",
            label: "Filter",
            onPress: onFilterPress,
          },
        ]}
        onStateChange={onStateChange}
      />
    </Portal>
  );
}

export default FloatingActionButton;
