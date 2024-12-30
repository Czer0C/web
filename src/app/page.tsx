import Table from '@/app/table'
// import { useEffect, useState } from 'react'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TableZone />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  )
}

// http://34.143.206.52/videos/download?fileName=Ram-Meme.mp4

const HOST = 'http://34.143.206.52'

const ENDPOINT_LIST = `${HOST}/videos`

export interface Video {
  id: string
  bucket: string
  name: string
  size: string
  timeCreated: string
  contentType: string
}

async function TableZone() {
  const data = await fetch(ENDPOINT_LIST)

  const videos = await data.json()

  return (
    <div>
      <Table videos={videos} />
    </div>
  )
}
