import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) redirect("/signin");

    async function handleUpdate(formData: FormData) {
        "use server";
        await updateProfile(formData);
    }

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500">Manage your public profile and account details.</p>
            </div>

            <div className="p-0 flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 uppercase">
                    {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <span>{session.user.name?.[0] || session.user.email?.[0] || "U"}</span>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900">Profile Picture</p>
                    <p className="text-xs text-slate-500">Avatars are currently managed via Gravatar (based on email).</p>
                </div>
            </div>

            <form action={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                    <input
                        name="name"
                        defaultValue={session.user.name || ""}
                        className="w-full h-10 px-3 rounded-md border border-[#E5E5E5] focus:outline-none focus:border-slate-400 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                        placeholder="Your full name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Username</label>
                    <input
                        disabled
                        value={session.user.username || ""}
                        className="w-full h-10 px-3 rounded-md border border-[#E5E5E5] bg-[#F7F7F5] text-slate-500 cursor-not-allowed text-sm"
                    />
                    <p className="text-[11px] text-slate-400">Username cannot be changed.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">Email Address</label>
                    <input
                        disabled
                        value={session.user.email || ""}
                        className="w-full h-10 px-3 rounded-md border border-[#E5E5E5] bg-[#F7F7F5] text-slate-500 cursor-not-allowed text-sm"
                    />
                    <p className="text-[11px] text-slate-400">Contact support to change your email address.</p>
                </div>

                <div className="pt-2">
                    <button type="submit" className="bg-[#2D2D2A] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors shadow-sm">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
