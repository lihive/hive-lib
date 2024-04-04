<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [hive-lib](./hive-lib.md)

## hive-lib package

## Classes

<table><thead><tr><th>

Class


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[CoordinatesNotAdjacentError](./hive-lib.coordinatesnotadjacenterror.md)


</td><td>

An error indicating that two coordinates are not adjacent when they were expected to be.


</td></tr>
<tr><td>

[InvalidDirectionError](./hive-lib.invaliddirectionerror.md)


</td><td>

An error indicating that a direction value is invalid.


</td></tr>
<tr><td>

[NoTileAtCoordinateError](./hive-lib.notileatcoordinateerror.md)


</td><td>

An error indicating that there is no tile at a coordinate where there was expected to be one.


</td></tr>
</tbody></table>

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[allQueensPlaced(board, color, config)](./hive-lib.allqueensplaced.md)


</td><td>

Determine if all queens of the given color are on the board.


</td></tr>
<tr><td>

[allQueensSurrounded(board, color)](./hive-lib.allqueenssurrounded.md)


</td><td>

Determine if all queens of the given color are completely surrounded.


</td></tr>
<tr><td>

[boardNotation(board)](./hive-lib.boardnotation.md)


</td><td>

Generate a board notation string from a [GameBoard](./hive-lib.gameboard.md)<!-- -->.


</td></tr>
<tr><td>

[cartesianToHex(coordinate, size)](./hive-lib.cartesiantohex.md)


</td><td>

Convert a cartesian coordinate to a hex coordinate.


</td></tr>
<tr><td>

[chainBoardChanges(fns)](./hive-lib.chainboardchanges.md)


</td><td>

Generate a function that applies a sequence of changes to a game board.


</td></tr>
<tr><td>

[createMovePass()](./hive-lib.createmovepass.md)


</td><td>

Create a passing move.


</td></tr>
<tr><td>

[createTileMovement(from, to)](./hive-lib.createtilemovement.md)


</td><td>

Create a tile movement move.


</td></tr>
<tr><td>

[createTilePlacement(tileId, to)](./hive-lib.createtileplacement.md)


</td><td>

Create a tile placement move.


</td></tr>
<tr><td>

[eachClimbDirection(board, coordinate, iteratee)](./hive-lib.eachclimbdirection.md)


</td><td>

Call iteratee for every neighboring stack onto which a tile could climb.


</td></tr>
<tr><td>

[eachDirection(iteratee)](./hive-lib.eachdirection.md)


</td><td>

Call iteratee for each of the six hex direction values (1 through 6).


</td></tr>
<tr><td>

[eachDropDirection(board, coordinate, iteratee)](./hive-lib.eachdropdirection.md)


</td><td>

Call iteratee for every neighboring coordinate into which a tile could drop.


</td></tr>
<tr><td>

[eachNeighboringCoordinate(board, coordinate, iteratee)](./hive-lib.eachneighboringcoordinate.md)


</td><td>

Call iteratee for every neighboring coordinate.


</td></tr>
<tr><td>

[eachNeighboringStack(board, coordinate, iteratee)](./hive-lib.eachneighboringstack.md)


</td><td>

Call iteratee for every neighboring coordinate that contains a tile stack.


</td></tr>
<tr><td>

[eachSlideDirection(board, coordinate, iteratee)](./hive-lib.eachslidedirection.md)


</td><td>

Call iteratee for every neighboring coordinate into which a tile could slide.


</td></tr>
<tr><td>

[eachStack(board, iteratee)](./hive-lib.eachstack.md)


</td><td>

Call iteratee for every coordinate on the game board that contains tiles.


</td></tr>
<tr><td>

[eachUnoccupiedCoordinate(board, iteratee)](./hive-lib.eachunoccupiedcoordinate.md)


</td><td>

Call iteratee for every unoccupied coordinate that is adjacent to an occupied coordinate on a board.


