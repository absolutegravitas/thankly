const fs = require('fs')
const path = require('path')
const esprima = require('esprima')
const typescript = require('typescript')
require('dotenv').config({ path: '../../.env' }) // Load environment variables from .env file

// Set up logging
const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'comment_generator.log' }),
  ],
})

class NextJsAppRouterMonorepoCommentGenerator {
  constructor(apiKey, repoPath) {
    this.apiKey = apiKey
    this.repoPath = repoPath
    this.apiUrl = 'https://api.anthropic.com/v1/messages'
    this.rateLimit = 10 // Limit API calls to 10 per minute
    this.lastRequestTime = 0
    this.projectInstructions = this.loadProjectInstructions()
    // Define file types to process and exclude
    this.fileExtensionsToProcess = ['.js', '.jsx', '.ts', '.tsx']
    this.fileExtensionsToExclude = ['.scss', '.css', '.json', '.txt', '.md', '.env']
    this.filePatternToExclude = /\..*ignore$/ // Exclude files ending with 'ignore' (e.g., .gitignore)
    logger.info('NextJsAppRouterMonorepoCommentGenerator initialized')
  }

  // Load project-specific instructions from a file
  loadProjectInstructions() {
    const instructionsPath = path.join(__dirname, 'project_instructions.txt')
    logger.info(`Attempting to load project instructions from: ${instructionsPath}`)
    if (fs.existsSync(instructionsPath)) {
      const instructions = fs.readFileSync(instructionsPath, 'utf8')
      logger.info('Project instructions loaded successfully')
      return instructions
    } else {
      logger.warn('No project instructions file found')
      return 'No project-specific instructions found.'
    }
  }

