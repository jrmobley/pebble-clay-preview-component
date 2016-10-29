# pebble-clay-preview-component

This is a custom component for the [Pebble Clay](https://github.com/pebble/clay) configuration package.

### Getting Started

So that your SVG and CSS can be kept in their own files, you should install the very tiny `raw-loader` for webpack as a `devDependency` of your project.

```
npm install raw-loader --save-dev
```

Then in your `app.js` you can load and register the Preview component as follows.

```javascript
var Preview = require('pebble-clay-preview-component');
var previewTemplate = require('raw!./preview.svg');
var previewStyle = require('raw!./preview.css');
var previewComponent = new Preview(previewTemplate, previewStyle);
...
clay.registerComponent(previewComponent); 
```

---

### Preview

**Manipulator:** [`val`](https://www.github.com/pebble/clay#val)

This component allows the user to provide a dynamic preview of their watch face or app on the Clay configuration page.
The user supplies an SVG template and the component provides options to modify the SVG dynamically in response to changes in the configuration.

##### Properties

| Property | Type | Description |
|----------|------|-------------|
| type | string | Set to `preview`. |
| id | string (unique) | Set this to a unique string to allow this item to be looked up using `Clay.getItemById()` in your [custom function](#custom-function). |
| messageKey | string (unique) | The AppMessage key matching the `messageKey` item defined in your `package.json`.  Set this to a unique string to allow this item to be looked up using `Clay.getItemsByMessageKey()` in your custom function. You must set this if you wish for the value of this item to be persisted after the user closes the config page. |
| defaultValue | string | The default value of the dropdown menu. Must match a value in the `options` array. |
| sunlight | boolean | Use the color-corrected sunlight color palette if `true`, else the uncorrected version. Defaults to `true` if not specified. |
| bindings | array of objects | How should preview elements change in response to configuration changes. Each binding is an object with `source`, `selector`, `set` and `map` properties. |
| capabilities | array | Array of features that the connected watch must have for this item to be present |
| group | string | Set this to allow this item, along with other items sharing the same group to be looked up using `Clay.getItemsByGroup()` in your [custom function](#custom-function) |

##### Bindings

| Property | Type | Description |
|----------|------|-------------|
| source   | string | The `messageKey` or `id` of the config item to monitor.  `id` values must be prefixed with a `#` sign. |
| selector | string | A CSS selector to identify which elements of the preview to modify. |
| set      | string | The name of the property to set on the selected preview elements.  This name follows the Minified.js conventions for [`.set(name, value)`](http://minifiedjs.com/api/set.html) |
| map      | string OR object | Specifies the mapping from the values read from the source item to the values set on the selected preview elements.  If map is specified as an object, then the keys of the object correspond to the possible values of the source and the values are the corresponding values to set on the preview element.  If map is specified as a string, then this string is the name of a built-in map function. |

##### Map functions

| Function | Description |
|----------|-------------|
| color    | Converts integer color values to CSS RGB hex values and optionally converts to the sunlight palette according to the  `sunlight` property of the `preview` item. |
| show     | Converts truthy values to `block` and falsy values to `none`.  Appropriate for setting the `$display` property. |
| hide     | Converts truthy values to `none` and falsy values to `block`.  The opposite of show. | 

##### Example

SVG Template
```html
<svg role="img" class="component component-preview" width="144" height="168" viewBox="0 0 144 168">
    <rect class="background" stroke="none" fill="currentColor" width="100%" height="100%" />
    <text class="text" id="time" stroke="none" fill="currentColor">4:20</text>
    <text class="text" id="date" stroke="none" fill="currentColor">04/20</text>
    <circle class="bluetooth" stroke="none" fill="currentColor" r="20" />
</svg>
```

Clay Config
```javascript
{
    "type": "color",
    "messageKey": "BACKGROUND_COLOR",
    "label": "Background Color"
},
{
    "type": "color",
    "messageKey": "TEXT_COLOR",
    "label": "Text Color"
},
{
    "type": "toggle",
    "messageKey": "SHOW_DATE",
    "label": "Show Date"
}
{
    "type": "select",
    "messageKey": "BLUETOOTH",
    "label": "Bluetooth Status",
    "options": [
        { "label": "None", "value": 0 },
        { "label": "Visual", "value": 1 },
        { "label": "Visual+Vibration", "value": 2 }
    ]
}
{
    "type": "preview",
    "bindings": [
        {
            "source": "BACKGROUND_COLOR",
            "selector": ".background",
            "set": "$color",
            "map": "color"
        },
        {
            "source": "TEXT_COLOR",
            "selector": ".text",
            "set": "$color",
            "map": "color"
        },
        {
            "source": "SHOW_DATE",
            "selector": "#date",
            "set": "$display",
            "map": "show"
        },
        {
            "source": "SHOW_BLUETOOTH",
            "selector": ".bluetooth",
            "set": "$display",
            "map": { "0": "none", "1": "block", "2": "block" }
        }
    ]
}
```
