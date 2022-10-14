--- re-state the problem ---

Santa delivers presents in a building, the floor to which the present is delivered
is given by a set of instructions. Instructions are build out of closing [)] and opening
parentheses [(].

An openening parenthesis means Santa needs to go up one floor.
A closing parenthesis means Santa needs to go down one floor.

As the building is very tall, and basemenet very deep. Santa will never reach the top
or the bottom of it.

Given some instructions, and said Santa stars at floor 0, to which floor Santa needsto
deliver the presensts?

-- inputs --
set of instructions to determine building delivery floor number

-- outputs --
building floor number to which Santa should deliver the presents

-- labeling pieces --

1. set of instructions to determine building delivery floor number (input)    - santaInstructions
2. building floor number to which Santa should deliver the presents (output)  - targetFloor

-- concrete examples --

1. valid inputs

`(` results in floor `1`
`(((` results in floor `3`
`()))` results in floor `-2`

2. invalid inputs

none strings
characters different than opening and clonsing parenthesis
empty input

-- speudocode --

check if input is a string
  if not log an error and return
declare a counter to determine building floor number
loop through `santaInstructions`
  add one to counter if is an opening parenthesis
  remove one to counter if is a closing parenthesis
return floor number

