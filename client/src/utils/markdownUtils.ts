export function stripMarkdown(markdown: string): string {
  return (
    markdown
      // Remove headings (e.g. # Heading)
      .replace(/^#+\s?/gm, "")
      // Remove bold/italic markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      // Remove underscores
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Remove unordered list markers
      .replace(/^\s*[-*+]\s+/gm, "")
      // Remove metadata bullets like `- **key**: value`
      .replace(/-\s+\*\*(.*?)\*\*:/g, "$1:")
      // Remove horizontal rules
      .replace(/^---$/gm, "")
      // Remove any remaining inline code/backticks
      .replace(/`([^`]+)`/g, "$1")
      // Collapse multiple blank lines
      .replace(/\n{2,}/g, "\n\n")
      .trim()
  );
}
