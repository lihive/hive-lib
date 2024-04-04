<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [hive-lib](./hive-lib.md) &gt; [boardNotation](./hive-lib.boardnotation.md)

## boardNotation() function

Generate a board notation string from a [GameBoard](./hive-lib.gameboard.md)<!-- -->.

**Signature:**

```typescript
export declare function boardNotation(board: GameBoard): string;
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
</tbody></table>
**Returns:**

string

A board notation string.

## Remarks

A game board notation string is a simple compressed string representation of the result of passing the board into `JSON.stringify`<!-- -->. The opening and closing brackets are replaced with URL-safe characters and tiles are assumed to be white unless explicitly noted as black. Finally, extraneous characters are omitted and a simple change to the first and last characters of the string are made to simplify parsing. Note that board notation is not intended to be human-readable; rather, it's optimized for size and potential use in a URL.
