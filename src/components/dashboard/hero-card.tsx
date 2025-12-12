import Image from "next/image";
import dashboardHeroImage from "../../../public/assets/images/dashboard.svg";

export function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#317C74] p-8 text-white shadow-lg">
      <div className="relative z-10 flex flex-col justify-center h-full max-w-[60%]">
        <h2 className="mb-2 text-3xl font-bold">Selamat Datang, Sara</h2>
        <p className="text-primary-foreground/90 text-sm leading-relaxed">
          Pantau perkembangan akademik dan aktivitas belajar siswa secara
          real-time.
        </p>
      </div>

      <div className="absolute right-0 bottom-0 h-full w-[40%] max-w-[200px]">
        <div className="relative w-full h-full">
            <Image
            src={dashboardHeroImage}
            alt="Guru sedang mengajar"
            fill // Gunakan fill agar gambar mengikuti container parent-nya
            style={{ objectFit: "contain", objectPosition: "bottom right" }} // Posisikan di kanan bawah
            priority // Best practice: Load prioritas karena ini Above the Fold
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
      </div>
    </div>
  );
}
