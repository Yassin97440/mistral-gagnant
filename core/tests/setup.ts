import dotenv from 'dotenv';
import path from 'path';

// Charge les variables d'environnement depuis .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration des variables d'environnement pour les tests
process.env.HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || 'test_key'; 
process.env.MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'test_key'; 
process.env.LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY || 'test_key'; 
process.env.LANGSMITH_TRACING = process.env.LANGSMITH_TRACING || 'test_key'; 
process.env.NOTION_API_KEY = process.env.NOTION_API_KEY || 'test_key'; 
process.env.NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || 'test_key'; 
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'test_key'; 
process.env.SUPABASE_PRIVATE_KEY = process.env.SUPABASE_PRIVATE_KEY || 'test_key'; 