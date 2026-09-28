import { DEFAULT_ROOM, userRoom } from '../config/constants.js';

const DM_PATTERN = /^dm:([a-f\d]{24}):([a-f\d]{24})$/;

// Sorted ids, so both users always get the same room id
export function dmRoom(userA, userB) {
  return `dm:${[userA, userB].sort().join(':')}`;
}

export function getDmMembers(room) {
  const match = DM_PATTERN.exec(room);
  return match ? [match[1], match[2]] : null;
}

export function canAccessRoom(room, userId) {
  if (room === DEFAULT_ROOM) return true;

  const members = getDmMembers(room);
  return Boolean(
    members &&
      members[0] !== members[1] &&
      members.includes(userId) &&
      dmRoom(...members) === room,
  );
}

// Socket rooms that should receive events for a conversation
export function roomTargets(room) {
  const members = getDmMembers(room);
  return members ? members.map(userRoom) : [room];
}
