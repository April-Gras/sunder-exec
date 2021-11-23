export default {
  targetDirectories: [
    'path/to/scriptdirectory'
  ],
  extentionMapping: {
    exe: null,
    sh: 'sh',
    js: 'node'
  } as Record<string, string | null>,
  noExtentionExec: null
} as const
