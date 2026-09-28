export const GENERAL_ROOM = 'general';

// Must match the server: sorted ids so both users get the same room
export function dmRoomId(userA, userB) {
  return `dm:${[userA, userB].sort().join(':')}`;
}
