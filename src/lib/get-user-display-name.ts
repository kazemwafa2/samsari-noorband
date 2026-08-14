import { getUserMetadata } from "./get-user-metadata";

export async function getUserDisplayName() {
  const metadata =
    await getUserMetadata();

  if (!metadata) {
    return null;
  }

  return (
    metadata.display_name ??
    metadata.full_name ??
    metadata.name ??
    null
  );
}