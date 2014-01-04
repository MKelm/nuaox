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

NX.ShipHandler = function(display) {

  this.display = display;

  this.player = null;

  this.enemiesStart = { x: 0, y: -500 };
  this.enemiesEnd = { x: 0, y: 500 };
  this.enemies = [];
}

NX.ShipHandler.prototype.constructor = NX.ShipHandler;

NX.ShipHandler.prototype.initializePlayer = function() {
  this.player = new NX.Ship("player");
  this.player.displayId = this.display.drawShip(this.player);
}