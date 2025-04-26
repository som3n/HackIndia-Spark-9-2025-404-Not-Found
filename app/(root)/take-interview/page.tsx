import Agent from "@/components/Agent";
import InterViewHeader from "@/components/InterViewHeader";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="p-4">
      <InterViewHeader />
      <Agent
        userName={user?.name!}
        userId={user?.id}
        // profileImage={user?.profileURL}
        type="generate"
      />
    </div>
  );
};

export default Page;
