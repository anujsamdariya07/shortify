import { VideoInterface } from "@/models/Video"

type MyFetchOptions = {
  method?: 'GET' | "POST" | 'PUT' | "PATCH" | "DELETE"
  body? : any
  headers?: Record<string, string>
}

export type VideoFormData = Omit<VideoInterface, '_id'>

class ApiClient {
  private async myFetch<T> (
    endPoint: string,
    options: MyFetchOptions = {}
  ): Promise<T> {
    const {method = 'GET', body, headers = {}} = options

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }

    const response = await fetch(`/api${endPoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body): undefined
    })

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json()
  }

  async getVideos () {
    return this.myFetch<VideoInterface[]>('/vidoes')
  }

  async getAVideo (id: string) {
    return this.myFetch<VideoInterface>(`/vidoes/${id}`)
  }

  async createVideo (videoData: VideoFormData) {
    return this.myFetch('/videos', {
      method: 'POST',
      body: videoData,
    })
  }
}

export const apiClient = new ApiClient()
