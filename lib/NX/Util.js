/*
 * This file is part of NuaoX.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/nuaox
 *
 * NuaoX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * NuaoX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NuaoX. If not, see <http://www.gnu.org/licenses/>.
 */

NX.Util = function() {
  this.jsons = {};
}

NX.Util.prototype.constructor = NX.Util;

NX.Util.prototype.getEventListener = function(obj, func) {
  return function(event) { obj[func](obj, event); };
}

NX.Util.prototype.quit = function(delay) {
  if (typeof delay == "undefined") {
    delay = 0;
  }
  global.setTimeout(function() {
    require('nw.gui').App.closeAllWindows();
  }, delay);
}

NX.Util.prototype.loadJSON = function(json, forceLoad) {
  var result = {};
  if (typeof this.jsons[json] == "undefined") {
    try {
      result = JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
      if (forceLoad !== true) {
        // load json files one time only
        // espacially externals which will be used in multiple data files
        this.jsons[json] = result;
      }
    } catch (err) {
    }
  } else {
    result = this.jsons[json];
  }
  return result;
};

NX.Util.prototype.objectLength = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};

NX.Util.prototype.time = function(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (!delay > 0) {
    delay = 0;
  }
  var t = new Date().getTime() / div;
  if (type != "formated") {
    return Math.round(t + delay);
  } else {
    var date = new Date(t);
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}

NX.Util.prototype.isChance = function(p, max) {
  if (typeof max == "undefined") max = 32767;
  // calculates if a chance exists to do something
  var r = Math.random() * max;
  return r < (max * p)
}

NX.Util.prototype.isRectangesCollision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 <= x2 + w2 &&
          x2 <= x1 + w1 &&
          y1 <= y2 + h2 &&
          y2 <= y1 + h1);
}