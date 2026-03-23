import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/app/models/model"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "not authenticated"
      }, { status: 401 })
    }

    const userId = session.user._id
    const { acceptMessages } = await request.json()

    const foundUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isAccepting: acceptMessages } },
      { new: true }
    )

    if (!foundUser) {
      return Response.json({
        success: false,
        message: "user not found"
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: "message acceptance status updated",
      isAccepting: foundUser.isAccepting,
    }, { status: 200 })

  } catch (error) {
    return Response.json({
      success: false,
      message: "internal server error"
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "not authenticated"
      }, { status: 401 })
    }

    const userId = session.user._id

    const foundUser = await UserModel.findById(userId)
    if (!foundUser) {
      return Response.json({
        success: false,
        message: "user not found"
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: "user status found",
      isAccepting: foundUser.isAccepting,
    }, { status: 200 })

  } catch (error) {
    return Response.json({
      success: false,
      message: "internal server error"
    }, { status: 500 })
  }
}