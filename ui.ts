import {yellow} from "./dep.ts";

export const help = `run without params:
- to work in interactive mode

run with params:
ls - to show list of tasks

add "task"   - to add task
done index   - to check task as done
undone index - to check task as undone
remove index - to remove task`;

export const toolbar = `${yellow('d')}one ${yellow('a')}dd ${yellow('e')}dit ${yellow('r')}emove`;
