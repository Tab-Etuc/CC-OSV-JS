async function collectTypescriptFiles(root: URL): Promise<URL[]> {
  const files: URL[] = [];
  for await (const entry of Deno.readDir(root)) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const url = new URL(`${entry.name}${entry.isDirectory ? "/" : ""}`, root);
    if (entry.isDirectory) files.push(...await collectTypescriptFiles(url));
    else if (entry.isFile && entry.name.endsWith(".ts")) files.push(url);
  }
  return files;
}

Deno.test("所有 src TypeScript 模組都能在測試環境載入", async () => {
  const files = await collectTypescriptFiles(
    new URL("../src/", import.meta.url),
  );
  const loadable = files.filter((file) => !file.pathname.endsWith("/index.ts"));
  for (const file of loadable) await import(file.href);
  if (loadable.length < 100) {
    throw new Error(
      `模組數量異常：只找到 ${loadable.length} 個 TypeScript 模組`,
    );
  }
});
