import Image from "next/image";
import Link from "next/link";

export function BuyMeACoffeeButton() {
  return (
    <Link
      className="fixed right-5 bottom-5"
      href="https://www.buymeacoffee.com/hour.is"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        width={217}
        height={54}
      />
    </Link>
  );
}
