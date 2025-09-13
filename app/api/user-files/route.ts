import { NextResponse } from "next/server"
import { openAIAdaptor } from "@/adaptors/open-ai.adaptor"
import { fileInputSchema } from "@/schemas/file-input.schema"
import { fromError } from "zod-validation-error"

export async function POST(req: any, res: NextResponse) {
  const formData = await req.formData()
  const createdFiles = []

  for (const file of formData.values()) {
    try {
      fileInputSchema.parse(file)
      createdFiles.push(openAIAdaptor.createFile(file))
    } catch (err) {
      const error = fromError(err)
      const errorMessage = error.toString()
      return NextResponse.json({ message: errorMessage }, { status: 400 })
    }
  }

  try {
    const uploadedFiles = await Promise.all(createdFiles)
    const filesId = uploadedFiles.reduce(
      (responseObject: Record<string, any>, file: any, index: number) => {
        if (file?.id) {
          responseObject[file.filename] = file.id
          return responseObject
        } else {
          throw new Error()
        }
      },
      {}
    )
    return NextResponse.json(filesId, { status: 201 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: "something went wrong! Please try again" },
      { status: 400 }
    )
  }
}
