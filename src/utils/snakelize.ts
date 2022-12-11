function isConvertableObject(obj: unknown) {
  return obj === Object(obj) && !Array.isArray(obj) &&
    typeof obj !== "function" && !(obj instanceof Blob);
}

function camelToSnakeCase(text: string) {
  return text.replace(/[A-Z]/g, ($1) => `_${$1.toLowerCase()}`);
}

export function snakelize<T>(
  // deno-lint-ignore no-explicit-any
  obj: Record<string, any> | Record<string, any>[],
): T {
  if (isConvertableObject(obj)) {
    // deno-lint-ignore no-explicit-any
    const convertedObject: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
      convertedObject[camelToSnakeCase(key)] = snakelize(
        // deno-lint-ignore no-explicit-any
        (obj as Record<string, any>)[key],
      );
    });

    return convertedObject as T;
  } else if (Array.isArray(obj)) {
    obj = obj.map((element) => snakelize(element));
  }

  return obj as T;
}
