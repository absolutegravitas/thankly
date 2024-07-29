    const fs = require('fs').promises
    const path = require('path')
    require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

    async function loadDependencies() {
      const ora = (await import('ora')).default
      const cliProgress = (await import('cli-progress')).default
      return { ora, cliProgress }
    }

    const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

    async function documentFile(filePath) {
      const { ora } = await loadDependencies()
      const spinner = ora('Processing file...').start()

      try {
        // Read the file
        spinner.text = 'Reading file...'
        const fileContent = await fs.readFile(filePath, 'utf8')
        spinner.succeed('File read successfully')

        // Prepare the message for Claude AI
        spinner.text = 'Preparing message for Claude AI...'
        const fileExtension = path.extname(filePath)
        const message = `Add TypeScript-friendly comments and type annotations to this ${fileExtension} file. The project is using Next.js 14 with App Router and server components. Return full code with comments and type annotations. Preserve original structure and formatting.

    1. Use the most current TypeScript and React documentation best practices. Include a brief description of the code in plain English. Add a longer overview of a few sentences describing in plain English what this file does. Use business-friendly language. List any performance issues, considerations or observations as dot points and details for which functions or methods may be affected.

    2. Prioritize TypeScript's built-in type system over comment-based type annotations where possible.

    3. For components, hooks, and functions:
      - Use TypeScript interfaces or type aliases to define prop types, state types, and return types.
      - Add concise descriptions for non-obvious props, state, or behavior.

    4. For Next.js specific patterns:
      - Use the latest Next.js TypeScript patterns and decorators if available.
      - Include comments for routing, data fetching, and rendering strategies.

    5. For complex logic or algorithms:
      - Add brief explanations focusing on the 'why' rather than the 'what'.

    6. Performance considerations:
      - Note any potential performance impacts or optimization opportunities.

    7. API integrations or data management:
      - Document expected data structures and potential error states.

    8. Accessibility (a11y) considerations:
      - Note any specific accessibility features or requirements.

    9. State management:
      - Document key state variables and their purpose.

    10. Side effects:
        - Clearly indicate any side effects in functions or components.

    11. Keep documentation DRY (Don't Repeat Yourself):
        - Avoid redundant comments where TypeScript types are self-explanatory.

    12. Future compatibility:
        - Where applicable, note any version-specific features or potential deprecations.

    Aim for a balance between comprehensive documentation and clean, readable code. Prefer TypeScript's static typing over excessive commenting where appropriate. Adapt to any new TypeScript or React documentation standards that may have emerged.

    IMPORTANT INSTRUCTIONS:
    1. Return the COMPLETE commented and type-annotated TypeScript code.
    2. DO NOT add any backticks (\`) at the start or end of the code.
    3. DO NOT wrap the code in any markdown formatting (e.g., \`\`\`tsx).
    4. DO NOT remove or paraphrase any existing code.
    5. Place comments above the described code.
    6. Use clear, concise English.
    7. Maintain consistency with existing comments.
    8. For arrow functions and const declarations, place comments immediately above.
    9. Remove unnecessary whitespace to save tokens, but avoid syntax errors.
    10. DO NOT add any explanations outside of the code comments.

    Here's the code to comment and annotate:

    ${fileContent}

    Return only the complete, commented code without any additional formatting or explanations.`

        spinner.succeed('Message prepared')

        // Send the request to Claude AI
        spinner.text = 'Sending request to Claude AI...'
        spinner.start()
        const response = await fetch(CLAUDE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            // model: 'claude-3-haiku-20240307', // basic, fast & dumb for commenting
            model: 'claude-3-sonnet-20240229', // medium, sometimes produces garbage and random syntax errors ymmv
            // model: 'claude-3-opus-20240229', // complex and expensive but works
            // model: 'claude-3-5-sonnet-20240620', // super complex
            max_tokens: 4000,
            messages: [{ role: 'user', content: message }],
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        spinner.succeed('Received response from Claude AI')

        const data = await response.json()
        // Extract the response content
        const commentedCode = data.content[0].text

        // Write the commented code back to the file
        spinner.text = 'Writing updated content to file...'
        await fs.writeFile(filePath, commentedCode, 'utf8')
        spinner.succeed(`File ${filePath} has been successfully documented.`)
        spinner.stop()
      } catch (error) {
        spinner.fail(`Error processing file ${filePath}: ${error.message}`)
      }
    }

    // The file path is provided as a command-line argument
    const filePath = process.argv[2]

    if (!filePath) {
      console.error('No file path provided. Please provide a file path as an argument.')
      process.exit(1)
    }

    documentFile(filePath)
