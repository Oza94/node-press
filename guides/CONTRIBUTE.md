contribute to node-press
====================

## coding conventions

 * All javascript files server side are valited with [jshint](http://jshint.com/)

## git

### branch name

The branch name must follow this convention :

```
<version>/<type>/<name>
```

Where :

 * **version**: is the fixed version, e.g. ```0.1.x``` 
 * **type**: refer to commit message type, e.g. ```refactor```
 * **name**: is the name of your branch, e.g. ```fix-slugify```

### merging

Merge with ```--no-ff``` option.

### commit message

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on github as well as in various git tools.

### type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of  * the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation