declare global {
  interface String {
    // deno-lint-ignore no-explicit-any
    format(...replacements: any[]): string;
  }
}

String.prototype.format = function () {
  const args = arguments;
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};
