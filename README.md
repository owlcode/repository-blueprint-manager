# Repository Blueprint Manager

Manage multiple git repositories. Align your common configuration files in multiple repositories easily! Synchronize shared files in a glance.

# How to use

Create directory with blueprints and configuration. 

### How to use

Create directory structure representing all your blueprints yo want to apply to different repositories

    .
    ├── blueprints
        ├── license
            ├── LICENSE.md
        ├── code-style
            ├── .eslintrc.js
            ├── .prettierrc
            ├── .eslintignore
        ├── jsons
            ├── package.json
    ├── .rbmrc.js               # Configuration file
    
# Blueprints

Define a list of atomic blueprints that you can later easily apply to different repositories

# Config

Declarative & simple configuration of your repositories. Paste git url and select blueprints you want to use.

# License