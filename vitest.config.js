import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'vitest/config'

loadEnvConfig(process.cwd())

export default defineConfig({  
  test: {    
    globals: true, 
    environment: 'node', 
  },
  resolve: {
    tsconfigPaths: true 
  }
})