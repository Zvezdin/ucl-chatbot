#!/bin/bash
shouldGenerate=$( cat -s "config/npm-config.json" |  jq -r '.shouldGenerate' ) 
echo ${shouldGenerate}

if [ "$shouldGenerate" == 'true' ]
then
	echo "New version being generated..."
else
	echo "Error! Make sure to change should generate to true for a new version number"
	exit 64
fi