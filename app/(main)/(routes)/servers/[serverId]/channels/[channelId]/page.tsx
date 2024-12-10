const ChannelPage = async (props: { params: Promise<{ channelId: string }> }) => {
  const params = await props.params;
  return <div>ChannelPage {params.channelId} </div>;
};

export default ChannelPage;
