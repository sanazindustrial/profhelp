import { forwardRef, useState } from "react"
import {
  ACCEPTED_FILE_TYPES,
  fileInputSchema,
} from "@/schemas/file-input.schema"
import { CheckIcon } from "@radix-ui/react-icons"
import { Spinner } from "@radix-ui/themes"
import axios from "axios"
import { fromError, isZodErrorLike } from "zod-validation-error"

import { FilePurpose } from "@/types/file-purpose.types"
import { Input } from "@/components/ui/input"

const MAX_FILE_NUM = 3

const _FileUploader = (
  {
    purpose,
    fileId,
    trackFile,
    onClick,
    multiple = false,
  }: {
    purpose: FilePurpose
    fileId: string
    trackFile: (purpose: FilePurpose, fileId: string) => void
    onClick: (purpose: FilePurpose) => void
    multiple?: boolean
  },
  ref: any
) => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onChangeHandler = async (e: React.ChangeEvent<any>) => {
    const filesList = e.target.files

    if (filesList.length > MAX_FILE_NUM) {
      setError(`Max file number allowed: ${MAX_FILE_NUM}`)
      e.target.value = null
      return
    }

    const formData = new FormData()

    for (const file of filesList) {
      try {
        fileInputSchema.parse(file)
        formData.append(file.name, file)
      } catch (err) {
        if (isZodErrorLike(error)) {
          const validationError = fromError(error)
          setError(validationError.toString())
        } else {
          setError(
            `An error occur while loading file: ${file.name}. Please try again`
          )
        }
        e.target.value = null
        return
      }
    }

    setIsLoading(true)

    try {
      const { data } = await axios.post("api/user-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      trackFile(purpose, data)
    } catch (error: any) {
      setError(`An error occur while loading file your. Please try again`)
      e.target.value = null
    } finally {
      setIsLoading(false)
    }
  }

  const onClickHandler = () => {
    setError("")
    onClick(purpose)
  }

  return (
    <div>
      <div className="flex">
        <Input
          type="file"
          onChange={onChangeHandler}
          accept={ACCEPTED_FILE_TYPES.join(",")}
          onClick={onClickHandler}
          className="w-fit"
          ref={ref}
          disabled={isLoading}
          multiple={multiple}
        />
        {isLoading && (
          <Spinner
            loading={true}
            className="ml-4 self-center"
            size="3"
          ></Spinner>
        )}
        {fileId && (
          <div className="self-center text-green-500">
            <CheckIcon className="size-6" />
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  )
}

const FileUploader = forwardRef(_FileUploader)
export { FileUploader }
