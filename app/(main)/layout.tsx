import { checkUser } from "@/actions/user";
import { TaskProvider } from "@/components/task-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkUser();
  return (
    <div>
      <TaskProvider>{children}</TaskProvider>
    </div>
  );
}
