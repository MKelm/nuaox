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

  // stars for background
  this.starsContainer = null;
  this.stars = [];
  this.maxStars = 100;
  this.maxStarSize = 5;
  this.minStarSpeed = 80;
  this.maxStarSpeed = 100;
}

NX.Display.prototype.constructor = NX.Display;

NX.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: nx.pixi.screen.width/2, y: nx.pixi.screen.height/2 };
  this.container.scale = {x: nx.pixi.screen.ratio, y: nx.pixi.screen.ratio };
  nx.pixi.stage.addChild(this.container);

  this.starsContainer = new PIXI.DisplayObjectContainer();
  this.starsContainer.position = {x: -1 * nx.pixi.screen.width/2, y: -1 * nx.pixi.screen.height/2 };
  this.container.addChild(this.starsContainer);
}

NX.Display.prototype.drawStar = function(x, y) {
  var x = x || Math.random() * nx.pixi.screen.width, y = y || Math.random() * nx.pixi.screen.height,
    size = Math.random() * this.maxStarSize,
    speed = Math.random() * this.maxStarSpeed + this.minStarSpeed;
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0xFFFFFF);
  gfx.drawRect(-1 * size/2, -1 * size/2, size, size);
  gfx.position = { x: x, y: y };
  this.starsContainer.addChild(gfx);
  this.stars.push({ speed: speed, gfx: gfx });
}

NX.Display.prototype.drawStars = function() {
  if (this.stars.length == 0) {
    for (var i = 0; i < this.maxStars; i++) {
      this.drawStar();
    }
  }
}

NX.Display.prototype.moveStars = function() {
  for (var i = 0; i < this.stars.length; i++) {
    this.stars[i].gfx.position.y = this.stars[i].gfx.position.y +
      (this.stars[i].speed / this.game.fps);
    if (this.stars[i].gfx.position.y > nx.pixi.screen.height) {
      this.starsContainer.removeChild(this.stars[i].gfx);
      this.stars.splice(i, 1);
      this.drawStar(false, 1);
    }
  }
}