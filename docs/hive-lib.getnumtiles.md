<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [hive-lib](./hive-lib.md) &gt; [getNumTiles](./hive-lib.getnumtiles.md)

## getNumTiles() function

Get the total number of tiles on the board, optionally of a specified color and/or bug.

**Signature:**

```typescript
export declare function getNumTiles(board: GameBoard, color?: Color, bug?: BugId): number;
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

A game board.


</td></tr>
<tr><td>

color


</td><td>

[Color](./hive-lib.color.md)


</td><td>

_(Optional)_ The color tile to count.


</td></tr>
<tr><td>

bug


</td><td>

[BugId](./hive-lib.bugid.md)


</td><td>

_(Optional)_ The bug type to count.


</td></tr>
</tbody></table>
**Returns:**

number

The number of total tiles on the board if no color or bug was provided, otherwise the number of tiles of the given color/bug.
