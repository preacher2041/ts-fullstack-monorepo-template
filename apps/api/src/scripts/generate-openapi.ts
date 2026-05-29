import fs from 'fs'
import path from 'path'
import { openApiSpec } from '../openapi'

const outputPath = path.resolve(process.cwd(), 'openapi-spec.json')
fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2), 'utf8')
console.log(`🚀 OpenAPI spec successfully written to ${outputPath}`)
