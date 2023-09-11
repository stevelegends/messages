#!/bin/bash

#if [ $# -eq 0 ]; then
#  echo "Usage: ./generate-react-component.sh ComponentName"
#  exit 1
#fi
#
## Get the component name from the command line argument
#component_name="$1"

echo "Enter Component - example login-screen, etc.: "
read input_name
echo "generating ${input_name} component"

mkdir ${input_name}
cd ${input_name}

component_name=$(echo "$input_name" | awk -F'-' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1' | tr -d '-')
component_name=$(echo "$component_name" | sed 's/ //g')

# Create the component file
echo "// react" > "${input_name}.tsx"
echo 'import React, { FC } from "react";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo '// modules' >> "${input_name}.tsx"
echo 'import { View } from "react-native";' >> "${input_name}.tsx"
echo 'import { StackNavigationProp } from "@react-navigation/stack";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo '// navigation' >> "${input_name}.tsx"
echo 'import { StackNavigatorParams } from "@navigation/main-navigation";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo '// styles' >> "${input_name}.tsx"
echo 'import styles from "./'${input_name}'.styles";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo '// theme' >> "${input_name}.tsx"
echo 'import { globalStyles } from "@theme/theme";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo '// components' >> "${input_name}.tsx"
echo 'import { Text } from "@components";' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo 'type '${component_name}'Props = {' >> "${input_name}.tsx"
echo '    navigation: StackNavigationProp<StackNavigatorParams, "'${component_name}'">;' >> "${input_name}.tsx"
echo '};' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo 'const '${component_name}': FC<'${component_name}'Props> = () => {' >> "${input_name}.tsx"
echo '    return (' >> "${input_name}.tsx"
echo '        <View style={[styles.container, globalStyles["flex-center"]]}>' >> "${input_name}.tsx"
echo '            <Text>'${component_name}'</Text>' >> "${input_name}.tsx"
echo '        </View>' >> "${input_name}.tsx"
echo '    );' >> "${input_name}.tsx"
echo '};' >> "${input_name}.tsx"
echo '' >> "${input_name}.tsx"
echo 'export default '${component_name}';' >> "${input_name}.tsx"

# Create the styles file
echo 'import { StyleSheet } from "react-native";' > "${input_name}.styles.ts"
echo '' >> "${input_name}.styles.ts"
echo 'const styles = StyleSheet.create({' >> "${input_name}.styles.ts"
echo '    container: {' >> "${input_name}.styles.ts"
echo '        // Add your styles here' >> "${input_name}.styles.ts"
echo '    },' >> "${input_name}.styles.ts"
echo '});' >> "${input_name}.styles.ts"
echo '' >> "${input_name}.styles.ts"
echo 'export default styles;' >> "${input_name}.styles.ts"

echo "Component '${component_name}' generated successfully."
