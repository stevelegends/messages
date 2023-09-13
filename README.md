![./assets/favicon](./assets/favicon.png)

# Translation

### 1. Translating:

```ts
<Text style={styles.heading}><Trans>Message Inbox</Trans></Text>
```

#### The solution is to use the t macro together with the i18n object which we can obtain from the useLingui hook. We use the two like this to get a translated string:

```ts
const { i18n } = useLingui();
```

```ts
<Button title={t(i18n)`this will be translated and rerendered with locale changes`}/>
```

### 2. Translating Outside:

```ts
import { i18n } from "@lingui/core";
```

```ts
const deleteTitle = msg`Are you sure to delete this?`;
```

```ts
const showDeleteConfirmation = () => {
    Alert.alert(i18n._(deleteTitle));
};
```

### 3. Nesting components

![./assets/nesting_translate](./assets/nesting_translate.png)

```ts
<Trans>
  <Text style={{ fontSize: 20 }}>
    <Text>Concert of </Text>
    <Text style={{ color: "green" }}>Green Day</Text>
    <Text style={{ fontWeight: "bold" }}> tonight!</Text>
  </Text>
</Trans>
```

The extracted string for translation will look like this:

```ts
"<0><1>Concert of </1><2>Green Day</2><3> tonight!</3></0>";
```

### 4. Changing the active locale

The last remaining piece of the puzzle is changing the active locale. The i18n object exposes i18n.loadAndActivate() for that. Call the method and the I18nProvider will re-render the translations. It all becomes clear when you take a look at the final code.

```ts
const loadAndActivateLocale = () => {
    const activeLanguage = i18n.locale;
    const newActiveLanguage = activeLanguage === "en" ? "cs" : "en";
    const catalog =
      newActiveLanguage === "en"
        ? require("./locales/en/messages.js")
        : require("./locales/cs/messages.js");
    i18n.load(newActiveLanguage, catalog.messages);
    i18n.activate(newActiveLanguage);
  };

<Button
    onPress={loadAndActivateLocale}
    title={t`Toggle language to ${i18n.locale === "en" ? "cs" : "en"}`}
/>
```
