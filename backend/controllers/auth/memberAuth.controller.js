import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import MemberModel from '../../models/member.model.js'
import sequelize from '../../models/index.js'
import { where } from 'sequelize'
const Member=MemberModel(sequelize)

const generateToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:'1d'
    });
};

export const signup= async (req,res)=>{
    try{
        const {MemberName,Email,Password} =req.body;

        const existing= await Member.findOne({where:{Email}});
        if(existing){
            return res.status(400).json({message:'Member Already Exists!'})
        }

        const hashedPassword=await bcrypt.hash(Password,10);

        const newMember=await Member.create({
            MemberName,
            Email,
            PasswordHash:hashedPassword,
            IsActive:true,
            JoinDate: new Date()
        })

        const token = generateToken({ id: newMember.MemberID, email: newMember.Email })

        res.status(201).json({token,member:{
            id:newMember.MemberID,
            name:newMember.MemberName,
            email:newMember.Email
        }});

    }catch(e){
        res.status(500).json({message:'Signup Failed', error: e})
    }
};

export const login=async(req,res)=>{
    try{
        const {Email,Password}=req.body;

        const member=await Member.findOne({where:{Email}});
        if(!member){
            return res.status(404).json({message:'Invalid Email or Password'})
        }

        const isMatch=await bcrypt.compare(Password,member.PasswordHash);
        if(!isMatch){
            return res.status(401).json({message:'Invalid credentials'})
        }

        const token = generateToken({ id: member.MemberID, email: member.Email })

        res.status(200).json({token,member:{id:member.MemberID,name:member.MemberName,email:member.Email}})


    }catch(err){
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}

export const checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.MemberID,
        name: user.MemberName,
        email: user.Email,
      },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: "Token expired or invalid" });
  }
};


