import languages from "@languages/languages.ts";

export function translate(locale: string) {
  let data: typeof languages["english"];
  if (locale in languages) {
    data = languages[locale as keyof typeof languages];
  }
  data = languages.english;
  return data;
}
