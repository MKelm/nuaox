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

// global object initialization
var nx = nx || {};

$(document).ready(function() {
  global.setTimeout(function() {
    //try {
      nx.keys = {};

      nx.util = new NX.Util("jquery");

      nx.version = new NX.Version();
      nx.version.updateHashesFile(); // for maintainer

      nx.userConfig = nx.util.loadJSON('./user/data/config.json');
      nx.intervals = {};
      nx.pixi = new NX.Pixi();

      nx.game = new NX.Game();

      // add/start the pixi renderer
      document.body.appendChild(nx.pixi.renderer.view);
      requestAnimFrame(nx.pixi.animate.curry(nx.pixi));

      nx.pixi.loadAssets(function() { nx.game.start(); });

    //} catch (err) {
      //console.log(err);
    //}
  }, 0.00000001); // use timeout to detect fullscreen size correctly
});
