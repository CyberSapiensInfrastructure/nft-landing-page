import providenceVideo from "../assets/video/footer_video.mp4";

const Footer = () => {
  return (
    <footer className="relative border-t border-[#d8624b]/10 py-6 sm:py-8 overflow-hidden !lowercase">
      {/* Footer fade overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#0f0514]" />
      </div>

      {/* Video Background with fade */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0514] via-[#0f0514]/90 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src={providenceVideo} type="video/mp4" />
        </video>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#d8624b]" />
              <span className="text-sm tracking-[0.2em] text-white/90 hover:text-white transition-all duration-300 drop-shadow-[0_0_3px_rgba(112,66,248,0.3)]">
                PLAYPROVIDENCE.IO
              </span>
            </div>
            <p className="text-xs text-white/60 hover:text-white/80 leading-relaxed max-w-md transition-all duration-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
              Experience the future of Web3 gaming. Providence brings you an
              immersive universe where gaming meets blockchain technology.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col md:items-end space-y-4">
            <div className="flex items-center gap-6">
              {/* Social Links */}
              {[
                {
                  name: "Twitter",
                  url: "https://twitter.com/PlayProvidence",
                },
                { name: "Discord", url: "https://discord.gg/playprovidence" },

                {
                  name: "Instagram",
                  url: "https://instagram.com/PlayProvidence",
                },
                {
                  name: "Youtube",
                  url: "https://youtube.com/@PlayProvidence",
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 hover:text-[#d8624b] transition-all duration-300 drop-shadow-[0_0_3px_rgba(112,66,248,0.2)]"
                >
                  {social.name}
                </a>
              ))}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-[10px] text-white/50 tracking-wider hover:text-white/70 transition-all duration-300 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
                POWERED BY CYBERSAPIENs
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#d8624b]/40" />
                <span className="text-[10px] text-white/20">
                  ALL RIGHTS RESERVED ©2024
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-4 border-t border-[#d8624b]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30">
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-white/50 hover:text-white transition-all duration-300 drop-shadow-[0_0_3px_rgba(112,66,248,0.2)]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-white transition-all duration-300 drop-shadow-[0_0_3px_rgba(112,66,248,0.2)]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/50 hover:text-white transition-all duration-300 drop-shadow-[0_0_3px_rgba(112,66,248,0.2)]"
              >
                Cookie Policy
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#d8624b]/40" />
              <span className="">
                Built with passion in CYBERSAPIENS Labs
              </span>
            </div>
          </div>
        </div>

        {/* Gradient Line */}
        <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d8624b]/30 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
