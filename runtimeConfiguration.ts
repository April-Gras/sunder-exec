export default {
  targetDirectories: [
    '/home/nowl/code/sunder-exec/'
  ],
  extentionMapping: {
    exe: null,
    sh: 'sh',
    js: 'node',
    ps1: 'powershell'
  } as Record<string, string | null>,
  noExtentionExec: null
} as const
