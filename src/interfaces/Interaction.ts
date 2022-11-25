import { discordeno } from "@deps";
/** The interaction arguments.
 * Important the members `deaf` and `mute` properties will always be false.
 */
export type InteractionCommandArgs = Record<
  string,
  | discordeno.Member
  | discordeno.Role
  | Record<
    string,
    Pick<discordeno.Channel, "id" | "name" | "type" | "permissions">
  >
  | boolean
  | string
  | number
>;
