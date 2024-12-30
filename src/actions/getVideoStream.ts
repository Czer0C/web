'use server'

import nextConfig from '../../next.config'

export const getVideoStream = async (fileName: string) => {
  const res = await fetch(
    `${nextConfig.HOST_STAGING}/videos/download?fileName=${fileName}`,
    {
      headers: {
        Authorization: 'Bearer test-local',
      },
    }
  )

  const blob = await res.blob()

  return blob
}
