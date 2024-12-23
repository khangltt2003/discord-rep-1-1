import { ChannelInput } from "@/components/chat/chat-input";
import { ConversationHeader } from "@/components/conversation/conversation-header";
import ProfileCard from "@/components/conversation/conversation-member-card";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ConversationMessages } from "@/components/conversation/conversation-messages";

const ConversationPage = async (props: { params: Promise<{ conversationId: string }> }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

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

  const memberTwo = conversation.memberOneId === profile.id ? conversation.memberTwo : conversation.memberOne;

  return (
    <div className="bg-white dark:bg-[#00000014] h-full flex flex-col ">
      <div>
        <ConversationHeader memberTwo={memberTwo} />
      </div>
      <div className="flex w-full h-full overflow-y-auto">
        <div className=" h-full w-full flex flex-col ">
          <ConversationMessages
            currentMember={conversation.memberOne}
            name={memberTwo.name}
            chatId={conversation.id}
            apiUrl="/api/directmessages/"
            socketUrl="/api/socket/directmessages"
            socketQuery={{ conversationId: conversation.id }}
            paramKey="conversationId"
            paramValue={conversation.id}
            type="conversation"
          />
          <div className="px-4 py-3">
            <ChannelInput
              name={memberTwo.name}
              type="conversation"
              socketUrl="/api/socket/directmessages"
              socketQuery={{ conversationId: conversation.id }}
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col w-96 z-20 bg-[#00000045]  ">
          <ProfileCard memberTwo={memberTwo} />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
