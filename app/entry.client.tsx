import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

// document.documentElement.style.setProperty(
//   "--scrollbar-width",
//   window.innerWidth - document.documentElement.clientWidth + "px"
// );

hydrate(<RemixBrowser />, document);
