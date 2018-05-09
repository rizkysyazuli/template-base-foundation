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

Install dependencies & run the project. This will open a new browser window with [BrowserSync](https://browsersync.io/) running.

    npm install && grunt

Now go work your magic!

---

## Deploying the project

Create and update the FTP credential file. [See here](https://github.com/thrashr888/grunt-sftp-deploy#authentication-parameters) to understand the format.

    cp .ftppass.example .ftppass
    open -e .ftppass

Then, run this command.

    grunt deploy --env=<environment>

**Note**: the `environment` value **must match** with one of the keys in the `.ftppass` file.
