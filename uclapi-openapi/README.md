# uclapi-openapi

## What this is

This is an open api definition of the uclapi (uclapi.com). This repository should not be edited except when changes are made to it by swagger.

## The aim

Since this repo is set up to track the changes made in swagger it means that we can set up future repositories for python, node, ... to generate updates to the sdk when they see changes made here

## Current progress on auto updates

Node automatically builds when you update swagger but due to constraints of swagger you manually have to version the build in the config file and set shouldGenerate to true.
