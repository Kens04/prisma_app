import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

//インスタンスを作成
const prisma = new PrismaClient();

// データベースに接続する関数
export const connect = async () => {
    try {
        //prismaでデータベースに接続
        prisma.$connect();
    } catch (error) {
        return Error("DB接続失敗しました")
    }
}

// データベースからデータを取得する
export const GET = async (req: Request) => {
  try {
      await connect();
      const todos = await prisma.todo.findMany();

      return NextResponse.json({todos},{ status: 200 })

  } catch (error) {
      return NextResponse.json({ messeage: "Error" },{ status: 500 })

  } finally {
      //必ず実行する
      await prisma.$disconnect();
  }
}


export const POST = async (req: Request, res: NextResponse) => {
  const { title } = await req.json();
  try {
      await connect();
      const todo = await prisma.todo.create({
          data: {
              title: title,
              createdAt: new Date()
          }
      });

      return NextResponse.json({ message: "投稿完了"}, { status: 200 })

  } catch (error) {
      return NextResponse.json({ messeage: "投稿失敗" }, { status: 500 })

  } finally {
      await prisma.$disconnect();
  }
}