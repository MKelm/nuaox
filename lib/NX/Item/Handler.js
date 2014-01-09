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

NX.ItemHandler = function(game) {

  this.game = game;
  this.items = [
    { handle: "shieldup", effects: { shield: 50 } },
    { handle: "pointsup", effects: { points: 100 } }
  ];

  this.itemLifeTime = 1000 * 15;
}

NX.ItemHandler.prototype.constructor = NX.ItemHandler;

NX.ItemHandler.prototype.getRandomItem = function() {
  var id = Math.round(Math.random() * (this.items.length - 1));
  return { handle: this.items[id].handle, id: id, lifeTime: this.itemLifeTime };
}


NX.ItemHandler.prototype.applyItemEffects = function(itemId) {
  var effects = this.items[itemId].effects;
  for (var property in effects) {
    switch (property) {
      case "shield":
        this.game.shipHandler.player.shield += effects.shield;
        break;
      case "points":
        this.game.points += effects.points;
        break;
    }
  }
}

NX.ItemHandler.prototype.displayItem = function(item) {
  if (typeof item.position == "object") {
    this.game.display.drawItem(item);
  }
}