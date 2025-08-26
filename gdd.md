# Game Design Document: Puzzle Escape

## High-Level Concept

Climb a pit filling with falling blocks while managing stamina. Wait too long, and you’ll be buried or drowned. Spend too much, and you
risk exhaustion and being crushed. Escape before the rising water reaches you.

## Core Gameplay Loop

Blocks fall into the pit at timed intervals.

Player climbs, jumps, or pushes blocks to ascend.

Player manages stamina: actions like jumping, climbing, or pushing consume stamina.

Water rises continuously from the bottom of the pit.

Player loses if crushed, trapped, or drowned.

Player wins by reaching the top exit of the pit.

## Player Mechanics

Movement: left/right, jump, climb, push blocks.

Stamina:

Max = 100 units.

Jump = 15 units.

Push block = 25 units.

Climb = 20 units/sec while holding.

Regeneration: +10 units/sec when idle.

Exhaustion:

Stamina ≤ 0 → player cannot jump, push, or climb until partially regenerated.

Blocks Type Behavior Normal Standard platform, can push. Heavy Cannot push, forces alternate routes. Hazard Spikes/instant-death if
touched. Ladder/Rope (optional) Rare, allows faster climb.

Blocks spawn at regular intervals from the top.

Interval and speed increase with level progression.

### Hazards

Rising Water: steadily moves upward. Touching it = instant death.

Crush: block falling on player = instant death.

| Stage | Block Speed | Spawn Interval | Pit Height | Water Rise        | Notes                                 |
| ----- | ----------- | -------------- | ---------- | ----------------- | ------------------------------------- |
| 1     | Slow        | 3 sec          | 20 blocks  | 1 block/5 sec     | Tutorial level, teach stamina         |
| 2     | Medium      | 2.5 sec        | 25 blocks  | 1 block/4 sec     | Introduce awkward shapes              |
| 3     | Fast        | 2 sec          | 30 blocks  | 1 block/3 sec     | Heavy/hazard blocks added             |
| 4+    | Very Fast   | 1.5–2 sec      | 35+ blocks | 1 block/2–2.5 sec | All hazards, minimal mistakes allowed |

## Camera & Visuals

Camera pans up as the player climbs higher.

Water visible rising from bottom to reinforce tension.

Stamina bar visible near player or in HUD.

Optional: block squish/stretch, particles, and sound effects for impact.

## Win Condition

Reach the top lip of the pit before the water overtakes you.

Optional exit animation or splash for cinematic finish.

Lose Conditions

Crushed by a falling block.

Trapped in a sealed area with no climbable space.

Drowned by rising water.

## Controls

Left / Right → Move

Jump → Jump (stamina cost)

Climb → Hold against wall (stamina drain)

Push block → Interact with adjacent block (stamina cost)

## Audio / Feedback

Falling block sound on landing.

Stamina low warning (visual + audio).

Water rise sound cue for urgency.

Victory and failure cues.

## Scope for 1-Week Jam

Single pit with ~6 progressive levels.

Core mechanics: movement, falling blocks, stamina, rising water.

Optional polish: simple particle effects, block variety, and sound.
