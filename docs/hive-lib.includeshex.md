<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [hive-lib](./hive-lib.md) &gt; [includesHex](./hive-lib.includeshex.md)

## includesHex() function

Determine if an array of hex coordinates includes a specific coordinate.

**Signature:**

```typescript
export declare function includesHex(hexes: HexCoordinate[], hex: HexCoordinate): boolean;
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

hexes


</td><td>

[HexCoordinate](./hive-lib.hexcoordinate.md)<!-- -->\[\]


</td><td>

An array of hex coordinates.


</td></tr>
<tr><td>

hex


</td><td>

[HexCoordinate](./hive-lib.hexcoordinate.md)


</td><td>

The hex coordinate to search for.


</td></tr>
</tbody></table>
**Returns:**

boolean

true if hex is in the array hexes, false otherwise.
