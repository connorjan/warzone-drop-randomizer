import { z } from "zod"

export const SettingsSchema = z.object({
  johnMode: z.boolean(),
  showAnimation: z.boolean(),
})

export const DefaultSettings = {
  johnMode: false,
  showAnimation: true
}
