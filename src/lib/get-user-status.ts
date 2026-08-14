import { isUserBanned } from "./is-user-banned";
import { isUserVerified } from "./is-user-verified";
import { isUserConfirmed } from "./is-user-confirmed";

export async function getUserStatus() {
  const banned =
    await isUserBanned();

  if (banned) {
    return "BANNED";
  }

  const confirmed =
    await isUserConfirmed();

  if (!confirmed) {
    return "UNCONFIRMED";
  }

  const verified =
    await isUserVerified();

  if (!verified) {
    return "UNVERIFIED";
  }

  return "ACTIVE";
}