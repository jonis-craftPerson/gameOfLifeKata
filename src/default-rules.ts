import { RuleTable, Rules } from './rules.interface';
import { stateRule, TableRules } from './rules';
import { AliveState, CellStateList, DeadState } from './state.interface';

export const STANDARD_RULE_TABLE: RuleTable = {
  [CellStateList.Alive]: stateRule(
    CellStateList.Alive,
    () => new AliveState(),
    [2, 3],
    CellStateList.Dead,
    CellStateList.Dead
  ),
  [CellStateList.Dead]: stateRule(
    CellStateList.Dead,
    () => new DeadState(),
    [0, 1, 4, 5, 6, 7, 8],
    CellStateList.Alive,
    CellStateList.Alive
  ),
};

export const standardRules: Rules = new TableRules(STANDARD_RULE_TABLE);
