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

async function convertScssToTailwind(
  tsxFilePath,
  scssFilePath,
  globalScssFilePath,
  tailwindClassesPath,
) {
  const { ora } = await loadDependencies()
  const spinner = ora('Processing files...').start()

  try {
    spinner.text = 'Reading files...'
    // Unescape the file paths
    const unescapedTsxPath = tsxFilePath.replace(/\\(\(|\))/g, '$1')
    const unescapedScssPath = scssFilePath.replace(/\\(\(|\))/g, '$1')
    const unescapedGlobalScssPath = globalScssFilePath.replace(/\\(\(|\))/g, '$1')
    const unescapedTailwindClassesPath = tailwindClassesPath.replace(/\\(\(|\))/g, '$1')

    const tsxContent = await fs.readFile(unescapedTsxPath, 'utf8')
    const scssContent = await fs.readFile(unescapedScssPath, 'utf8')
    const globalScssContent = await fs.readFile(unescapedGlobalScssPath, 'utf8')
    const tailwindClassesContent = await fs.readFile(unescapedTailwindClassesPath, 'utf8')
    spinner.succeed('Files read successfully')

    spinner.text = 'Preparing message for Claude AI...'
    const message = `Convert the SCSS styles to equivalent Tailwind CSS classes in this React component. Return the full TSX code with Tailwind classes inline. Preserve original structure and functionality.

1. Replace SCSS references with equivalent Tailwind classes.
2. Add classes for responsiveness on all devices.
3. Preserve existing Tailwind classes unless they conflict with your changes.
4. You can re-organize UI elements or add additional classes as long as the same style is achieved for the user.
5. Review and use globally defined Tailwind class objects for components such as headlines, button text, and content blocks from the tailwindClasses.ts file.
6. Use the getPaddingClasses function from tailwindClasses.ts to apply padding based on the block type.
7. Utilize the blockFormats, contentFormats, buttonLook, tailwindColorMatch, and textColorVariants objects from tailwindClasses.ts where applicable.

IMPORTANT: DO NOT remove any existing comments
IMPORTANT: DO NOT add any backticks (\`) at the start or end of the code.
IMPORTANT: DO NOT wrap the code in any markdown formatting (e.g., \`\`\`tsx).

SCSS content:
${scssContent}

Global SCSS content:
${globalScssContent}

tailwindClasses.ts content:
${tailwindClassesContent}

TSX content:
${tsxContent}

Return only the complete TSX code with Tailwind classes, without any additional formatting or explanations.`

    spinner.succeed('Message prepared')

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
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    spinner.succeed('Received response from Claude AI')

    const data = await response.json()
    const convertedTsxContent = data.content[0].text

    spinner.text = 'Writing updated content to file...'
    await fs.writeFile(unescapedTsxPath, convertedTsxContent, 'utf8')
    spinner.succeed(`File ${unescapedTsxPath} has been successfully updated with Tailwind classes.`)
    spinner.stop()
  } catch (error) {
    spinner.fail(`Error processing files: ${error.message}`)
  }
}

// Unescape the arguments
const tsxFilePath = process.argv[2].replace(/\\(\(|\))/g, '$1')
const scssFilePath = process.argv[3].replace(/\\(\(|\))/g, '$1')
const globalScssFilePath = process.argv[4].replace(/\\(\(|\))/g, '$1')
const workspaceFolder = process.argv[5].replace(/\\(\(|\))/g, '$1')
const tailwindClassesPath = path.join(
  workspaceFolder,
  'src',
  'app',
  '(app)',
  '_css',
  'tailwindClasses.ts',
)

if (!tsxFilePath || !scssFilePath || !globalScssFilePath || !workspaceFolder) {
  console.error(
    'Please provide TSX, SCSS, global SCSS file paths, and workspace folder path as arguments.',
  )
  process.exit(1)
}

convertScssToTailwind(tsxFilePath, scssFilePath, globalScssFilePath, tailwindClassesPath)
