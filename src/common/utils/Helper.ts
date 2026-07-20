import { Types } from "mongoose";
import { findById } from "../../modules/user/user.repository";

export async function getTaskReceivers(
  assignedTo: Types.ObjectId,
): Promise<string[]> {
  const receivers = new Set<string>();
    console.log(assignedTo)
  let current = await findById(assignedTo?.toString());

    console.log("current._id:", current?._id);
    console.log("reportsTo:", current?.reportsTo);
    console.log("typeof reportsTo:", typeof current?.reportsTo);

  while (current) {
    receivers.add(current._id.toString());

    if (!current.reportsTo) {
      break;
    }
    const reportsToId = getObjectId(current.reportsTo);

    if (!reportsToId) {
      break;
    }

    console.log("current._id:", current._id);
    console.log("reportsTo:", current.reportsTo);
    console.log("typeof reportsTo:", typeof current.reportsTo);

    current = await findById(current?.reportsTo?.toString());
  }

  return [...receivers];
}


function getObjectId(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Types.ObjectId) {
    return value.toString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && "_id" in value && value._id) {
    return value._id.toString();
  }

  return null;
}
