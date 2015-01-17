node-press theming
==================

You can create themes for **node-press**. Themes are located in `public/themes` folder.

## Create a theme

Create a directory in `public/themes`. Add an `index.css` which contains your concat css.

## Use a theme

You can set the theme using nconf. For example in `settings.json`

```json
{
  ...,
  "app": {
    ...,
    "theme": "default" // name of the directory in public/themes
  }
}
```
