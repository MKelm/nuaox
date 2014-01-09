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
  this.starsGfx = null;
  this.stars = [];

  this.maxStars = 100;
  this.maxStarSize = 5;
  this.minStarSpeed = 80;
  this.maxStarSpeed = 100;

  // ships in foreground
  this.ships = [];
  this.shipTweens = [];

  this.pointsText = null;
  this.shieldText = null;
}

NX.Display.prototype.constructor = NX.Display;

NX.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  nx.pixi.stage.addChild(this.container);
  this.container.scale = {x: nx.pixi.screen.ratio, y: nx.pixi.screen.ratio};
  this.container.position = {x: nx.pixi.screen.width/2, y: nx.pixi.screen.height/2 };

  this.starsGfx = new PIXI.Graphics();
  this.starsGfx.position = {x: -1 * nx.pixi.screen.baseSize.width/2, y: -1 * nx.pixi.screen.baseSize.height/2 };
  this.container.addChild(this.starsGfx);

  var scope = this;
  nx.pixi.resizeCallback = function() { scope.handleResize(); };
}

NX.Display.prototype.handleResize = function() {
  this.container.scale = {x: nx.pixi.screen.ratio, y: nx.pixi.screen.ratio};
  this.container.position = {x: nx.pixi.screen.width/2, y: nx.pixi.screen.height/2 };
}


NX.Display.prototype.drawShip = function(ship, positionX, positionY) {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/ships/"+ship.handle+".png"));
  sprite.anchor = { x: 0.5, y: 0.5 };
  sprite.position = { x: positionX, y: positionY };
  sprite.rotation = Math.radians(ship.direction * 180);
  this.container.addChild(sprite);
  this.ships.push(sprite);
  return this.ships.length - 1;
}

NX.Display.prototype.moveShip = function(ship, fps, addX, addY) {
  if (typeof this.ships[ship.displayId] != "undefined") {
    if (addX !== 0) {
      this.ships[ship.displayId].position.x += addX * ship.speed / fps;
    }
    if (addY !== 0) {
      this.ships[ship.displayId].position.y += addY * ship.speed / fps;
    }
  }
}

NX.Display.prototype.removeShip = function(id) {
  if (typeof this.ships[id] != "undefined") {
    this.container.removeChild(this.ships[id]);
    this.ships.splice(id, 1);
    if (typeof this.shipTweens[id] != "undefined") {
      this.shipTweens[id].stop();
      this.shipTweens.splice(id, 1);
    }
    // correct all display ids in enemies handler
    var enemies = this.game.shipHandler.enemies;
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].ship.displayId > id) enemies[i].ship.displayId--;
    }
  }
}

NX.Display.prototype.stopShips = function() {
  for (var id in this.shipTweens) {
    this.shipTweens[id].stop();
  }
  this.shipTweens = [];
}

NX.Display.prototype.getShipPosition = function(displayId) {
  return this.ships[displayId].position;
}

NX.Display.prototype.animateEnemyShip = function(enemy) {
  var ship = this.ships[enemy.ship.displayId], targetPosition = enemy.steps[enemy.nextStep], scope = this;

  if (typeof ship != "undefined" && typeof targetPosition != "undefined") {
    var distance = Math.sqrt(
      Math.pow(ship.position.x - targetPosition.x, 2) + Math.pow(ship.position.y - targetPosition.y, 2)
    );

    enemy.animate = true;
    this.shipTweens[enemy.ship.displayId] = new TWEEN.Tween( { x: ship.position.x, y: ship.position.y } )
      .to(
        { x: targetPosition.x, y: targetPosition.y }, 1000 * (distance / enemy.ship.speed)
      )
      .onUpdate( function () {
        ship.position.x = this.x;
        ship.position.y = this.y;
        var playerShipDisplayId = scope.game.shipHandler.player.displayId;
        if (typeof scope.ships[playerShipDisplayId] != "undefined") {
          var enemyPlayerDistance = Math.sqrt(
            Math.pow(this.x - scope.ships[playerShipDisplayId].position.x, 2) +
            Math.pow(this.y - scope.ships[playerShipDisplayId].position.y, 2)
          );
          // needs ships with width==height!
          if (enemyPlayerDistance < (ship.width/2 + scope.ships[0].width/2)) {
            scope.game.dispatchEvent({
              type: "enemy-player-collision",
              content: { shipDisplayId: enemy.ship.displayId, damage: 0.5 }
            });
          }
        }
      })
      .onComplete( function () {
        enemy.animate = false;
        enemy.nextStep++;
      })
      .start();
  }
}

