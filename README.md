This is a repository that contains the code for Conway's Game Of Life Kata. 

It's been programmed using Typescript. 
It has been implemented using TDD and applying Clean Code and SOLID principles. Tests go first, they fail and then the code is implemented accoidng to those tests. 
State transitions live in an injectable Rules object backed by a RuleTable, not inside the state classes. States are passive value objects, so adding a new state only requires defining it and registering its rule in the table — Cell, AliveState and DeadState stay untouched (Open/Closed Principle).