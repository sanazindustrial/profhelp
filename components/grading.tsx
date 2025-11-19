"use client"

import { useEffect, useRef, useState } from "react"
import { Spinner } from "@radix-ui/themes"
import { useAssistant } from "ai/react"
// @ts-ignore
import mixpanel from "mixpanel-browser"

import {
  FilePurpose,
  FilePurposeEnum,
  FilePurposeInterface,
} from "@/types/file-purpose.types"
import {
  MESSAGE_CHUNKS_COMPONENTS,
  getMessageContent,
} from "@/lib/user-messages.utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/components/file-uploader.component"

export function Grading() {
  const {
    status,
    messages,
    setMessages,
    error,
    append,
    threadId,
    setThreadId,
  } = useAssistant({
    api: "/api/assistant",
  })

  const isResponseLoading = status === "in_progress"
  const [professorProfile, setProfessorProfile] = useState("")
  const [rubricPrompt, setRubricPrompt] = useState("")
  const [assignmentPrompt, setAssignmentPrompt] = useState("")
  const [studentPost, setStudentPost] = useState("")
  const [refineInstructions, setRefineInstructions] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<FilePurposeInterface>({})

  const rubricInputRef = useRef<HTMLInputElement>(null)
  const assignmentInputRef = useRef<HTMLInputElement>(null)
  const studentInputRef = useRef<HTMLInputElement>(null)
  const professorInputRef = useRef<HTMLInputElement>(null)

  // Load the professor profile from localStorage when the component mounts
  useEffect(() => {
    const storedProfile = localStorage.getItem("professorProfile")
    const storedPrompt = localStorage.getItem("rubricPrompt")
    const storedAssignmentPrompt = localStorage.getItem("assignmentPrompt")

    if (storedProfile) {
      setProfessorProfile(storedProfile)
    }
    if (storedPrompt) {
      setRubricPrompt(storedPrompt)
    }

    if (storedAssignmentPrompt) {
      setAssignmentPrompt(storedAssignmentPrompt)
    }
  }, [])
  // Save the professor profile to localStorage when it changes
  useEffect(() => {
    if (!professorProfile) {
      return
    }
    localStorage.setItem("professorProfile", professorProfile)
  }, [professorProfile])

  // Save the discussion prompt to localStorage when it changes
  useEffect(() => {
    if (!rubricPrompt) {
      return
    }
    localStorage.setItem("rubricPrompt", rubricPrompt)
  }, [rubricPrompt])

  const trackUploadedFiles = (purpose: FilePurpose, id: string) => {
    setUploadedFiles((uploadedFiles) => {
      if (id) {
        return { ...uploadedFiles, [purpose]: id }
      } else {
        return Object.keys(uploadedFiles)
          .filter((fileKey) => fileKey !== purpose)
          .reduce((updatedFiles: Record<string, string>, fileKey) => {
            updatedFiles[fileKey] = uploadedFiles[fileKey]
            return updatedFiles
          }, {})
      }
    })
  }

  const fileUploaderClickHandler = (purpose: FilePurpose) => {
    switch (purpose) {
      case FilePurposeEnum.rubric:
        if (rubricInputRef.current) {
          rubricInputRef.current.value = ""
          trackUploadedFiles(purpose, "")
        }
        break
      case FilePurposeEnum.assignment:
        if (assignmentInputRef.current) {
          assignmentInputRef.current.value = ""
          trackUploadedFiles(purpose, "")
        }
        break
      case FilePurposeEnum.student:
        if (studentInputRef.current) {
          studentInputRef.current.value = ""
          trackUploadedFiles(purpose, "")
        }
        break
    }
  }

  const onSubmitHandler = () => {
    mixpanel.track("Response Generated")
    stop()
    setMessages([])

    const messageChunks: Partial<Record<FilePurposeEnum, string>> = {}
    const availablePurposeFiles = Object.keys(uploadedFiles)

    MESSAGE_CHUNKS_COMPONENTS.forEach((component) => {
      if (!availablePurposeFiles.includes(component)) {
        switch (component) {
          case FilePurposeEnum.assignment:
            messageChunks[FilePurposeEnum.assignment] = assignmentPrompt
            break
          case FilePurposeEnum.rubric:
            messageChunks[FilePurposeEnum.rubric] = rubricPrompt
            break
          case FilePurposeEnum.student:
            messageChunks[FilePurposeEnum.student] = studentPost
            break
          case FilePurposeEnum.professor:
            messageChunks[FilePurposeEnum.professor] = professorProfile
            break
        }
      }
    })

    const content = getMessageContent(messageChunks)

    if (Object.keys(uploadedFiles).length > 0) {
      append({ role: "user", content }, { data: uploadedFiles })
    } else {
      append({ role: "user", content })
    }
  }

  const onSubmitRefinementHandler = () => {
    if (!messages[1]) {
      alert("Please generate a response first!")
      return
    }
    // alert(rubricPrompt)
    mixpanel.track("Response Refined")
    stop()
    setMessages([])
    append({ role: "user", content: refineInstructions })
  }

  const newGradingHandler = () => {
    setThreadId(undefined)
    setStudentPost("")
    setRefineInstructions("")
    setUploadedFiles({ ...uploadedFiles, [FilePurposeEnum.student]: "" })
    if (studentInputRef.current) {
      studentInputRef.current.value = ""
      trackUploadedFiles(FilePurposeEnum.student, "")
    }
  }

  mixpanel.init("2cd410fcd850fc63e1d196976acaff87", {
    debug: process.env.NODE_ENV !== "production",
    track_pageview: true,
    persistence: "localStorage",
  })

  return (
    <section className="w-full space-y-9">
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="professor-profile">
            Professor Background & Style
          </Label>
          <FileUploader
            purpose={FilePurposeEnum.professor}
            trackFile={trackUploadedFiles}
            onClick={fileUploaderClickHandler}
            fileId={uploadedFiles[FilePurposeEnum.professor]}
            ref={professorInputRef}
          />
          <Textarea
            className="min-h-[100px]"
            id="professor-profile"
            placeholder="Enter your response style + paste in examples of your previous responses"
            value={professorProfile}
            disabled={!!uploadedFiles[FilePurposeEnum.professor]}
            onChange={(e) => setProfessorProfile(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rubric-prompt">
            Instructions Rubric. You can write it or upload file below.
            <br />
            <span className="mt-2 text-sm italic text-zinc-400">
              Accepted files: pdf, doc, xls, ppt, txt
            </span>
          </Label>
          <div className="mb-8">
            <FileUploader
              purpose={FilePurposeEnum.rubric}
              trackFile={trackUploadedFiles}
              onClick={fileUploaderClickHandler}
              fileId={uploadedFiles[FilePurposeEnum.rubric]}
              ref={rubricInputRef}
            />
          </div>
          <Textarea
            className="min-h-[100px]"
            id="rubric-topic"
            value={rubricPrompt}
            disabled={!!uploadedFiles[FilePurposeEnum.rubric]}
            onChange={(e) => setRubricPrompt(e.target.value)}
            placeholder="Enter the rubric prompt"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignment-prompt">Assignment</Label>
          <FileUploader
            purpose={FilePurposeEnum.assignment}
            trackFile={trackUploadedFiles}
            onClick={fileUploaderClickHandler}
            fileId={uploadedFiles[FilePurposeEnum.assignment]}
            ref={assignmentInputRef}
            multiple
          />
          <Textarea
            className="min-h-[100px]"
            id="assignment-topic"
            value={assignmentPrompt}
            onChange={(e) => setAssignmentPrompt(e.target.value)}
            placeholder="Enter the assignment prompt"
            disabled={!!uploadedFiles[FilePurposeEnum.assignment]}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-post">
            Student&apos;s Post. You can write it or upload file below.
          </Label>
          <FileUploader
            purpose={FilePurposeEnum.student}
            trackFile={trackUploadedFiles}
            onClick={fileUploaderClickHandler}
            fileId={uploadedFiles[FilePurposeEnum.student]}
            ref={studentInputRef}
            multiple
          />
          <Textarea
            value={studentPost}
            onChange={(e) => setStudentPost(e.target.value)}
            className="min-h-[100px]"
            id="student-post"
            placeholder="Enter the student's post"
            disabled={!!uploadedFiles[FilePurposeEnum.student]}
          />
        </div>
      </div>
      <div className="flex">
        <Button
          onClick={onSubmitHandler}
          disabled={!!threadId || isResponseLoading}
        >
          Generate Response
        </Button>
        <Button
          disabled={isResponseLoading || !threadId}
          onClick={newGradingHandler}
          className="ml-4"
        >
          new Grading
        </Button>
        <Spinner
          loading={isResponseLoading}
          className="ml-4 self-center"
          size="3"
        ></Spinner>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="professor-response">Professor&apos;s Response</Label>
          <Textarea
            className="min-h-[100px]"
            style={{ overflowAnchor: "auto" }}
            id="professor-response"
            value={messages[1] ? messages[1].content : ""}
            onChange={(e) =>
              setMessages([
                messages[0],
                {
                  content: e.target.value,
                  role: "assistant",
                  id: "1",
                },
              ])
            }
            placeholder="Response will be generated here"
          />
          {error && <span>{error.message}</span>}
        </div>
      </div>
      {/* Text Input with Refine Response label, button that says Refine Response */}
      <Button
        onClick={() => {
          mixpanel.track("Response Copied")
          navigator.clipboard.writeText(messages[1].content)
        }}
      >
        Copy Response
      </Button>
      {messages[1] && !isResponseLoading && (
        <div>
          <div className="w-full">
            <Label htmlFor="refine-response">Refine Response</Label>
            <Textarea
              id="refine-response"
              className="min-h-[100px]"
              placeholder="Refine the professor's response - ex. make it shorter, stricter"
              value={refineInstructions}
              onChange={(e) => setRefineInstructions(e.target.value)}
            />
          </div>
          <Button className="mt-4" onClick={onSubmitRefinementHandler}>
            Refine
          </Button>
        </div>
      )}
    </section>
  )
}
