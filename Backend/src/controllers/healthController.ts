// Simple health check handler. Use any for params to avoid type resolution
// issues in environments where @types/express is not available to the TS
// server. This keeps runtime behavior unchanged while removing the
// TypeScript namespace error.
export const ping = (_req: any, res: any) => {
  return res.json({ ok: true })
}

export default ping
