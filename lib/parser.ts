type TaskType = "create" | "update" | "delete" | "response";

interface ParsedTask {
  type: TaskType;
  id?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  description?: string;
  completed?: boolean;
  content: string;
}

interface ParsedArtifact {
  tasks: ParsedTask[];
  responses: ParsedTask[]; // Separate responses from actions
  errors?: string[]; // Track parsing errors
  warnings?: string[]; // Track warnings for debugging
}

/**
 * Convert escaped newlines and quotes to actual characters.
 * Example: '\n' -> newline, '\"' -> '"'
 */
function unescapeXmlString(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }
  return input
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r")
    .trim();
}

/**
 * Validates and normalizes priority values
 */
function validatePriority(
  priority: string
): "HIGH" | "MEDIUM" | "LOW" | undefined {
  const normalized = priority.toUpperCase().trim();
  if (["HIGH", "MEDIUM", "LOW"].includes(normalized)) {
    return normalized as "HIGH" | "MEDIUM" | "LOW";
  }
  return undefined;
}

/**
 * Validates task ID format (supports both CUID and UUID)
 * CUID format: typically starts with 'c' and is 25 chars (Prisma default)
 * UUID format: standard UUID v4 format
 */
function validateTaskId(id: string): boolean {
  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return false;
  }

  const trimmedId = id.trim();

  // CUID validation (Prisma default) - typically 25 chars, starts with 'c'
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  if (cuidRegex.test(trimmedId)) {
    return true;
  }

  // UUID v4 validation (fallback for other formats)
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(trimmedId)) {
    return true;
  }

  // More lenient CUID check (in case format varies)
  // CUIDs are usually 20-25 characters, alphanumeric
  if (trimmedId.length >= 20 && trimmedId.length <= 30 && /^[a-z0-9-]+$/i.test(trimmedId)) {
    return true;
  }

  return false;
}

/**
 * Extracts XML content from various formats
 */
function extractXmlContent(input: string): string {
  let content = input.trim();

  // Handle markdown code blocks
  const markdownMatch = content.match(/```(?:xml)?\s*([\s\S]*?)```/);
  if (markdownMatch) {
    content = markdownMatch[1].trim();
  }

  // Handle escaped XML
  content = content
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return content;
}

/**
 * Parses the XML-like <artifact> response string into structured tasks.
 * Enhanced with better error handling and validation.
 */
function parseArtifact(response: string): ParsedArtifact {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tasks: ParsedTask[] = [];
  const responses: ParsedTask[] = [];

  try {
    const normalized = response.replace(/\r/g, "").trim();

    // More flexible artifact matching
    const artifactMatch = normalized.match(
      /<artifact[^>]*>([\s\S]*)<\/artifact>/i
    );
    if (!artifactMatch) {
      throw new Error("Response does not contain a valid <artifact> block.");
    }

    const innerContent = artifactMatch[1];

    // Enhanced task regex to handle various formats
    const taskRegex = /<task\s*([^>]*)>([\s\S]*?)<\/task>/gi;

    let match: RegExpExecArray | null;
    while ((match = taskRegex.exec(innerContent)) !== null) {
      try {
        const attrString = match[1];
        const content = match[2].trim();

        // Parse attributes more robustly
        const attrs: Record<string, string> = {};
        const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/gi;
        let attrMatch: RegExpExecArray | null;

        while ((attrMatch = attrRegex.exec(attrString)) !== null) {
          attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
        }

        if (!attrs.type) {
          errors.push(
            `Task missing required "type" attribute: ${content.substring(
              0,
              50
            )}...`
          );
          continue;
        }

        const type = attrs.type.toLowerCase();

        // Validate task type
        if (!["create", "update", "delete", "response"].includes(type)) {
          errors.push(`Unsupported task type "${type}"`);
          continue;
        }

        // Allow delete tasks to have empty content
        if (!content && type !== "delete") {
          errors.push("Empty task content found");
          continue;
        }

        const task: ParsedTask = {
          type: type as TaskType,
          content,
        };

        // Parse optional attributes
        if (attrs.id) {
          const id = attrs.id.trim();
          task.id = id;

          // Validate ID format for update/delete operations
          if ((type === "update" || type === "delete") && !validateTaskId(id)) {
            warnings.push(
              `Task ID "${id}" for ${type} operation may be invalid. Expected UUID format.`
            );
          }
        }

        if (attrs.priority) {
          const priority = validatePriority(attrs.priority);
          if (priority) {
            task.priority = priority;
          } else {
            errors.push(
              `Invalid priority value "${
                attrs.priority
              }" for task: ${content.substring(0, 50)}...`
            );
          }
        }

        if (attrs.description) {
          task.description = attrs.description.trim();
        }

        if (attrs.completed) {
          const completed = attrs.completed.toLowerCase();
          if (completed === "true" || completed === "false") {
            task.completed = completed === "true";
          } else {
            errors.push(
              `Invalid completed value "${attrs.completed}" for task: ${content.substring(0, 50)}...`
            );
          }
        }

        // Separate responses from actions
        if (type === "response") {
          responses.push(task);
        } else {
          tasks.push(task);
        }
      } catch (taskError) {
        errors.push(
          `Error parsing task: ${
            taskError instanceof Error ? taskError.message : "Unknown error"
          }`
        );
      }
    }
  } catch (error) {
    errors.push(
      `Failed to parse artifact: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  return {
    tasks,
    responses,
    ...(errors.length > 0 && { errors }),
    ...(warnings.length > 0 && { warnings }),
  };
}

export const parseArtifactResponse = (rawResponse: string): ParsedArtifact => {
  if (!rawResponse || typeof rawResponse !== "string") {
    return {
      tasks: [],
      responses: [],
      errors: ["Invalid input: response must be a non-empty string"],
    };
  }

  try {
    const cleanedResponse = unescapeXmlString(rawResponse);
    const xmlContent = extractXmlContent(cleanedResponse);

    if (!xmlContent) {
      return {
        tasks: [],
        responses: [],
        errors: ["No XML content found in response"],
      };
    }

    return parseArtifact(xmlContent);
  } catch (error) {
    return {
      tasks: [],
      responses: [],
      errors: [
        `Parser error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ],
    };
  }
};
