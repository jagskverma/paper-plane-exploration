# Phase 5.5 — Playtest Checklist

> Run time: ~5-10 minutes  
> Controls: Arrow keys (Up=pitch up, Down=pitch down, Left/Right=bank)  
> HUD: top-left shows alt (AGL), speed, bank, pitch, position  

## Pre-flight

- [ ] Game loads without errors (check browser console)
- [ ] HUD visible top-left
- [ ] Paper plane model visible, centered on screen
- [ ] Camera behind the plane, looking forward
- [ ] Terrain visible below (colored cube-sphere with hills)

## Flight Feel

### Neutral Flight (no keys pressed)
- [ ] Plane auto-flies forward at ~7.5 speed
- [ ] Altitude holds steady at ~12m AGL (not sinking or climbing)
- [ ] Expected HUD: `alt: 10-14m | spd: 7-8`

### Pitch Up (hold Up Arrow)
- [ ] Nose tilts upward
- [ ] Plane climbs (altitude increases)
- [ ] Speed decreases slightly
- [ ] Expected HUD: `alt: rising | spd: 4-6`

### Pitch Down (hold Down Arrow)
- [ ] Nose tilts downward
- [ ] Plane descends (altitude decreases)
- [ ] Speed increases
- [ ] Expected HUD: `alt: dropping | spd: 10-12`

### Bank Left (hold Left Arrow)
- [ ] Plane rolls left (visual roll around forward axis)
- [ ] Plane turns left (heading changes)
- [ ] Altitude stays roughly stable during turn
- [ ] Release key: plane returns to level

### Bank Right (hold Right Arrow)
- [ ] Plane rolls right
- [ ] Plane turns right
- [ ] Altitude stays stable
- [ ] Release key: plane returns to level

## Terrain Objects

### Fly Between Trees (hold forward, steer toward tree pair ahead)
- [ ] At least two trees visible ahead on the terrain
- [ ] Can steer between them without collision
- [ ] Plane passes between tree canopies

### Fly Near Rocks/Bushes
- [ ] Rocks/bushes visible on terrain surface
- [ ] Can fly over them without collision (they're below 12m AGL)

### Collision Test (deliberately fly into a tree)
- [ ] Plane bumps off the tree (pushed away)
- [ ] Speed drops noticeably on collision
- [ ] Plane does NOT fly through the tree
- [ ] No crashes or errors in console

## Camera

- [ ] Camera follows plane smoothly
- [ ] Can see the plane and terrain ahead simultaneously
- [ ] Paper plane model is clearly a plane, not an indistinct shape
- [ ] Horizon feels natural (not disorienting)

## Scale & Feel

### The "Paper Plane" Test
- [ ] Does it feel like flying a paper plane close to the ground?
- [ ] Or does it feel like an aircraft cruising high above terrain?
- [ ] Objects appear appropriately sized relative to the plane

## Gate Criteria for Phase 6/7

All items below must pass:

- [ ] Neutral flight holds altitude (no sink)
- [ ] All four control directions work correctly
- [ ] Collision with trees works (no fly-through)
- [ ] Camera is readable (can see plane + terrain)
- [ ] "Paper plane feel" is acceptable (close to ground, objects feel large)

**Gate result: PASS / FAIL**  
If FAIL, note which items failed:

---
