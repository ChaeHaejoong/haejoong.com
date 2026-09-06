import UserEditor from "@/features/user/edit/ui/UserEditor";

export default function MyPageProfileSection() {
  return (
    <section className="space-y-10 sm:space-y-12">
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-title">
            프로필 편집
          </h2>
        </div>
        <UserEditor />
      </div>
    </section>
  );
}
