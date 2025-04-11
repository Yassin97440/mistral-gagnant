
import { v4 as uuidv4 } from "uuid";


export const getNewMemoryConfig = () => {
    return { configurable: { thread_id: uuidv4() } };
}