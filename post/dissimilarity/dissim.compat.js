'use strict';

/*
Monty Hall problem.
*/

function mean(arr) {
  var sum = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var elt = _step.value;

      sum += elt;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return sum / arr.length;
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function montyHall(stay) {
  var numDoors = 3;
  var car = Math.floor(numDoors * Math.random());
  var guess = Math.floor(numDoors * Math.random());

  if (stay) {
    return car === guess;
  }

  var doors = new Set(Array.from(Array(numDoors), function (_, n) {
    return n;
  }));
  // Monty opens a door != guess, and != car.
  doors.delete(car);
  doors.delete(guess);
  var openDoorGoat = sample(Array.from(doors));

  // Switchers open the door != openDoorGoat and != guess
  doors = new Set(Array.from(Array(numDoors), function (_, n) {
    return n;
  }));
  doors.delete(openDoorGoat);
  doors.delete(guess);

  return car === sample(Array.from(doors));
}

function monteCarlo() {
  var stayers = mean(Array.from(Array(1e3), function (_) {
    return montyHall(true);
  }));
  var switchers = mean(Array.from(Array(1e3), function (_) {
    return montyHall(false);
  }));
  var num2str = function num2str(x) {
    return '' + Math.round(x * 1e4) / 1e2;
  };
  document.getElementById('monty-hall-switchers').textContent = num2str(switchers);
  document.getElementById('monty-hall-stayers').textContent = num2str(stayers);
}

/*
The criterion of dissimilarity plots.
*/
function linspace(a, b, num) {
  var δ = (b - a) / (num - 1);
  return Array.from(Array(num), function (_, i) {
    return a + δ * i;
  });
}

var pLie = [0, .1, .25, .5, 1];
var pPlaus = linspace(0, 1, 51);

function makeTrace(pUseful, pLie, pPlausVec) {
  return {
    x: pPlausVec.slice(),
    y: pPlausVec.map(function (pp) {
      return pUseful * pp / (pUseful * pp + pLie * (1 - pp));
    }),
    type: 'scatter',
    name: 'pLie=' + pLie
  };
}
function pUsefulToData(pUseful) {
  return pLie.map(function (pLie) {
    return makeTrace(pUseful, pLie, pPlaus);
  });
}

var layout = {
  title: 'pUseful = 1',
  xaxis: { title: 'pPlausible' },
  yaxis: { title: 'p(H | says H)' }
};

Plotly.newPlot('myDiv', pUsefulToData(1), layout);
Plotly.newPlot('myDiv-2', pUsefulToData(.5), (layout.title = 'pUseful = 0.5') && layout);
Plotly.newPlot('myDiv-3', pUsefulToData(.1), (layout.title = 'pUseful = 0.1') && layout);

