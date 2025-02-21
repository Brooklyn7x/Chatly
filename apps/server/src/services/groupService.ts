import { ConversationModel } from "../models/conversation";
import { ServiceResponse } from "../types/service-respone";
import { ConversationType, ParticipantRole } from "../types/conversation";
import mongoose from "mongoose";
import { Logger } from "../utils/logger";

export class GroupService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }
  async createGroup(
    creatorId: string,
    name: string,
    participantIds: string[],
    metadata?: any
  ): Promise<ServiceResponse<any>> {
    try {
      if (!name || name.trim().length < 3) {
        return {
          success: false,
          error: "Group name must be at least 3 characters",
        };
      }

      const uniqueParticipants = [...new Set([creatorId, ...participantIds])];
      const existingGroup = await ConversationModel.findOne({
        type: ConversationType.GROUP,
        "participants.userId": {
          $all: uniqueParticipants.map((id) => new mongoose.Types.ObjectId(id)),
        },
        "metadata.title": name.trim(),
      });

      if (existingGroup) {
        return {
          success: false,
          error: "Group with same name and participants already exists",
        };
      }

      const newGroup = new ConversationModel({
        type: ConversationType.GROUP,
        participants: uniqueParticipants.map((id) => ({
          userId: new mongoose.Types.ObjectId(id),
          role:
            id === creatorId ? ParticipantRole.OWNER : ParticipantRole.MEMBER,
        })),
        metadata: {
          title: name.trim(),
          description: metadata?.description || "",
          avatar: metadata?.avatar || "",
          isArchived: false,
          isPinned: false,
          createdBy: new mongoose.Types.ObjectId(creatorId),
        },
      });

      await newGroup.save();

      return {
        success: true,
        data: {
          ...newGroup.toObject(),
          participants: newGroup.participants.map((p) => ({
            ...p,
            userId: p.userId.toString(),
          })),
        },
      };
    } catch (error) {
      this.logger.error("Error creating group:", error);
      return { success: false, error: "Failed to create group" };
    }
  }

  async updateGroupSettings(
    groupId: string,
    updates: {
      title?: string;
      description?: string;
      avatar?: string;
    },
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const group = await ConversationModel.findById(groupId);
      if (!group || group.type !== ConversationType.GROUP) {
        return { success: false, error: "Group not found" };
      }
      const participant = group.participants.find(
        (p) => p.userId.toString() === userId
      );

      if (
        !participant ||
        ![ParticipantRole.ADMIN, ParticipantRole.OWNER].includes(
          participant.role
        )
      ) {
        return {
          success: false,
          error: "Unauthorized to update group settings",
        };
      }

      const updatePayload: Record<string, any> = {};
      if (updates.title?.trim())
        updatePayload["metadata.title"] = updates.title.trim();
      if (updates.description !== undefined)
        updatePayload["metadata.description"] = updates.description;
      if (updates.avatar !== undefined)
        updatePayload["metadata.avatar"] = updates.avatar;

      const updatedGroup = await ConversationModel.findByIdAndUpdate(
        groupId,
        { $set: updatePayload },
        { new: true, runValidators: true }
      ).populate("participants.userId");

      if (!updatedGroup) {
        return { success: false, error: "Failed to update group" };
      }

      return {
        success: true,
        data: {
          ...updatedGroup.toObject(),
          participants: updatedGroup.participants.map((p) => ({
            userId: p.userId.toString(),
            role: p.role,
          })),
        },
      };
    } catch (error) {
      this.logger.error("Error updating group settings:", error);
      return { success: false, error: "Failed to update group settings" };
    }
  }

  async addMemberToGroup(
    groupId: string,
    userId: string,
    requesterId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const group = await ConversationModel.findById(groupId);
      if (!group || group.type !== ConversationType.GROUP) {
        return { success: false, error: "Group not found" };
      }

      const requester = group.participants.find(
        (p) => p.userId.toString() === requesterId
      );

      if (
        !requester ||
        ![ParticipantRole.ADMIN, ParticipantRole.OWNER].includes(requester.role)
      ) {
        return { success: false, error: "Unauthorized to add members" };
      }
      const userExists = group.participants.some(
        (p) => p.userId.toString() === userId
      );

      if (userExists) {
        return { success: false, error: "User already in group" };
      }

      const updatedGroup = await ConversationModel.findByIdAndUpdate(
        groupId,
        {
          $addToSet: {
            participants: {
              userId: new mongoose.Types.ObjectId(userId),
              role: ParticipantRole.MEMBER,
            },
          },
        },
        { new: true }
      );

      if (!updatedGroup) {
        return { success: false, error: "Failed to add member" };
      }

      return {
        success: true,
        data: {
          groupId,
          userId,
          role: ParticipantRole.MEMBER,
        },
      };
    } catch (error) {
      this.logger.error("Error adding member to group:", error);
      return { success: false, error: "Failed to add member to group" };
    }
  }

  async removeMemberFromGroup(
    groupId: string,
    userId: string,
    requesterId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const group = await ConversationModel.findById(groupId);
      if (!group || group.type !== ConversationType.GROUP) {
        return { success: false, error: "Group not found" };
      }
      const requester = group.participants.find(
        (p) => p.userId.toString() === requesterId
      );

      if (
        !requester ||
        ![ParticipantRole.ADMIN, ParticipantRole.OWNER].includes(requester.role)
      ) {
        return { success: false, error: "Unauthorized to remove members" };
      }
      const targetUser = group.participants.find(
        (p) => p.userId.toString() === userId
      );

      if (!targetUser) {
        return { success: false, error: "User not in group" };
      }

      if (targetUser.role === ParticipantRole.OWNER) {
        return { success: false, error: "Cannot remove group owner" };
      }

      const updatedGroup = await ConversationModel.findByIdAndUpdate(
        groupId,
        {
          $pull: {
            participants: { userId: new mongoose.Types.ObjectId(userId) },
          },
        },
        { new: true }
      );

      if (!updatedGroup) {
        return { success: false, error: "Failed to remove member" };
      }

      return {
        success: true,
        data: {
          groupId,
          removedUserId: userId,
        },
      };
    } catch (error) {
      this.logger.error("Error removing member from group:", error);
      return { success: false, error: "Failed to remove member from group" };
    }
  }

  async deleteGroup(
    groupId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const group = await ConversationModel.findById(groupId);
      if (!group || group.type !== ConversationType.GROUP) {
        return { success: false, error: "Group not found" };
      }

      const owner = group.participants.find(
        (p) =>
          new mongoose.Types.ObjectId(p.userId).equals(
            new mongoose.Types.ObjectId(userId)
          ) && p.role === ParticipantRole.OWNER
      );

      if (!owner) {
        return {
          success: false,
          error: "Only group owner can delete the group",
        };
      }

      const deletionResult = await ConversationModel.deleteOne({
        _id: groupId,
      });
      if (deletionResult.deletedCount === 0) {
        return { success: false, error: "Failed to delete group" };
      }

      return {
        success: true,
        data: {
          groupId,
          deletedAt: new Date(),
        },
      };
    } catch (error) {
      this.logger.error("Error deleting group:", error);
      return { success: false, error: "Failed to delete group" };
    }
  }

  async promoteMember(
    groupId: string,
    userId: string,
    requesterId: string
  ): Promise<ServiceResponse<any>> {
    try {
      const group = await ConversationModel.findById(groupId);
      if (!group || group.type !== ConversationType.GROUP) {
        return { success: false, error: "Group not found" };
      }
      const requester = group.participants.find(
        (p) =>
          p.userId.toString() ===
          new mongoose.Types.ObjectId(requesterId).toString()
      );

      if (!requester || requester.role !== ParticipantRole.OWNER) {
        return { success: false, error: "Unauthorized to promote members" };
      }
      const targetUser = group.participants.find(
        (p) => p.userId === new mongoose.Types.ObjectId(userId).toString()
      );

      if (!targetUser) {
        return { success: false, error: "User not in group" };
      }

      if (targetUser.role === ParticipantRole.ADMIN) {
        return { success: false, error: "User is already an admin" };
      }

      targetUser.role = ParticipantRole.ADMIN;
      await group.save();

      return {
        success: true,
        data: {
          groupId,
          userId,
          newRole: ParticipantRole.ADMIN,
        },
      };
    } catch (error) {
      this.logger.error("Error promoting member:", error);
      return { success: false, error: "Failed to promote member" };
    }
  }
}