</td></tr>
<tr><td>

[everyNeighboringCoordinate(board, coordinate, predicate)](./hive-lib.everyneighboringcoordinate.md)


</td><td>

Determine if some predicate holds true for every coordinate surrounding a specified coordinate.


</td></tr>
<tr><td>

[findNeighborCoordinate(board, coordinate, predicate)](./hive-lib.findneighborcoordinate.md)


</td><td>

Find the first neighboring hex coordinate for which a predicate holds true.


</td></tr>
<tr><td>

[findTileCoordinates(board, tileId)](./hive-lib.findtilecoordinates.md)


</td><td>

Find the locations of a tile.


</td></tr>
<tr><td>

[gameBoard(moves, upTo)](./hive-lib.gameboard.md)


</td><td>

Generate a game board from a sequence of moves, optionally up to but not including a certain move index.


</td></tr>
<tr><td>

[gameNotation(moves)](./hive-lib.gamenotation.md)


</td><td>

Generate a game notation string from an array of [Move](./hive-lib.move.md)<!-- -->s.


</td></tr>
<tr><td>

[getNextMoveColor(moves)](./hive-lib.getnextmovecolor.md)


</td><td>

Get the player who plays next.


</td></tr>
<tr><td>

[getNumTiles(board, color, bug)](./hive-lib.getnumtiles.md)


</td><td>

Get the total number of tiles on the board, optionally of a specified color and/or bug.


</td></tr>
<tr><td>

[getOccupiedCoordinates(board)](./hive-lib.getoccupiedcoordinates.md)


</td><td>

Get an array of all occupied hex coordinates on a game board.


</td></tr>
<tr><td>

[getOccupiedNeighbors(board, coordinate)](./hive-lib.getoccupiedneighbors.md)


</td><td>

Get an array of all occupied hex coordinates that are neighboring a given coordinate.


</td></tr>
<tr><td>

[getStack(board, coordinate)](./hive-lib.getstack.md)


</td><td>

Get the stack of tiles located at the given hex coordinate.


</td></tr>
<tr><td>

[getStackHeight(board, coordinate)](./hive-lib.getstackheight.md)


</td><td>

Get the height of the stack located at the given hex coordinate.


</td></tr>
<tr><td>

[getStacks(board, sortForRender)](./hive-lib.getstacks.md)


</td><td>

Get an array of all stacks on a board, optionally sorting for rendering.


</td></tr>
<tr><td>

[getTileAt(board, coordinate)](./hive-lib.gettileat.md)


</td><td>

Get the tile on top of the stack at the given coordinate.


</td></tr>
<tr><td>

[getTileBug(tileId)](./hive-lib.gettilebug.md)


</td><td>

Get the bug id from a tile id.


</td></tr>
<tr><td>

[getTileColor(tileId)](./hive-lib.gettilecolor.md)


</td><td>

Get the color of a tile.


</td></tr>
<tr><td>

[getTilesOnBoard(board)](./hive-lib.gettilesonboard.md)


</td><td>

Get an array of all tiles on a game board.


</td></tr>
<tr><td>

[getUnoccupiedCoordinates(board)](./hive-lib.getunoccupiedcoordinates.md)


</td><td>

Get an array of the unoccupied coordinates touching the hive.


</td></tr>
<tr><td>

[hexCoordinateKey(coordinate)](./hive-lib.hexcoordinatekey.md)


</td><td>

Generate a unique string for a hex coordinate. This function will always generate the same string for a given coordinate.


</td></tr>
<tr><td>

[hexesAreNeighbors(a, b)](./hive-lib.hexesareneighbors.md)


</td><td>

Determine if two hex coordinates are adjacent.


</td></tr>
<tr><td>

[hexesEqual(a, b)](./hive-lib.hexesequal.md)


</td><td>

Determine if two hex coordinates are equivalent.


</td></tr>
<tr><td>

[hexHeight(hexSize)](./hive-lib.hexheight.md)


