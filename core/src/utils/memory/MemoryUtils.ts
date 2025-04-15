
export const getMemoryConfig = (threadId: string) => {
    return { configurable: { thread_id: threadId } };
}