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

  this.rushNum = 1;
  this.rushStartPosition = { x: 0, y: -500 };
  this.rushs = nx.util.loadJSON("./lib/data/ships/rushs.json"); // enemy rushs

  this.enemies = [];
}

NX.ShipHandler.prototype.constructor = NX.ShipHandler;

NX.ShipHandler.prototype.initializePlayer = function() {
  this.player = new NX.Ship("player");
  this.player.displayId = this.display.drawShip(
    this.player, 0, nx.pixi.screen.height/2 - this.player.size/2
  );
}

NX.ShipHandler.prototype.initializeRush = function() {
  this.enemies = this.rushs["rush"+this.rushNum];
  var enemy = null;
  for (var i = 0; i < this.enemies.length; i++) {
    enemy = this.enemies[i];
    enemy.ship = new NX.Ship(enemy.handle);
    enemy.ship.displayId = this.display.drawShip(
      enemy.ship, this.rushStartPosition.x + enemy.steps[0][0], this.rushStartPosition.y + enemy.steps[0][1]
    );
    enemy.step = 1;
    enemy.run = true;
  }
}