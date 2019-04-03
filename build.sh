#!/bin/bash
cd /var/www/nemv3
git pull
yarn
cd be
yarn
cd ..
cd fe
yarn
yarn build
cd ..
pm2 start