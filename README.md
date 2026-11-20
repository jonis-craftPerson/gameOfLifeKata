This is a repository that contains the code for Conway's Game Of Life Kata. 

It's been programmed using Typescript. 
It has been implemented using TDD and applying Clean Code and SOLID principles. Tests go first, they fail and then the code is implemented according to those tests. 
State transitions live in an injectable Rules object, not inside the state classes. The default implementation composes concrete polymorphic Rule classes (`SurvivalRule`, `DeathRule`, `BirthRule`, `StasisRule`, `ToggleRule`) through `RuleBasedRules`. A data-driven `TableRules`/`RuleTable` implementation is also available: states are passive value objects, so adding a new state only requires defining it and registering its rule in the table — Cell, AliveState and DeadState stay untouched (Open/Closed Principle).

## Reflection

I did this kata with Opencode
After applying the last changes I'm suprised at how much did the AI change the code and how atomized every class, constant interface and state is. There are somethings that make sense, like separating the state of a cell from the class to decouple it and make it open to changes or hardcode the values by which a cell surveives or dies but right now I'm a the point in which is hard for me to follow the code.  

I want to keep that in mind while I learn, and keep asking whether the design is helping or just adding indirection.


The good part is that the test look great and cover more cases than I would have thought of. 