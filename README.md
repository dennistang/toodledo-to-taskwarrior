# toodledo-to-taskwarrior

## Overview
Quick and dirty Node.js script to convert [ToodleDo](http://www.toodledo.com/) XML into JSON format to import into [TaskWarrior](http://www.taskwarrior.org/)

## Getting Started
* `npm install`
* In your ToodleDo account, export your tasks in XML format
* Run `index.js` with your XML file, e.g., `node index.js toodledo.xml`
* Import outputted JSON file into TaskWarrior, e.g., `cat 2016-10-30T23:23:24-07:00.json | task import -`

## Bugs / TODO
* [ ] More coverage for variances of recurring values (most already work with TaskWarrior)
* [ ] Improve coverage of priority value variants
* [ ] Subtask importing