  // Make an API call to Claude, respecting rate limits
  async callClaudeApi(prompt) {
    const currentTime = Date.now()
    // Implement rate limiting
    if (currentTime - this.lastRequestTime < 60000 / this.rateLimit) {
      const waitTime = 60000 / this.rateLimit - (currentTime - this.lastRequestTime)
      logger.info(`Rate limit reached. Waiting for ${waitTime}ms before next API call`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    // Prepare the full prompt with project instructions
    const fullPrompt = `
${this.projectInstructions}

Now, based on the above project context and instructions, please respond to the following:

${prompt}
    `

    try {
      logger.info('Making API call to Claude')
      // Make the API call to Claude
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{ role: 'user', content: fullPrompt }],
        }),
      })

      // Handle API errors
      if (!response.ok) {
        logger.error(`API call failed with status: ${response.status}`)
        logger.error(`Response body: ${await response.text()}`)
        throw new Error(`API call failed with status: ${response.status}`)
      }

      const data = await response.json()
      this.lastRequestTime = Date.now()
      logger.info('API call successful')
      return data.content[0].text
    } catch (error) {
      logger.error(`API call failed: ${error.message}`)
      throw error
    }
  }

  // Generate comments for an entire file
  async generateFileComment(filePath, fileContent) {
    logger.info(`Generating comments for file: ${filePath}`)
    const relativePath = path.relative(this.repoPath, filePath)
    const fileType = path.extname(filePath)
    // Prepare the prompt for Claude
    const prompt = `Given the following context and code, please perform two tasks:

1. Generate comments:
   a) An introductory comment block: A concise and informative JSDoc-style comment block that provides an overview of the file's purpose, any important details, and how it fits into the larger project context. Use only standard JSDoc tags like @file, @description, @module, etc. Do not include an @author tag or any inline comments within this block.
   b) Inline comments: Brief, targeted comments throughout the code that explain complex logic, important decisions, or any non-obvious implementations.

2. Provide a code clarification:
   Explain the code in simple, easy-to-understand language. Break down the code's functionality, purpose, and key components.

File Path: ${relativePath}

File Content:
${fileContent}

Please provide your response in the following format:

/**
 * @file [filename]
 * @description [file description]
 * [any other relevant JSDoc tags]
 */

Inline Comments:
[Line number]: [Your inline comment]
[Line number]: [Your inline comment]
...

Code Clarification:
[Your simplified explanation of the code here. Do not include line numbers just hyphens is fine.]

Generated Response:`

    return this.callClaudeApi(prompt)
  }

  // Generate comments for a specific function
  async generateFunctionComment(functionDef, filePath) {
    logger.info(`Generating comment for function in file: ${filePath}`)
    const relativePath = path.relative(this.repoPath, filePath)
    const prompt = `Given the following context and function definition in a Next.js App Router monorepo, generate a concise and informative JSDoc comment:

    File Path: ${relativePath}

    Function Definition:
    ${functionDef}

    Generated JSDoc Comment:`

    return this.callClaudeApi(prompt)
  }

  // Process a JavaScript or TypeScript file
  async processJavaScriptLikeFile(filePath) {
    logger.info(`Processing file: ${filePath}`)
    const content = fs.readFileSync(filePath, 'utf8')
    const response = await this.generateFileComment(filePath, content)

    // Parse the response from Claude
    const [introBlock, inlineComments, codeClarification] = response.split('\n\n').filter(Boolean)

    // Add the introductory block and code clarification
    let newContent =
      introBlock.trim() +
      '\n\n' +
      '/*\nCode Clarification:\n' +
      codeClarification.replace('Code Clarification:', '').trim() +
      '\n*/\n\n' +
      content

    // Add inline comments
    const lines = newContent.split('\n')
    const inlineCommentRegex = /(\d+):\s(.+)/g
    let match
    let inlineCommentsAdded = 0
    while ((match = inlineCommentRegex.exec(inlineComments)) !== null) {
      const [, lineNum, comment] = match
      const index = parseInt(lineNum) - 1
      if (index >= 0 && index < lines.length) {
        lines[index] = lines[index] + ' // ' + comment.trim()
        inlineCommentsAdded++
      }
    }
    logger.info(`Added ${inlineCommentsAdded} inline comments`)

    newContent = lines.join('\n')

    // Process functions and other structures using AST
    const ast =
      filePath.endsWith('.ts') || filePath.endsWith('.tsx')
        ? typescript.createSourceFile(filePath, newContent, typescript.ScriptTarget.Latest, true)
        : esprima.parseModule(newContent, { jsx: true, comment: true })

    let functionCommentsAdded = 0
    const processNode = async (node) => {
      // Check for various types of function declarations
      if (
        node.kind === typescript.SyntaxKind.FunctionDeclaration ||
        node.kind === typescript.SyntaxKind.MethodDeclaration ||
        (node.kind === typescript.SyntaxKind.VariableStatement &&
          node.declarationList.declarations[0].initializer &&
          (node.declarationList.declarations[0].initializer.kind ===
            typescript.SyntaxKind.ArrowFunction ||
            node.declarationList.declarations[0].initializer.kind ===
              typescript.SyntaxKind.FunctionExpression))
      ) {
        const functionDef = newContent.substring(node.pos, node.end)
        const docstring = await this.generateFunctionComment(functionDef, filePath)
        newContent = newContent.replace(functionDef, `/**\n * ${docstring}\n */\n${functionDef}`)
        functionCommentsAdded++
      }
    }

    // Recursively visit and process all nodes in the AST
    const visitNode = async (node) => {
      await processNode(node)
      typescript.forEachChild(node, visitNode)
    }

    await visitNode(ast)
    logger.info(`Added comments for ${functionCommentsAdded} functions`)

    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent)
    logger.info(`File processed and updated: ${filePath}`)
  }

  // Process a single file
  async processFile(filePath) {
    const ext = path.extname(filePath)
    const fileName = path.basename(filePath)

    // Check if the file should be processed based on its extension and name
    if (
      this.fileExtensionsToProcess.includes(ext) &&
      !this.fileExtensionsToExclude.includes(ext) &&
      !this.filePatternToExclude.test(fileName)
    ) {
      await this.processJavaScriptLikeFile(filePath)
    } else {
      logger.info(`Skipping file: ${filePath} (not a target file type or excluded)`)
    }
  }

  // Process all files in the directory
  async processDirectory() {
    logger.info(`Processing directory: ${this.repoPath}`)
    const files = fs.readdirSync(this.repoPath, { recursive: true, withFileTypes: true })
    let processedFiles = 0
    let skippedFiles = 0
    for (const file of files) {
      const filePath = path.join(this.repoPath, file.path, file.name)
      if (file.isFile()) {
        const ext = path.extname(file.name)
        if (
          this.fileExtensionsToProcess.includes(ext) &&
          !this.fileExtensionsToExclude.includes(ext) &&
          !this.filePatternToExclude.test(file.name)
        ) {
          await this.processFile(filePath)
          processedFiles++
        } else {
          skippedFiles++
        }
      }
    }
    logger.info(
      `Directory processing complete. Processed ${processedFiles} files, skipped ${skippedFiles} files.`,
    )
  }

  // Process a single file specified by the user
  async processSingleFile(filePath) {
    if (!fs.existsSync(filePath)) {
      logger.error(`Error: ${filePath} is not a valid file.`)
      return
    }

    const ext = path.extname(filePath)
    const fileName = path.basename(filePath)

    // Check if the file should be processed
    if (
      !this.fileExtensionsToProcess.includes(ext) ||
      this.fileExtensionsToExclude.includes(ext) ||
      this.filePatternToExclude.test(fileName)
    ) {
      logger.warn(`Error: ${filePath} is not a supported file type or is excluded.`)
      return
    }

    logger.info(`Processing single file: ${filePath}`)
    await this.processFile(filePath)
    logger.info(`Finished processing: ${filePath}`)
  }
}

// Main function to run the script
async function main() {
  logger.info('Starting comment generation process')
  // Get the API key from environment variables
  const apiKey = process.env.ANTHROPIC
  if (!apiKey) {
    logger.error('Error: ANTHROPIC not found in .env file')
    process.exit(1)
  }

  // Set up the generator
  const repoPath = path.resolve(__dirname, '..') // Assumes the script is in a subdirectory of the repo
  logger.info(`Repository path set to: ${repoPath}`)
  const generator = new NextJsAppRouterMonorepoCommentGenerator(apiKey, repoPath)

  // Get the file path from command line arguments, if provided
  const filePath = process.argv[2]

  try {
    // Process either a single file or the entire directory
    if (filePath) {
      logger.info(`Single file mode: Processing ${filePath}`)
      await generator.processSingleFile(filePath)
    } else {
      logger.info('Directory mode: Processing entire repository')
      await generator.processDirectory()
    }
    logger.info('Comment generation process completed successfully')
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`)
    logger.error(error.stack)
  }
}

// Run the main function
main()
