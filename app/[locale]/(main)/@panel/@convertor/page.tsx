import { AbstractIntlMessages, useMessages } from "next-intl";

import Client from "./client";

export default function Panel() {
  const messages = useMessages();

  return <Client messages={messages.FilePanel as AbstractIntlMessages} />;
}
