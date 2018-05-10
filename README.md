# Boilerplate code for simple static websites

## Technologies

* [HTML5 Boilerplate](https://html5boilerplate.com/)
* [ZURB Foundation](https://foundation.zurb.com/)
* [Grunt](https://gruntjs.com/)

---

## Getting started

Clone this project from the latest commit (you don't want to get the entire history of this repo).

    git clone --depth 1 <repo-url> <project-name>
    cd <project-name>

Create and update the base config file according to your project's settings.

    cp config.json.example config.json
    open -e config.json

Install dependencies.

    npm install

---

## How to use

All source files are located inside the `src` folder. The contents are mostly [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate/blob/6.1.0/dist/doc/TOC.md) files, with the exception of the CSS, which has been replaced with Sass from [ZURB Foundation](https://foundation.zurb.com/sites/docs/sass.html).

### Running the project

The default command. Runs the project and starts a [BrowserSync](https://browsersync.io/) server to watch and auto-reload your files.

    grunt

### Installing plugins & libraries

Install with `npm`, then include it inside `Gruntfile.js`.

```js
var libraries = {
    js: [
        'node_modules/foundation-sites/dist/js/foundation.min.js'
    ],
    css: [
        'node_modules/foundation-sites/scss'
    ]
};
```

JS files is automatically included in the build. CSS or Sass files is now in your path and ready to be imported.

```css
@import 'foundation';
```

### Deploying the project

Create and update the FTP credential file. [See here](https://github.com/thrashr888/grunt-sftp-deploy#authentication-parameters) to understand the format.

    cp .ftppass.example .ftppass
    open -e .ftppass

Then, run this command.

    grunt deploy --env=<environment>

**Note**: the `environment` value **must match** with one of the keys in the `.ftppass` file.
