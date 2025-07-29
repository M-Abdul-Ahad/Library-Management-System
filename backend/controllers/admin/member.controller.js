import sequelize from "../../models/index.js";
import { Op } from "sequelize";
import MemberModel from "../../models/member.model.js";
import bcrypt from "bcryptjs";

const Member = MemberModel(sequelize);

export const addMember = async (req, res) => {
  try {
    const { MemberName, Email, Password } = req.body;

    const existingMember = await Member.findOne({ where: { Email } });
    if (existingMember) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const newMember = await Member.create({
      MemberName,
      Email,
      PasswordHash: hashedPassword,
    });

    res.status(201).json({
      message: "Member added successfully",
      member: {
        MemberID: newMember.MemberID,
        MemberName: newMember.MemberName,
        Email: newMember.Email,
        JoinDate: newMember.JoinDate,
        IsActive: newMember.IsActive,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add member", error: err });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { MemberName, Email, IsActive } = req.body;

    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await member.update({ MemberName, Email, IsActive });

    res.status(200).json({
      message: "Member updated successfully",
      member,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update member", error: err });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Member.destroy({ where: { MemberID: id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete member", error: err });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: { exclude: ["PasswordHash"] },
    });

    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve members", error: err });
  }
};

export const searchMembersByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    const members = await Member.findAll({
      where: {
        MemberName: {
          [Op.like]: `%${name}%`,
        },
      },
      attributes: { exclude: ["PasswordHash"] },
    });

    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err });
  }
};
