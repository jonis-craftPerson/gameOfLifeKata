import { BirthRule } from './birth-rule';
import { DeathRule } from './death-rule';
import { SURVIVAL_NEIGHBORS } from './neighbor-counts';
import { Rule } from './rule.interface';
import { RuleBasedRules } from './rule-based-rules';
import { RuleTable, Rules } from './rules.interface';
import { stateRule, TableRules } from './rules';
import { StasisRule } from './stasis-rule';
import { AliveState, CellStateList, DeadState } from './state.interface';
import { SurvivalRule } from './survival-rule';
import { ToggleRule } from './toggle-rule';

export const STANDARD_RULE_TABLE: RuleTable = {
  [CellStateList.Alive]: stateRule(
    CellStateList.Alive,
    () => new AliveState(),
    SURVIVAL_NEIGHBORS,
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

export const STANDARD_RULES: readonly Rule[] = [
  new SurvivalRule(),
  new DeathRule(),
  new BirthRule(),
  new StasisRule(),
  new ToggleRule(),
];

export const standardRules: Rules = new RuleBasedRules(STANDARD_RULES);