NX.Display.prototype.animateBullets = function(ship) {
  var tweens = [];
  for (var i = 0; i < ship.weapons.length; i++) {
    var time = nx.util.time(), lastActionTimeDiff = time - ship.weapons[i].lastAction;

    if (ship.weapons[i].lastAction == -1 || lastActionTimeDiff > ship.weapons[i].delay) {
      ship.weapons[i].lastAction = time;

      var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/bullets/"+ship.weapons[i].handle+".png"));
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
      tweens[i] = function (iI, iSprite, iTargetPosition, iDistance, iShip, iWeaponId) {
        return new TWEEN.Tween( { x: iSprite.position.x, y: iSprite.position.y } )
          .to(
            { x: iTargetPosition.x, y: iTargetPosition.y }, 1000 * (iDistance / ship.weapons[i].speed)
          )
          .onUpdate( function() {
            iSprite.position.x = this.x;
            iSprite.position.y = this.y;
            for (var id = 0; id < scope.ships.length; id++) {
              if (id != iShip.displayId) {
                var shipBulletDistance = Math.sqrt(
                  Math.pow(this.x - scope.ships[id].position.x, 2) +
                  Math.pow(this.y - scope.ships[id].position.y, 2)
                );
                if (shipBulletDistance < iShip.size/2 + iShip.weapons[iWeaponId].size/2) {

                  tweens[iI].stop();
                  scope.container.removeChild(iSprite);

                  scope.game.dispatchEvent({
                    type: "bullet-ship-collision",
                    content: { shipDisplayId: id, damage: iShip.weapons[iWeaponId].damage }
                  });
                }
              }
            }
          })
          .onComplete( function() {
            if (scope.container.children.indexOf(iSprite) !== -1) {
              scope.container.removeChild(iSprite);
            }
          })
          .start();
      }(i, sprite, targetPosition, distance, ship, i)
    }
  }
}

// uses range from enemy to player to shoot
NX.Display.prototype.getPlayerShipInTargetRange = function(player, enemy) {
  var enemyShip = this.ships[enemy.ship.displayId], playerShip = this.ships[player.displayId];
  if (typeof enemyShip != "undefined") {
    // target range area from enemy 1000 pixels to bottom
    return nx.util.isRectangesCollision(
      enemyShip.position.x - enemy.ship.size/2, enemyShip.position.y - enemy.ship.size/2,
      enemy.ship.size, 1000,
      playerShip.position.x - playerShip.width/2, playerShip.position.y - playerShip.height/2,
      player.size, player.size
    );
  }
  return false;
}

// draw points status of player
NX.Display.prototype.drawPoints = function(points) {
  var prefix = "Points: ";
  var style = {font: 26 + "px " + "Arial", fill: "FFFFFF"};
  var tPoints = new PIXI.Text(prefix+Math.round(points), style);
  if (this.pointsText !== null) {
    this.container.removeChild(this.pointsText);
  }
  this.container.addChild(tPoints);
  this.pointsText = tPoints;
  this.pointsText.position = { x: 400-this.pointsText.width-20, y: 300-this.pointsText.height-20 };
}

// draw shield status of player
NX.Display.prototype.drawShield = function(shield) {
  var prefix = "Shield: ";
  if (this.shieldText === null) {
    var style = {font: 26 + "px " + "Arial", fill: "FFFFFF"};
    var tShield = new PIXI.Text(prefix+Math.round(shield), style);
    tShield.position = { x: -400+20, y: 300-tShield.height-20 };
    this.container.addChild(tShield);
    this.shieldText = tShield;
  } else {
    this.shieldText.setText(prefix+Math.round(shield));
  }

}

NX.Display.prototype.initStars = function() {
  for (var i = this.stars.length; i < this.maxStars; i++) {
    this.stars[i] = {
      size: Math.round(Math.random() * this.maxStarSize),
      speed: Math.random() * this.maxStarSpeed + this.minStarSpeed,
      x: Math.random() * nx.pixi.screen.baseSize.width,
      y: Math.random() * nx.pixi.screen.baseSize.height
    };
  }
}

NX.Display.prototype.drawStars = function() {
  this.starsGfx.clear();
  this.starsGfx.beginFill(0xFFFFFF);
  var starsToRemove = [];
  for (var i = 0; i < this.stars.length; i++) {
    if (this.stars[i].y > nx.pixi.screen.baseSize.height) {
      this.stars[i].y = 0;
    } else {
      this.stars[i].y += this.stars[i].speed / this.game.fps
    }
    this.starsGfx.drawRect(this.stars[i].x, this.stars[i].y, this.stars[i].size, this.stars[i].size);
  }
  for (var i = 0; i < starsToRemove.length; i++) {
    this.stars.splice(starsToRemove[i], 1);
  }
  this.starsGfx.endFill();
}

NX.Display.prototype.drawItem = function(item) {
  var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/items/"+item.handle+".png"));
  sprite.anchor = { x: 0.5, y: 0.5 };
  sprite.position = { x: item.position.x, y: item.position.y };
  this.container.addChild(sprite);

  var scope = this;
  var tween = new TWEEN.Tween( { y: 0 } )
    .to(
      { y: Math.radians(360) * 10 }, item.lifeTime
    )
    .onUpdate( function() {
      sprite.rotation = this.y;
      var playerItemDistance = Math.sqrt(
        Math.pow(sprite.position.x - scope.ships[0].position.x, 2) +
        Math.pow(sprite.position.y - scope.ships[0].position.y, 2)
      );
      if (playerItemDistance < 25 + 50) {
        tween.stop();
        scope.container.removeChild(sprite);
        scope.game.dispatchEvent({
          type: "player-item-collision",
          content: { item: item }
        });
      }
    })
    .onComplete( function() {
      scope.container.removeChild(sprite);
    })
    .start();
}