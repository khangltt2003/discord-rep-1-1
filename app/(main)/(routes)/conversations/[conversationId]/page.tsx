import { ChannelInput } from "@/components/chat/chat-input";
import { ConversationHeader } from "@/components/conversation/conversation-header";
import ProfileCard from "@/components/conversation/conversation-member-card";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ConversationMessages } from "@/components/conversation/conversation-messages";
import VideoRoom from "@/components/video-room";

const ConversationPage = async (props: { params: Promise<{ conversationId: string }>; searchParams: { [key: string]: boolean | undefined } }) => {
  const params = await props.params;
  const searchParams = props.searchParams;

  const audio = !!searchParams.audio || false;
  const video = !!searchParams.video || false;

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

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

  const secondMember = conversation.memberOneId === profile.id ? conversation.memberTwo : conversation.memberOne;

  return (
    <div className="bg-white dark:bg-[#00000014] h-full flex flex-col ">
      <div>
        <ConversationHeader memberTwo={secondMember} />
      </div>
      {!audio && !video && (
        <div className="flex w-full h-full overflow-y-auto">
          <div className=" h-full w-full flex flex-col ">
            <ConversationMessages
              currentMember={profile}
              name={secondMember.name}
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
                name={secondMember.name}
                type="conversation"
                socketUrl="/api/socket/directmessages"
                socketQuery={{ conversationId: conversation.id }}
              />
            </div>
          </div>

          <div className="hidden md:flex flex-col w-96 z-20 bg-[#00000045]  ">
            <ProfileCard memberTwo={secondMember} />
          </div>
        </div>
      )}
      {audio && <VideoRoom chatId={conversation.id} audio={true} video={false} />}
      {video && <VideoRoom chatId={conversation.id} audio={true} video={true} />}
    </div>
  );
};

export default ConversationPage;
