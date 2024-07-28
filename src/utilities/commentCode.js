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

// OLD IMPLEMENTATION TO ITERATE THROUGH SHIT
// async function documentFile(filePath) {
//   const { ora, cliProgress } = await loadDependencies()
//   const spinner = ora('Processing file...').start()
//   const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

//   try {
//     // Read the file
//     spinner.text = 'Reading file...'
//     const fileContent = await fs.readFile(filePath, 'utf8')
//     spinner.succeed('File read successfully')

//     // Prepare the message for Claude AI
//     spinner.text = 'Preparing message for Claude AI...'
//     const fileExtension = path.extname(filePath)
//     const message = `Please provide:
// 1. A JSDoc comment block for the entire file, including @file, @description, @overview and any other relevant tags.
// 2. A brief code clarification explaining the overall functionality.

// Do not modify or rewrite the original code. Only provide comments and explanations in clear, concise, and plain english. Add notes for any potential performance considerations or optimizations. Maintain consistency with existing code comments. Highlight any important side effects or dependencies.

// Important: This is a ${fileExtension} file. Use the correct comment syntax. Do not nest comments or use multiple comment styles on the same line. Also try and avoid adding in-line comments outside of react fragments as that causes eslint errors because of the "single root element rule" or "single parent rule" in React.

// Here's the code:

// ${fileContent}

// Please format your response exactly as follows:
// /**
//  * @file [filename]
//  * @description [file description]
//  * @overview [Your explanation of the overall functionality]
//  * [any other relevant JSDoc tags]
//  */
// Inline Comments:
// [Line number]: [Your comment]
// [Line number]: [Your comment]
// ...`
//     spinner.succeed('Message prepared')

//     // Send the request to Claude AI
//     spinner.text = 'Sending request to Claude AI...'
//     spinner.start()
//     const response = await fetch(CLAUDE_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': CLAUDE_API_KEY,
//         'anthropic-version': '2023-06-01',
//       },
//       body: JSON.stringify({
//         // model: 'claude-3-haiku-20240307', // basic, fast & dumb for commenting
//         // model: 'claude-3-sonnet-20240229', // medium, produces garbage back with extra backticks and random syntax errors ymmv
//         model: 'claude-3-opus-20240229', // complex and expensive but works
//         // model: 'claude-3-5-sonnet-20240620', // super complex
//         max_tokens: 4000,
//         messages: [{ role: 'user', content: message }],
//       }),
//     })

//     if (!response.ok) {
//       spinner.fail(`HTTP error! status: ${response.status}`)
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     spinner.succeed('Received response from Claude AI')

//     const data = await response.json()
//     // Extract the response content
//     const aiResponse = data.content[0].text

//     spinner.text = 'Processing AI response...'
//     const [jsdocBlock, inlineComments] = aiResponse.split('Inline Comments:')

//     // Add JSDoc block to the top of the file
//     let updatedContent = jsdocBlock.trim() + '\n\n' + fileContent

//     // Add inline comments
//     const lines = updatedContent.split('\n')
//     const commentLines = inlineComments.trim().split('\n')
//     spinner.stop()
//     progressBar.start(commentLines.length, 0)

//     // Create a map to store comments for each line
//     const commentMap = new Map()

//     for (const commentLine of commentLines) {
//       const [lineNum, comment] = commentLine.split(':')
//       const lineIndex = parseInt(lineNum.trim()) - 1
//       if (lineIndex >= 0 && lineIndex < lines.length) {
//         if (!commentMap.has(lineIndex)) {
//           commentMap.set(lineIndex, [])
//         }
//         commentMap.get(lineIndex).push(comment.trim())
//       }
//     }

//     // Apply comments to the lines, starting from the bottom
//     for (let i = lines.length - 1; i >= 0; i--) {
//       if (commentMap.has(i)) {
//         const comments = commentMap.get(i).reverse() // Reverse comments to maintain original order
//         const currentLine = lines[i].trim()
//         const indentation = lines[i].match(/^\s*/)[0] // Preserve indentation

