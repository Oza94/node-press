node-press
==========

A minimalist content management system running on node.js.

**Note**: this project is very new, under active development and is not suitable for production apps for the moment. However any feedback will be greatly appreciated.

## install

You'll need the following software installed on your machine:

 * [node.js](http://nodejs.org/)
 * [MongoDB](http://www.mongodb.org/)

Clone the project and install dependencies :

```bash
git clone https://github.com/Oza94/node-press.git
cd node-press

# install node dependencies
npm install
```

## configure

This project uses [nconf](https://github.com/flatiron/nconf), and will merge (in-order) its configuration from different locations. Higher number means higher priority :

 1.  ```settings.defaults.json``` the default configuration file with pre-filled settings
 2. ```settings.json``` optional, ignored by git. override global defaults settings with **your** defaults settings using this file
 3. ```process.ENV``` optional, use environment variables to define configuration at os-level
 4. ```argv``` optional, use command line arguments to override any other source

For the moment you can refer to ```settings.defaults.json``` to know the list of configuration options.

### create an account

You'll need to create an account to use the admin part of the site. You can use the provided script :

```bash
node tools/createaccount
```

## running

Both of the following commands will work :

```bash
# just start the project
node index

# start the project with reload on file change a interactive deamon
gulp develop
```

If you have left the defaults settings, you can access the app at :

 * public: [http://localhost:8080](http://localhost:8080)
 * admin: [http://localhost:8080/admin/login](http://localhost:8080/admin/login)