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

// some hotkey functions

$("html").keyup(function(e){
  if (e.which == 27) { // ESC
    nx.util.quit();
  } else if (e.which == 112) { // F1
    nx.pixi.setFpsCounter(true, nx.pixi);
  }
});

// keys handler for more game key events
$("html").keydown(function(e) {
    nx.keys[e.which] = true;
});
$("html").keyup(function(e) {
    delete nx.keys[e.which];
});