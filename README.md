This is a repository that contains the code for Conway's Game Of Life Kata. 

It's been programmed using Typescript. 
It has been implemented using TDD and applying Clean Code and SOLID principles. Tests go first, they fail and then the code is implemented according to those tests. 
State transitions live in an injectable Rules object, not inside the state classes. The default implementation composes concrete polymorphic Rule classes (`SurvivalRule`, `DeathRule`, `BirthRule`, `StasisRule`, `ToggleRule`) through `RuleBasedRules`. A data-driven `TableRules`/`RuleTable` implementation is also available: states are passive value objects, so adding a new state only requires defining it and registering its rule in the table — Cell, AliveState and DeadState stay untouched (Open/Closed Principle).