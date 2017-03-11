# Cheerladders

Support ain't about money.

* [Home](https://cheerladders.xyz/)
* [Examples](https://cheerladders.xyz/#examples)
* [Create a page](https://cheerladders.xyz/create)
* [Current State](#current-state)
* [Contribute](#contribute)

## Current State

For now the project is more a proof of concept than a finished product.
The workflow is pretty simple and the ui/ux could easily be improved.
I'll be working on it for the next iteration if it gets some traction.
In the mean time, feel free to contribute to any aspect you please.

## Contribute

Your contributions are more than welcome.
Just fork this repository and submit your PR!

### Installation

```
npm install
npm start
```

### Environment variables

* `PORT` - port the application listens to, default to `3000`.
* `MONGO_URL` - mongo url the application connects to, default to `localhost/cheerladders`.
* `TRACKING_ID` - Google Analytics tracking id, default to `''`.

### Adding a widget

Find the full list of available widgets in [assets/widgets.js](https://github.com/Zhouzi/cheerladders/blob/master/assets/widgets.js).
The structure of a widget is as follows:

```
{
  name: 'Visit our website',
  params: {
    url: 'What is the url of the website?',
  },
  render: function(wrapper, params) {
    wrapper.innerHTML = '<a href="' + params.url + '">Visit our website</a>';
  },
}
```

* **name**: used as display value when selecting a widget to add.
* **params**: a map of params with the key being the identifier and value a question to ask the user.
* **render**: a function that receives a wrapper and the provided params - renders the widget.

The render function can return `false` if the widget should't be rendered at all (e.g when using a browser-dependent feature).