//         // Check if the current line is the start of a multi-line statement
//         const isMultiLineStart =
//           currentLine.endsWith('{') ||
//           currentLine.endsWith('(') ||
//           currentLine.endsWith('[') ||
//           currentLine.endsWith('=') ||
//           (currentLine.includes('=>') && !currentLine.includes('{'))

//         // Check if the next line (if exists) is part of a multi-line statement
//         const isNextLinePartOfMultiLine =
//           i < lines.length - 1 &&
//           (lines[i + 1].trim().startsWith(')') ||
//             lines[i + 1].trim().startsWith('}') ||
//             lines[i + 1].trim().startsWith(']'))

//         if (isMultiLineStart || isNextLinePartOfMultiLine) {
//           // For multi-line statements, add the comments above the statement
//           const combinedComments = comments
//             .map((comment) => `${indentation}// ${comment}`)
//             .join('\n')
//           lines.splice(i, 0, combinedComments)
//         } else {
//           // For single-line statements, add the comment on the same line
//           const comment = comments[0] // Use only the first comment if multiple exist
//           lines[i] = `${lines[i]} // ${comment}`
//         }
//       }
//       progressBar.update(lines.length - i)
//     }

//     progressBar.stop()
//     updatedContent = lines.join('\n')

//     // Write the updated content back to the file
//     spinner.text = 'Writing updated content to file...'
//     await fs.writeFile(filePath, updatedContent, 'utf8')
//     spinner.succeed(`File ${filePath} has been successfully documented.`)
//   } catch (error) {
//     spinner.fail(`Error processing file ${filePath}: ${error.message}`)
//   }
// }

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
    const message = `Add JSDoc-compliant comments to this ${fileExtension} Next.js 14 code using App Router and server components. Return full code with comments. Preserve original structure and formatting.

1. File-level JSDoc block:
   @file
   @module [derive from filename]
   @description [brief description]
   @overview [A few sentences describing in plain english what this file does. Use business friendly language. List any performance issues, considerations or observations here as dot points and details for which functions or methods may be affected.]

2. For Next.js 14 App Router specific patterns:
   @route for route handlers (e.g., page.tsx, layout.tsx, loading.tsx, error.tsx)
   @layout for layout components
   @template for template components
   @error for error components
   @loading for loading components
   @notFound for not-found components
   @serverAction for server actions
   Mark server components with @server (default in App Router)
   Mark client components with @client and note the 'use client' directive

3. For route handlers:
   @function
   @description
   @param {NextRequest} request
   @returns {NextResponse}

4. For PayloadCMS specific code:
   @payloadField for field definitions
   @payloadHook for hooks
   @payloadEndpoint for custom API endpoints

5. For functions (including arrow functions) and methods:
   @function [or @const for const arrow functions]
   @description
   @param {type} name - description
   @returns {type} description

6. For React functional components (including arrow function components):
   @component
   @description
   @param {Props} props - Infer and document Props type
   @returns {JSX.Element}

7. For hooks (built-in and custom):
   @hook
   @description
   @param {type} name - description
   @returns {type} description

8. For TypeScript specifics:
   Document types and interfaces with @typedef and @interface
   Use exact TypeScript types in param and return descriptions

9. For complex logic:
   Brief explanations above relevant code blocks

10. Performance considerations, side effects, dependencies where you notice them:
    @note above relevant code

Use appropriate syntax. No nested comments. Avoid inline comments outside React fragments.

Place comments above described code. Use clear, concise English. Maintain consistency with existing comments.

For arrow functions and const declarations, place comments immediately above.

Remove unnecessary whitespace to save tokens, but avoid syntax errors.
IMPORTANT: Do not wrap the response in any code block syntax (e.g., \`\`\`tsx or \`\`\`). Return the raw, commented code only.

Code:
${fileContent}

Return only commented code, no explanations.`

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
