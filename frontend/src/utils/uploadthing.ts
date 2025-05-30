// src/utils/uploadthing.ts
'use client'
import { generateUploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

// Просто передаём дженерик — кнопка сама найдёт ваш API-роут
export const UploadButton = generateUploadButton<OurFileRouter>()
