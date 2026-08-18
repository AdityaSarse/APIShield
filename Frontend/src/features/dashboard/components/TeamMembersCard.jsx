function TeamMembersCard() {
  const team = [
    {
      name: "Tiana Jeff",
      role: "VP Security",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "John Kay",
      role: "Director of Engineering",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      name: "Matt Filipili",
      role: "DevSecOps Lead",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-5 shadow-2xs">
      <h4 className="text-sm font-extrabold text-[#18181B] pb-3 border-b border-[#F1F3F5]">
        Security Team & Admins
      </h4>

      <div className="mt-3.5 space-y-3">
        {team.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <img
              src={m.avatar}
              alt={m.name}
              className="h-9 w-9 rounded-full object-cover border border-[#EBECEF] shadow-2xs"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#18181B] truncate">{m.name}</div>
              <div className="text-[10px] text-[#71717A] truncate font-medium">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamMembersCard;
