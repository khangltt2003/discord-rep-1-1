import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const ConversationPage = async (props: { params: Promise<{ conversationId: string }> }) => {
  const params = await props.params;

  const conversationId = params.conversationId;

  if (!conversationId) {
    return redirect("/");
  }

  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      memberOne: true,
      memberTwo: true,
    },
  });

  if (!conversation) {
    return redirect("/");
  }

  return <div>{JSON.stringify(conversation)}</div>;
};

export default ConversationPage;
