import { UserRole } from "@/common";
import { CreateUserDto } from "@/modules/user/dto/createUser.dto";
import { UpdateUserDto } from "@/modules/user/dto/updateUser.dto";
import { User, UserDocument, UserModel } from "@/modules/user/user.model";
import { Types } from "mongoose";


  export async function create(user: CreateUserDto): Promise<UserDocument> {
    return UserModel.create(user);
  }

  export async function findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  export async function findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).select("+password").exec();
  }

  export async function findByUsername(username: string): Promise<UserDocument | null> {
    return UserModel.findOne({ username }).exec();
  }

  export async function findAll(): Promise<UserDocument[]> {
  return UserModel.find({
    role: { $ne: UserRole.SUPER_ADMIN },
  }).exec();
}
  export async function findManagers(): Promise<UserDocument[]> {
    return UserModel.find({role:UserRole.MANAGER}).exec();
  }


  export async function updateById(
    id: string,
    data: UpdateUserDto
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  export async function findByIdWithPassword(
  id: string
): Promise<UserDocument | null> {
  return UserModel.findById(id)
    .select("+password")
    .exec();
}

  export async function deleteById(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  export async function emailExists(email: string): Promise<boolean> {
    return (await UserModel.exists({ email })) !== null;
  }

  export async function usernameExists(username: string): Promise<boolean> {
    return (await UserModel.exists({ username })) !== null;
  }

  export async function findByReportsTo(
  reportsTo: string
  ): Promise<User[]> {
  return UserModel.aggregate([
    {
      $match: {
        reportsTo: new Types.ObjectId(reportsTo),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "reportsTo",
        as: "teamMembers",
      },
    },
  ]);
}
