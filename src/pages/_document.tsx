import { Html, Head, Main, NextScript } from "next/document";
import { Theme } from "@radix-ui/themes";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Theme>
          <Main />
        </Theme>
        <NextScript />
      </body>
    </Html>
  );
}
