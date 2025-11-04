import { fbq } from "@/lib/fbq"; // ✅ Add this line
import WhatsAppIcon from "@/assets/logos/whatsapp.svg";

const WhatsAppButton = () => {
  const phoneNumber = "971561371569";
  const message = "Hello! I’d like to learn more about your services.";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fbq("track", "Contact", {
      content_name: "WhatsApp CTA",
      content_category: "Floating Button",
      status: "clicked",
    });
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}&utm_source=website&utm_medium=floating_whatsapp&utm_campaign=contact`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed right-5 bottom-5 z-50
        flex items-center justify-center
        h-14 w-14 rounded-full
        bg-[#25D366] shadow-lg hover:shadow-xl
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#128C7E]
      "
    >
      <img
        src={WhatsAppIcon}
        alt="WhatsApp"
        className="w-10 h-10 object-contain"
      />
    </a>
  );
};

export default WhatsAppButton;