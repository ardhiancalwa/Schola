import Image from "next/image";
import dashboardHeroImage from "../../../public/assets/images/dashboard.svg";

interface HeroCardProps {
  user: {
    name: string;
    role: string;
  };
}

export function HeroCard({ user }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#317C74] p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col justify-center h-full py-8 max-w-[60%]">
        <h2 className="mb-2 text-3xl font-bold">Selamat Datang, {user.name}</h2>
        <p className="text-primary-foreground/90 text-sm leading-relaxed">
          Pantau perkembangan akademik dan aktivitas belajar siswa secara
          real-time.
        </p>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-[40%]">
        <Image
          src={dashboardHeroImage}
          alt="Dashboard Hero"
          fill
          className="object-left"
          priority
        />
      </div>
    </div>
  );
}
