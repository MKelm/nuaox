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

NX.Ship = function(handle) {
  this.handle = handle;

  var config = nx.util.loadJSON("./lib/data/ships/"+this.handle+".json");
  this.size = config.size;
  this.speed = config.speed;
  this.shield = config.shield;
  this.weapons = config.weapons;
  this.direction = config.direction; // up 0, down 1

  for (var i = 0; i < this.weapons.length; i++) {
    this.weapons[i].lastAction = -1;
  }

  this.displayId = -1;
}

NX.Ship.prototype.constructor = NX.Ship;

NX.Ship.prototype.setBulletHit = function(damage) {
  this.shield -= damage;
  if (this.shield > 0) {
    return true;
  }
  return false;
}