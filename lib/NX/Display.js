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

NX.Display = function(game) {

  this.game = game;
  this.container = null;
}

NX.Display.prototype.constructor = NX.Display;

NX.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: nx.pixi.screen.width/2, y: nx.pixi.screen.height/2 };
  this.container.scale = {x: nx.pixi.screen.ratio * 1.5, y: nx.pixi.screen.ratio * 1.5};
  nx.pixi.stage.addChild(this.container);
}