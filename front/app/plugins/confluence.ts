import { defineNuxtPlugin } from '#app'
import { ConfluenceClient, type ConfluenceConfig } from '~~/services/confluenceClient'

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();

    const config: ConfluenceConfig = {
        baseUrl: runtimeConfig.ConfluenceBaseUrl,
        username: runtimeConfig.ConfluenceUsername,
        apiToken: runtimeConfig.ConfluenceApiToken,
    }

    const confluenceClient = new ConfluenceClient(config)

    return {
        provide: {
            confluenceClient
        }
    }
})