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

// storage class to perform database actions

NX.Storage = function() {
  this.db = openDatabase('nxdb1', '1.0', 'nxdb1', 2 * 1024 * 1024);
}

NX.Storage.prototype.constructor = NX.Storage;

NX.Storage.prototype.setTimePoints = function(points) {
  var time = nx.util.time();
  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ranglist (time unique, points)');
  });
  this.db.transaction(function (tx) {
    tx.executeSql('INSERT INTO ranglist (time, points) VALUES (?, ?)', [time, points]);
  });
}

NX.Storage.prototype.loadRanglist = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM ranglist ORDER BY time DESC LIMIT 5', [], function (tx, results) {
      var ranglist = [];
      for (var i = 0; i < results.rows.length; i++) {
        ranglist.push(results.rows.item(i));
      }
      if (callback) callback.call(this, ranglist);
    });
  }, function() { if (callback) callback.call(this, []) });
}