</td><td>

Get the height of a hexagon given its size.

Refer to \[Red Blob Games\](https://www.redblobgames.com/grids/hexagons/\#size-and-spacing) for definition of hexagon size.


</td></tr>
<tr><td>

[hexPath(size, rounding, precision)](./hive-lib.hexpath.md)


</td><td>

Generate a SVG path data string that represents a hexagon.


</td></tr>
<tr><td>

[hexToCartesian(coordinate, size, orientation)](./hive-lib.hextocartesian.md)


</td><td>

Convert a hex coordinate to a cartesian coordinate.


</td></tr>
<tr><td>

[hexToTransform(coordinate, size, orientation)](./hive-lib.hextotransform.md)


</td><td>

Create an SVG transform string that can be used to translate to the center of a given hex coordinate.


</td></tr>
<tr><td>

[hexWidth(hexSize)](./hive-lib.hexwidth.md)


</td><td>

Get the width of a hexagon given its size.

Refer to \[Red Blob Games\](https://www.redblobgames.com/grids/hexagons/\#size-and-spacing) for definition of hexagon size.


</td></tr>
<tr><td>

[includesHex(hexes, hex)](./hive-lib.includeshex.md)


</td><td>

Determine if an array of hex coordinates includes a specific coordinate.


</td></tr>
<tr><td>

[isBoardEmpty(board)](./hive-lib.isboardempty.md)


</td><td>

Determine if a game board is empty.


</td></tr>
<tr><td>

[isCoordinateOccupied(board, coordinate)](./hive-lib.iscoordinateoccupied.md)


</td><td>

Determine if there is at least one tile at the given coordinate.


</td></tr>
<tr><td>

[isGated(board, coordinate, direction)](./hive-lib.isgated.md)


</td><td>

Determine if there is a gate blocking movement (sliding, climbing, or dropping) of the tile at the given coordinate in the given direction.


</td></tr>
<tr><td>

[isMoveMovement(move)](./hive-lib.ismovemovement.md)


</td><td>

Determine if a move is a tile movement.


</td></tr>
<tr><td>

[isMovePass(move)](./hive-lib.ismovepass.md)


</td><td>

Determine if a move is a passing move.


</td></tr>
<tr><td>

[isMovePlacement(move)](./hive-lib.ismoveplacement.md)


</td><td>

Determine if a move is a tile placement.


</td></tr>
<tr><td>

[isOwnTile(tileId, player)](./hive-lib.isowntile.md)


</td><td>

Determine if a tile belongs to a player.


</td></tr>
<tr><td>

[moveBreaksHive(board, coordinate)](./hive-lib.movebreakshive.md)


</td><td>

Determine if moving the topmost tile from the given coordinate would break the hive.


</td></tr>
<tr><td>

[movementNotation(from, to)](./hive-lib.movementnotation.md)


</td><td>

Generate a tile movement notation string.


</td></tr>
<tr><td>

[moveTile(board, from, to)](./hive-lib.movetile.md)


</td><td>

Move a tile on a board to a new location.


</td></tr>
<tr><td>

[parseBoardNotation(notation)](./hive-lib.parseboardnotation.md)


</td><td>

Generate a [GameBoard](./hive-lib.gameboard.md) from a board notation string.


</td></tr>
<tr><td>

[parseGameNotation(notation)](./hive-lib.parsegamenotation.md)


</td><td>

Generate an ordered array of [Move](./hive-lib.move.md) objects from a game notation string.


</td></tr>
<tr><td>

[parseHexCoordinateKey(coordinateKey)](./hive-lib.parsehexcoordinatekey.md)


</td><td>

Convert a hex coordinate into a hex coordinate.


</td></tr>
<tr><td>

[passNotation()](./hive-lib.passnotation.md)


</td><td>

Generate a passing move notation string.


</td></tr>
<tr><td>

[placementNotation(tileId, coordinate)](./hive-lib.placementnotation.md)


</td><td>

Generate a tile placement notation string.


</td></tr>
<tr><td>

[placeTile(board, tileId, coordinate)](./hive-lib.placetile.md)


</td><td>

Place a tile on a board.


</td></tr>
<tr><td>

[placeTile(tileId, coordinate)](./hive-lib.placetile_1.md)


</td><td>

Create a function that places a tile on a board.


</td></tr>
<tr><td>

[popTile(board, coordinate)](./hive-lib.poptile.md)


</td><td>

Remove a tile from a board.


</td></tr>
<tr><td>

[popTile(coordinate)](./hive-lib.poptile_1.md)


</td><td>

Create a function that removes a tile from a board.


</td></tr>
<tr><td>

[relativeHexCoordinate(coordinate, direction)](./hive-lib.relativehexcoordinate.md)


</td><td>

Get the hex coordinate in one of the six directions relative to the given base coordinate, or on top of that coordinate.


</td></tr>
<tr><td>

[relativeHexDirection(source, target)](./hive-lib.relativehexdirection.md)


</td><td>

Get the hex direction pointing from source to target.


</td></tr>
<tr><td>

[renderSort(stacks)](./hive-lib.rendersort.md)


</td><td>

Sort stacks of tiles so that they are ordered from back to front, shortest to tallest.


</td></tr>
<tr><td>

[someNeighboringCoordinate(board, coordinate, iteratee)](./hive-lib.someneighboringcoordinate.md)


</td><td>

Determine if there is some coordinate neighboring the given coordinate for which the given predicate holds true.


</td></tr>
<tr><td>

[stacksInHand(board, color, config)](./hive-lib.stacksinhand.md)


</td><td>

Get a list of tiles that a player has in their hand, grouped by bug type.


</td></tr>
<tr><td>

[tile(color, bugId)](./hive-lib.tile.md)


</td><td>

Create a tile id.


</td></tr>
<tr><td>

[tilesInHand(board, color, config)](./hive-lib.tilesinhand.md)


</td><td>

Get a list of tiles that a player has in their hand.


</td></tr>
<tr><td>

[toHexDirection(number)](./hive-lib.tohexdirection.md)


</td><td>

Convert a number to a hex direction.


</td></tr>
<tr><td>

[validAntMoves(board, coordinate)](./hive-lib.validantmoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as an ant.


</td></tr>
<tr><td>

[validBeetleMoves(board, coordinate)](./hive-lib.validbeetlemoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a beetle.


</td></tr>
<tr><td>

[validGrasshopperMoves(board, coordinate)](./hive-lib.validgrasshoppermoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a grasshopper.


</td></tr>
<tr><td>

[validLadybugMoves(board, coordinate)](./hive-lib.validladybugmoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a ladybug.


</td></tr>
<tr><td>

[validMosquitoMoves(board, coordinate)](./hive-lib.validmosquitomoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a mosquito.


</td></tr>
<tr><td>

[validMoves(gameOrBoard, color, coordinate)](./hive-lib.validmoves.md)


</td><td>

Get an array of valid moves for the specified color player moving the top tile at the specified coordiante.


</td></tr>
<tr><td>

[validPillbugMoves(board, coordinate)](./hive-lib.validpillbugmoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a pillbug.


</td></tr>
<tr><td>

[validPillbugPushes(board, target, pillbug)](./hive-lib.validpillbugpushes.md)


</td><td>

Get all valid moves for the tile at the given coordinate being moved by an adjacent pillbug.


</td></tr>
<tr><td>

[validQueenMoves(board, coordinate)](./hive-lib.validqueenmoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a queen.


</td></tr>
<tr><td>

[validSpiderMoves(board, coordinate)](./hive-lib.validspidermoves.md)


</td><td>

Get all valid moves for the tile at the given coordinate acting as a spider.


</td></tr>
<tr><td>

[walkBoard(board, start, omit)](./hive-lib.walkboard.md)


</td><td>

Create a sequence of coordinates that represent walking the board, visiting each occupied coordinate exactly once.


</td></tr>
<tr><td>

[wasPillbugPush(color, move, board)](./hive-lib.waspillbugpush.md)


</td><td>

Determine if a move was a pillbug push.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[CartesianCoordinate](./hive-lib.cartesiancoordinate.md)


</td><td>

A coordinate in 2D space in a cartesian coordinate system.


</td></tr>
<tr><td>

[GameConfig](./hive-lib.gameconfig.md)


</td><td>

An object describing which play variants are being used in a game.


</td></tr>
<tr><td>

[HexCoordinate](./hive-lib.hexcoordinate.md)


</td><td>

A coordinate in 2D space in a hexagonal coordinate system.


</td></tr>
<tr><td>

[HexOrientation](./hive-lib.hexorientation.md)


</td><td>

An object that represents a hex orientation.


</td></tr>
<tr><td>

[HexStack](./hive-lib.hexstack.md)


</td><td>

A stack of tile ids associated with a hex coordinate.


</td></tr>
</tbody></table>

## Variables

<table><thead><tr><th>

Variable


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[BASE\_GAME\_TOURNAMENT](./hive-lib.base_game_tournament.md)


</td><td>

The base game configuration with the tournament opening rule.


</td></tr>
<tr><td>

[BASE\_GAME](./hive-lib.base_game.md)


</td><td>

The base game configuration.


</td></tr>
<tr><td>

[FLAT\_TOP](./hive-lib.flat_top.md)


</td><td>

The flat-top hex orientation.


</td></tr>
<tr><td>

[POINTY\_TOP](./hive-lib.pointy_top.md)


</td><td>

The pointy-top hex orientation.


</td></tr>
</tbody></table>

## Type Aliases

<table><thead><tr><th>

Type Alias


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[BugId](./hive-lib.bugid.md)


</td><td>

A character that represents a bug type. - A: Ant - B: Beetle - G: Grasshopper - L: Ladybug - M: Mosquito - P: Pillbug - Q: Queen - S: Spider - X: Blank


</td></tr>
<tr><td>

[Color](./hive-lib.color.md)


</td><td>

A character representing a hive player color.


</td></tr>
<tr><td>

[DirectionFn](./hive-lib.directionfn.md)


</td><td>

A function invoked with a hex direction parameter.


</td></tr>
<tr><td>

[Game](./hive-lib.game.md)


</td><td>

An object that contains a game's settings, history, and state.


</td></tr>
<tr><td>

[GameBoard](./hive-lib.gameboard.md)


</td><td>

A map of hex coordinates to tile stacks.


</td></tr>
<tr><td>

[Move](./hive-lib.move.md)


</td><td>

An object describing a player's move, which can be a tile placement, tile movement, or pass.


</td></tr>
<tr><td>

[NeighborFn](./hive-lib.neighborfn.md)


</td><td>

A function typically invoked for a coordinates's neighbors, where neighbor and stack refer to some coordinate's neighboring coordinate and stack, and direction refers to the relative direction of the neighbor from the original coordinate.


</td></tr>
<tr><td>

[Pass](./hive-lib.pass.md)


</td><td>

An object describing a passing move.


</td></tr>
<tr><td>

[StackFn](./hive-lib.stackfn.md)


</td><td>

A function invoked with a hex coordinate and a tile stack.


</td></tr>
<tr><td>

[TileId](./hive-lib.tileid.md)


</td><td>

A string that represents a specific colored bug tile.


</td></tr>
<tr><td>

[TileMovement](./hive-lib.tilemovement.md)


</td><td>

An object describing a tile movement.


</td></tr>
<tr><td>

[TilePlacement](./hive-lib.tileplacement.md)


</td><td>

An object describing a tile placement.


</td></tr>
</tbody></table>