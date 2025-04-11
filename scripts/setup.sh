#! /bin/bash

asdf install

corepack enable
corepack prepare yarn@stable --activate

asdf reshim nodejs

# Install dependencies
yarn install

# Build the project
yarn build