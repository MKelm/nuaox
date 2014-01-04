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

  // stars in background
  this.starsContainer = null;
  this.stars = [];

  this.maxStars = 100;
  this.maxStarSize = 5;
  this.minStarSpeed = 80;
  this.maxStarSpeed = 100;

  // ships in foreground
  this.ships = [];
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

NX.Display.prototype.drawShip = function(ship, positionX, positionY) {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/ships/"+ship.handle+".png"));
  sprite.anchor = { x: 0.5, y: 0.5 };
  sprite.position = { x: positionX, y: positionY };
  sprite.rotation = Math.radians(ship.direction * 180);
  this.container.addChild(sprite);
  this.ships.push(sprite);
  return this.ships.length - 1;
}

NX.Display.prototype.moveShip = function(ship, fps, addX, addY) {
  if (addX !== 0) {
    this.ships[ship.displayId].position.x += addX * ship.speed / fps;
  }
  if (addY !== 0) {
    this.ships[ship.displayId].position.y += addY * ship.speed / fps;
  }
}

NX.Display.prototype.removeShip = function(id) {
  this.container.removeChild(this.ships[id]);
  this.ships.splice(id, 1);
}

NX.Display.prototype.animateEnemyShip = function(enemy) {
  var ship = this.ships[enemy.ship.displayId], targetPosition = enemy.steps[enemy.nextStep];

  var distance = Math.sqrt(
    Math.pow(ship.position.x - targetPosition.x, 2) + Math.pow(ship.position.y - targetPosition.y, 2)
  );

  enemy.animate = true;
  new TWEEN.Tween( { x: ship.position.x, y: ship.position.y } )
    .to(
      { x: targetPosition.x, y: targetPosition.y }, 1000 * (distance / enemy.ship.speed)
    )
    .onUpdate( function () {
      ship.position.x = this.x;
      ship.position.y = this.y;
    })
    .onComplete( function () {
      enemy.animate = false;
      enemy.nextStep++;
    })
    .start();
}

NX.Display.prototype.animateBullets = function(ship) {
  for (var i = 0; i < ship.weapons.length; i++) {
    var time = nx.util.time(), lastActionTimeDiff = time - ship.weapons[i].lastAction;

    if (ship.weapons[i].lastAction == -1 || lastActionTimeDiff > ship.weapons[i].delay) {
      ship.weapons[i].lastAction = time;

      var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("data/gfx/bullets/"+ship.weapons[i].handle+".png"));
      sprite.anchor = { x: 0.5, y: 0.5 };
      sprite.position = {
        x: this.ships[ship.displayId].position.x + ship.weapons[i].position.x,
        y: this.ships[ship.displayId].position.y + ship.weapons[i].position.y
      };
      sprite.rotation = Math.radians(ship.direction * 180);
      this.container.addChild(sprite);

      var targetPosition = {
        x: sprite.position.x, y: (ship.direction == 0) ? -500 : 500
      };
      var distance = Math.sqrt(
        Math.pow(sprite.position.x - targetPosition.x, 2) + Math.pow(sprite.position.y - targetPosition.y, 2)
      );

      var scope = this;
      !function (iSprite, iTargetPosition, iDistance, iShip) {
        new TWEEN.Tween( { x: iSprite.position.x, y: iSprite.position.y } )
          .to(
            { x: iTargetPosition.x, y: iTargetPosition.y }, 1000 * (iDistance / ship.weapons[i].speed)
          )
          .onUpdate( function () {
            iSprite.position.x = this.x;
            iSprite.position.y = this.y;
          })
          .start();
      }(sprite, targetPosition, distance, ship)
    }
  }
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