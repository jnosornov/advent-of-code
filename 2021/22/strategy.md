--- re-state the problem ---

Due to the extreme ocean depths submarine's reactor has overheated
so it needs to be rebooted.

The reactor's core is built out of a 3d grid made of cubes. Each cube
represented by an x, y, z coordinate. Cubes have either an on or off
state.

Cubes are off at the start of the reboot process.
To reboot the reactor the cubes needs to be set to on or off based on
a series of instructions (the puzzle input). Each instruction (step)
specifies a cuboid (a set of cubes) and a desired state (on or off) for
each of those cubes.

The reboot process finishes once all steps have been performed.
How many cubes are on after the reboot process?

-- inputs --
reactor's reboot instructions

-- outputs --
the amount of reactor's cubes on

-- labeling pieces --
1. reboot process steps - rebootStages
2. reboot process step - rebootStage
3. reboot stage status - status
4. reboot stage cuboid - cuboid
5. cuboid cubes - cuboidCubes
6. reactor cubes on list - cubesOnList
7. current reactor reboot stage - rebootStageCounter

-- concrete examples --

1. valid input

```
on x=10..12,y=10..12,z=10..12
on x=11..13,y=11..13,z=11..13
off x=9..11,y=9..11,z=9..11
on x=10..10,y=10..10,z=10..10
```

2. invalid input

- malformed stage
- no input

-- speudocode --
define reboot stage counter to cero
define list of cubes on

execute reboot stage
  increment reboot stage counter in one
  if reboot stage counter greater than the number of reboot stages  // stop condition
    return
  if not
    if is first stage and reboot stage status is off
      return execute reboot stage
    list reboot stage cuboid cubes
    if reboot stage status on
      include non-overlaping cubes in the list of cubes on
    if reboot stage status off
      remove overlaping cubes from list of cubes on
    return execute reboot stage
count the number of cubes on