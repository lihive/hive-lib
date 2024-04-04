<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [hive-lib](./hive-lib.md) &gt; [walkBoard](./hive-lib.walkboard.md)

## walkBoard() function

Create a sequence of coordinates that represent walking the board, visiting each occupied coordinate exactly once.

**Signature:**

```typescript
export declare function walkBoard(board: GameBoard, start: HexCoordinate, omit?: HexCoordinate): HexCoordinate[];
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

board


</td><td>

[GameBoard](./hive-lib.gameboard.md)


</td><td>

The game board.


</td></tr>
<tr><td>

start


</td><td>

[HexCoordinate](./hive-lib.hexcoordinate.md)


</td><td>

The starting coordinate.


</td></tr>
<tr><td>

omit


</td><td>

[HexCoordinate](./hive-lib.hexcoordinate.md)


</td><td>

_(Optional)_ A coordinate to treat as empty.


</td></tr>
</tbody></table>
**Returns:**

[HexCoordinate](./hive-lib.hexcoordinate.md)<!-- -->\[\]

The sequence of visited hex coordinates.

## Remarks

This function will visit every stack on the board by beginning at the provided starting coordinate and recursively choosing an unvisited neighbor to visit. Each occupied coordinate will be visited exactly once assuming that the hive is not broken. If the `omit` coordinate is specified, that coordinate will be treated as unoccupied; this is useful for determining whether moving a tile breaks the one-hive rule.
