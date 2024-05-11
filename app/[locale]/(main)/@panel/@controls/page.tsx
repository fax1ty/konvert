import { AbstractIntlMessages, useMessages } from "next-intl";

import Client from "./client";

export default function Controls() {
  const messages = useMessages();

  return <Client messages={messages.Processing as AbstractIntlMessages} />;
}
