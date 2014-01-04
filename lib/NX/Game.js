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

NX.Game = function() {
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);
  this.fps = -1;

  this.run = false;
  this.lastUpdateTime = null;

  this.player = new NX.Player();

  this.display = new NX.Display(this);
  this.display.initialize();

  // register interaction event listeners
  this.addEventListener('ship-collision', nx.util.getEventListener(this, "handleEvent"));
}

NX.Game.prototype.constructor = NX.Game;

NX.Game.prototype.start = function() {

  this.lastUpdateTime = nx.util.time();
  this.run = true;
}

NX.Game.prototype.update = function(scope) {
  var timeDiff = nx.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;

  scope.lastUpdateTime = nx.util.time();
}

NX.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "ship-collision":
      break;
  }
}