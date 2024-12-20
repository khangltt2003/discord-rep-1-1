import { ConversationSideBar } from "@/components/conversation/conversation-sidebar";

const ConversationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full flex">
      <div className="w-72 inset-y-0 bg-[#00000045]">
        <ConversationSideBar />
      </div>
      <main className="h-full w-full">{children}</main>
    </div>
  );
};

export default ConversationLayout;
