const util = require('util');
const exec = require('child_process').exec;
const fs = require('fs');
const moment = require('moment');
const xml2js = require('xml2js');

const xmlFile = process.argv[2];

let replaceKey = (object, oldKey, newKey) => {
  if (oldKey === newKey) { return this; }

  Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey));
};

// Clean keys
let cleanTaskData = task => {
  let requiredKeys = [
    'description',
    'start',
    'end',
    'due',
    'until',
    'scheduled',
    'wait',
    'recur',
    'parent',
    'annotation',
    'project',
    'tags',
    'priority',
    'depends',
    'UDA'
  ];

  for (let key in task) {
    if (requiredKeys.indexOf(key) === -1 || task[key] === '') {
      delete task[key];
    }

    if (task.recur === 'none') { delete task.recur }
  }
};

// Re-map keys
let remapKeys = task => {
  let keyMap = {
    'title': 'description',
    'folder': 'project',
    'duedate': 'due',
    'note': 'annotation',
    'repeat': 'recur'
  };

  let valueMap = {
    'priority': {
      'High': 'H',
      'Medium': 'M',
      'Low': 'L'
    }
  };

  let reservedKeys = ['parent', 'status'];

  // delete reservedKeys
  for (let reservedKey of reservedKeys) {
    delete task[reservedKey];
  }

  // swap with keyMap
  for (let key in keyMap) {
    let newKey = keyMap[key];

    replaceKey(task, key, newKey);

    if (typeof task[newKey] === 'object') {
      task[newKey] = task[newKey].toString();
    }

}

  // convert values from valueMap
  for (let value in valueMap) {
    let newValue = valueMap[value][task[value]];

    if (newValue) {
      task[value] = newValue;
    }
  }

};

fs.readFile(xmlFile, {trim: true}, (error, result) => {
  xml2js.parseString(result, (err, result) => {
    let time = moment().format();

    result = result.xml.item;

    result.forEach(task => {
      remapKeys(task);
      task.recur = task.recur.toLowerCase();
      cleanTaskData(task);
    });

    result = JSON.stringify(result);

    fs.writeFile('./' + time + '.json', result, (err) => {
      console.log(time + '.json written.');
    });
  });

});

