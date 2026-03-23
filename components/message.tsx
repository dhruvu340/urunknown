"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

const MessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(500, "Message cannot exceed 500 characters"),
})

type MessageFormData = z.infer<typeof MessageSchema>

interface MessageCardProps {
  username: string
}

const MessageCard = ({ username }: MessageCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MessageFormData>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  })

  const content = form.watch("content")
  const charCount = content?.length || 0

  const onSubmit = async (data: MessageFormData) => {
    try {
      setIsSubmitting(true)
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      })

      toast.success("Message sent!", {
        description: response.data.message || "Your message was delivered.",
      })

      form.reset()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      const errMsg = axiosError.response?.data?.message

      if (axiosError.response?.status === 403) {
        toast.error("Not accepting messages", {
          description: `${username} is not accepting messages right now.`,
        })
      } else if (axiosError.response?.status === 401) {
        toast.error("User not found", {
          description: `No account found for @${username}.`,
        })
      } else {
        toast.error("Failed to send", {
          description: errMsg || "Something went wrong. Please try again.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-gray-900 px-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-3">
            {/* avatar */}
            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg">
                Send a message
              </CardTitle>
              <CardDescription className="text-sm">
                to{" "}
                <span className="font-medium text-black">
                  @{username}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="text-sm font-medium">
                    Your message
                  </FieldLabel>

                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder={`Send an anonymous message to @${username}...`}
                      className="min-h-[140px] resize-none pr-4 text-sm leading-relaxed focus:ring-2 focus:ring-black"
                      maxLength={500}
                    />
                    {/* char counter */}
                    <span
                      className={`absolute bottom-3 right-3 text-xs ${
                        charCount > 450
                          ? charCount > 490
                            ? "text-red-500"
                            : "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    >
                      {charCount}/500
                    </span>
                  </div>

                  <div className="min-h-[18px]">
                    {fieldState.error && (
                      <FieldError
                        className="text-xs text-red-500"
                        errors={[fieldState.error]}
                      />
                    )}
                  </div>
                </Field>
              )}
            />
          </CardContent>

          <CardFooter className="pt-0">
            <Button
              type="submit"
              disabled={isSubmitting || charCount === 0}
              className="w-full h-11 bg-black text-white hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default MessageCard