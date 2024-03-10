# hive-lib

# Hive Game Notation

TODO: https://entomology.gitlab.io/notation.html 

1. wQ, bQ \wQ 2. wB1 wQ-, bB1 -bQ 3. wB1 -wB1, bB1 \wB1 4. wB1 \wB1, x 5. wS1 wQ/, x 6. wA1 \wS1, x 7. wA2 -wA1, x 8. wG1 /wA2, x 9. wS2 /wB1#

# Coordinate Hive Game Notation
- Faster to build a game board because reference tiles do not need to be located and parsing is dead simple.
- Reversible? Given assembled game board can generate previous game board state from last move.
- Does not require numbered bugs

(0,0)[wQ];(0,1)[bQ];(1,0)[wB];(-1,1)[bB];(1,0)(0,0)

# Compact Hive Game Notation

Q;Q\wQ;B1wQ-;B1-bQ;-B1;B1-;\B1;x

- Individual moves are separated by semicolons
- The color of the tile being moved can be omitted if it is the player's own tile
- Moves to place a tile on the board require a reference tile (except the first move)
- Bug types have the following individual notation rules:

**Queen Bee**, **Beetle**, **Grasshopper**, **Spider**, **Pillbug**

Once placed on the board, only a direction marker is required to indicate a
tiles's move direction, e.g:

- `-Q` queen moves left
- `B2/` beetle 2 moves up+right
- `bA3-` black ant 3 moves right
- `-G1` grasshopper 1 jumps to the left
- `\S2` spider 2 moves up+left and continues two more moves around the hive

**Ant**, **Mosquito**, **Ladybug**

Uses normal notation

**Pillbug**

When moving other tiles, uses normal notation

