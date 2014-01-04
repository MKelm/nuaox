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

  this.display = new NX.Display(this);
  this.display.initialize();

  this.shipHandler = new NX.ShipHandler(this.display);

  this.welcomeWindow = null;

  // register interaction event listeners
  this.addEventListener('ship-collision', nx.util.getEventListener(this, "handleEvent"));
  this.addEventListener('window-close-click', nx.util.getEventListener(this, "handleEvent"));
}

NX.Game.prototype.constructor = NX.Game;

NX.Game.prototype.start = function() {
  this.display.drawStars();
  this.shipHandler.initializePlayer();

  this.welcomeWindow = new NX.DisplayWindow(this, 550, 200)
  this.welcomeWindow.handle = "welcome";
  this.welcomeWindow.show();
  this.welcomeWindow.drawCloseButton();
  this.welcomeWindow.drawContentText(
    "You are Jip a pilot of the Nuao. The Nuao felt into a battle against the Umiri. " +
    "Control your ship well and smash the Umiri fighters away!",
    500,
    40
  );
}

NX.Game.prototype.update = function(scope) {
  var timeDiff = nx.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;
  // update game elements
  scope.display.moveStars();

  for (var key in nx.keys) {
    if (key == 37) { // left arrow
      scope.display.moveShip(scope.shipHandler.player, scope.fps, -1, 0);
    } else if (key == 39) { // right arrow
      scope.display.moveShip(scope.shipHandler.player, scope.fps, 1, 0);
    } else if (key == 38) { // up arrow
      scope.display.moveShip(scope.shipHandler.player, scope.fps, 0, -1);
    } else if (key == 40) { // down arrow
      scope.display.moveShip(scope.shipHandler.player, scope.fps, 0, 1);
    }
  }

  scope.lastUpdateTime = nx.util.time();
}

NX.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "window-close-click":
      if (event.content.window == "welcome") {
        scope.welcomeWindow.hide();
        // start game process
        scope.lastUpdateTime = nx.util.time();
        scope.run = true;
      }
    case "ship-collision":
      break;
  }
}