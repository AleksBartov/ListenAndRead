import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.orange,
      }}
    >
      <Text
        style={{
          color: Colors.white,
          fontSize: 25,
          fontFamily: "Nunito_900Black",
        }}
      >
        ЧИТАЮ СЛОГИ
      </Text>
      <Text
        style={{
          color: Colors.white,
          fontSize: 20,
          fontFamily: "Nunito_500Medium",
        }}
      >
        Второй этап отработки навыков чтения. Теперь, зная все буквы, мы
        соединяем их в слоги!
      </Text>
    </View>
  );
}
