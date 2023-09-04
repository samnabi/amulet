// Cordwood: Split a string into equal-length chunks
// Adapted from https://itnext.io/javascript-split-a-string-into-equal-lengths-848eb811f383
if (!String.prototype.cordwood) {
  String.prototype.cordwood = function(cordlen) {
  if (cordlen === undefined ) { cordlen = 2; } // Default chunk length is 2
  if (cordlen > this.length) { cordlen = this.length; } // Can't have a chunk length longer than the string
  var yardstick = new RegExp(`.{${cordlen}}`, 'g');
  var pieces = this.match(yardstick);
  var accumulated = (pieces.length * cordlen);
  var modulo = this.length % accumulated;
  if (modulo) pieces.push(this.slice(accumulated));
  return pieces;
 };
}

// Verify amulet hash and transform it into a set of x,y coordinates on a 16-by-16 grid
// Coordinates go from 0,0 to 15,15
if (!String.prototype.amuletHashToCoordinates) {
  String.prototype.amuletHashToCoordinates = function() {
    
    // Check hash length
    if (this.length !== 64) {
      console.log(this);
      console.log('The hash must be 64 bytes long.');
      return false;
    }

    // Check that it's an amulet
    if (!this.includes('8888')) {
      console.log('The hash must contain four or more consecutive 8s.');
      return false;
    }

    // Map possible hash values to a coordinate number
    var coordinate_map = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      b: 11,
      c: 12,
      d: 13,
      e: 14,
      f: 15
    };

    // Split the hash into sets of 2 characters
    var chunks = this.cordwood(2);
    var coordinatesArray = [];
    chunks.forEach((chunk) => {
      coordinatesArray.push([
        coordinate_map[chunk.charAt(0)],
        coordinate_map[chunk.charAt(1)]
      ]);
    });

    return coordinatesArray;
  }
}

class Play {

  static run(hash, canvas, world_width = 16, world_height = 16) {
    const world = new World(
      world_width,
      world_height,
      hash.amuletHashToCoordinates(),
    );

    canvas.innerHTML = world.render();

    Play.intervals['amulet-' + hash] = setInterval(() => {
      world._tick()
      const rendered = world.render()
      if (canvas.innerHTML == rendered) {
        clearInterval(Play.intervals['amulet-' + hash]);
      } else {
        canvas.innerHTML = rendered
      }
    }, 150)
  }

}

Play.intervals = [];

class World {

  constructor(width, height, alive_cells) {
    this.width = width;
    this.height = height;
    this.cells = {};
    this.cached_directions = [
      [-1, 1],  [0, 1],  [1, 1], // above
      [-1, 0],           [1, 0], // sides
      [-1, -1], [0, -1], [1, -1] // below
    ];

    // Build canvas of empty cells
    this.populate_empty_cells();

    // Add alive cells
    for (let i = 0; i < alive_cells.length; i++) {
      let x = alive_cells[i][0];
      let y = alive_cells[i][1];
      const cell = new Cell(x, y, true)
      this.cells[`${x}-${y}`] = cell
    }

    this.prepopulate_neighbours();
  }

  _tick() {
    const cells = Object.values(this.cells);

    // First determine the action for all cells
    for (const cell of cells) {
      const alive_neighbours = this.alive_neighbours_around(cell);
      if (!cell.alive && alive_neighbours == 3) {
        cell.next_state = 1;
      } else if (alive_neighbours < 2 || alive_neighbours > 3) {
        cell.next_state = 0;
      }
    }

    // Then execute the determined action for all cells
    for (const cell of cells) {
      if (cell.next_state == 1) {
        cell.alive = true;
      } else if (cell.next_state == 0) {
        cell.alive = false;
      }
    }
  }

  render() {
    let rendering = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cell_at(x, y);
        rendering += cell.to_char();
      }
      rendering += "<br />";
    }
    return rendering;
  }

  populate_empty_cells() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.add_cell(x, y, false);
      }
    }
  }

  prepopulate_neighbours() {
    for (const cell of Object.values(this.cells)) {
      this.neighbours_around(cell)
    }
  }

  add_cell(x, y, alive = false) {
    if (this.cell_at(x, y) != null) {
      throw new World.LocationOccupied
    }

    const cell = new Cell(x, y, alive)
    this.cells[`${x}-${y}`] = cell
    return this.cell_at(x, y)
  }

  cell_at(x, y) {
    return this.cells[`${x}-${y}`]
  }

  neighbours_around(cell) {
    if (cell.neighbours == null) {
      cell.neighbours = new Array
      for (const set of this.cached_directions) {
        const neighbour = this.cell_at(
          (cell.x + set[0]),
          (cell.y + set[1])
        )
        if (neighbour != null) {
          cell.neighbours.push(neighbour)
        }
      }
    }

    return cell.neighbours
  }

  alive_neighbours_around(cell) {
    let alive_neighbours = 0
    const neighbours = this.neighbours_around(cell)
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i]
      if (neighbour.alive) {
        alive_neighbours += 1
      }
    }
    return alive_neighbours
  }

}

World.LocationOccupied = function() {}

class Cell {

  constructor(x, y, alive = false) {
    this.x = x
    this.y = y
    this.alive = alive
    this.next_state = null
    this.neighbours = null
  }

  to_char() {
    return (this.alive ? '<span class="alive"></span>' : '<span class="dead"></span>')
  }

}
